import { Metadata } from "next"
import { ShieldCheck, Lock, Fingerprint, Globe } from "lucide-react"

export const metadata: Metadata = {
    title: "Security Features - Pentasec Documentation",
    description: "Overview of security measures implemented in Pentasec.",
}

export default function SecurityPage() {
    return (
        <div className="space-y-10 max-w-4xl pb-10">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                    Security Features
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Security is our core product. Pentasec is built with a "Security First" architecture to ensure your data stays private and protected.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

                <div className="p-6 rounded-xl border border-muted bg-card/40 hover:bg-card/60 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                            <Fingerprint className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Authentication</h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex gap-2 items-start"><span className="text-primary">•</span> Passwords hashed using bcrypt with salt.</li>
                        <li className="flex gap-2 items-start"><span className="text-primary">•</span> 24-hour JWT session expiration.</li>
                        <li className="flex gap-2 items-start"><span className="text-primary">•</span> Secure Google OAuth 2.0 integration.</li>
                    </ul>
                </div>

                <div className="p-6 rounded-xl border border-muted bg-card/40 hover:bg-card/60 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Encryption</h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex gap-2 items-start"><span className="text-primary">•</span> AES-256-GCM for local data storage.</li>
                        <li className="flex gap-2 items-start"><span className="text-primary">•</span> Machine-derived keys preventing portability attacks.</li>
                        <li className="flex gap-2 items-start"><span className="text-primary">•</span> API keys stored in encrypted config files.</li>
                    </ul>
                </div>

                <div className="p-6 rounded-xl border border-muted bg-card/40 hover:bg-card/60 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Integrity</h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex gap-2 items-start"><span className="text-primary">•</span> SHA-256 hashes for all evidence files.</li>
                        <li className="flex gap-2 items-start"><span className="text-primary">•</span> "Frozen" vulnerabilities are read-only to ensure audit trails.</li>
                    </ul>
                </div>

                <div className="p-6 rounded-xl border border-muted bg-card/40 hover:bg-card/60 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">App Security</h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex gap-2 items-start"><span className="text-primary">•</span> Strict CORS policies.</li>
                        <li className="flex gap-2 items-start"><span className="text-primary">•</span> Input sanitization on all fields.</li>
                        <li className="flex gap-2 items-start"><span className="text-primary">•</span> HTTPS-only external communication.</li>
                    </ul>
                </div>

            </div>
        </div>
    )
}
