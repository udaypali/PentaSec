'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { MainContent } from '@/components/main-content'
import { PreviewPanel } from '@/components/preview-panel'
import { AIRedaction } from '@/components/ai-redaction'
import { EvidenceVault } from '@/components/evidence-vault'
import { ReportArchive } from '@/components/report-archive'
import { Dashboard } from '@/components/dashboard'
import { SettingsPage } from '@/components/settings-page'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export interface ReportData {
  shortDescription: string
  explanation: string
  technicalEvidenceTab: 'nmap' | 'burp' | 'logs'
  technicalEvidenceContent: string
  pocImages: File[]
  imagePaths?: string[]
}

export interface GeneratedReport {
  title: string
  introduction: string
  cvssDetails: {
    score: string
    severity: string
    vectorString: string
  }
  stepsToReproduce: string[]
  proofOfConcept: string
  impact: string
  remediation: string
  technicalDetails: string
  images: File[]
  imagePaths?: string[]
}

export default function Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/signin')
    } else {
      setIsLoading(false)
    }
  }, [router])


  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState('reports')
  const [reportData, setReportData] = useState<ReportData>({
    shortDescription: '',
    explanation: '',
    technicalEvidenceTab: 'nmap',
    technicalEvidenceContent: '',
    pocImages: [],
  })
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport>({
    title: 'Untitled Vulnerability',
    introduction: '',
    cvssDetails: {
      score: '0.0',
      severity: 'None',
      vectorString: '',
    },
    stepsToReproduce: [],
    proofOfConcept: '',
    impact: '',
    remediation: '',
    technicalDetails: '',
    images: [],
  })
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState({ title: '', description: '' })



  const handleReportDataChange = (data: ReportData) => {
    setReportData(data)
  }

  const handleGenerateReport = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reportData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.error && errorData.error.includes("API Key not found")) {
          setAlertMessage({
            title: "AI Configuration Missing",
            description: "You first need to add the API Key and the Model.\n\nSteps:\n1. Go to Settings\n2. Select 'AI & Model' tab\n3. Enter API Key and Model Name\n4. Click Save\n5. Test Connection\n6. Proceed"
          })
          setAlertOpen(true)
          return
        }
        throw new Error(errorData.error || 'Failed to generate report')
      }

      const generatedData = await response.json()

      const generated: GeneratedReport = {
        title: generatedData.title || 'Untitled Vulnerability',
        introduction: generatedData.introduction || '',
        cvssDetails: generatedData.cvssDetails || {
          score: '0.0',
          severity: 'None',
          vectorString: '',
        },
        stepsToReproduce: generatedData.stepsToReproduce || [],
        proofOfConcept: generatedData.proofOfConcept || '',
        impact: generatedData.impact || '',
        remediation: generatedData.remediation || '',
        technicalDetails: generatedData.technicalDetails || '',
        images: reportData.pocImages,
      }
      setGeneratedReport(generated)
    } catch (error) {
      console.error('Error generating report:', error)
      if (error instanceof Error) {
        if (error.message.includes("API Key not found") || error.message.includes("400") || error.message.includes("500")) {
          // We might need to handle the specific error messsage better
          // But since we can't easily read the body in the generic catch block if we threw a generic error
          // Let's modify the fetch block above
        }
      }
    }
  }

  const handleEditDraft = (draft: any) => {
    // Map draft data to ReportData structure
    const newReportData: ReportData = {
      shortDescription: draft.report.title || draft.title || '',
      explanation: draft.report.introduction || '',
      technicalEvidenceTab: (draft.tags && draft.tags[0] === 'logs' ? 'logs' : 'nmap') as 'nmap' | 'burp' | 'logs', // Simple mapping, could be robust
      technicalEvidenceContent: draft.report.technicalDetails || '',
      pocImages: [],
      imagePaths: draft.imagePaths || []
    };

    setReportData(newReportData);
    setGeneratedReport({
      ...draft.report,
      imagePaths: draft.imagePaths || []
    });
    setCurrentPage('reports');
  };

  if (isLoading) {
    return null // or a loading spinner
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onPageChange={setCurrentPage} currentPage={currentPage} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onPageChange={setCurrentPage} />
        <div className="flex flex-1 overflow-hidden gap-0">
          <div className={currentPage === 'reports' ? 'flex flex-1 overflow-hidden' : 'hidden'}>
            <MainContent
              onDataChange={handleReportDataChange}
              onGenerate={handleGenerateReport}
              onReset={() => setGeneratedReport({
                title: 'Untitled Vulnerability',
                introduction: '',
                cvssDetails: { score: '0.0', severity: 'None', vectorString: '' },
                stepsToReproduce: [],
                proofOfConcept: '',
                impact: '',
                remediation: '',
                technicalDetails: '',
                images: [],
              })}
              generatedReport={generatedReport}
              reportData={reportData}
            />
            <PreviewPanel report={generatedReport} onReportChange={setGeneratedReport} />
          </div>
          <div className={currentPage === 'dashboard' ? 'contents' : 'hidden'}>
            <Dashboard />
          </div>
          <div className={currentPage === 'redaction' ? 'contents' : 'hidden'}>
            <AIRedaction onNavigate={() => setCurrentPage('settings')} />
          </div>
          <div className={currentPage === 'vault' ? 'contents' : 'hidden'}>
            <EvidenceVault />
          </div>
          <div className={currentPage === 'archive' ? 'contents' : 'hidden'}>
            <ReportArchive onEdit={handleEditDraft} />
          </div>
          <div className={currentPage === 'settings' ? 'contents' : 'hidden'}>
            <SettingsPage />
          </div>
        </div>
      </div>


      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertMessage.title}</AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line">
              {alertMessage.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setAlertOpen(false)
              setCurrentPage('settings')
            }}>
              Go to Settings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  )
}
