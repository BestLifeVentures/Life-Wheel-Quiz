# Deployment Guide - Life Wheel Quiz

This is a **static HTML/CSS/JS application** with no build process required.

## 🚨 IMPORTANT: Fix for "Missing entry-point" Error

If you're seeing this error:
```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
```

This means your Cloudflare Pages project is configured with the wrong build command. Follow these steps:

### Quick Fix

1. **Go to Cloudflare Dashboard** → Your Pages Project → **Settings** → **Builds & deployments**

2. **Change these settings:**
   - **Build command:** Leave **COMPLETELY EMPTY** (or remove `npx wrangler deploy`)
   - **Build output directory:** `/` (root)
   - **Framework preset:** None

3. **Click "Save"** and **retry deployment**

The project now includes a `wrangler.toml` file that configures it as a static assets site, so Wrangler will work correctly if triggered by Cloudflare Pages.

---

## Cloudflare Pages Deployment

### Option 1: Via Cloudflare Dashboard (Recommended)

1. **Login to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Navigate to "Pages" in the sidebar

2. **Create New Project**
   - Click "Create a project"
   - Connect your GitHub account if not already connected
   - Select the `Life-Wheel-Quiz` repository

3. **Configure Build Settings**
   ```
   Framework preset: None
   Build command: (leave empty)
   Build output directory: /
   Root directory: /
   ```

   **IMPORTANT**: This is a static site with no build process. The build command should be empty or just `echo "Static site"`.

4. **Environment Variables**
   - None required for this project

5. **Deploy**
   - Click "Save and Deploy"
   - Your site will be live at: `https://your-project.pages.dev`

### Option 2: Via Wrangler CLI

```bash
# Install Wrangler if not already installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
wrangler pages publish . --project-name=life-wheel-quiz
```

### Build Settings for Cloudflare Pages

If you're setting this up through the Cloudflare dashboard, use these exact settings:

| Setting | Value |
|---------|-------|
| **Framework preset** | None |
| **Build command** | *(leave empty)* or `echo "Static site"` |
| **Build output directory** | `/` |
| **Root directory** | `/` |
| **Node version** | (not needed, but 18 if required) |

### Troubleshooting Build Failures

If you're experiencing build failures:

1. **Clear the build command**: Make sure it's completely empty or just an echo statement
2. **Set output directory to `/`**: Since files are in the root
3. **No node_modules**: This project has no dependencies
4. **Check branch**: Make sure you're deploying from the correct branch

### Custom Domain

1. Go to your Cloudflare Pages project
2. Click "Custom domains"
3. Add your domain and follow DNS setup instructions

## Alternative Deployment Options

### Netlify

1. Connect your repository
2. Build settings:
   - Build command: (leave empty)
   - Publish directory: `/`

### Vercel

1. Import your repository
2. Framework Preset: Other
3. Build Command: (leave empty)
4. Output Directory: `.`

### GitHub Pages

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: Select your main branch, `/` (root)

### Simple Static Hosting (Any Provider)

Simply upload these files to your web server:
- `index.html`
- `styles.css`
- `quiz.js`
- `qr-code.html`
- `_headers` (if supported)

## File Structure

```
Life-Wheel-Quiz/
├── index.html       # Main quiz application
├── styles.css       # All styling
├── quiz.js          # Quiz logic and functionality
├── qr-code.html     # QR code generator
├── _headers         # Security headers (Cloudflare/Netlify)
├── package.json     # Minimal package file
├── .gitignore       # Git ignore rules
└── README.md        # Documentation
```

## Post-Deployment

After deployment:

1. **Test the quiz** - Go through all 15 questions
2. **Test mobile responsiveness** - Check on phone/tablet
3. **Test QR code generator** - Access `https://your-domain.com/qr-code.html`
4. **Generate QR code** for your deployed URL
5. **Test save functionality** - Ensure images download correctly

## Common Issues

### Build Failing
- **Cause**: Cloudflare looking for a build process
- **Solution**: Set build command to empty or `echo "Static site"`

### 404 on subpages
- **Cause**: Single page app routing
- **Solution**: This app doesn't need routing, all pages are direct HTML files

### CDN Resources Not Loading
- **Cause**: External CDN blocked or slow
- **Solution**: Check console for errors, ensure:
  - html2canvas CDN is accessible
  - QRCode.js CDN is accessible

### Save Image Not Working
- **Cause**: html2canvas library not loaded
- **Solution**: Check browser console, ensure CDN is accessible

## CDN Dependencies

This app uses these external libraries via CDN:
- **html2canvas** (1.4.1) - For saving results as image
- **QRCode.js** (1.0.0) - For generating QR codes

No npm install or build process required!

## Support

For deployment issues, contact Best Life Ventures technical support.
