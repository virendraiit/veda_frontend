# How to Get Your Firebase API Key

## 🔑 Step-by-Step Guide

### 1. Go to Firebase Console
- Visit: https://console.firebase.google.com/
- Sign in with your Google account
- Select your project: **snappy-byte-457513-n1**

### 2. Navigate to Project Settings
- Click the **gear icon** ⚙️ next to "Project Overview" in the left sidebar
- Select **"Project settings"**

### 3. Add a Web App (if not already added)
- Scroll down to the **"Your apps"** section
- Click **"Add app"** button
- Select **"Web"** platform
- Register app with name: **"Sahayak Web App"**
- Click **"Register app"**

### 4. Copy the Configuration
After registering, you'll see a configuration object like this:

```javascript

```

### 5. Create Environment File
Create a `.env.local` file in your project root:

```bash
# In your project directory
touch .env.local
```

### 6. Add Your Configuration
Add these lines to your `.env.local` file:

```env
# Replace with your actual values from step 4

```

### 7. Restart Your Development Server
```bash
# Stop your current server (Ctrl+C)
# Then restart it
npm run dev
```

## 🔍 Troubleshooting

### If you still get API key errors:

1. **Check if the file is created correctly:**
   ```bash
   # Check if .env.local exists
   ls -la .env.local
   ```

2. **Verify the API key format:**
   - Should start with "AIzaSy"
   - Should be 39 characters long
   - Example: `AIzaSyC_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

3. **Make sure you're using the Web API key, not the service account key:**
   - ❌ Service account key (starts with private key)
   - ✅ Web API key (starts with AIzaSy)

4. **Check if Authentication is enabled:**
   - Go to Firebase Console → Authentication
   - Click "Get started"
   - Enable "Email/Password" sign-in method

## 📝 Important Notes

- **Never commit `.env.local` to git** (it should be in `.gitignore`)
- **Use the Web API key, not the service account key**
- **The API key is safe to expose** in frontend code (it's designed for this)
- **Restart your dev server** after adding environment variables

## 🚀 Test Your Setup

After completing the steps:

1. Start your dev server: `npm run dev`
2. Go to: `http://localhost:3000/auth/login`
3. Try creating a new account
4. If successful, you should be redirected to the dashboard

## ❓ Still Having Issues?

If you're still getting API key errors:

1. Double-check that you copied the entire API key
2. Make sure there are no extra spaces in your `.env.local` file
3. Verify that you're using the web app configuration, not the service account
4. Check the browser console for more detailed error messages 