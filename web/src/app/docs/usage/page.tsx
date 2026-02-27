import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Usage - Pentasec Documentation",
    description: "How to use Pentasec to generate reports.",
}

export default function UsagePage() {
    return (
        <div className="space-y-6 max-w-3xl">
            <div className="space-y-2">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Using Pentasec
                </h1>
                <p className="text-xl text-muted-foreground">
                    Learn the basics of creating projects and generating pentest reports.
                </p>
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none">
                <h2>Dashboard Overview</h2>
                <p>
                    After launching Pentasec, you will be greeted by the Dashboard. Here you can see your recent projects, quick stats, and access global settings.
                </p>

                <h2>Creating a New Project</h2>
                <ol>
                    <li>Click the "New Project" button in the top right corner.</li>
                    <li>Enter the Client Name and Assessment Date.</li>
                    <li>Select the type of assessment (Network, Web, Mobile, etc.).</li>
                    <li>Click "Create" to initialize the project workspace.</li>
                </ol>

                <h2>Adding Findings</h2>
                <p>
                    Inside a project, navigate to the "Findings" tab. You can add findings manually or import them from popular scanners (Nessus, Burp Suite support coming soon).
                </p>
                <ul>
                    <li><strong>Title:</strong> A unique title for the finding.</li>
                    <li><strong>Severity:</strong> Critical, High, Medium, Low, or Info.</li>
                    <li><strong>Description:</strong> detailed explanation of the vulnerability.</li>
                    <li><strong>Proof of Concept:</strong> Steps to reproduce the issue.</li>
                </ul>

                <h2>Generating the Report</h2>
                <p>
                    Once you have added all your findings, go to the "Report" tab.
                </p>
                <ol>
                    <li>Select a report template (Standard, Executive, Technical).</li>
                    <li>Click "Generate Report".</li>
                    <li>The report will be generated instantly in DOCX format.</li>
                    <li>Click "Open Folder" to view the generated file.</li>
                </ol>
            </div>
        </div>
    )
}
