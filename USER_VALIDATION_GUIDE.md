# User Validation System Guide

## 🔐 Overview

This guide explains how the user validation system works in the Sahayak Teaching Assistant application. The system ensures that only authorized users can access the platform and provides different levels of access based on user roles.

## 🏗️ System Architecture

### **1. User Registration Flow**

```
User Registration → Firebase Auth → Firestore Profile → Admin Approval → Access Granted
```

### **2. User Types**

- **Teacher** - Can access teacher dashboard and tools
- **Student** - Can access student dashboard and learning tools
- **Admin** - Can manage user registrations and system settings

### **3. Registration Status**

- **Pending** - User registered but not yet approved
- **Approved** - User can access the platform
- **Rejected** - User registration was denied

## 🔧 Implementation Details

### **Firebase Configuration**

The system uses both Firebase Authentication and Firestore:

```typescript
// Firebase Auth - Handles login/logout
const auth = getAuth(app)

// Firestore - Stores user profiles and validation data
const db = getFirestore(app)
```

### **User Profile Structure**

```typescript
interface UserProfile {
  uid: string                    // Firebase Auth UID
  email: string                  // User's email
  userType: 'teacher' | 'student' | 'admin'
  displayName?: string           // Optional display name
  school?: string               // School name
  grade?: string                // Student grade level
  subjects?: string[]           // Teacher subjects
  createdAt: Date              // Registration date
  lastLogin: Date              // Last login timestamp
  isActive: boolean            // Account status
  registrationStatus: 'pending' | 'approved' | 'rejected'
}
```

## 🚀 How to Use

### **1. User Registration**

When a user registers:

```typescript
// Check if user already exists
const { isRegistered } = await checkRegistration(email)
if (isRegistered) {
  // Show error - user already exists
  return
}

// Create new user
const result = await signup(email, password, 'teacher')
```

### **2. User Validation**

Before allowing access to protected routes:

```typescript
// Validate user access
const { hasAccess, userProfile } = await validateAccess('teacher')
if (!hasAccess) {
  // Redirect to login or show error
  return
}
```

### **3. Admin Management**

Admins can manage user registrations:

```typescript
// Approve user
await updateUserStatus(userId, 'approved')

// Reject user
await updateUserStatus(userId, 'rejected')
```

## 🛡️ Security Features

### **1. Multi-Level Validation**

- **Firebase Auth** - Email/password authentication
- **Firestore Profile** - User role and status validation
- **Admin Approval** - Manual approval for new registrations

### **2. Access Control**

```typescript
// Check user permissions
const hasAccess = userProfile.userType === requiredUserType && 
                 userProfile.isActive && 
                 userProfile.registrationStatus === 'approved'
```

### **3. Protected Routes**

Routes are protected based on:
- Authentication status
- User type (teacher/student)
- Registration approval status

## 📋 Admin Functions

### **User Management Panel**

The admin panel provides:

- **View all users** - See all registered users
- **Filter by status** - Pending, approved, rejected
- **Approve/Reject** - Manage user registrations
- **User details** - View user information

### **Admin Actions**

```typescript
// Load all users
const users = await loadUsers()

// Update user status
await updateUserStatus(uid, 'approved')

// Filter users
const pendingUsers = users.filter(u => u.registrationStatus === 'pending')
```

## 🔍 Validation Functions

### **1. Check User Registration**

```typescript
const checkUserRegistration = async (email: string) => {
  // Check if email is registered in Firebase Auth
  const signInMethods = await fetchSignInMethodsForEmail(auth, email)
  const isRegistered = signInMethods.length > 0
  
  if (isRegistered) {
    // Get user profile from Firestore
    const userProfile = await getUserProfile(uid)
    return { isRegistered: true, userType: userProfile?.userType }
  }
  
  return { isRegistered: false }
}
```

### **2. Validate User Access**

```typescript
const validateUserAccess = async (uid: string, requiredUserType: string) => {
  const userProfile = await getUserProfile(uid)
  
  if (!userProfile) return { hasAccess: false }
  
  const hasAccess = userProfile.userType === requiredUserType && 
                   userProfile.isActive && 
                   userProfile.registrationStatus === 'approved'
  
  return { hasAccess, userProfile }
}
```

## 🎯 Use Cases

### **1. New Teacher Registration**

1. Teacher fills registration form
2. System checks if email already exists
3. Creates Firebase Auth account
4. Creates Firestore profile with 'pending' status
5. Admin reviews and approves
6. Teacher can access platform

### **2. Student Login**

1. Student enters credentials
2. System validates authentication
3. Checks user profile for approval status
4. If approved, grants access to student dashboard
5. If pending/rejected, shows appropriate message

### **3. Admin Management**

1. Admin views pending registrations
2. Reviews user information
3. Approves or rejects registration
4. System updates user status
5. User receives notification

## 🔧 Setup Instructions

### **1. Enable Firestore**

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Create database in production mode
4. Set up security rules

### **2. Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own profile
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admins can read all user profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
    }
  }
}
```

### **3. Environment Variables**

Make sure you have the correct Firebase configuration in your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

## 🚨 Error Handling

### **Common Errors**

1. **User not found** - Email not registered
2. **Invalid credentials** - Wrong password
3. **Account not approved** - Registration pending
4. **Access denied** - Wrong user type for route

### **Error Messages**

```typescript
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address'
    case 'auth/wrong-password':
      return 'Incorrect password'
    case 'auth/account-not-approved':
      return 'Your account is pending approval'
    // ... more error cases
  }
}
```

## 📈 Benefits

### **1. Security**
- Multi-layer authentication
- Role-based access control
- Admin approval system

### **2. Scalability**
- Firebase handles authentication
- Firestore stores user data
- Easy to add new user types

### **3. User Experience**
- Clear registration flow
- Status feedback
- Easy admin management

### **4. Compliance**
- User data tracking
- Audit trail
- Approval workflow

This validation system ensures that only authorized users can access your educational platform while providing a smooth user experience and robust security. 