# CareerCash PWA Setup Guide

## Play Store & App Distribution

### Prerequisites
- Node.js 16+
- npm or yarn
- Android Studio (for testing)
- Google Play Developer Account ($25 one-time fee)

### Step 1: Build the App

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Step 2: Create App Icons

You need these icon sizes:
- **192x192px** - `public/icon-192.png`
- **512x512px** - `public/icon-512.png`
- **192x192px (maskable)** - `public/icon-192-maskable.png`
- **512x512px (maskable)** - `public/icon-512-maskable.png`

**Icon Requirements:**
- PNG format
- Transparent background (recommended)
- Brand colors: #B03052 (primary), #F8F2EA (background)
- Maskable icons: Safe zone within 2/3 of the image

### Step 3: Create Screenshots

For Play Store listing, create these screenshots:
- **540x720px (narrow)** - `public/screenshot-1.png` (Login screen)
- **540x720px (narrow)** - `public/screenshot-2.png` (Dashboard)
- **1280x720px (wide)** - `public/screenshot-desktop.png` (Desktop view)

### Step 4: Distribute as Web App

#### Option A: Publish on Google Play (Web APK)
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Fill app details (name, description, category)
4. Upload screenshots and app icon
5. Set pricing (free or paid)
6. Deploy to Google Play
7. Google will create native APK wrapper

#### Option B: Distribute as PWA
1. Deploy to HTTPS hosting (Vercel, Netlify, Firebase)
2. Users can:
   - Visit the URL on Android
   - Tap menu → "Install app"
   - App appears on home screen

#### Option C: Create Android APK with Bubblewrap
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest /path/to/manifest.json
bubblewrap build
```

### Step 5: Testing

#### Test Locally
```bash
npm run preview
# or
npx vite preview
```

#### Test with Android Emulator
1. Open Android Studio
2. Create virtual device
3. Run: `adb install app.apk`

#### Test on Real Device
1. Enable USB debugging
2. Connect Android phone
3. Run: `adb install app.apk`

### Step 6: Play Store Submission

1. **App Listing**
   - Title: "CareerCash - Financial Readiness for Your Career"
   - Short description: "Calculate your financial readiness for career decisions"
   - Full description: Add comprehensive details about features
   - Category: Finance or Productivity
   - Screenshots: 2-5 high-quality images

2. **Content Rating**
   - Complete questionnaire
   - Get rating (usually: Everyone)

3. **Pricing & Distribution**
   - Free or Premium (your choice)
   - Select countries
   - Manage device categories (phones, tablets)

4. **Release**
   - Create release in Internal Testing
   - Test with closed testers
   - Move to Production when ready

### Key Files

**manifest.json** - PWA configuration
- App name, description
- Theme colors
- Icons
- Display mode (standalone)

**service-worker.js** - Offline support
- Cache strategy
- Network fallback
- Push notifications
- Background sync

**index.html** - PWA setup
- Manifest link
- Meta tags
- Service worker registration
- Install prompt handler

### Features Enabled

✅ **Offline Support** - Works without internet
✅ **Install Prompt** - "Add to Home Screen" button
✅ **Push Notifications** - Ready for notifications
✅ **Background Sync** - Syncs data in background
✅ **Splash Screen** - Custom loading screen
✅ **Standalone Mode** - No browser UI

### Performance Tips

1. **Optimize Bundle Size**
   ```bash
   npm run build --analyze
   ```

2. **Lazy Load Components** (if needed)
   ```javascript
   const Dashboard = lazy(() => import('./Dashboard'));
   ```

3. **Image Optimization**
   - Use WebP format
   - Compress PNG icons
   - Use responsive images

4. **Bundle Analysis**
   - Remove unused dependencies
   - Tree-shake unused code

### Security Checklist

- ✅ HTTPS only
- ✅ Content Security Policy headers
- ✅ Secure localStorage usage (never store passwords)
- ✅ Input validation
- ✅ CORS configuration

### Monetization Options

1. **Free with Ads** - AdMob integration
2. **Freemium** - Free tier + premium features
3. **Subscription** - Monthly/yearly plans
4. **In-App Purchases** - Premium analysis reports

### Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)
- [Bubblewrap Documentation](https://github.com/GoogleChromeLabs/bubblewrap)

### Next Steps

1. ✅ Create app icons (design or use icon generator)
2. ✅ Create screenshots (test on various devices)
3. ✅ Deploy to HTTPS hosting
4. ✅ Test on Android devices
5. ✅ Create Play Store account
6. ✅ Submit for review
7. ✅ Monitor ratings & feedback

### Support

For Play Store issues:
- Email: support@Google.com
- [Play Console Help Community](https://support.google.com/googleplay/android-developer/community)
