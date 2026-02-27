import { Metadata } from "next"
import { LayoutDashboard, Activity, AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
    title: "Dashboard - Pentasec Documentation",
    description: "Documentation for the Pentasec Dashboard module.",
}

export default function DashboardPage() {
    return (
        <div className="space-y-10 max-w-4xl pb-10">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                    Dashboard
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    The Dashboard is your command center, offering a comprehensive real-time overview of your penetration testing activities and project health.
                </p>
            </div>

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-card/60 rounded-xl border border-muted flex flex-col gap-4">
                        <div className="p-3 w-fit rounded-lg bg-blue-500/10 text-blue-500">
                            <LayoutDashboard className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Workspace Overview</h3>
                        <p className="text-muted-foreground">
                            Get an instant snapshot of all your active projects. The dashboard aggregates data from multiple assessments to give you a high-level view of your security posture.
                        </p>
                    </div>

                    <div className="p-6 bg-card/60 rounded-xl border border-muted flex flex-col gap-4">
                        <div className="p-3 w-fit rounded-lg bg-green-500/10 text-green-500">
                            <Activity className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Key Metrics</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><strong>Total Reports:</strong> Track productivity over time.</li>
                            <li><strong>Severity Distribution:</strong> Visual breakdown of findings by criticality.</li>
                        </ul>
                    </div>
                </div>

                <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <h3 className="text-lg font-bold">Recent Activity Feed</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        The dashboard features a live feed of the latest vulnerabilities added or modified across all projects. This allows team leads to monitor progress and identifying critical blockers immediately.
                    </p>
                    <div className="pl-4 border-l-2 border-primary/20 space-y-2">
                        <p className="text-sm text-foreground/80">Example Activity:</p>
                        <div className="text-xs font-mono bg-background/50 p-2 rounded border">
                            [14:30] SQL Injection found in /login endpoint (Critical)
                        </div>
                        <div className="text-xs font-mono bg-background/50 p-2 rounded border">
                            [14:15] New Project "Finance App Q1" created
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
