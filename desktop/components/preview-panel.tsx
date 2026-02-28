'use client'

import { Eye, Download, Share2, FileText, Edit } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { GeneratedReport } from '@/app/page'
import jsPDF from 'jspdf'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const renderRichText = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

interface PreviewPanelProps {
  report: GeneratedReport
  onReportChange: (report: GeneratedReport) => void
}

export function PreviewPanel({ report, onReportChange }: PreviewPanelProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedReport, setEditedReport] = useState(report)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setEditedReport(report)
  }, [report])

  const handleFieldChange = (field: keyof GeneratedReport, value: any) => {
    const updated = { ...editedReport, [field]: value }
    setEditedReport(updated)
  }

  const saveEdits = () => {
    onReportChange(editedReport)
    setIsEditMode(false)
  }

  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsDownloading(true)

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = 210
      const pageHeight = 297
      const margin = 20
      const contentWidth = pageWidth - margin * 2
      let y = margin

      const checkPage = (needed: number) => {
        if (y + needed > pageHeight - margin) {
          pdf.addPage()
          y = margin
        }
      }

      const addWrappedText = (text: string, x: number, startY: number, maxWidth: number, lineHeight: number, fontSize: number, wrapXOffset: number = 0) => {
        pdf.setFontSize(fontSize)
        // First split by explicit new lines
        const paragraphs = text.split('\n');

        for (let p = 0; p < paragraphs.length; p++) {
          const paragraph = paragraphs[p];
          if (!paragraph.trim()) {
            y += lineHeight; // Empty lines just advance Y
            continue;
          }

          let currentX = x;
          const parts = paragraph.split(/(\*\*.*?\*\*)/g)

          for (let i = 0; i < parts.length; i++) {
            let chunk = parts[i];
            if (!chunk) continue;

            let isBold = false;
            if (chunk.startsWith('**') && chunk.endsWith('**')) {
              isBold = true;
              chunk = chunk.slice(2, -2);
            }

            pdf.setFont('helvetica', isBold ? 'bold' : 'normal');

            const words = chunk.split(' ');
            for (let w = 0; w < words.length; w++) {
              const word = words[w];
              if (!word) {
                // handle structural double spaces if any
                currentX += pdf.getTextWidth(' ');
                continue;
              }

              let wordWidth = pdf.getTextWidth(word);
              if (currentX + wordWidth > margin + maxWidth && currentX > x) {
                // Wrap to next line
                currentX = x + wrapXOffset;
                y += lineHeight;
                checkPage(lineHeight);
              }
              pdf.text(word, currentX, y);
              currentX += wordWidth + pdf.getTextWidth(' ');
            }
          }
          // After finishing a paragraph, advance Y for the next block
          y += lineHeight;
        }
      }

      // Header bar
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(18)
      const titleText = editedReport.title || 'Untitled Vulnerability'
      const titleLines = pdf.splitTextToSize(titleText, contentWidth)
      const titleLineHeight = 8
      const titleTotalHeight = titleLines.length * titleLineHeight
      const startYTitle = 28
      const dateY = startYTitle + titleTotalHeight + 2
      const headerHeight = dateY + 7

      pdf.setFillColor(30, 30, 40)
      pdf.rect(0, 0, pageWidth, headerHeight, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(8)
      pdf.text('SECURITY ASSESSMENT REPORT', margin, 15)

      pdf.setFontSize(18)
      let currentTitleY = startYTitle
      for (const line of titleLines) {
        pdf.text(line, margin, currentTitleY)
        currentTitleY += titleLineHeight
      }

      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      pdf.text(`Prepared by: Security Team  |  Date: ${dateStr}`, margin, dateY)
      y = headerHeight + 10

      // Severity + CVSS row
      pdf.setTextColor(0, 0, 0)
      const severity = editedReport.cvssDetails?.severity || 'N/A'
      const score = editedReport.cvssDetails?.score || 'N/A'
      const vector = editedReport.cvssDetails?.vectorString || ''

      // Severity badge
      if (severity === 'Critical') pdf.setFillColor(185, 28, 28)
      else if (severity === 'High') pdf.setFillColor(220, 38, 38)
      else if (severity === 'Medium') pdf.setFillColor(202, 138, 4)
      else if (severity === 'Low') pdf.setFillColor(37, 99, 235)
      else pdf.setFillColor(107, 114, 128)

      pdf.roundedRect(margin, y, 50, 14, 2, 2, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text(severity, margin + 25, y + 9, { align: 'center' })

      // CVSS score box  
      pdf.setFillColor(243, 244, 246)
      pdf.roundedRect(margin + 55, y, 40, 14, 2, 2, 'F')
      pdf.setTextColor(30, 30, 40)
      pdf.setFontSize(10)
      pdf.text(`CVSS: ${score}`, margin + 75, y + 9, { align: 'center' })

      // Vector string
      if (vector) {
        pdf.setFontSize(7)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(100, 100, 100)
        pdf.text(vector, margin + 100, y + 9)
      }

      y += 22

      // Section helper
      const addSection = (num: string, title: string, content: string) => {
        checkPage(20)
        pdf.setDrawColor(200, 200, 200)
        pdf.setLineWidth(0.5)
        pdf.line(margin, y, pageWidth - margin, y)
        y += 6
        pdf.setTextColor(30, 30, 40)
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${num}. ${title}`, margin, y)
        y += 7
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(60, 60, 60)
        addWrappedText(content || `No ${title.toLowerCase()} provided.`, margin, y, contentWidth, 5, 10)
        y += 4
      }

      // Executive Summary (highlighted box)
      checkPage(25)
      pdf.setFillColor(239, 246, 255)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      const summaryLines = pdf.splitTextToSize(editedReport.introduction || 'No introduction provided.', contentWidth - 10)
      const boxHeight = Math.max(20, summaryLines.length * 5 + 14)
      checkPage(boxHeight)
      pdf.setFillColor(239, 246, 255)
      pdf.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'F')
      pdf.setDrawColor(37, 99, 235)
      pdf.setLineWidth(1)
      pdf.line(margin, y, margin, y + boxHeight)
      pdf.setTextColor(30, 30, 40)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text('EXECUTIVE SUMMARY', margin + 5, y + 7)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      pdf.setFontSize(9)
      let lblY = y + 13
      for (const line of summaryLines) {
        pdf.text(line, margin + 5, lblY)
        lblY += 5
      }
      y += boxHeight + 6

      // Sections
      addSection('1', 'Vulnerability Details', editedReport.introduction || '')

      // Steps to Reproduce
      checkPage(20)
      pdf.setDrawColor(200, 200, 200)
      pdf.setLineWidth(0.5)
      pdf.line(margin, y, pageWidth - margin, y)
      y += 6
      pdf.setTextColor(30, 30, 40)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text('2. Steps to Reproduce', margin, y)
      y += 7
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      if (editedReport.stepsToReproduce && editedReport.stepsToReproduce.length > 0) {
        editedReport.stepsToReproduce.forEach((step, idx) => {
          checkPage(7)
          // Strip any existing "1. " or "1) " from the beginning of the step string to avoid double numbering
          const cleanStep = step.replace(/^\d+[\.\)]\s*/, '')
          addWrappedText(`${idx + 1}. ${cleanStep}`, margin + 2, y, contentWidth - 4, 5, 10)
          y += 2
        })
      } else {
        addWrappedText('No steps provided.', margin, y, contentWidth, 5, 10)
      }
      y += 4

      // Proof of Concept
      checkPage(20)
      pdf.setDrawColor(200, 200, 200)
      pdf.setLineWidth(0.5)
      pdf.line(margin, y, pageWidth - margin, y)
      y += 6
      pdf.setTextColor(30, 30, 40)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text('3. Proof of Concept', margin, y)
      y += 7
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      const pocText = editedReport.proofOfConcept || 'No proof of concept provided.'
      const pocItems = pocText.split('\n').filter(l => l.trim() !== '')

      pocItems.forEach((item) => {
        checkPage(7)
        // Detect if it's a sub-item (e.g., 'a. ', 'b. ', or just indented)
        const isSubPoint = /^\s*[a-z]\.\s/i.test(item) || /^\s+/.test(item) || item.trim().startsWith('-')
        const cleanItem = item.trim()

        let startX = margin + 2;
        let wrapXOffset = 4;

        if (isSubPoint) {
          startX = margin + 8;
          wrapXOffset = 4;
        }

        addWrappedText(cleanItem, startX, y, contentWidth - (startX - margin), 5, 10, wrapXOffset);
        y += 2 // Add space between main points/sub-points
      })
      y += 4

      // POC Images
      const imageDataUrls: { dataUrl: string; label: string }[] = []

      // Load saved images (from backend API)
      if (editedReport.imagePaths && editedReport.imagePaths.length > 0) {
        for (let i = 0; i < editedReport.imagePaths.length; i++) {
          try {
            const resp = await fetch(`http://127.0.0.1:5000/api/report-images/${editedReport.imagePaths[i]}`)
            const blob = await resp.blob()
            const dataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result as string)
              reader.readAsDataURL(blob)
            })
            imageDataUrls.push({ dataUrl, label: `Figure ${i + 1}: Proof of Concept` })
          } catch (e) {
            console.warn(`Failed to load saved image ${i}`, e)
          }
        }
      }

      // Load new images (File objects)
      if (editedReport.images && editedReport.images.length > 0) {
        for (let i = 0; i < editedReport.images.length; i++) {
          try {
            const dataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result as string)
              reader.readAsDataURL(editedReport.images[i])
            })
            const figNum = (editedReport.imagePaths?.length || 0) + i + 1
            imageDataUrls.push({ dataUrl, label: `Figure ${figNum}: Proof of Concept` })
          } catch (e) {
            console.warn(`Failed to load new image ${i}`, e)
          }
        }
      }

      // Embed images into PDF
      for (const img of imageDataUrls) {
        try {
          const tempImg = new Image()
          await new Promise<void>((resolve, reject) => {
            tempImg.onload = () => resolve()
            tempImg.onerror = reject
            tempImg.src = img.dataUrl
          })

          const aspectRatio = tempImg.width / tempImg.height
          let imgW = contentWidth
          let imgH = imgW / aspectRatio

          // Cap height to avoid images larger than half a page
          const maxImgH = (pageHeight - margin * 2) * 0.6
          if (imgH > maxImgH) {
            imgH = maxImgH
            imgW = imgH * aspectRatio
          }

          checkPage(imgH + 12)

          // Light border around image
          pdf.setDrawColor(200, 200, 200)
          pdf.setLineWidth(0.3)
          pdf.rect(margin, y, imgW, imgH)
          pdf.addImage(img.dataUrl, 'PNG', margin, y, imgW, imgH)
          y += imgH + 3

          // Caption
          pdf.setTextColor(130, 130, 130)
          pdf.setFontSize(8)
          pdf.setFont('helvetica', 'italic')
          pdf.text(img.label, margin + imgW / 2, y, { align: 'center' })
          y += 8
          pdf.setFont('helvetica', 'normal')
        } catch (e) {
          console.warn('Failed to embed image in PDF', e)
        }
      }

      addSection('4', 'Impact Assessment', editedReport.impact || '')
      addSection('5', 'Remediation Recommendations', editedReport.remediation || '')
      addSection('6', 'Technical Analysis', editedReport.technicalDetails || '')

      // Footer
      checkPage(15)
      y += 4
      pdf.setDrawColor(30, 30, 40)
      pdf.setLineWidth(1)
      pdf.line(margin, y, pageWidth - margin, y)
      y += 6
      pdf.setTextColor(130, 130, 130)
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'italic')
      pdf.text(
        'This is a confidential security assessment report intended for authorized recipients only.',
        pageWidth / 2, y, { align: 'center' }
      )

      pdf.save(`${editedReport.title.replace(/\s+/g, '_')}_Report.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      setError(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="w-1/2 border-l border-border bg-background flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Live Preview</span>
          <span className="text-xs text-muted">• How your report will look when exported</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isEditMode
              ? 'bg-primary text-primary-foreground'
              : 'btn-ghost'
              }`}
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button onClick={handleDownload} className="btn-ghost" disabled={isDownloading}>
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>

        </div>
      </div>

      {/* Preview Content - Word Document Style */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6 scrollbar-custom">
        {/* Document Container */}
        <div id="report-preview" className="max-w-4xl mx-auto bg-white text-gray-900 shadow-xl">
          {/* Document Page */}
          <div className="p-16 space-y-8 min-h-screen">
            {/* Report Header - Professional */}
            <div className="border-b-4 border-gray-800 pb-8">
              <p className="text-xs text-gray-600 font-bold tracking-widest uppercase mb-6">Security Assessment Report</p>
              {isEditMode ? (
                <input
                  type="text"
                  value={editedReport.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="text-5xl font-black text-gray-900 mb-4 leading-tight w-full bg-yellow-50 px-3 py-2 rounded"
                />
              ) : (
                <h1 className="text-5xl font-black text-gray-900 mb-4 leading-tight">{editedReport.title}</h1>
              )}
              <div className="flex items-center justify-between text-sm text-gray-700">
                <p className="font-semibold">Prepared by: Security Team</p>
                <p>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            {/* Severity Badge */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-600 font-semibold mb-2 uppercase">Severity Level</p>
                {isEditMode ? (
                  <input
                    type="text"
                    value={editedReport.cvssDetails.severity}
                    onChange={(e) =>
                      handleFieldChange('cvssDetails', {
                        ...editedReport.cvssDetails,
                        severity: e.target.value,
                      })
                    }
                    className="text-2xl font-bold text-white bg-red-600 px-4 py-3 rounded w-full"
                  />
                ) : (
                  <div className={`inline-block text-2xl font-bold text-white px-6 py-3 rounded ${editedReport.cvssDetails.severity === 'Critical' ? 'bg-red-700' :
                    editedReport.cvssDetails.severity === 'High' ? 'bg-red-600' :
                      editedReport.cvssDetails.severity === 'Medium' ? 'bg-yellow-600' :
                        editedReport.cvssDetails.severity === 'Low' ? 'bg-blue-600' :
                          'bg-gray-600'
                    }`}>
                    {editedReport.cvssDetails.severity}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 font-semibold mb-2 uppercase">CVSS Score</p>
                <div className="text-3xl font-bold text-gray-900 bg-gray-100 px-4 py-3 rounded">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedReport.cvssDetails.score}
                      onChange={(e) =>
                        handleFieldChange('cvssDetails', {
                          ...editedReport.cvssDetails,
                          score: e.target.value,
                        })
                      }
                      className="w-full bg-white px-2 py-1 rounded"
                    />
                  ) : (
                    editedReport.cvssDetails.score
                  )}
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <section className="bg-blue-50 border-l-4 border-blue-600 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase">Executive Summary</h2>
              {isEditMode ? (
                <textarea
                  value={editedReport.introduction}
                  onChange={(e) => handleFieldChange('introduction', e.target.value)}
                  className="w-full bg-white px-3 py-2 rounded text-gray-700 leading-relaxed text-sm"
                  rows={3}
                />
              ) : (
                <p className="text-gray-800 leading-relaxed text-sm whitespace-pre-wrap">{renderRichText(editedReport.introduction || 'No introduction provided.')}</p>
              )}
            </section>

            {/* Detailed Findings */}
            <div className="space-y-10">
              {/* Vulnerability Description */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase border-b-2 border-gray-300 pb-2">1. Vulnerability Details</h2>
                {isEditMode ? (
                  <textarea
                    value={editedReport.introduction}
                    onChange={(e) => handleFieldChange('introduction', e.target.value)}
                    className="w-full bg-gray-50 px-3 py-2 rounded text-gray-700 leading-relaxed text-sm"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{renderRichText(editedReport.introduction || 'No details provided.')}</p>
                )}
              </section>

              {/* Steps to Reproduce */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase border-b-2 border-gray-300 pb-2">2. Steps to Reproduce</h2>
                {isEditMode ? (
                  <textarea
                    value={editedReport.stepsToReproduce.join('\n')}
                    onChange={(e) => handleFieldChange('stepsToReproduce', e.target.value.split('\n'))}
                    className="w-full bg-gray-50 px-3 py-2 rounded text-gray-700 text-sm"
                    rows={4}
                  />
                ) : (
                  <ol className="text-gray-700 space-y-2 text-sm">
                    {editedReport.stepsToReproduce.map((step, idx) => {
                      const cleanStep = step.replace(/^\d+[\.\)]\s*/, '')
                      return (
                        <li key={idx} className="flex gap-3">
                          <span className="font-bold text-gray-600 flex-shrink-0">{idx + 1}.</span>
                          <span className="whitespace-pre-wrap">{renderRichText(cleanStep)}</span>
                        </li>
                      )
                    })}
                  </ol>
                )}
              </section>

              {/* Technical Evidence & POC */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase border-b-2 border-gray-300 pb-2">3. Proof of Concept</h2>
                {isEditMode ? (
                  <textarea
                    value={editedReport.proofOfConcept}
                    onChange={(e) => handleFieldChange('proofOfConcept', e.target.value)}
                    className="w-full bg-gray-50 px-3 py-2 rounded text-gray-700 font-mono text-xs"
                    rows={5}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="text-gray-700 space-y-2 text-sm pl-2">
                      {(editedReport.proofOfConcept || 'No proof of concept provided.').split('\n').filter(l => l.trim() !== '').map((item, idx) => {
                        const isSubPoint = /^\s*[a-z]\.\s/i.test(item) || /^\s+/.test(item) || item.trim().startsWith('-')
                        return (
                          <div key={idx} className={`flex gap-3 ${isSubPoint ? 'ml-6 text-gray-600' : 'font-medium'}`}>
                            <span className="whitespace-pre-wrap">{renderRichText(item.trim())}</span>
                          </div>
                        )
                      })}
                    </div>
                    {(editedReport.images?.length > 0 || (editedReport.imagePaths && editedReport.imagePaths.length > 0)) && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {/* Saved Images */}
                        {editedReport.imagePaths && editedReport.imagePaths.map((path, idx) => (
                          <div key={`saved-${idx}`} className="border border-gray-300 rounded p-2 bg-white">
                            <img
                              src={`http://127.0.0.1:5000/api/report-images/${path}`}
                              alt={`Saved POC ${idx + 1}`}
                              className="w-full h-auto rounded"
                            />
                            <p className="text-center text-xs text-gray-500 mt-2">Figure {idx + 1}: Proof of Concept (Saved)</p>
                          </div>
                        ))}

                        {/* New Images */}
                        {editedReport.images.map((image, idx) => (
                          <div key={`new-${idx}`} className="border border-gray-300 rounded p-2 bg-white">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`POC ${idx + 1}`}
                              className="w-full h-auto rounded"
                            />
                            <p className="text-center text-xs text-gray-500 mt-2">Figure {(editedReport.imagePaths?.length || 0) + idx + 1}: Proof of Concept</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Impact Assessment */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase border-b-2 border-gray-300 pb-2">4. Impact Assessment</h2>
                {isEditMode ? (
                  <textarea
                    value={editedReport.impact}
                    onChange={(e) => handleFieldChange('impact', e.target.value)}
                    className="w-full bg-gray-50 px-3 py-2 rounded text-gray-700 leading-relaxed text-sm"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{renderRichText(editedReport.impact || 'No impact assessment provided.')}</p>
                )}
              </section>

              {/* Remediation & Recommendations */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase border-b-2 border-gray-300 pb-2">5. Remediation Recommendations</h2>
                {isEditMode ? (
                  <textarea
                    value={editedReport.remediation}
                    onChange={(e) => handleFieldChange('remediation', e.target.value)}
                    className="w-full bg-gray-50 px-3 py-2 rounded text-gray-700 leading-relaxed text-sm"
                    rows={4}
                  />
                ) : (
                  <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                    {renderRichText(editedReport.remediation || 'No remediation provided')}
                  </div>
                )}
              </section>

              {/* Technical Details */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase border-b-2 border-gray-300 pb-2">6. Technical Analysis</h2>
                {isEditMode ? (
                  <textarea
                    value={editedReport.technicalDetails}
                    onChange={(e) => handleFieldChange('technicalDetails', e.target.value)}
                    className="w-full bg-gray-50 px-3 py-2 rounded text-gray-700 font-mono text-xs"
                    rows={5}
                  />
                ) : (
                  <div className="bg-gray-50 p-4 rounded border border-gray-300">
                    <p className="text-gray-800 text-sm font-mono whitespace-pre-wrap">{renderRichText(editedReport.technicalDetails || 'No technical analysis provided.')}</p>
                  </div>
                )}
              </section>
            </div>

            {/* Footer */}
            <div className="border-t-4 border-gray-800 pt-8 mt-12">
              <p className="text-xs text-gray-600 italic text-center">
                This is a confidential security assessment report intended for authorized recipients only. {isEditMode ? 'Click Save to apply changes.' : ''}
              </p>
            </div>

            {/* Edit Mode Actions */}
            {isEditMode && (
              <div className="flex gap-2 mt-6 pt-6 border-t border-gray-300">
                <button
                  onClick={saveEdits}
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditedReport(report)
                    setIsEditMode(false)
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={!!error} onOpenChange={(open) => !open && setError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
