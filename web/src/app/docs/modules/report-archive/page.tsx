import { Metadata } from "next"
import { Archive, FileEdit, CheckCircle, Clock } from "lucide-react"

export const metadata: Metadata = {
    title: "Report Archive - Pentasec Documentation",
    description: "Managing draft reports.",
}

export default function ReportArchivePage() {
    return (
        <div className="space-y-10 max-w-4xl pb-10">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                    Report Archive
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Your workspace for drafts. Edit, refine, and review reports before finalizing them into the Evidence Vault.
                </p>
            </div>

            <div className="space-y-8">
                <div className="p-6 bg-card/60 rounded-xl border border-muted flex items-start gap-4">
                    <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-lg mt-1">
                        <Archive className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Draft Management</h3>
                        <p className="text-muted-foreground leading-7">
                            The Report Archive acts as a staging area. Generated reports land here first, allowing you to manually tweak the AI-generated content, add concluding remarks, or merge multiple findings into a single narrative before official export.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-6">Status Workflow</h2>
                    <div className="grid gap-4">
                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-background/50">
                            <div className="p-2 bg-gray-500/10 text-gray-500 rounded-full">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Just Started</h4>
                                <p className="text-sm text-muted-foreground">Initial draft created by AI. Needs review.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-background/50">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-full">
                                <FileEdit className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">In Progress</h4>
                                <p className="text-sm text-muted-foreground">Currently being edited by a pentester.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-background/50">
                            <div className="p-2 bg-green-500/10 text-green-500 rounded-full">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Ready to Export</h4>
                                <p className="text-sm text-muted-foreground">Finalized and ready to be moved to Evidence Vault.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
