[CmdletBinding()]
param(
    [Parameter()]
    [string]$RootPath = ".",

    [Parameter()]
    [ValidateSet("Known", "All")]
    [string]$InjectMode = "Known",

    [Parameter()]
    [switch]$Backup = $true,

    [Parameter()]
    [switch]$DryRun = $false,

    [Parameter()]
    [string]$BaseUrl = "https://hamdeni-cs.tn",

    [Parameter()]
    [switch]$VerifyLive = $false,

    [Parameter()]
    [string]$LogPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$measurementId = 'G-NRRL1TSE7Z'
$snippetLines = @(
    "<!-- GA4 for hamdeni-cs.tn -->",
    "<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-NRRL1TSE7Z\"></script>",
    "<script>",
    "  window.dataLayer = window.dataLayer || [];",
    "  function gtag(){ dataLayer.push(arguments); }",
    "  gtag('js', new Date());",
    "  gtag('config', 'G-NRRL1TSE7Z');",
    "</script>",
    ""
)
$snippet = $snippetLines -join "`r`n"

$knownRelativePaths = @(
    "index.html",
    "igcse/dashboard.html",
    "as/dashboard.html",
    "a/dashboard.html"
)

$excludedDirectories = @('node_modules','dist','build','vendor','.git','.next','out','coverage','tmp','temp','assets','css','images')

function Get-ResolvedRoot {
    param([string]$Path)
    try {
        return (Resolve-Path -Path $Path).ProviderPath
    }
    catch {
        throw "RootPath '$Path' could not be resolved. $_"
    }
}

function Get-TargetFiles {
    param(
        [string]$Root,
        [string]$Mode
    )

    $targets = @()

    if ($Mode -eq 'Known') {
        foreach ($relative in $knownRelativePaths) {
            $full = Join-Path -Path $Root -ChildPath $relative
            $exists = Test-Path -Path $full -PathType Leaf
            $targets += [PSCustomObject]@{
                RelativePath = $relative
                FullPath     = $full
                Exists       = $exists
            }
        }
    }
    else {
        $patterns = @('*.html', '*.htm')
        try {
            $files = Get-ChildItem -Path $Root -Recurse -File -Include $patterns -ErrorAction Stop
        }
        catch {
            throw "Failed to enumerate files under '$Root'. $_"
        }

        foreach ($file in $files) {
            $relative = [System.IO.Path]::GetRelativePath($Root, $file.FullName)
            $segments = $relative -split [System.IO.Path]::DirectorySeparatorChar
            if ($segments | Where-Object { $excludedDirectories -contains $_ }) {
                continue
            }
            $targets += [PSCustomObject]@{
                RelativePath = $relative
                FullPath     = $file.FullName
                Exists       = $true
            }
        }
    }

    return $targets
}

function New-LocalResult {
    param(
        [string]$Path,
        [string]$Action,
        [string]$Reason
    )

    return [PSCustomObject]@{
        Type   = 'Local'
        Path   = $Path
        Action = $Action
        Reason = $Reason
    }
}

function Inject-GA4 {
    param(
        [string]$FilePath,
        [string]$DisplayPath,
        [bool]$DryRun,
        [bool]$BackupEnabled,
        [string]$SnippetContent,
        [string]$MeasurementId,
        [ref]$BackupCounter
    )

    try {
        $content = Get-Content -Path $FilePath -Raw -Encoding utf8
    }
    catch {
        return New-LocalResult -Path $DisplayPath -Action 'Error' -Reason "Failed to read file: $_"
    }

    if ($content -like "*${MeasurementId}*") {
        return New-LocalResult -Path $DisplayPath -Action 'Skipped' -Reason 'Measurement ID already present'
    }

    $match = [regex]::Match($content, '</head>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($match.Success) {
        $newContent = $content.Insert($match.Index, $SnippetContent)
    }
    else {
        $newContent = $SnippetContent + $content
    }

    if ($DryRun) {
        return New-LocalResult -Path $DisplayPath -Action 'WouldTag' -Reason 'DryRun enabled'
    }

    if ($BackupEnabled) {
        $backupPath = "$FilePath.bak"
        try {
            Copy-Item -Path $FilePath -Destination $backupPath -Force
            $BackupCounter.Value++
        }
        catch {
            return New-LocalResult -Path $DisplayPath -Action 'Error' -Reason "Failed to create backup: $_"
        }
    }

    try {
        Set-Content -Path $FilePath -Value $newContent -Encoding utf8
        return New-LocalResult -Path $DisplayPath -Action 'Tagged' -Reason 'Snippet inserted'
    }
    catch {
        return New-LocalResult -Path $DisplayPath -Action 'Error' -Reason "Failed to write file: $_"
    }
}

function Verify-Live {
    param(
        [string]$BaseUrl,
        [string]$MeasurementId
    )

    $trimmedBase = $BaseUrl.TrimEnd('/')
    $urls = @(
        "$trimmedBase/",
        "$trimmedBase/igcse/dashboard.html",
        "$trimmedBase/as/dashboard.html",
        "$trimmedBase/a/dashboard.html"
    )

    $timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    $results = @()

    foreach ($url in $urls) {
        $separator = $url.Contains('?') ? '&' : '?'
        $fullUrl = "$url${separator}ga4check=$timestamp"
        $statusCode = $null
        $contains = $false

        try {
            $response = Invoke-WebRequest -Uri $fullUrl -Method Get -Headers @{ 'Cache-Control' = 'no-cache' } -ErrorAction Stop
            $statusCode = [int]$response.StatusCode
            if ($response.Content -like "*${MeasurementId}*") {
                $contains = $true
            }
        }
        catch {
            $webEx = $_.Exception
            if ($webEx -is [System.Net.WebException] -and $webEx.Response) {
                try {
                    $statusCode = [int]$webEx.Response.StatusCode
                }
                catch {
                    $statusCode = 0
                }
            }
            else {
                $statusCode = 0
            }
            $contains = $false
        }

        $results += [PSCustomObject]@{
            Type       = 'Live'
            Url        = $url
            StatusCode = $statusCode
            ContainsID = [bool]$contains
        }
    }

    return $results
}

$rootResolved = Get-ResolvedRoot -Path $RootPath
$localResults = @()
$backupCounter = [ref]0

$backupEnabled = if ($PSBoundParameters.ContainsKey('Backup')) {
    [bool]$Backup
} else {
    $true
}
$dryRunEnabled = if ($PSBoundParameters.ContainsKey('DryRun')) {
    [bool]$DryRun
} else {
    $false
}

$targets = Get-TargetFiles -Root $rootResolved -Mode $InjectMode

foreach ($target in $targets) {
    if (-not $target.Exists) {
        $localResults += New-LocalResult -Path $target.RelativePath -Action 'MissingFile' -Reason 'File not found'
        continue
    }

    $result = Inject-GA4 -FilePath $target.FullPath -DisplayPath $target.RelativePath -DryRun:$dryRunEnabled -BackupEnabled:$backupEnabled -SnippetContent $snippet -MeasurementId $measurementId -BackupCounter $backupCounter
    $localResults += $result
}

$localResults | Select-Object Path, Action, Reason | Format-Table -AutoSize

$totalExamined = $targets.Count
$taggedCount = ($localResults | Where-Object { $_.Action -eq 'Tagged' }).Count
$skippedCount = ($localResults | Where-Object { $_.Action -eq 'Skipped' }).Count
$missingCount = ($localResults | Where-Object { $_.Action -eq 'MissingFile' }).Count
$backedUpCount = $backupCounter.Value

Write-Output "Summary: TotalExamined=$totalExamined, Tagged=$taggedCount, Skipped=$skippedCount, Missing=$missingCount, BackedUp=$backedUpCount"

$liveResults = @()
if ($VerifyLive) {
    $liveResults = Verify-Live -BaseUrl $BaseUrl -MeasurementId $measurementId
    $liveResults | Select-Object Url, StatusCode, ContainsID | Format-Table -AutoSize

    $liveChecked = $liveResults.Count
    $liveWithId = ($liveResults | Where-Object { $_.ContainsID }).Count
    $liveMissing = $liveChecked - $liveWithId
    Write-Output "Live Summary: LiveChecked=$liveChecked, LiveWithID=$liveWithId, LiveMissingID=$liveMissing"
}

if ($LogPath) {
    try {
        $logDirectory = Split-Path -Path $LogPath -Parent
        if ($logDirectory -and -not (Test-Path -Path $logDirectory)) {
            New-Item -Path $logDirectory -ItemType Directory -Force | Out-Null
        }

        $allResults = @()
        if ($localResults.Count -gt 0) {
            $allResults += $localResults
        }
        if ($liveResults.Count -gt 0) {
            $allResults += $liveResults
        }

        $selectedResults = $allResults | Select-Object Type, Path, Action, Reason, Url, StatusCode, ContainsID
        if (@($selectedResults).Count -gt 0) {
            $selectedResults | Export-Csv -Path $LogPath -NoTypeInformation -Encoding UTF8
        }
        else {
            "Type,Path,Action,Reason,Url,StatusCode,ContainsID" | Set-Content -Path $LogPath -Encoding utf8
        }
    }
    catch {
        Write-Error "Failed to write log file: $_"
    }
}
