// Firebase configuration
import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  AuthError,
  fetchSignInMethodsForEmail
} from 'firebase/auth'
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCRLWT6xM5XEWSiwVlomlvZyXm0ZtZkv1E",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "snappy-byte-457513-n1.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "snappy-byte-457513-n1",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "snappy-byte-457513-n1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "594290114400",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:594290114400:web:5e397031fbcb3678696805",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Y2F2YH14QK"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Analytics (only in browser)
let analytics = null
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes ? analytics = getAnalytics(app) : null)
}

// Initialize Firebase Authentication
export const auth = getAuth(app)

// Initialize Firestore
export const db = getFirestore(app)

// User types
export interface UserProfile {
  uid: string
  email: string
  userType: 'teacher' | 'student' | 'admin'
  displayName?: string
  school?: string
  grade?: string
  subjects?: string[]
  createdAt: Date
  lastLogin: Date
  isActive: boolean
  registrationStatus: 'pending' | 'approved' | 'rejected'
}

// Game types
export interface GameRecord {
  id: string
  title: string
  description: string
  gameType: string
  gradeLevel: string
  gameUrl: string
  createdAt: Date
  userId: string
  userEmail: string
  isPlayed?: boolean
  playedAt?: Date
}

export interface CustomContentRecord {
  id: string
  subject: string
  grade: string
  topic: string
  contentLessonPlan: string
  materialUrl: string
  imageUrl: string
  userId: string
  userEmail: string
  createdAt: Date
}

export interface MaterialRecord {
  id: string
  subject: string
  grade: string
  topic: string
  materials: string
  materialUrl: string
  imageUrl: string
  userId: string
  userEmail: string
  createdAt: Date
}

// Authentication functions
export const signInUser = async (email: string, password: string) => {
  try {
    console.log('Attempting to sign in user:', email)
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    if (userCredential.user) {
      console.log('User signed in successfully:', userCredential.user.email)
      
      // Verify user exists and has required fields
      if (!userCredential.user.email) {
        throw new Error('User email is missing')
      }
      
      // Check if user has displayName (for userType detection)
      if (!userCredential.user.displayName) {
        console.warn('User does not have displayName set')
      }
      
      return { user: userCredential.user, error: null }
    } else {
      throw new Error('No user returned from sign in')
    }
  } catch (error) {
    console.error('Sign in failed:', error)
    return { user: null, error: error as AuthError }
  }
}

export const signUpUser = async (email: string, password: string, userType: 'teacher' | 'student', displayName?: string) => {
  try {
    // 1. Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // 2. Update the user's display name if provided
    if (displayName && userCredential.user) {
      try {
        await updateProfile(userCredential.user, {
          displayName: displayName
        })
      } catch (profileError) {
        console.error('Failed to update display name:', profileError)
        // Continue without display name update
      }
    }
    
    // 3. Try to create user profile in Firestore (optional)
    try {
      const userProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: email,
        userType: userType,
        displayName: displayName,
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
        registrationStatus: 'approved'
      }
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile)
      console.log('User profile created in Firestore successfully')
    } catch (firestoreError) {
      console.log('Firestore profile creation failed, but user can still login:', firestoreError)
      // Continue without Firestore profile - user can still login with Firebase Auth
    }
    
    return { user: userCredential.user, error: null }
  } catch (error) {
    console.error('User creation failed:', error)
    return { user: null, error: error as AuthError }
  }
}

export const signOutUser = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error) {
    return { error: error as AuthError }
  }
}

export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

