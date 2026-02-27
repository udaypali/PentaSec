import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, FileText, Eye, Database, Archive, Settings } from "lucide-react"

export const metadata: Metadata = {
    title: "Getting Started - Pentasec Documentation",
    description: "User Interface Overview and getting started with Pentasec.",
}

export default function GettingStartedPage() {
    return (
        <div className="space-y-10 max-w-4xl pb-10">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                    Getting Started
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Familiarize yourself with the Pentasec interface and modules to hit the ground running.
                </p>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">User Interface Overview</h2>
                    <p className="text-muted-foreground leading-7 mb-6">
                        The Pentasec interface features a modern, dark-themed design that aligns with cybersecurity industry preferences. The main dashboard provides quick access to all modules through a consistent sidebar navigation menu.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NavCard
                            icon={<LayoutDashboard className="w-5 h-5 text-blue-500" />}
                            title="Dashboard"
                            description="Overview of projects, recent activity, and key metrics."
                        />
                        <NavCard
                            icon={<FileText className="w-5 h-5 text-purple-500" />}
                            title="Report Builder"
                            description="Create AI-powered vulnerability reports with live preview."
                        />
                        <NavCard
                            icon={<Eye className="w-5 h-5 text-green-500" />}
                            title="AI Redaction"
                            description="Automatically redact sensitive info from screenshots."
                        />
                        <NavCard
                            icon={<Database className="w-5 h-5 text-orange-500" />}
                            title="Evidence Vault"
                            description="Manage project evidence with cryptographic integrity."
                        />
                        <NavCard
                            icon={<Archive className="w-5 h-5 text-yellow-500" />}
                            title="Report Archive"
                            description="Workspace for managing and exporting draft reports."
                        />
                        <NavCard
                            icon={<Settings className="w-5 h-5 text-gray-500" />}
                            title="Settings"
                            description="Configure AI models, themes, and user preferences."
                        />
                    </div>
                </section>
            </div>
        </div>
    )
}

function NavCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="bg-card/50 hover:bg-card hover:shadow-sm transition-all border-muted/60">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="p-2 bg-background/50 rounded-md border border-border/50">
                    {icon}
                </div>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            </CardContent>
        </Card>
    )
}
