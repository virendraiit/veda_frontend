"use client"

import React from 'react';

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

interface QuestionPaperPDFProps {
  paper: QuestionPaper;
  topic: string;
  grade: string;
  onClose: () => void;
}

const QuestionPaperPDF: React.FC<QuestionPaperPDFProps> = ({ paper, topic, grade, onClose }) => {
  const totalMarks = paper.mcq.reduce((sum, q) => sum + q.marks, 0) +
                    paper.short_q.reduce((sum, q) => sum + q.marks, 0) +
                    paper.mid_q.reduce((sum, q) => sum + q.marks, 0) +
                    paper.long_q.reduce((sum, q) => sum + q.marks, 0);

  const printPaper = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const paperContent = generatePaperHTML();
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Question Paper - ${topic}</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 1in;
              }
              body {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
            }
            
            * {
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
              position: relative;
              background: white;
              color: #333;
            }
            
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 72px;
              color: rgba(59, 130, 246, 0.08);
              z-index: -1;
              pointer-events: none;
              font-weight: bold;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
              letter-spacing: 4px;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 20px;
              position: relative;
            }
            
            .header h1 {
              font-size: 28px;
              font-weight: bold;
              margin: 0 0 10px 0;
              color: #1e40af;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            
            .header h2 {
              font-size: 20px;
              margin: 5px 0;
              color: #374151;
            }
            
            .header h3 {
              font-size: 16px;
              margin: 5px 0;
              color: #6b7280;
            }
            
            .header p {
              font-size: 14px;
              margin: 10px 0 0 0;
              color: #6b7280;
              font-weight: bold;
            }
            
            .section {
              margin-bottom: 35px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #1e40af;
              border-left: 4px solid #3b82f6;
              padding-left: 15px;
              background: linear-gradient(90deg, #eff6ff 0%, transparent 100%);
              padding: 10px 15px;
            }
            
            .question {
              margin-bottom: 20px;
              padding: 15px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              background: #fafafa;
              page-break-inside: avoid;
            }
            
            .question-text {
              font-weight: bold;
              margin-bottom: 12px;
              color: #1f2937;
              font-size: 14px;
              line-height: 1.5;
            }
            
            .options {
              margin-left: 25px;
              margin-top: 10px;
            }
            
            .option {
              margin-bottom: 8px;
              padding: 5px 0;
              font-size: 13px;
            }
            
            .option-label {
              font-weight: bold;
              color: #3b82f6;
              margin-right: 8px;
            }
            
            .marks {
              font-weight: bold;
              color: #059669;
              margin-left: 10px;
              font-size: 12px;
              background: #d1fae5;
              padding: 2px 8px;
              border-radius: 12px;
            }
            
            .total-marks {
              text-align: right;
              font-weight: bold;
              margin-top: 30px;
              border-top: 2px solid #3b82f6;
              padding-top: 15px;
              font-size: 16px;
              color: #1e40af;
            }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
            }
            
            .sahayak-logo {
              display: inline-block;
              font-weight: bold;
              color: #3b82f6;
              font-size: 14px;
            }
            
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="watermark">SAHAYAK</div>
          ${paperContent}
          <div class="footer">
            <p>Generated by <span class="sahayak-logo">SAHAYAK</span> - AI-Powered Educational Assistant</p>
            <p>Date: ${new Date().toLocaleDateString('en-IN')} | Time: ${new Date().toLocaleTimeString('en-IN')}</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  };

  const generatePaperHTML = () => {
    return `
      <div class="header">
        <h1>QUESTION PAPER</h1>
        <h2>Topic: ${topic}</h2>
        <h3>Grade: ${grade}</h3>
        <p>Time: 2 Hours | Total Marks: ${totalMarks}</p>
      </div>

      <div class="section">
        <div class="section-title">Section A: Multiple Choice Questions (${paper.mcq.reduce((sum, q) => sum + q.marks, 0)} Marks)</div>
        ${paper.mcq.map((q, i) => `
          <div class="question">
            <div class="question-text">
              Q${i + 1}. ${q.question} 
              <span class="marks">[${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
            </div>
            <div class="options">
              <div class="option">
                <span class="option-label">a)</span> ${q.options[0].a}
              </div>
              <div class="option">
                <span class="option-label">b)</span> ${q.options[0].b}
              </div>
              <div class="option">
                <span class="option-label">c)</span> ${q.options[0].c}
              </div>
              <div class="option">
                <span class="option-label">d)</span> ${q.options[0].d}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <div class="section-title">Section B: Short Answer Questions (${paper.short_q.reduce((sum, q) => sum + q.marks, 0)} Marks)</div>
        ${paper.short_q.map((q, i) => `
          <div class="question">
            <div class="question-text">
              Q${i + 11}. ${q.question} 
              <span class="marks">[${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <div class="section-title">Section C: Medium Answer Questions (${paper.mid_q.reduce((sum, q) => sum + q.marks, 0)} Marks)</div>
        ${paper.mid_q.map((q, i) => `
          <div class="question">
            <div class="question-text">
              Q${i + 21}. ${q.question} 
              <span class="marks">[${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <div class="section-title">Section D: Long Answer Questions (${paper.long_q.reduce((sum, q) => sum + q.marks, 0)} Marks)</div>
        ${paper.long_q.map((q, i) => `
          <div class="question">
            <div class="question-text">
              Q${i + 26}. ${q.question} 
              <span class="marks">[${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="total-marks">
        Total Marks: ${totalMarks}
      </div>
    `;
  };

  const downloadAsPDF = () => {
    printPaper();
  };

  const previewPaper = () => {
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) return;

    const paperContent = generatePaperHTML();
    
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Question Paper Preview - ${topic}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
              position: relative;
              background: white;
              color: #333;
            }
            
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 72px;
              color: rgba(59, 130, 246, 0.08);
              z-index: -1;
              pointer-events: none;
              font-weight: bold;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
              letter-spacing: 4px;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 20px;
              position: relative;
            }
            
            .header h1 {
              font-size: 28px;
              font-weight: bold;
              margin: 0 0 10px 0;
              color: #1e40af;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            
            .header h2 {
              font-size: 20px;
              margin: 5px 0;
              color: #374151;
            }
            
            .header h3 {
              font-size: 16px;
              margin: 5px 0;
              color: #6b7280;
            }
            
            .header p {
              font-size: 14px;
              margin: 10px 0 0 0;
              color: #6b7280;
              font-weight: bold;
            }
            
            .section {
              margin-bottom: 35px;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #1e40af;
              border-left: 4px solid #3b82f6;
              padding-left: 15px;
              background: linear-gradient(90deg, #eff6ff 0%, transparent 100%);
              padding: 10px 15px;
            }
            
            .question {
              margin-bottom: 20px;
              padding: 15px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              background: #fafafa;
            }
            
            .question-text {
              font-weight: bold;
              margin-bottom: 12px;
              color: #1f2937;
              font-size: 14px;
              line-height: 1.5;
            }
            
            .options {
              margin-left: 25px;
              margin-top: 10px;
            }
            
            .option {
              margin-bottom: 8px;
              padding: 5px 0;
              font-size: 13px;
            }
            
            .option-label {
              font-weight: bold;
              color: #3b82f6;
              margin-right: 8px;
            }
            
            .marks {
              font-weight: bold;
              color: #059669;
              margin-left: 10px;
              font-size: 12px;
              background: #d1fae5;
              padding: 2px 8px;
              border-radius: 12px;
            }
            
            .total-marks {
              text-align: right;
              font-weight: bold;
              margin-top: 30px;
              border-top: 2px solid #3b82f6;
              padding-top: 15px;
              font-size: 16px;
              color: #1e40af;
            }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
            }
            
            .sahayak-logo {
              display: inline-block;
              font-weight: bold;
              color: #3b82f6;
              font-size: 14px;
            }
            
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
          <div class="watermark">SAHAYAK</div>
          ${paperContent}
          <div class="footer">
            <p>Generated by <span class="sahayak-logo">SAHAYAK</span> - AI-Powered Educational Assistant</p>
            <p>Date: ${new Date().toLocaleDateString('en-IN')} | Time: ${new Date().toLocaleTimeString('en-IN')}</p>
          </div>
        </body>
      </html>
    `);
    
    previewWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Question Paper Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Paper Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Topic:</span> {topic}
              </div>
              <div>
                <span className="font-medium">Grade:</span> {grade}
              </div>
              <div>
                <span className="font-medium">Total Marks:</span> {totalMarks}
              </div>
              <div>
                <span className="font-medium">Sections:</span> 4 (MCQ, Short, Medium, Long)
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={previewPaper}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview Paper
          </button>
          
          <button
            onClick={downloadAsPDF}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p className="mb-2"><strong>Features:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Professional formatting with Sahayak watermark</li>
            <li>Print-optimized layout for A4 paper</li>
            <li>Section-wise organization with clear marking scheme</li>
            <li>Automatic total marks calculation</li>
            <li>Date and time stamping</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuestionPaperPDF; 