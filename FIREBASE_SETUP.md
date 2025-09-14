# Firebase Authentication Setup

This guide will help you set up Firebase authentication for the Sahayak Teaching Assistant application.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard to create your project

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Optionally, you can also enable other providers like Google, Facebook, etc.

## 3. Get Firebase Configuration

1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web"
4. Register your app with a nickname (e.g., "Sahayak Web App")
5. Copy the configuration object that looks like this:

**Important:** The service account private key you provided is for server-side operations only. For frontend authentication, you need the web API key from the web app configuration.

## 4. Set Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables with your Firebase configuration:

```env
# Firebase Configuration for snappy-byte-457513-n1

# Note: The private key from your service account should NOT be used in the frontend
# It's only for server-side operations. For frontend authentication, you need the web API key.
```

## 5. Install Firebase Dependencies

Run the following command to install Firebase:

```bash
npm install firebase
```

## 6. Complete Setup Steps

1. **Get Web App Configuration:**
   - Go to Firebase Console > Project Settings > General
   - Scroll to "Your apps" section
   - Click "Add app" > "Web" if you haven't added a web app yet
   - Register with name "Sahayak Web App"
   - Copy the `apiKey` and `appId` from the config

2. **Create Environment File:**
   ```bash
   # Create .env.local file
   touch .env.local
   ```

3. **Add Configuration:**

   ```

4. **Install Dependencies:**
   ```bash
   npm install firebase
   ```

5. **Test the Setup:**
   - Start your development server: `npm run dev`
   - Navigate to `/auth/login`
   - Try creating a new account or logging in with existing credentials

## 7. Security Rules (Optional)

If you plan to use Firestore or Realtime Database, make sure to set up appropriate security rules to protect your data.

## 8. Service Account (Server-Side Only)

The service account credentials you provided are for server-side operations only:

```json
```

**⚠️ Security Warning:**
- Never include the private key in frontend code
- Keep service account credentials secure
- Use environment variables for server-side operations
- The private key should only be used in API routes or server functions

## 9. User Management

You can manage users through the Firebase Console:
- Go to "Authentication" > "Users"
- View, edit, or delete user accounts
- Monitor sign-in activity

## Features Implemented

- ✅ Email/Password authentication
- ✅ User registration and login
- ✅ Protected routes
- ✅ Authentication state management
- ✅ Error handling
- ✅ Loading states
- ✅ Automatic redirects
- ✅ User type detection (teacher/student)

## Usage

The authentication system automatically:
- Redirects authenticated users to appropriate dashboards
- Protects routes that require authentication
- Handles login/signup errors
- Manages authentication state globally
- Supports both teacher and student user types

## Customization

You can customize the authentication flow by:
- Modifying user type detection logic in `ProtectedRoute.tsx`
- Adding additional authentication providers
- Customizing error messages
- Adding user profile management
- Implementing password reset functionality 