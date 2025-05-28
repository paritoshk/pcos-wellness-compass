# Nari AI - Deployment Guide

This document outlines the steps to deploy the Nari AI application, primarily using Vercel.

## Prerequisites

*   Node.js and pnpm installed.
*   Vercel CLI installed (`pnpm add -g vercel`).
*   A Vercel account.
*   Environment variables correctly set up in a `.env` file (see below) and on Vercel.

## Environment Variables

The Nari AI application requires the following environment variables:

*   `VITE_FIREWORKS_API_KEY`: Your API key for Fireworks AI.
*   `VITE_AUTH0_DOMAIN`: Your Auth0 domain.
*   `VITE_AUTH0_CLIENT_ID`: Your Auth0 client ID.

Make sure these are set in your Vercel project settings.

## Deployment Steps

1.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

2.  **Build the Project**:
    ```bash
    pnpm run build
    ```
    This creates a `dist` folder with the production-ready static assets.

3.  **Deploy with Vercel CLI**:
    Navigate to your project directory in the terminal and run:
    ```bash
    vercel
    ```
    Follow the Vercel CLI prompts. If it's your first time deploying this project, it will guide you through linking it to a Vercel project.
    
    Alternatively, you can use:
    ```bash
    vercel --prod
    ```
    for a production deployment directly.

4.  **Configure Vercel Project Settings**:
    *   Go to your project on Vercel.
    *   Ensure the Build & Development Settings are configured correctly (Framework Preset should be Vite).
    *   Add the environment variables mentioned above in the Environment Variables section of your project settings.

## `vercel.json` Configuration

The `vercel.json` file is set up to handle SPA routing and caching. No changes are typically needed here for standard deployment.

## `deploy.sh` Script

A `deploy.sh` script is provided for a guided deployment. You can run it using:
```bash
./deploy.sh
```
This script automates some of the checks and steps but ultimately relies on the Vercel CLI.

## Troubleshooting

*   **Blank Page After Deployment**: Check browser console for errors. Ensure environment variables are correctly set on Vercel. Verify that the `vercel.json` rewrites are working.
*   **API Key Issues**: Double-check that `VITE_FIREWORKS_API_KEY` is available to your Vercel deployment.

This guide should help you deploy Nari AI. Good luck!

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)

#### Method A: GitHub Integration (Easiest)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Sign in with GitHub
4. Click "New Project"
5. Import your repository
6. Vercel will auto-detect React/Vite setup
7. **Important:** Configure Environment Variables (see below)
8. Click "Deploy"

#### Method B: Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
# npm i -g vercel  OR  pnpm add -g vercel
pnpm add -g vercel

# Deploy (Vercel will prompt for environment variables)
vercel

# Alternatively, set environment variables first:
vercel env add VITE_FIREWORKS_API_KEY
# Then deploy:
vercel
```

### Option 2: Netlify
```bash
# Build the app
pnpm run build

# Deploy to Netlify:
# 1. Go to netlify.com
# 2. Drag & drop the 'dist' folder
# 3. Configure Environment Variables (Site settings -> Build & deploy -> Environment)
#    - Add VITE_FIREWORKS_API_KEY with your key
# OR
# 3. Use Netlify CLI:
# npm i -g netlify-cli OR pnpm add -g netlify-cli
pnpm add -g netlify-cli
netlify deploy --prod --dir=dist
#    You'll need to set environment variables in the Netlify UI.
```

### Option 3: RunPod (For GPU/AI workloads)
RunPod is better suited for backend AI services. For this frontend React app, use Vercel or Netlify instead.

For a full-stack deployment with RunPod:
1. Containerize the app with Docker
2. Deploy container to RunPod
3. Configure reverse proxy for web access

## 🔧 Environment Configuration

### API Keys Required:

1.  **`VITE_FIREWORKS_API_KEY`** (for food analysis)
    *   **Source**: Get from [https://app.fireworks.ai/users?tab=apiKeys](https://app.fireworks.ai/users?tab=apiKeys)
    *   **Setup**: This key must be set as an environment variable in your deployment platform (Vercel, Netlify, etc.) and locally in a `.env` file.
        *   Create a `.env` file in the project root (this file is gitignored).
        *   Add the line: `VITE_FIREWORKS_API_KEY=your_actual_api_key_here`

2. **Auth0 Configuration** (if using Auth0)
   - Domain and Client ID need to be configured
   - Currently using manual auth (guest mode)

### Build Settings:
- **Build Command**: `pnpm run build`
- **Output Directory**: `dist`
- **Node Version**: 18+

## 🌐 Domain Configuration

### Custom Domain (Vercel):
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. SSL is automatically provisioned

### Environment Variables:
Currently, all configuration is client-side. No server environment variables needed.

## 📱 Features Working After Deployment:
- ✅ Food photo analysis (with API key configured)
- ✅ PCOS profile setup
- ✅ Chat interface
- ✅ History tracking
- ✅ Expert connections
- ✅ Responsive mobile design

## 🔍 Post-Deployment Checklist:
- [ ] Verify `VITE_FIREWORKS_API_KEY` is set correctly in the deployment environment.
- [ ] Test food photo upload and analysis.
- [ ] Verify profile setup flow.
- [ ] Check mobile responsiveness.
- [ ] Test all navigation routes.

## 🆘 Troubleshooting:

### Build Errors:
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run build
```

### Routing Issues:
The `vercel.json` file handles SPA routing. Ensure it's in the root directory.

### API Issues:
- Ensure `VITE_FIREWORKS_API_KEY` is correctly set in your environment (local `.env` or deployment platform settings).
- Check browser console for API errors (though with server-side keys, these should be less frequent).
- Verify CORS settings if needed (less likely with API key on server-side requests via backend, but relevant if your setup changes). 