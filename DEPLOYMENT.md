# Deployment Guide for GitHub Pages

## 🎯 Deployment URL
Your portfolio will be available at: **https://verbasik.github.io/warp-zone-folio**

---

## 📋 Prerequisites

1. **GitHub Repository**
   - Create a new repository on GitHub named `warp-zone-folio` (or any name)
   - Do NOT initialize with README (we already have one)

2. **Git Configuration**
   - Ensure Git is installed and configured on your machine
   - Repository must be on the `main` branch

---

## 🚀 Deployment Methods

You have **two options** for deployment:

### Option 1: Automatic Deployment (Recommended) ⚡

Uses GitHub Actions to automatically deploy on every push to `main`.

#### Steps:

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Pixel-art portfolio ready for deployment"
   git branch -M main
   git remote add origin https://github.com/Verbasik/warp-zone-folio.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

3. **Wait for deployment:**
   - The GitHub Action will automatically trigger
   - Check the **Actions** tab to monitor progress
   - Once complete (green checkmark), your site will be live!

4. **Access your portfolio:**
   - Open: https://verbasik.github.io/warp-zone-folio
   - It may take 1-2 minutes for the first deployment

#### Future updates:
```bash
git add .
git commit -m "Update portfolio content"
git push
```
The site will automatically redeploy on every push! ✨

---

### Option 2: Manual Deployment with gh-pages 📦

Uses the `gh-pages` npm package to manually deploy.

#### Steps:

1. **Initialize Git repository (if not done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Pixel-art portfolio"
   git branch -M main
   git remote add origin https://github.com/Verbasik/warp-zone-folio.git
   git push -u origin main
   ```

2. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

   This command will:
   - Build your project (`npm run build`)
   - Deploy the `dist/` folder to the `gh-pages` branch
   - Push to GitHub

3. **Enable GitHub Pages (first time only):**
   - Go to repository **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Select branch: `gh-pages` and folder: `/ (root)`
   - Click **Save**

4. **Access your portfolio:**
   - Open: https://verbasik.github.io/warp-zone-folio
   - Wait 1-2 minutes for the first deployment

#### Future updates:
```bash
git add .
git commit -m "Update portfolio content"
git push
npm run deploy  # Deploy to GitHub Pages
```

---

## 🛠️ What Has Been Configured

### ✅ Files Modified for Deployment:

1. **src/App.tsx**
   - Changed `BrowserRouter` → `HashRouter`
   - Reason: GitHub Pages requires hash-based routing

2. **vite.config.ts**
   - Added `base: '/warp-zone-folio/'`
   - Ensures correct asset paths on GitHub Pages

3. **package.json**
   - Added `homepage` field
   - Added deployment scripts: `predeploy`, `deploy`
   - Changed name to `warp-zone-folio`

4. **.github/workflows/deploy.yml** (NEW)
   - GitHub Actions workflow for automatic deployment
   - Triggers on push to `main` branch

5. **src/config/\*.ts**
   - Updated placeholder data with "Verbasik"
   - Updated GitHub URLs to your account
   - Added "Warp Zone Folio" as featured project

---

## 🔍 Verify Deployment

### Check if site is live:
```bash
curl -I https://verbasik.github.io/warp-zone-folio
```

Expected: `HTTP/2 200` status

### Common URLs to test:
- Homepage: https://verbasik.github.io/warp-zone-folio
- Direct access: https://verbasik.github.io/warp-zone-folio/#/

---

## 🐛 Troubleshooting

### Issue: "404 Page Not Found"

**Cause:** GitHub Pages not configured correctly

**Solution:**
1. Go to Settings → Pages
2. Ensure source is set to:
   - **GitHub Actions** (for automatic deployment)
   - OR **gh-pages** branch (for manual deployment)
3. Wait 2-3 minutes and refresh

---

### Issue: "Blank page after deployment"

**Cause:** Base URL misconfiguration

**Solution:**
1. Check `vite.config.ts` has: `base: '/warp-zone-folio/'`
2. Ensure repository name matches the base path
3. Rebuild and redeploy:
   ```bash
   npm run build
   npm run deploy
   ```

---

### Issue: "Assets not loading (404 errors in console)"

**Cause:** Incorrect base URL

**Solution:**
1. Verify `vite.config.ts`: `base: '/warp-zone-folio/'`
2. Check `package.json`: `homepage` matches deployment URL
3. Rebuild:
   ```bash
   rm -rf dist
   npm run build
   npm run deploy
   ```

---

### Issue: "GitHub Action fails"

**Cause:** Permissions not set correctly

**Solution:**
1. Go to Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Save
6. Re-run the failed workflow in the Actions tab

---

## 📝 Updating Content

### Personal Information:
Edit `src/config/site.config.ts`

### Projects:
Edit `src/config/projects.config.ts`

### Skills:
Edit `src/config/skills.config.ts`

### Colors & Theme:
Edit `src/index.css` (`:root` section)

After editing:
```bash
# If using automatic deployment:
git add .
git commit -m "Update content"
git push

# If using manual deployment:
npm run deploy
```

---

## 🎨 Custom Domain (Optional)

If you want to use a custom domain (e.g., `portfolio.verbasik.com`):

1. **Purchase a domain** (Namecheap, Google Domains, etc.)

2. **Add CNAME file** to `public/` folder:
   ```
   portfolio.verbasik.com
   ```

3. **Configure DNS:**
   Add these records in your domain provider:
   ```
   Type: CNAME
   Name: portfolio (or @)
   Value: verbasik.github.io
   ```

4. **Update vite.config.ts:**
   ```typescript
   base: '/',  // Change from '/warp-zone-folio/'
   ```

5. **Enable in GitHub Settings:**
   - Settings → Pages → Custom domain
   - Enter: `portfolio.verbasik.com`
   - Check "Enforce HTTPS"

6. **Redeploy**

---

## 📊 Analytics (Optional)

Add Google Analytics or Plausible:

1. **Get tracking ID** from your analytics provider

2. **Add script to** `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

3. **Redeploy**

---

## 🎉 Success Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed to `main` branch
- [ ] GitHub Pages enabled (Actions or gh-pages)
- [ ] Site accessible at https://verbasik.github.io/warp-zone-folio
- [ ] No console errors on the live site
- [ ] Navigation works correctly
- [ ] Theme toggle works
- [ ] All sections visible and styled correctly
- [ ] Mobile responsive (test on phone)

---

## 📞 Need Help?

- **GitHub Pages Docs:** https://docs.github.com/en/pages
- **Vite Deployment Guide:** https://vitejs.dev/guide/static-deploy.html
- **Issues?** Open an issue on GitHub repository

---

**🚀 Ready to deploy? Choose your method and follow the steps above!**

Your pixel-art portfolio is ready to shine! ✨