export const checkUserRegistration = async (email: string): Promise<{ isRegistered: boolean; userType?: string }> => {
  try {
    console.log('Checking registration for email:', email)
    
    const signInMethods = await fetchSignInMethodsForEmail(auth, email)
    
    if (signInMethods.length > 0) {
      console.log('User is registered with methods:', signInMethods)
      
      // User exists in Firebase Auth, try to get userType from Firestore if available
      try {
        const usersRef = collection(db, 'users')
        const q = query(usersRef, where('email', '==', email))
        const querySnapshot = await getDocs(q)
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0]
          const userData = userDoc.data() as UserProfile
          console.log('Found user profile in Firestore:', userData.userType)
          return { isRegistered: true, userType: userData.userType }
        }
      } catch (firestoreError) {
        console.log('Could not fetch user profile from Firestore:', firestoreError)
      }
      
      // User exists in Firebase Auth but no Firestore profile
      return { isRegistered: true, userType: 'student' } // Default fallback
    }
    
    console.log('User is not registered')
    return { isRegistered: false }
  } catch (error) {
    console.error('Error checking user registration:', error)
    return { isRegistered: false }
  }
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  try {
    await setDoc(doc(db, 'users', uid), updates, { merge: true })
    return { success: true, error: null }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

export const validateUserAccess = async (uid: string, requiredUserType: 'teacher' | 'student'): Promise<{ hasAccess: boolean; userProfile?: UserProfile }> => {
  try {
    const userProfile = await getUserProfile(uid)
    if (!userProfile) {
      return { hasAccess: false }
    }
    
    // Check if user type matches required type
    if (userProfile.userType === requiredUserType) {
      return { hasAccess: true, userProfile }
    }
    
    // Admin can access everything
    if (userProfile.userType === 'admin') {
      return { hasAccess: true, userProfile }
    }
    
    return { hasAccess: false, userProfile }
  } catch (error) {
    console.error('Error validating user access:', error)
    return { hasAccess: false }
  }
}

// Game management functions
export const saveGame = async (gameData: Omit<GameRecord, 'id'>): Promise<{ success: boolean; gameId?: string; error?: string }> => {
  try {
    console.log('🔥 Attempting to save game to Firebase...')
    console.log('🔥 Game data:', gameData)
    console.log('🔥 Firebase db instance:', db)
    
    const gamesRef = collection(db, 'games')
    console.log('🔥 Games collection reference:', gamesRef)
    
    const gameDoc = await addDoc(gamesRef, {
      ...gameData,
      createdAt: serverTimestamp(),
    })
    
    console.log('🔥 Game saved successfully with ID:', gameDoc.id)
    return { success: true, gameId: gameDoc.id }
  } catch (error) {
    console.error('🔥 Error saving game:', error)
    if (error instanceof Error) {
      console.error('🔥 Error details:', {
        code: (error as any).code,
        message: error.message,
        stack: error.stack
      })
    }
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save game' }
  }
}

export const getGamesByUser = async (userId: string): Promise<GameRecord[]> => {
  try {
    console.log('🔥 Getting games for user:', userId)
    const gamesRef = collection(db, 'games')
    
    // First try with orderBy, if it fails, try without
    let querySnapshot
    try {
      const q = query(
        gamesRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      console.log('🔥 Executing query with orderBy...')
      querySnapshot = await getDocs(q)
    } catch (orderByError) {
      console.log('🔥 OrderBy failed, trying without orderBy:', orderByError)
      const q = query(
        gamesRef, 
        where('userId', '==', userId)
      )
      querySnapshot = await getDocs(q)
    }
    
    console.log('🔥 Query result size:', querySnapshot.size)
    
    const games: GameRecord[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      console.log('🔥 Processing game document:', doc.id, data)
      
      const game: GameRecord = {
        id: doc.id,
        title: data.title,
        description: data.description,
        gameType: data.gameType,
        gradeLevel: data.gradeLevel,
        gameUrl: data.gameUrl,
        createdAt: data.createdAt?.toDate() || new Date(),
        userId: data.userId,
        userEmail: data.userEmail,
        isPlayed: data.isPlayed || false,
        playedAt: data.playedAt?.toDate(),
      }
      
      games.push(game)
      console.log('🔥 Added game to array:', game)
    })
    
    // Sort manually if orderBy failed
    games.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    console.log('🔥 Total games returned:', games.length)
    return games
  } catch (error) {
    console.error('🔥 Error getting games by user:', error)
    return []
  }
}

export const deleteGame = async (gameId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await deleteDoc(doc(db, 'games', gameId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting game:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete game' }
  }
}

export const getAllGames = async (): Promise<GameRecord[]> => {
  try {
    console.log('Loading all games from Firebase')
    const gamesRef = collection(db, 'games')
    const q = query(gamesRef, orderBy('createdAt', 'desc'))
    
    const querySnapshot = await getDocs(q)
    const games: GameRecord[] = []
    
    console.log('Total games in database:', querySnapshot.size)
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      games.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        gameType: data.gameType,
        gradeLevel: data.gradeLevel,
        gameUrl: data.gameUrl,
        createdAt: data.createdAt?.toDate() || new Date(),
        userId: data.userId,
        userEmail: data.userEmail,
      })
    })
    
    console.log('All games loaded:', games)
    return games
  } catch (error) {
    console.error('Error getting all games:', error)
    return []
  }
}

