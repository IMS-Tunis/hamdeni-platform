[CmdletBinding(DefaultParameterSetName = 'Tag')]
param(
    [Parameter(Position = 0)]
    [string]$RootPath = '.',

    [Parameter(ParameterSetName = 'Tag')]
    [switch]$DryRun,

    [Parameter(ParameterSetName = 'Tag')]
    [bool]$Backup = $true,

    [Parameter(ParameterSetName = 'Tag')]
    [string]$LogPath,

    [Parameter(ParameterSetName = 'Revert')]
    [switch]$Revert
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Resolve-NormalizedPath {
    param(
        [Parameter(Mandatory)]
        [string]$Path
    )

    $resolved = Resolve-Path -LiteralPath $Path -ErrorAction Stop
    return $resolved.ProviderPath
}

function Get-RelativePath {
    param(
        [Parameter(Mandatory)]
        [string]$BasePath,
        [Parameter(Mandatory)]
        [string]$TargetPath
    )

    try {
        return [System.IO.Path]::GetRelativePath($BasePath, $TargetPath)
    } catch {
        return $TargetPath
    }
}

function Test-IsExcluded {
    param(
        [Parameter(Mandatory)]
        [string]$RelativePath
    )

    $pattern = '(?i)(^|[\\/])(node_modules|dist|build|vendor|\.git|\.next|out|coverage|tmp|temp|assets|css|images)([\\/])'
    return [System.Text.RegularExpressions.Regex]::IsMatch($RelativePath, $pattern)
}

function New-Snippet {
    $lines = @(
        '<!-- GA4 for hamdeni-cs.tn -->',
        '<script async src="https://www.googletagmanager.com/gtag/js?id=G-NRRL1TSE7Z"></script>',
        '<script>',
        '  window.dataLayer = window.dataLayer || [];',
        '  function gtag(){ dataLayer.push(arguments); }',
        "  gtag('js', new Date());",
        "  gtag('config', 'G-NRRL1TSE7Z');",
        '</script>',
        ''
    )

    return ($lines -join "`r`n")
}

function Invoke-RevertOperation {
    param(
        [Parameter(Mandatory)]
        [string]$Root,
        [switch]$DryRun
    )

    $bakFiles = Get-ChildItem -LiteralPath $Root -Filter '*.bak' -Recurse -File
    $restored = 0
    $errors = 0

    foreach ($bak in $bakFiles) {
        $originalPath = $bak.FullName.Substring(0, $bak.FullName.Length - 4)
        $relative = Get-RelativePath -BasePath $Root -TargetPath $originalPath

        if ($DryRun) {
            Write-Output ("WouldRevert`t{0}" -f $relative)
            continue
        }

        try {
            Move-Item -LiteralPath $bak.FullName -Destination $originalPath -Force
            Write-Output ("Reverted`t{0}" -f $relative)
            $restored++
        } catch {
            Write-Output ("ErrorReverting`t{0}`t{1}" -f $relative, $_.Exception.Message)
            $errors++
        }
    }

    $summary = "Revert Summary: Total={0}, Reverted={1}, Errors={2}" -f $bakFiles.Count, $restored, $errors
    Write-Output $summary
}

$resolvedRoot = Resolve-NormalizedPath -Path $RootPath
$snippet = New-Snippet

if ($Revert) {
    Invoke-RevertOperation -Root $resolvedRoot -DryRun:$DryRun
    return
}

$logEntries = @()
$totals = [ordered]@{
    Total    = 0
    Tagged   = 0
    Skipped  = 0
    BackedUp = 0
}

$files = Get-ChildItem -LiteralPath $resolvedRoot -Recurse -File -Include '*.html', '*.htm' -ErrorAction Stop

foreach ($file in $files) {
    $totals.Total++
    $relative = Get-RelativePath -BasePath $resolvedRoot -TargetPath $file.FullName
    $action = 'Skipped'
    $reason = 'ExcludedFolder'

    if (Test-IsExcluded -RelativePath $relative) {
        Write-Output ("{0}`t{1}`t{2}" -f $action, $relative, $reason)
        if ($LogPath) {
            $logEntries += [pscustomobject]@{ Path = $relative; Action = $action; Reason = $reason }
        }
        $totals.Skipped++
        continue
    }

    try {
        $content = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
    } catch {
        $reason = 'ReadError'
        Write-Output ("Skipped`t{0}`t{1}" -f $relative, $reason)
        if ($LogPath) {
            $logEntries += [pscustomobject]@{ Path = $relative; Action = 'Skipped'; Reason = $reason }
        }
        $totals.Skipped++
        continue
    }

    if ($content -like '*G-NRRL1TSE7Z*') {
        $reason = 'AlreadyTagged'
        Write-Output ("Skipped`t{0}`t{1}" -f $relative, $reason)
        if ($LogPath) {
            $logEntries += [pscustomobject]@{ Path = $relative; Action = 'Skipped'; Reason = $reason }
        }
        $totals.Skipped++
        continue
    }

    $match = [System.Text.RegularExpressions.Regex]::Match($content, '</head>', 'IgnoreCase')
    if ($match.Success) {
        $reason = 'BeforeHeadClose'
        $newContent = $content.Substring(0, $match.Index) + $snippet + $content.Substring($match.Index)
    } else {
        $reason = 'NoHeadTag'
        $newContent = $snippet + $content
    }

    if ($DryRun) {
        Write-Output ("WouldTag`t{0}`t{1}" -f $relative, $reason)
        if ($LogPath) {
            $logEntries += [pscustomobject]@{ Path = $relative; Action = 'WouldTag'; Reason = $reason }
        }
        continue
    }

    try {
        if ($Backup) {
            Copy-Item -LiteralPath $file.FullName -Destination ($file.FullName + '.bak') -Force
            $totals.BackedUp++
        }

        Set-Content -LiteralPath $file.FullName -Value $newContent -Encoding UTF8
        $action = 'Tagged'
        Write-Output ("{0}`t{1}`t{2}" -f $action, $relative, $reason)
        if ($LogPath) {
            $logEntries += [pscustomobject]@{ Path = $relative; Action = $action; Reason = $reason }
        }
        $totals.Tagged++
    } catch {
        $reason = 'WriteError'
        Write-Output ("Skipped`t{0}`t{1}" -f $relative, $reason)
        if ($LogPath) {
            $logEntries += [pscustomobject]@{ Path = $relative; Action = 'Skipped'; Reason = $reason }
        }
        $totals.Skipped++
    }
}

if ($LogPath -and $logEntries.Count -gt 0) {
    try {
        $logDirectory = Split-Path -Path $LogPath -Parent
        if ($logDirectory -and -not (Test-Path -LiteralPath $logDirectory)) {
            New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
        }
        $logEntries | Export-Csv -Path $LogPath -NoTypeInformation -Encoding UTF8
    } catch {
        Write-Output ("LogError`t{0}" -f $_.Exception.Message)
    }
}

$summaryLine = 'Summary: Total={0}, Tagged={1}, Skipped={2}, BackedUp={3}' -f $totals.Total, $totals.Tagged, $totals.Skipped, $totals.BackedUp
Write-Output $summaryLine
