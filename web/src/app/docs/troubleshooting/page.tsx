import { Metadata } from "next"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { LifeBuoy, AlertCircle, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
    title: "Troubleshooting - Pentasec Documentation",
    description: "Common issues and support information.",
}

export default function TroubleshootingPage() {
    return (
        <div className="space-y-10 max-w-4xl pb-10">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                    Troubleshooting
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Find solutions to common issues and get the support you need.
                </p>
            </div>

            <div className="space-y-8">
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <AlertCircle className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold tracking-tight">Common Issues</h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg font-medium">AI Report Generation Fails</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-7">
                                <p>This usually happens if the API key is missing or invalid.</p>
                                <ol className="list-decimal ml-4 mt-2 space-y-1">
                                    <li>Go to <strong>Settings</strong> &gt; <strong>AI Configuration</strong>.</li>
                                    <li>Verify your Google Gemini API key is entered.</li>
                                    <li>Click the <strong>Test Connection</strong> button to verify connectivity.</li>
                                </ol>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg font-medium">Image Redaction Not Working</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-7">
                                <p>The AI Redaction module relies on Tesseract OCR being installed on the host machine.</p>
                                <p className="mt-2">Ensure Tesseract is installed at the default location: <code>C:\Program Files\Tesseract-OCR</code>.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg font-medium">Cannot Login to Google</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-7">
                                <p>If the OAuth window doesn't open or returns an error:</p>
                                <ul className="list-disc ml-4 mt-2 space-y-1">
                                    <li>Check your internet connection.</li>
                                    <li>Ensure your firewall isn't blocking the application.</li>
                                    <li>Verify that you entered the correct email associated with your invitation (if applicable).</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger className="text-lg font-medium">Evidence Files Not Saving</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-7">
                                <p>This is often a permissions or storage issue.</p>
                                <ul className="list-disc ml-4 mt-2 space-y-1">
                                    <li>Verify you have sufficient free disk space (at least 500MB recommended).</li>
                                    <li>Ensure the application has write permissions to its installation directory and the <code>AppData</code> folder.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                <section className="bg-muted/30 p-8 rounded-xl border border-border/50">
                    <div className="flex items-center gap-3 mb-4">
                        <LifeBuoy className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold tracking-tight">Still Need Help?</h2>
                    </div>
                    <p className="text-muted-foreground mb-6">
                        Our support team is ready to assist you. For technical support, feature requests, or enterprise inquiries, please reach out through our official channels.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a href="#" className="flex flex-col items-center justify-center p-4 bg-background border rounded-lg hover:border-primary transition-colors group">
                            <HelpCircle className="w-6 h-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="font-semibold">Community Forum</span>
                            <span className="text-xs text-muted-foreground">Connect with peers</span>
                        </a>
                        <a href="#" className="flex flex-col items-center justify-center p-4 bg-background border rounded-lg hover:border-primary transition-colors group">
                            <LifeBuoy className="w-6 h-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="font-semibold">Support Portal</span>
                            <span className="text-xs text-muted-foreground">Submit a ticket</span>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    )
}
