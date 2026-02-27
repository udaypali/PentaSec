import { Metadata } from "next"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Cpu, Globe, Server } from "lucide-react"

export const metadata: Metadata = {
    title: "System Requirements - Pentasec Documentation",
    description: "Hardware and software requirements for running Pentasec.",
}

export default function RequirementsPage() {
    return (
        <div className="space-y-10 max-w-4xl pb-10">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                    System Requirements
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Ensure your system meets the following requirements to run Pentasec optimally.
                </p>
            </div>

            <div className="grid gap-8">
                {/* Software Requirements */}
                <Card className="border-muted/60 bg-card/50">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Monitor className="w-5 h-5" />
                            </div>
                            <CardTitle>Software Requirements</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-primary/20">
                                    <TableHead className="w-[200px] font-bold text-primary">Requirement</TableHead>
                                    <TableHead className="font-bold text-primary">Specification</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Operating System</TableCell>
                                    <TableCell>Windows 10/11 (64-bit)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Web Browser</TableCell>
                                    <TableCell>Chrome, Firefox, Safari, or Edge (latest versions)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Node.js</TableCell>
                                    <TableCell>Version 18 or higher (Bundled with installer)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Python</TableCell>
                                    <TableCell>Version 3.9 or higher (Bundled with installer)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Cloud Services</TableCell>
                                    <TableCell>MongoDB Atlas account & Google Cloud (Gemini API)</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Hardware Requirements */}
                <Card className="border-muted/60 bg-card/50">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Cpu className="w-5 h-5" />
                            </div>
                            <CardTitle>Hardware Requirements</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-primary/20">
                                    <TableHead className="w-[200px] font-bold text-primary">Requirement</TableHead>
                                    <TableHead className="font-bold text-primary">Specification</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Processor</TableCell>
                                    <TableCell>Intel Core i3 / AMD Ryzen 3 or equivalent</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">RAM</TableCell>
                                    <TableCell>4 GB minimum (8 GB recommended)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Storage</TableCell>
                                    <TableCell>2 GB free space for application & database</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Internet</TableCell>
                                    <TableCell>Required for AI report generation & updates</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Display</TableCell>
                                    <TableCell>1280x720 resolution or higher</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