// Update game as played
export const updateGamePlayed = async (gameId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await setDoc(doc(db, 'games', gameId), {
      isPlayed: true,
      playedAt: serverTimestamp(),
    }, { merge: true })
    
    return { success: true }
  } catch (error) {
    console.error('Error marking game as played:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to mark game as played' }
  }
} 

// Cookie management functions for middleware support
export const setAuthCookies = (user: User, userProfile: UserProfile) => {
  if (typeof window !== 'undefined') {
    // Set cookies for middleware authentication
    document.cookie = `auth-token=${user.uid}; path=/; max-age=3600; secure; samesite=strict`
    document.cookie = `user-type=${userProfile.userType}; path=/; max-age=3600; secure; samesite=strict`
  }
}

export const clearAuthCookies = () => {
  if (typeof window !== 'undefined') {
    // Clear authentication cookies
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'user-type=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

// Custom content management functions
export const saveCustomContent = async (contentData: Omit<CustomContentRecord, 'id'>): Promise<{ success: boolean; contentId?: string; error?: string }> => {
  try {
    console.log('🎨 Attempting to save custom content to Firebase...')
    console.log('🎨 Content data:', contentData)
    
    const contentRef = collection(db, 'customContent')
    console.log('🎨 Custom content collection reference:', contentRef)
    
    const contentDoc = await addDoc(contentRef, {
      ...contentData,
      createdAt: serverTimestamp(),
    })
    
    console.log('🎨 Custom content saved successfully with ID:', contentDoc.id)
    return { success: true, contentId: contentDoc.id }
  } catch (error) {
    console.error('🎨 Error saving custom content:', error)
    if (error instanceof Error) {
      console.error('🎨 Error details:', {
        code: (error as any).code,
        message: error.message,
        stack: error.stack
      })
    }
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save custom content' }
  }
}

export const getCustomContentByUser = async (userId: string): Promise<CustomContentRecord[]> => {
  try {
    console.log('🎨 Getting custom content for user:', userId)
    const contentRef = collection(db, 'customContent')
    
    // First try with orderBy, if it fails, try without
    let querySnapshot
    try {
      const q = query(
        contentRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      console.log('🎨 Executing query with orderBy...')
      querySnapshot = await getDocs(q)
    } catch (orderByError) {
      console.log('🎨 OrderBy failed, trying without orderBy:', orderByError)
      const q = query(
        contentRef, 
        where('userId', '==', userId)
      )
      querySnapshot = await getDocs(q)
    }
    
    console.log('🎨 Query result size:', querySnapshot.size)
    
    const content: CustomContentRecord[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      console.log('🎨 Processing content document:', doc.id, data)
      
      const contentRecord: CustomContentRecord = {
        id: doc.id,
        subject: data.subject,
        grade: data.grade,
        topic: data.topic,
        contentLessonPlan: data.contentLessonPlan,
        materialUrl: data.materialUrl,
        imageUrl: data.imageUrl,
        userId: data.userId,
        userEmail: data.userEmail,
        createdAt: data.createdAt?.toDate() || new Date(),
      }
      
      content.push(contentRecord)
      console.log('🎨 Added content to array:', contentRecord)
    })
    
    // Sort manually if orderBy failed
    content.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    console.log('🎨 Total content returned:', content.length)
    return content
  } catch (error) {
    console.error('🎨 Error getting custom content by user:', error)
    return []
  }
}

export const getCustomContentById = async (contentId: string): Promise<CustomContentRecord | null> => {
  try {
    console.log('🎨 Getting custom content by ID:', contentId)
    const contentRef = doc(db, 'customContent', contentId)
    const contentDoc = await getDoc(contentRef)
    
    if (contentDoc.exists()) {
      const data = contentDoc.data()
      const contentRecord: CustomContentRecord = {
        id: contentDoc.id,
        subject: data.subject,
        grade: data.grade,
        topic: data.topic,
        contentLessonPlan: data.contentLessonPlan,
        materialUrl: data.materialUrl,
        imageUrl: data.imageUrl,
        userId: data.userId,
        userEmail: data.userEmail,
        createdAt: data.createdAt?.toDate() || new Date(),
      }
      
      console.log('🎨 Found content:', contentRecord)
      return contentRecord
    } else {
      console.log('🎨 Content not found')
      return null
    }
  } catch (error) {
    console.error('🎨 Error getting custom content by ID:', error)
    return null
  }
}

export const deleteCustomContent = async (contentId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🎨 Deleting custom content:', contentId)
    const contentRef = doc(db, 'customContent', contentId)
    await deleteDoc(contentRef)
    
    console.log('🎨 Custom content deleted successfully')
    return { success: true }
  } catch (error) {
    console.error('🎨 Error deleting custom content:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete custom content' }
  }
}

// Material management functions
export const saveMaterial = async (materialData: Omit<MaterialRecord, 'id'>): Promise<{ success: boolean; materialId?: string; error?: string }> => {
  try {
    console.log('📚 Attempting to save material to Firebase...')
    console.log('📚 Material data:', materialData)
    
    const materialRef = collection(db, 'materials')
    console.log('📚 Materials collection reference:', materialRef)
    
    const materialDoc = await addDoc(materialRef, {
      ...materialData,
      createdAt: serverTimestamp(),
    })
    
    console.log('📚 Material saved successfully with ID:', materialDoc.id)
    return { success: true, materialId: materialDoc.id }
  } catch (error) {
    console.error('📚 Error saving material:', error)
    if (error instanceof Error) {
      console.error('📚 Error details:', {
        code: (error as any).code,
        message: error.message,
        stack: error.stack
      })
    }
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save material' }
  }
}

export const getMaterialsByUser = async (userId: string): Promise<MaterialRecord[]> => {
  try {
    console.log('📚 Getting materials for user:', userId)
    const materialRef = collection(db, 'materials')
    
    // First try with orderBy, if it fails, try without
    let querySnapshot
    try {
      const q = query(
        materialRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      console.log('📚 Executing query with orderBy...')
      querySnapshot = await getDocs(q)
    } catch (orderByError) {
      console.log('📚 OrderBy failed, trying without orderBy:', orderByError)
      const q = query(
        materialRef, 
        where('userId', '==', userId)
      )
      querySnapshot = await getDocs(q)
    }
    
    console.log('📚 Query result size:', querySnapshot.size)
    
    const materials: MaterialRecord[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      console.log('📚 Processing material document:', doc.id, data)
      
      const materialRecord: MaterialRecord = {
        id: doc.id,
        subject: data.subject,
        grade: data.grade,
        topic: data.topic,
        materials: data.materials,
        materialUrl: data.materialUrl,
        imageUrl: data.imageUrl,
        userId: data.userId,
        userEmail: data.userEmail,
        createdAt: data.createdAt?.toDate() || new Date(),
      }
      
      materials.push(materialRecord)
      console.log('📚 Added material to array:', materialRecord)
    })
    
    // Sort manually if orderBy failed
    materials.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    console.log('📚 Total materials returned:', materials.length)
    return materials
  } catch (error) {
    console.error('📚 Error getting materials by user:', error)
    return []
  }
}

export const getMaterialById = async (materialId: string): Promise<MaterialRecord | null> => {
  try {
    console.log('📚 Getting material by ID:', materialId)
    const materialRef = doc(db, 'materials', materialId)
    const materialDoc = await getDoc(materialRef)
    
    if (materialDoc.exists()) {
      const data = materialDoc.data()
      const materialRecord: MaterialRecord = {
        id: materialDoc.id,
        subject: data.subject,
        grade: data.grade,
        topic: data.topic,
        materials: data.materials,
        materialUrl: data.materialUrl,
        imageUrl: data.imageUrl,
        userId: data.userId,
        userEmail: data.userEmail,
        createdAt: data.createdAt?.toDate() || new Date(),
      }
      
      console.log('📚 Found material:', materialRecord)
      return materialRecord
    } else {
      console.log('📚 Material not found')
      return null
    }
  } catch (error) {
    console.error('📚 Error getting material by ID:', error)
    return null
  }
}

export const deleteMaterial = async (materialId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('📚 Deleting material:', materialId)
    const materialRef = doc(db, 'materials', materialId)
    await deleteDoc(materialRef)
    
    console.log('📚 Material deleted successfully')
    return { success: true }
  } catch (error) {
    console.error('📚 Error deleting material:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete material' }
  }
} 