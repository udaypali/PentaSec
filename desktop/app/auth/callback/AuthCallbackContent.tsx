"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

export default function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isElectron, setIsElectron] = useState(false);

    useEffect(() => {
        const inElectron =
            typeof window !== "undefined" && !!(window as any).require;
        setIsElectron(inElectron);

        const handleCallback = async () => {
            const hash = window.location.hash;

            if (!hash) {
                const params = new URLSearchParams(window.location.search);
                if (params.get("error")) {
                    setError(`Google Auth Error: ${params.get("error")}`);
                } else {
                    setError("No authentication token found.");
                }
                return;
            }

            const params = new URLSearchParams(hash.substring(1));
            const idToken =
                params.get("id_token") || params.get("access_token");
            const sessionId = params.get("state");

            if (!idToken) {
                setError("No valid token received from Google.");
                return;
            }

            try {
                const res = await fetch(
                    "http://127.0.0.1:5000/api/auth/google",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: idToken }),
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Authentication failed");
                }

                if (inElectron) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    setSuccess(true);

                    setTimeout(() => {
                        router.push("/");
                    }, 1000);
                } else {
                    if (sessionId) {
                        await fetch(
                            "http://127.0.0.1:5000/api/auth/oauth-store",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    token: data.token,
                                    user: data.user,
                                    session_id: sessionId,
                                }),
                            }
                        );
                    }

                    setSuccess(true);

                    setTimeout(() => {
                        window.close();
                    }, 2000);
                }
            } catch (err: any) {
                console.error(err);
                setError(
                    err.message || "Failed to authenticate with backend."
                );
            }
        };

        handleCallback();
    }, [router, searchParams]);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-4">
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl max-w-md text-center">
                    <h2 className="text-xl font-bold text-red-400 mb-2">
                        Authentication Error
                    </h2>
                    <p className="text-white/70 mb-4">{error}</p>
                    <button
                        onClick={() => window.close()}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        Close Window
                    </button>
                </div>
            </div>
        );
    }

    if (success && !isElectron) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-4">
                <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-xl max-w-md text-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-400 mb-2">
                        Success!
                    </h2>
                    <p className="text-white/70 mb-4">
                        You have been authenticated successfully.
                    </p>
                    <p className="text-white/50 text-sm">
                        Please return to the PentaSec app.
                        <br />
                        This window will close automatically.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-white/50">
                {success
                    ? "Redirecting to dashboard..."
                    : "Verifying Google credentials..."}
            </p>
        </div>
    );
}
