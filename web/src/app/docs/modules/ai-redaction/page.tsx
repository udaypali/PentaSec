import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, FileImage, ShieldAlert, ScanLine } from "lucide-react"

export const metadata: Metadata = {
    title: "AI Redaction - Pentasec Documentation",
    description: "Using AI to redact sensitive information from evidence images.",
}

export default function AIRedactionPage() {
    return (
        <div className="space-y-10 max-w-4xl pb-10">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                    AI Redaction
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Automatically detect and redact sensitive information from screenshots using advanced computer vision.
                </p>
            </div>

            <div className="space-y-8">
                <div className="p-6 bg-card/60 rounded-xl border border-muted flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary mt-1">
                        <ScanLine className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">How It Works</h3>
                        <p className="text-muted-foreground leading-7">
                            The AI Redaction module combines Tesseract OCR for text extraction with Google Gemini AI for context analysis. It identifies sensitive data patterns and automatically applies a pixel-level blur or black-out, ensuring no residual data remains.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-muted/30 border-dashed">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-1">
                                <FileImage className="w-5 h-5 text-blue-500" />
                                <CardTitle className="text-lg">Supported Formats</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>PNG Images (.png)</li>
                                <li>JPEG Images (.jpg, .jpeg)</li>
                                <li>Maximum file size: 10MB per image</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30 border-dashed">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldAlert className="w-5 h-5 text-red-500" />
                                <CardTitle className="text-lg">What Gets Redacted</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li><strong>PII:</strong> Names, emails, phone numbers.</li>
                                <li><strong>Secrets:</strong> API keys, passwords, tokens.</li>
                                <li><strong>Network:</strong> IP addresses, internal URLs.</li>
                                <li><strong>Session:</strong> Cookies, auth headers.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
