'use client'

import React from "react"
import { useState } from 'react'
import { Upload, Sparkles, X, Plus, Save } from 'lucide-react'
import type { ReportData, GeneratedReport } from '@/app/page'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface MainContentProps {
  onDataChange: (data: ReportData) => void
  onGenerate: () => Promise<void>
  onReset: () => void
  generatedReport: GeneratedReport
  reportData?: ReportData
}

// ... tabs definition ...

export function MainContent({ onDataChange, onGenerate, onReset, generatedReport, reportData }: MainContentProps) {
  const [formData, setFormData] = useState<ReportData>(reportData || {
    shortDescription: '',
    explanation: '',
    technicalEvidenceTab: 'nmap',
    technicalEvidenceContent: '',
    pocImages: [],
  })

  // Sync with prop changes (e.g. when loading a draft)
  React.useEffect(() => {
    if (reportData) {
      setFormData(reportData)
    }
  }, [reportData])
  const [isGenerating, setIsGenerating] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedTab, setSelectedTab] = useState('nmap')

  // Alert dialog state
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState({ title: '', description: '' })

  const showAlert = (title: string, description: string) => {
    setAlertMessage({ title, description })
    setAlertOpen(true)
  }

  const handleChange = (field: keyof Omit<ReportData, 'pocImages'>, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    onDataChange(updated)
  }

  const handleTabChange = (tab: 'nmap' | 'burp' | 'logs') => {
    setFormData({ ...formData, technicalEvidenceTab: tab })
  }

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files)
      setFormData({ ...formData, pocImages: [...formData.pocImages, ...newImages] })
      onDataChange({ ...formData, pocImages: [...formData.pocImages, ...newImages] })
    }
  }

  const removeImage = (index: number) => {
    const updated = formData.pocImages.filter((_, i) => i !== index)
    setFormData({ ...formData, pocImages: updated })
    onDataChange({ ...formData, pocImages: updated })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleImageUpload(e.dataTransfer.files)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      await onGenerate()
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto section-divider scrollbar-custom">
      {/* Content Header */}
      <div className="px-8 py-6 border-b border-border flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Report Builder</h2>
        <button
          onClick={() => {
            const emptyData: ReportData = {
              shortDescription: '',
              explanation: '',
              technicalEvidenceTab: 'nmap',
              technicalEvidenceContent: '',
              pocImages: [],
            }
            setFormData(emptyData)
            onDataChange(emptyData)
            setSelectedTab('nmap')
            onReset()
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          New Report
        </button>
      </div>

      {/* Form Content */}
      <div className="px-8 py-8">
        <div className="space-y-8 max-w-3xl">
          {/* Vulnerability Details Section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6">Vulnerability Details</h3>
            <div className="space-y-6">
              {/* Short Description */}
              <div>
                <label className="text-sm text-muted font-medium mb-2 block">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g., Unauthenticated RCE in Login Service"
                  className="input-minimal w-full"
                  value={formData.shortDescription}
                  onChange={(e) => handleChange('shortDescription', e.target.value)}
                />
              </div>

              {/* Explanation & Discovery */}
              <div>
                <label className="text-sm text-muted font-medium mb-2 block">Explanation & Discovery</label>
                <textarea
                  placeholder="Describe the issue and how it was found..."
                  rows={5}
                  className="input-minimal w-full resize-none"
                  value={formData.explanation}
                  onChange={(e) => handleChange('explanation', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Technical Evidence Section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Technical Evidence</h3>

            {/* Evidence Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { id: 'nmap', label: 'Nmap' },
                { id: 'burp', label: 'Burp Suite' },
                { id: 'logs', label: 'Logs' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as 'nmap' | 'burp' | 'logs')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${formData.technicalEvidenceTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted hover:text-foreground'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Evidence Content Area */}
            <div className="space-y-3">
              <textarea
                placeholder={`Paste ${formData.technicalEvidenceTab === 'nmap' ? 'Nmap' : formData.technicalEvidenceTab === 'burp' ? 'Burp Suite' : 'Log'} scan results...`}
                rows={6}
                className="input-minimal w-full resize-none"
                value={formData.technicalEvidenceContent}
                onChange={(e) => handleChange('technicalEvidenceContent', e.target.value)}
              />

              {/* Upload Log File Button */}
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-md font-medium hover:bg-card/80 transition-colors text-sm cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload Log File
                <input
                  type="file"
                  accept=".txt,.log,.xml,.json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target?.result as string;
                        handleChange('technicalEvidenceContent', content);
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Proof-of-Concept Images Section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Proof-of-Concept Images</h3>

            {/* Upload Area */}
            <label
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`flex items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${dragActive
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50 bg-card/50'
                }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
              />
              <div className="text-center">
                <Upload className="w-6 h-6 text-muted mx-auto mb-2" />
                <p className="text-sm text-foreground mb-1">Drop images here or click to upload</p>
                <p className="text-xs text-muted">PNG, JPG, GIF up to 10MB each</p>
              </div>
            </label>

            {/* Uploaded Images Preview */}
            {(formData.pocImages.length > 0 || (formData.imagePaths && formData.imagePaths.length > 0)) && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {/* Saved Images */}
                {formData.imagePaths?.map((path, idx) => (
                  <div key={`saved-${idx}`} className="relative group">
                    <div className="bg-card border border-border rounded-lg p-2 aspect-square flex items-center justify-center overflow-hidden">
                      <img
                        src={`http://127.0.0.1:5000/api/report-images/${path}`}
                        alt={`Saved POC ${idx + 1}`}
                        className="max-w-full max-h-full object-cover"
                      />
                    </div>
                    {/* No removal for now, or implement removal logic */}
                  </div>
                ))}

                {/* New Uploads */}
                {formData.pocImages.map((image, idx) => (
                  <div key={`new-${idx}`} className="relative group">
                    <div className="bg-card border border-border rounded-lg p-2 aspect-square flex items-center justify-center overflow-hidden">
                      <img
                        src={URL.createObjectURL(image) || "/placeholder.svg"}
                        alt={`POC ${idx + 1}`}
                        className="max-w-full max-h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="flex gap-3 pt-6 border-t border-border">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || (!formData.shortDescription && !formData.explanation)}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  AI Regenerate Report
                </>
              )}
            </button>
            <button
              onClick={async () => {
                try {
                  const draftData = {
                    title: (generatedReport.title !== 'Untitled Vulnerability' ? generatedReport.title : formData.shortDescription) || 'Untitled Draft',
                    status: 'draft',
                    report: {
                      title: (generatedReport.title !== 'Untitled Vulnerability' ? generatedReport.title : formData.shortDescription),
                      introduction: generatedReport.introduction || formData.explanation,
                      technicalDetails: generatedReport.technicalDetails || formData.technicalEvidenceContent,
                      cvssDetails: generatedReport.cvssDetails || { score: '', severity: '', vectorString: '' },
                      stepsToReproduce: generatedReport.stepsToReproduce || [],
                      proofOfConcept: generatedReport.proofOfConcept || '',
                      impact: generatedReport.impact || '',
                      remediation: generatedReport.remediation || '',
                      images: [] // Images are handled separately
                    },
                    tags: [formData.technicalEvidenceTab]
                  };

                  const formDataToSend = new FormData();
                  formDataToSend.append('data', JSON.stringify(draftData));

                  // Append images
                  if (formData.pocImages && formData.pocImages.length > 0) {
                    formData.pocImages.forEach((image) => {
                      formDataToSend.append('images', image);
                    });
                  }

                  const response = await fetch('http://127.0.0.1:5000/api/report-drafts', {
                    method: 'POST',
                    body: formDataToSend
                    // No Content-Type header; browser sets it to multipart/form-data
                  });

                  if (response.ok) {
                    showAlert('Draft saved successfully!', 'Your draft has been saved and is now available in the Report Archive.');
                  } else {
                    showAlert('Failed to save draft', 'An error occurred while saving your draft. Please try again.');
                  }
                } catch (error) {
                  console.error('Error saving draft:', error);
                  showAlert('Error saving draft', 'An unexpected error occurred. Please check your connection and try again.');
                }
              }}
              className="flex items-center gap-2 px-6 py-2 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-card/80 transition-colors text-sm"
            >
              <Save className="w-4 h-4" />
              Save to Draft
            </button>
          </div>
        </div>
      </div>

      {/* AlertDialog for notifications */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertMessage.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
