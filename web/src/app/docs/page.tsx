import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, Lock, Database, FileText, Eye } from "lucide-react"

export const metadata: Metadata = {
    title: "Introduction - Pentasec Documentation",
    description: "Introduction to Pentasec, the AI-powered pentest reporting tool.",
}

export default function DocsPage() {
    return (
        <div className="space-y-10 max-w-4xl pb-10">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                    Introduction
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Welcome to the Pentasec documentation. Learn how to install, configure, and use Pentasec for your security reporting needs.
                </p>
            </div>

            <div className="space-y-6">
                <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                    <h2 className="text-2xl font-bold tracking-tight mb-4">What is Pentasec?</h2>
                    <p className="leading-7 text-muted-foreground">
                        Pentasec is a comprehensive, AI-powered penetration testing platform designed to streamline the vulnerability assessment and reporting workflow for security professionals. The platform combines modern web technologies with artificial intelligence to automate tedious tasks while maintaining the highest standards of data security and integrity.
                    </p>
                    <p className="leading-7 text-muted-foreground mt-4">
                        Penetration testing, commonly known as ethical hacking, is a critical component of modern cybersecurity practices. It involves systematically probing computer systems, networks, and web applications to identify security vulnerabilities that malicious attackers could exploit. Traditional penetration testing workflows involve numerous manual processes that are time-consuming and error-prone. Pentasec addresses these challenges by providing a centralized platform that automates report generation, evidence management, and data redaction.
                    </p>
                </div>

                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    Key Features
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FeatureCard
                        icon={<FileText className="w-8 h-8 text-blue-500" />}
                        title="AI-Powered Reporting"
                        description="Automated vulnerability report generation using Google Gemini AI with structured output and CVSS scoring."
                    />
                    <FeatureCard
                        icon={<Shield className="w-8 h-8 text-green-500" />}
                        title="Evidence Vault"
                        description="Tamper-proof evidence storage with cryptographic verification using SHA-256 hashing."
                    />
                    <FeatureCard
                        icon={<Eye className="w-8 h-8 text-purple-500" />}
                        title="AI Image Redaction"
                        description="Automatically detect and redact sensitive information from screenshots using OCR and AI analysis."
                    />
                    <FeatureCard
                        icon={<Database className="w-8 h-8 text-orange-500" />}
                        title="Local-First Architecture"
                        description="Secure local storage with AES-256-GCM encryption for complete privacy. Zero external dependencies for reports."
                    />
                    <FeatureCard
                        icon={<Lock className="w-8 h-8 text-red-500" />}
                        title="Secure Authentication"
                        description="User authentication via email/password and Google OAuth 2.0 with JWT tokens."
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-yellow-500" />}
                        title="Project Management"
                        description="Hierarchical organization of projects and vulnerabilities with status tracking."
                    />
                </div>
            </div>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300 border-muted/60">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="p-2 bg-background/50 rounded-lg border border-border/50">
                    {icon}
                </div>
                <CardTitle className="text-base font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    )
}
