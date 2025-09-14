"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Copy, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuestionPaper {
  mcq: Array<{
    question: string;
    options: Array<{
      a: string;
      b: string;
      c: string;
      d: string;
    }>;
    answer: string;
    marks: number;
  }>;
  short_q: Array<{
    question: string;
    answer: string;
    marks: number;
  }>;
  mid_q: Array<{
    question: string;
    answer: string;
    marks: number;
  }>;
  long_q: Array<{
    question: string;
    answer: string;
    marks: number;
  }>;
}

const demoQuestionPaper: QuestionPaper = {
  mcq: [
    {
      question: "What does it mean to be honest?",
      options: [
        {
          a: "Always telling the truth",
          b: "Keeping secrets from friends",
          c: "Cheating in games",
          d: "Taking things without asking"
        }
      ],
      answer: "Always telling the truth",
      marks: 1
    },
    {
      question: "If you accidentally break something at home, what is the most honest thing to do?",
      options: [
        {
          a: "Hide it and pretend nothing happened",
          b: "Blame your sibling",
          c: "Tell an adult immediately and apologize",
          d: "Run away from the situation"
        }
      ],
      answer: "Tell an adult immediately and apologize",
      marks: 1
    },
    {
      question: "Why is it important to be honest with your parents?",
      options: [
        {
          a: "So they give you more pocket money",
          b: "So they will trust you",
          c: "So you don't have to do chores",
          d: "So you can play more games"
        }
      ],
      answer: "So they will trust you",
      marks: 1
    }
  ],
  short_q: [
    {
      question: "Define honesty in your own words.",
      answer: "Honesty means always telling the truth, being fair, and not cheating or stealing. It's about being truthful in your words and actions, even when it's difficult.",
      marks: 2
    },
    {
      question: "Give two examples of how a student can show honesty in school.",
      answer: "A student can show honesty by not copying during an exam and by admitting when they have forgotten to do their homework.",
      marks: 2
    }
  ],
  mid_q: [
    {
      question: "Describe a situation where choosing to be honest might be difficult, but is ultimately the right choice. Explain why.",
      answer: "Choosing to be honest can be difficult when you've accidentally damaged something valuable belonging to someone else, like a friend's toy. You might fear getting scolded or having to pay for it. However, being honest by admitting your mistake and apologizing is the right choice because it shows courage and responsibility.",
      marks: 3
    }
  ],
  long_q: [
    {
      question: "Explain in detail why honesty is considered a fundamental moral value and how it contributes to a person's good character. Provide examples.",
      answer: "Honesty is considered a fundamental moral value because it forms the bedrock of trust, integrity, and respect in all aspects of life. It means being truthful in thoughts, words, and actions, even when it's inconvenient or challenging. A person with honesty develops a strong, reliable character that others can depend on.",
      marks: 5
    }
  ]
}

interface QuestionPaperDemoProps {
  topic: string;
  grade: string;
  onClose: () => void;
}

