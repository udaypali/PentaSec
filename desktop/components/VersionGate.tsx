'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface VersionInfo {
    app_version: string;
    required_version: string;
    version_ok: boolean;
}

const GITHUB_RELEASES_URL =
    'https://github.com/udaypali/PentaSec/releases/latest';

export function VersionGate({ children }: { children: React.ReactNode }) {
    const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/version')
            .then((res) => res.json())
            .then((data: VersionInfo) => {
                setVersionInfo(data);
                setLoading(false);
            })
            .catch(() => {
                // If backend is unreachable let the app through — backend status
                // endpoint handles that separately.
                setError(true);
                setLoading(false);
            });
    }, []);

    // While checking, show a subtle full-screen loader
    if (loading) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm tracking-wide">Verifying version…</p>
                </div>
            </div>
        );
    }

    // If version_ok is false, block the UI entirely
    if (!error && versionInfo && !versionInfo.version_ok) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
                {/* Subtle grid background */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] [background-size:40px_40px]" />

                <div className="relative z-10 flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-10 shadow-2xl max-w-md w-full text-center">
                    {/* Icon */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 ring-2 ring-destructive/20">
                        <ShieldAlert className="h-8 w-8 text-destructive" />
                    </div>

                    {/* Heading */}
                    <div className="space-y-1">
                        <h1 className="text-xl font-semibold text-foreground">Update Required</h1>
                        <p className="text-sm text-muted-foreground">
                            This version of PentaSec is no longer supported.
                        </p>
                    </div>

                    {/* Version info */}
                    <div className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm space-y-1.5">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Your version</span>
                            <span className="font-mono font-medium text-destructive">
                                v{versionInfo.app_version}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Required version</span>
                            <span className="font-mono font-medium text-primary">
                                v{versionInfo.required_version}
                            </span>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Please download the latest release to continue using PentaSec.
                    </p>

                    {/* Update button */}
                    <button
                        onClick={() => window.open(GITHUB_RELEASES_URL, '_blank')}
                        className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
                    >
                        Update Now
                    </button>
                </div>
            </div>
        );
    }

    // Version is satisfied (or backend was unreachable — fail open)
    return <>{children}</>;
}
