"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  getFirestore, 
  collection, 
  query, 
  getDocs, 
  doc, 
  updateDoc,
  where,
  orderBy
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { UserProfile } from '@/lib/firebase'
import { useLanguage } from '@/lib/hooks/useLanguage'

export const UserManagement = () => {
  const { t } = useLanguage()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const usersRef = collection(db, 'users')
      const q = query(usersRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const usersData: UserProfile[] = []
      querySnapshot.forEach((doc) => {
        usersData.push(doc.data() as UserProfile)
      })
      
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (uid: string, status: 'approved' | 'rejected') => {
    try {
      const userRef = doc(db, 'users', uid)
      await updateDoc(userRef, {
        registrationStatus: status,
        lastLogin: new Date()
      })
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.uid === uid 
          ? { ...user, registrationStatus: status }
          : user
      ))
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true
    return user.registrationStatus === filter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'teacher':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Teacher</Badge>
      case 'student':
        return <Badge variant="outline" className="border-green-500 text-green-600">Student</Badge>
      case 'admin':
        return <Badge variant="outline" className="border-purple-500 text-purple-600">Admin</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage user registrations and access permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Input
              placeholder="Search users..."
              className="max-w-sm"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Users</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button onClick={loadUsers} variant="outline">
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.uid} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{user.email}</h3>
                      {getUserTypeBadge(user.userType)}
                      {getStatusBadge(user.registrationStatus)}
                    </div>
                                         <div className="text-sm text-gray-600 space-y-1">
                       <p>UID: {user.uid}</p>
                       <p>Created: {user.createdAt instanceof Date ? user.createdAt.toLocaleDateString() : new Date(user.createdAt).toLocaleDateString()}</p>
                       {user.school && <p>School: {user.school}</p>}
                       {user.grade && <p>Grade: {user.grade}</p>}
                     </div>
                  </div>
                  
                  {user.registrationStatus === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateUserStatus(user.uid, 'approved')}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateUserStatus(user.uid, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  
                  {user.registrationStatus === 'rejected' && (
                    <Button
                      size="sm"
                      onClick={() => updateUserStatus(user.uid, 'approved')}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Approve
                    </Button>
                  )}
                </div>
              </Card>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found matching the current filter.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 