const QuestionPaperDemo: React.FC<QuestionPaperDemoProps> = ({ topic, grade, onClose }) => {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('mcq')

  const copyToClipboard = () => {
    const paperText = generatePaperText(demoQuestionPaper, topic, grade)
    navigator.clipboard.writeText(paperText)
    
    toast({
      title: "Copied!",
      description: "Question paper copied to clipboard",
    })
  }

  const generatePaperText = (paper: QuestionPaper, topic: string, grade: string) => {
    let text = `QUESTION PAPER\n`
    text += `Topic: ${topic}\n`
    text += `Grade: ${grade}\n`
    text += `Time: 2 Hours\n\n`

    text += `Section A: Multiple Choice Questions\n`
    paper.mcq.forEach((q, i) => {
      text += `Q${i + 1}. ${q.question} [${q.marks} Mark${q.marks > 1 ? 's' : ''}]\n`
      text += `a) ${q.options[0].a}\n`
      text += `b) ${q.options[0].b}\n`
      text += `c) ${q.options[0].c}\n`
      text += `d) ${q.options[0].d}\n\n`
    })

    text += `Section B: Short Answer Questions\n`
    paper.short_q.forEach((q, i) => {
      text += `Q${i + 4}. ${q.question} [${q.marks} Mark${q.marks > 1 ? 's' : ''}]\n\n`
    })

    text += `Section C: Medium Answer Questions\n`
    paper.mid_q.forEach((q, i) => {
      text += `Q${i + 6}. ${q.question} [${q.marks} Mark${q.marks > 1 ? 's' : ''}]\n\n`
    })

    text += `Section D: Long Answer Questions\n`
    paper.long_q.forEach((q, i) => {
      text += `Q${i + 7}. ${q.question} [${q.marks} Mark${q.marks > 1 ? 's' : ''}]\n\n`
    })

    return text
  }

  const previewPaper = () => {
    const previewWindow = window.open('', '_blank')
    if (!previewWindow) return

    const totalMarks = demoQuestionPaper.mcq.reduce((sum, q) => sum + q.marks, 0) +
                      demoQuestionPaper.short_q.reduce((sum, q) => sum + q.marks, 0) +
                      demoQuestionPaper.mid_q.reduce((sum, q) => sum + q.marks, 0) +
                      demoQuestionPaper.long_q.reduce((sum, q) => sum + q.marks, 0)

    const paperContent = `
      <div style="font-family: 'Times New Roman', serif; line-height: 1.6; margin: 20px; position: relative;">
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 72px; color: rgba(59, 130, 246, 0.08); z-index: -1; pointer-events: none; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); letter-spacing: 4px;">SAHAYAK</div>
        
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px;">
          <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 10px 0; color: #1e40af; text-transform: uppercase; letter-spacing: 2px;">QUESTION PAPER</h1>
          <h2 style="font-size: 20px; margin: 5px 0; color: #374151;">Topic: ${topic}</h2>
          <h3 style="font-size: 16px; margin: 5px 0; color: #6b7280;">Grade: ${grade}</h3>
          <p style="font-size: 14px; margin: 10px 0 0 0; color: #6b7280; font-weight: bold;">Time: 2 Hours | Total Marks: ${totalMarks}</p>
        </div>

        <div style="margin-bottom: 35px;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #1e40af; border-left: 4px solid #3b82f6; padding-left: 15px; background: linear-gradient(90deg, #eff6ff 0%, transparent 100%); padding: 10px 15px;">
            Section A: Multiple Choice Questions (${demoQuestionPaper.mcq.reduce((sum, q) => sum + q.marks, 0)} Marks)
          </div>
          ${demoQuestionPaper.mcq.map((q, i) => `
            <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fafafa;">
              <div style="font-weight: bold; margin-bottom: 12px; color: #1f2937; font-size: 14px; line-height: 1.5;">
                Q${i + 1}. ${q.question} 
                <span style="font-weight: bold; color: #059669; margin-left: 10px; font-size: 12px; background: #d1fae5; padding: 2px 8px; border-radius: 12px;">[${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
              </div>
              <div style="margin-left: 25px; margin-top: 10px;">
                <div style="margin-bottom: 8px; padding: 5px 0; font-size: 13px;"><span style="font-weight: bold; color: #3b82f6; margin-right: 8px;">a)</span> ${q.options[0].a}</div>
                <div style="margin-bottom: 8px; padding: 5px 0; font-size: 13px;"><span style="font-weight: bold; color: #3b82f6; margin-right: 8px;">b)</span> ${q.options[0].b}</div>
                <div style="margin-bottom: 8px; padding: 5px 0; font-size: 13px;"><span style="font-weight: bold; color: #3b82f6; margin-right: 8px;">c)</span> ${q.options[0].c}</div>
                <div style="margin-bottom: 8px; padding: 5px 0; font-size: 13px;"><span style="font-weight: bold; color: #3b82f6; margin-right: 8px;">d)</span> ${q.options[0].d}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="margin-bottom: 35px;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #1e40af; border-left: 4px solid #3b82f6; padding-left: 15px; background: linear-gradient(90deg, #eff6ff 0%, transparent 100%); padding: 10px 15px;">
            Section B: Short Answer Questions (${demoQuestionPaper.short_q.reduce((sum, q) => sum + q.marks, 0)} Marks)
          </div>
          ${demoQuestionPaper.short_q.map((q, i) => `
            <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fafafa;">
              <div style="font-weight: bold; margin-bottom: 12px; color: #1f2937; font-size: 14px; line-height: 1.5;">
                Q${i + 4}. ${q.question} 
                <span style="font-weight: bold; color: #059669; margin-left: 10px; font-size: 12px; background: #d1fae5; padding: 2px 8px; border-radius: 12px;">[${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="margin-bottom: 35px;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #1e40af; border-left: 4px solid #3b82f6; padding-left: 15px; background: linear-gradient(90deg, #eff6ff 0%, transparent 100%); padding: 10px 15px;">
            Section C: Medium Answer Questions (${demoQuestionPaper.mid_q.reduce((sum, q) => sum + q.marks, 0)} Marks)
          </div>
          ${demoQuestionPaper.mid_q.map((q, i) => `
            <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fafafa;">
              <div style="font-weight: bold; margin-bottom: 12px; color: #1f2937; font-size: 14px; line-height: 1.5;">
                Q${i + 6}. ${q.question} 
                <span style="font-weight: bold; color: #059669; margin-left: 10px; font-size: 12px; background: #d1fae5; padding: 2px 8px; border-radius: 12px;">[${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="margin-bottom: 35px;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #1e40af; border-left: 4px solid #3b82f6; padding-left: 15px; background: linear-gradient(90deg, #eff6ff 0%, transparent 100%); padding: 10px 15px;">
            Section D: Long Answer Questions (${demoQuestionPaper.long_q.reduce((sum, q) => sum + q.marks, 0)} Marks)
          </div>
          ${demoQuestionPaper.long_q.map((q, i) => `
            <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fafafa;">
              <div style="font-weight: bold; margin-bottom: 12px; color: #1f2937; font-size: 14px; line-height: 1.5;">
                Q${i + 7}. ${q.question} 
                <span style="font-weight: bold; color: #059669; margin-left: 10px; font-size: 12px; background: #d1fae5; padding: 2px 8px; border-radius: 12px;">[${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="text-align: right; font-weight: bold; margin-top: 30px; border-top: 2px solid #3b82f6; padding-top: 15px; font-size: 16px; color: #1e40af;">
          Total Marks: ${totalMarks}
        </div>

        <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 15px;">
          <p>Generated by <span style="display: inline-block; font-weight: bold; color: #3b82f6; font-size: 14px;">SAHAYAK</span> - AI-Powered Educational Assistant</p>
          <p>Date: ${new Date().toLocaleDateString('en-IN')} | Time: ${new Date().toLocaleTimeString('en-IN')}</p>
        </div>
      </div>
    `

    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Question Paper Preview - ${topic}</title>
          <style>
            body { margin: 0; padding: 0; background: white; }
            .preview-controls {
              position: fixed;
              top: 20px;
              right: 20px;
              z-index: 1000;
              background: white;
              padding: 15px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              border: 1px solid #e5e7eb;
            }
            .preview-controls button {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              margin-left: 10px;
              font-size: 14px;
            }
            .preview-controls button:hover {
              background: #2563eb;
            }
          </style>
        </head>
        <body>
          <div class="preview-controls">
            <button onclick="window.print()">Print</button>
            <button onclick="window.close()">Close</button>
          </div>
          ${paperContent}
        </body>
      </html>
    `)
    
    previewWindow.document.close()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Demo Question Paper</h2>
            <p className="text-gray-600">Sample question paper for topic: {topic} (Grade {grade})</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Demo Mode
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>This is a sample question paper. The backend API is not available, so we're showing you a demo of what the generated paper would look like.</p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sample Question Paper</CardTitle>
                <CardDescription>Topic: {topic} | Grade: {grade}</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previewPaper}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="mcq">MCQ ({demoQuestionPaper.mcq.length})</TabsTrigger>
                <TabsTrigger value="short">Short ({demoQuestionPaper.short_q.length})</TabsTrigger>
                <TabsTrigger value="mid">Medium ({demoQuestionPaper.mid_q.length})</TabsTrigger>
                <TabsTrigger value="long">Long ({demoQuestionPaper.long_q.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="mcq" className="mt-6">
                <div className="space-y-6">
                  {demoQuestionPaper.mcq.map((q, i) => (
                    <div key={i} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold">Q{i + 1}. {q.question}</h4>
                        <Badge variant="secondary">{q.marks} Mark{q.marks > 1 ? 's' : ''}</Badge>
                      </div>
                      <div className="space-y-2 ml-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">a)</span>
                          <span>{q.options[0].a}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">b)</span>
                          <span>{q.options[0].b}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">c)</span>
                          <span>{q.options[0].c}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">d)</span>
                          <span>{q.options[0].d}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="short" className="mt-6">
                <div className="space-y-6">
                  {demoQuestionPaper.short_q.map((q, i) => (
                    <div key={i} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">Q{i + 4}. {q.question}</h4>
                        <Badge variant="secondary">{q.marks} Mark{q.marks > 1 ? 's' : ''}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="mid" className="mt-6">
                <div className="space-y-6">
                  {demoQuestionPaper.mid_q.map((q, i) => (
                    <div key={i} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">Q{i + 6}. {q.question}</h4>
                        <Badge variant="secondary">{q.marks} Mark{q.marks > 1 ? 's' : ''}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="long" className="mt-6">
                <div className="space-y-6">
                  {demoQuestionPaper.long_q.map((q, i) => (
                    <div key={i} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">Q{i + 7}. {q.question}</h4>
                        <Badge variant="secondary">{q.marks} Mark{q.marks > 1 ? 's' : ''}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionPaperDemo; 