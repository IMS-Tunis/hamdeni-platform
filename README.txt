HAMDENI COMPUTER SCIENCE PLATFORM – DEPLOYMENT GUIDE
=====================================================

✅ This folder is optimized for deployment on Render using your custom domain: hamdeni-cs.tn

📁 Structure:
-------------
- frontend/index.html        ← Your main site
- 404.html                   ← Custom not-found page
- frontend/*                 ← CSS, JS, images, etc.

📌 STEP 1 – Deploy to Render
-----------------------------
1. Go to https://dashboard.render.com
2. Create a new "Static Site"
3. Connect to GitHub OR upload this folder as ZIP manually
4. Set these values:
   - Build Command: (leave blank)
   - Publish Directory: frontend

📌 STEP 2 – Add Custom Domain (hamdeni-cs.tn)
---------------------------------------------
In Render:
- Go to your Static Site → Settings → Custom Domains
- Add: hamdeni-cs.tn
- Add: www.hamdeni-cs.tn

On Atlax.tn DNS panel:
- Add A record:
    Type: A
    Host: @
    Value: (Render will provide an IP, e.g. 216.24.57.1xx)

- Add CNAME:
    Type: CNAME
    Host: www
    Value: your-site-name.onrender.com

Then:
- Back in Render, enable SSL and "Force HTTPS"
- Wait for domain to propagate (15-60 minutes)

📌 STEP 3 – Redirect www to root (Optional)
-------------------------------------------
Render should handle this via redirect.
For client-side fallback, you can add JavaScript redirect if needed.

📌 STEP 4 – Enable auto-deploy (if using GitHub)
------------------------------------------------
- Go to Deploys tab
- Enable auto-deploy on push to main branch

📌 STEP 5 – Final Test
----------------------
- Open https://hamdeni-cs.tn from multiple devices
- Test SSL (https), loading speed, and page not found

Supabase Configuration
----------------------
The frontend now contains the Supabase URL, service key and teacher password directly in the JavaScript source. No external `config.js` file is required for deployment.
