"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Users, Plus, Edit, BookOpen, TrendingUp, Calendar, Award } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function ClassManagementPage() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "राहुल शर्मा",
      nameEn: "Rahul Sharma",
      grade: "Grade 3",
      age: 8,
      subjects: {
        mathematics: { score: 85, progress: 78 },
        science: { score: 92, progress: 85 },
        language: { score: 76, progress: 70 },
      },
      attendance: 95,
      lastAssessment: "2024-01-15",
      strengths: ["Quick learner", "Good at problem solving"],
      improvements: ["Needs help with writing", "Shy in group activities"],
    },
    {
      id: 2,
      name: "प्रिया पटेल",
      nameEn: "Priya Patel",
      grade: "Grade 4",
      age: 9,
      subjects: {
        mathematics: { score: 78, progress: 82 },
        science: { score: 88, progress: 90 },
        language: { score: 94, progress: 88 },
      },
      attendance: 98,
      lastAssessment: "2024-01-14",
      strengths: ["Excellent reader", "Helps other students"],
      improvements: ["Math calculation speed", "Confidence in presentations"],
    },
    {
      id: 3,
      name: "अमित कुमार",
      nameEn: "Amit Kumar",
      grade: "Grade 2",
      age: 7,
      subjects: {
        mathematics: { score: 65, progress: 60 },
        science: { score: 70, progress: 65 },
        language: { score: 82, progress: 75 },
      },
      attendance: 87,
      lastAssessment: "2024-01-13",
      strengths: ["Creative thinking", "Good memory"],
      improvements: ["Basic math concepts", "Regular attendance"],
    },
  ])

  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: "",
    nameEn: "",
    grade: "",
    age: "",
  })

  const gradeStats = {
    "Grade 1": { count: 8, avgScore: 75 },
    "Grade 2": { count: 12, avgScore: 72 },
    "Grade 3": { count: 15, avgScore: 78 },
    "Grade 4": { count: 10, avgScore: 82 },
    "Grade 5": { count: 7, avgScore: 85 },
  }

  const addStudent = () => {
    if (!newStudent.name || !newStudent.grade) {
      alert("Please fill in required fields")
      return
    }

    const student = {
      id: students.length + 1,
      ...newStudent,
      age: Number.parseInt(newStudent.age),
      subjects: {
        mathematics: { score: 0, progress: 0 },
        science: { score: 0, progress: 0 },
        language: { score: 0, progress: 0 },
      },
      attendance: 100,
      lastAssessment: new Date().toISOString().split("T")[0],
      strengths: [],
      improvements: [],
    }

    setStudents([...students, student])
    setNewStudent({ name: "", nameEn: "", grade: "", age: "" })
    setShowAddStudent(false)
  }

  const getOverallScore = (student: any) => {
    const subjects = Object.values(student.subjects) as any[]
    return Math.round(subjects.reduce((sum, subject) => sum + subject.score, 0) / subjects.length)
  }

  const getGradeColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50"
    if (score >= 75) return "text-blue-600 bg-blue-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">वर्ग व्यवस्थापन</h1>
                  <p className="text-sm text-gray-600">Class Management</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-teal-100 text-teal-800">
                  <Users className="w-4 h-4 mr-1" />
                  {students.length} Students
                </Badge>
                <Button onClick={() => setShowAddStudent(true)} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Student
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Class Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(students.reduce((sum, s) => sum + getOverallScore(s), 0) / students.length)}%
                    </div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)}%
                    </div>
                    <div className="text-sm text-gray-600">Attendance</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">
                      {students.filter((s) => getOverallScore(s) >= 85).length}
                    </div>
                    <div className="text-sm text-gray-600">High Performers</div>
                  </CardContent>
                </Card>
              </div>

              {/* Grade Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Number of students in each grade level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {Object.entries(gradeStats).map(([grade, stats]) => (
                      <div key={grade} className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-lg font-bold text-gray-900">{stats.count}</div>
                        <div className="text-sm text-gray-600 mb-2">{grade}</div>
                        <div className="text-xs text-gray-500">Avg: {stats.avgScore}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest assessments and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {students.slice(0, 5).map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{student.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{student.name}</div>
                            <div className="text-xs text-gray-500">Last assessment: {student.lastAssessment}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className={getGradeColor(getOverallScore(student))}>
                          {getOverallScore(student)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Student List */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Student List</CardTitle>
                    <CardDescription>Manage your students and their information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {students.map((student) => (
                        <div
                          key={student.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedStudent?.id === student.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedStudent(student)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="font-medium text-blue-600">{student.name.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-gray-500">{student.nameEn}</div>
                                <div className="text-xs text-gray-400">
                                  {student.grade} • Age {student.age}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className={getGradeColor(getOverallScore(student))}>
                                {getOverallScore(student)}%
                              </Badge>
                              <div className="text-xs text-gray-500 mt-1">Attendance: {student.attendance}%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Student Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Student Details</CardTitle>
                    <CardDescription>
                      {selectedStudent ? "Detailed information and progress" : "Select a student to view details"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedStudent ? (
                      <div className="space-y-4">
                        <div className="text-center pb-4 border-b">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-xl font-bold text-blue-600">{selectedStudent.name.charAt(0)}</span>
                          </div>
                          <h3 className="font-bold text-lg">{selectedStudent.name}</h3>
                          <p className="text-gray-600">{selectedStudent.nameEn}</p>
                          <div className="flex justify-center space-x-4 mt-2">
                            <Badge variant="outline">{selectedStudent.grade}</Badge>
                            <Badge variant="outline">Age {selectedStudent.age}</Badge>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Subject Performance</h4>
                          <div className="space-y-3">
                            {Object.entries(selectedStudent.subjects).map(([subject, data]: [string, any]) => (
                              <div key={subject}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="capitalize">{subject}</span>
                                  <span>{data.score}%</span>
                                </div>
                                <Progress value={data.progress} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2 text-green-700">Strengths</h4>
                          <ul className="text-sm space-y-1">
                            {selectedStudent.strengths.map((strength: string, index: number) => (
                              <li key={index} className="text-green-600">
                                • {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2 text-orange-700">Areas for Improvement</h4>
                          <ul className="text-sm space-y-1">
                            {selectedStudent.improvements.map((improvement: string, index: number) => (
                              <li key={index} className="text-orange-600">
                                • {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex space-x-2 pt-4">
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <BookOpen className="w-3 h-3 mr-1" />
                            Assessments
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Select a student from the list to view their details and progress</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Add Student Modal */}
              {showAddStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-md">
                    <CardHeader>
                      <CardTitle>Add New Student</CardTitle>
                      <CardDescription>Enter student information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Name (Marathi) *</label>
                        <Input
                          placeholder="e.g., राहुल शर्मा"
                          value={newStudent.name}
                          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Name (English)</label>
                        <Input
                          placeholder="e.g., Rahul Sharma"
                          value={newStudent.nameEn}
                          onChange={(e) => setNewStudent({ ...newStudent, nameEn: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Grade *</label>
                          <select
                            className="w-full px-3 py-2 border rounded-md"
                            value={newStudent.grade}
                            onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                          >
                            <option value="">Select Grade</option>
                            <option value="Grade 1">Grade 1</option>
                            <option value="Grade 2">Grade 2</option>
                            <option value="Grade 3">Grade 3</option>
                            <option value="Grade 4">Grade 4</option>
                            <option value="Grade 5">Grade 5</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Age</label>
                          <Input
                            type="number"
                            placeholder="8"
                            value={newStudent.age}
                            onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2 pt-4">
                        <Button onClick={addStudent} className="flex-1">
                          Add Student
                        </Button>
                        <Button onClick={() => setShowAddStudent(false)} variant="outline" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Class Progress Overview</CardTitle>
                  <CardDescription>Track student progress across subjects and grades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Mathematics Progress</h4>
                      <div className="space-y-3">
                        {students.map((student) => (
                          <div key={student.id} className="flex items-center justify-between">
                            <span className="text-sm">{student.name}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={student.subjects.mathematics.progress} className="w-20 h-2" />
                              <span className="text-xs text-gray-500 w-8">{student.subjects.mathematics.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">Science Progress</h4>
                      <div className="space-y-3">
                        {students.map((student) => (
                          <div key={student.id} className="flex items-center justify-between">
                            <span className="text-sm">{student.name}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={student.subjects.science.progress} className="w-20 h-2" />
                              <span className="text-xs text-gray-500 w-8">{student.subjects.science.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">Language Progress</h4>
                      <div className="space-y-3">
                        {students.map((student) => (
                          <div key={student.id} className="flex items-center justify-between">
                            <span className="text-sm">{student.name}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={student.subjects.language.progress} className="w-20 h-2" />
                              <span className="text-xs text-gray-500 w-8">{student.subjects.language.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                  <CardDescription>Create detailed reports for students and parents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-24 flex-col bg-transparent">
                      <BookOpen className="w-6 h-6 mb-2" />
                      <span>Individual Progress Report</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col bg-transparent">
                      <TrendingUp className="w-6 h-6 mb-2" />
                      <span>Class Performance Report</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col bg-transparent">
                      <Calendar className="w-6 h-6 mb-2" />
                      <span>Attendance Report</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col bg-transparent">
                      <Award className="w-6 h-6 mb-2" />
                      <span>Achievement Report</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col bg-transparent">
                      <Users className="w-6 h-6 mb-2" />
                      <span>Parent Communication</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col bg-transparent">
                      <BookOpen className="w-6 h-6 mb-2" />
                      <span>Subject-wise Analysis</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
