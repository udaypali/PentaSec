import { Metadata } from "next"
import { Database, FolderTree, Lock, FileCheck } from "lucide-react"

export const metadata: Metadata = {
    title: "Evidence Vault - Pentasec Documentation",
    description: "Managing secure evidence storage.",
}

export default function EvidenceVaultPage() {
    return (
        <div className="space-y-10 max-w-4xl pb-10">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                    Evidence Vault
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    A secure, structured repository for all your finding data, logs, and screenshots, protected by cryptographic verification.
                </p>
            </div>

            <div className="space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 md:col-span-3 p-6 bg-card/60 rounded-xl border border-muted">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                                <FolderTree className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Hierarchical Organization</h2>
                        </div>
                        <p className="text-muted-foreground">
                            Projects are organized in a strict hierarchy: <strong>Project → Vulnerability → Evidence Type</strong>.
                            This ensures that every piece of evidence is correctly attributed to a specific finding.
                        </p>
                    </div>

                    <div className="p-6 bg-muted/20 rounded-xl border border-border/50 flex flex-col items-center text-center gap-3">
                        <FileCheck className="w-8 h-8 text-blue-500" />
                        <h3 className="font-bold">Active State</h3>
                        <p className="text-sm text-muted-foreground">
                            Evidence can be added, modified, or deleted. Hashes are updated in real-time.
                        </p>
                    </div>

                    <div className="p-6 bg-muted/20 rounded-xl border border-border/50 flex flex-col items-center text-center gap-3">
                        <Lock className="w-8 h-8 text-red-500" />
                        <h3 className="font-bold">Frozen State</h3>
                        <p className="text-sm text-muted-foreground">
                            Vulnerability is locked. SHA-256 hashes are finalized and any modification triggers a tampering alert.
                        </p>
                    </div>

                    <div className="p-6 bg-muted/20 rounded-xl border border-border/50 flex flex-col items-center text-center gap-3">
                        <Database className="w-8 h-8 text-green-500" />
                        <h3 className="font-bold">Evidence Types</h3>
                        <p className="text-sm text-muted-foreground">
                            Automatically sorted into Logs (txt/xml), Images (png/jpg), and Reports (docx/pdf).
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
