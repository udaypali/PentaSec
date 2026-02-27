import { Metadata } from "next"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
    title: "Technical Specifications - Pentasec Documentation",
    description: "Technical details of the Pentasec platform.",
}

export default function TechnicalPage() {
    return (
        <div className="space-y-10 max-w-4xl pb-10">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                    Technical Specifications
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Detailed breakdown of the technology stack and data structures that power Pentasec.
                </p>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Technology Stack</h2>
                    <div className="rounded-xl border border-muted/60 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[200px]">Layer</TableHead>
                                    <TableHead>Technologies</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-semibold">Frontend</TableCell>
                                    <TableCell className="flex flex-wrap gap-2">
                                        <Badge variant="secondary">Next.js 16</Badge>
                                        <Badge variant="secondary">TypeScript</Badge>
                                        <Badge variant="secondary">Tailwind CSS</Badge>
                                        <Badge variant="secondary">Radix UI</Badge>
                                        <Badge variant="secondary">Framer Motion</Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold">Backend Logic</TableCell>
                                    <TableCell className="flex flex-wrap gap-2">
                                        <Badge variant="secondary">Python Flask</Badge>
                                        <Badge variant="secondary">PyJWT</Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold">Database</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">MongoDB Atlas</Badge> (Cloud)
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold">AI Services</TableCell>
                                    <TableCell className="flex flex-wrap gap-2">
                                        <Badge variant="default">Google Gemini AI</Badge>
                                        <Badge variant="default">Tesseract OCR</Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold">Desktop Runtime</TableCell>
                                    <TableCell className="flex flex-wrap gap-2">
                                        <Badge variant="secondary">Electron</Badge>
                                        <Badge variant="secondary">Node.js</Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold">Security</TableCell>
                                    <TableCell className="flex flex-wrap gap-2">
                                        <Badge variant="outline">AES-256-GCM</Badge>
                                        <Badge variant="outline">PBKDF2</Badge>
                                        <Badge variant="outline">SHA-256</Badge>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Database Collections</h2>
                    <div className="rounded-xl border border-muted/60 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[200px]">Collection</TableHead>
                                    <TableHead>Schema Overview</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-mono font-medium text-primary">Users</TableCell>
                                    <TableCell>Stores account basics (email, name, password hash, provider details).</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-mono font-medium text-primary">Projects</TableCell>
                                    <TableCell>Metadata for assessments (id, name, description, client, dates).</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-mono font-medium text-primary">Vulnerabilities</TableCell>
                                    <TableCell>The core finding data (id, title, severity, status, cvss, description).</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-mono font-medium text-primary">Evidence Files</TableCell>
                                    <TableCell>Metadata and hashes for uploaded proofs (images, logs, reports).</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-mono font-medium text-primary">Draft Reports</TableCell>
                                    <TableCell>Temporary storage for reports in progress (id, title, content blocks).</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-mono font-medium text-primary">Settings</TableCell>
                                    <TableCell>User-specific configurations (theme preference, encrypted API keys).</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </div>
        </div>
    )
}
