import { Metadata } from "next"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bot, Bug, FileOutput } from "lucide-react"

export const metadata: Metadata = {
    title: "Report Builder - Pentasec Documentation",
    description: "How to use the AI-assisted Report Builder.",
}

export default function ReportBuilderPage() {
    return (
        <div className="space-y-10 max-w-4xl pb-10">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                    Report Builder
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Create comprehensive, professional vulnerability reports in minutes with the power of Google Gemini AI.
                </p>
            </div>

            <div className="space-y-8">
                <div className="p-6 bg-card/60 rounded-xl border border-muted">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                            <Bot className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold">AI-Assisted Generation</h2>
                    </div>
                    <p className="text-muted-foreground leading-7 mb-6">
                        The Report Builder uses advanced AI to expand brief notes into full technical reports. Simply provide the core details, and Pentasec will generate a structured, industry-standard write-up including impact analysis and remediation steps.
                    </p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>What You Provide</TableHead>
                                <TableHead>What AI Generates</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Short description of the issue</TableCell>
                                <TableCell>Professional Vulnerability Title & Executive Summary</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Discovery notes</TableCell>
                                <TableCell>Steps to Reproduce (formatted)</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Raw tool output (Nmap, Burp)</TableCell>
                                <TableCell>Technical Anlaysis & Impact Assessment</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Vulnerability Category</TableCell>
                                <TableCell>CVSS Score, Severity, & Remediation</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-muted/20 rounded-xl border border-border/50">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                            <Bug className="w-5 h-5 text-red-500" />
                            Input Mode
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            The left pane is your workspace. Paste logs, type observations, and attach evidence screenshots. The AI reads this context to generate accurate reports.
                        </p>
                    </div>
                    <div className="p-6 bg-muted/20 rounded-xl border border-border/50">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                            <FileOutput className="w-5 h-5 text-blue-500" />
                            Live Preview
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            The right pane shows the real-time rendered report. You can manually edit any part of the AI-generated content before finalizing it.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
