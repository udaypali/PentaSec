import { Suspense } from "react";
import AuthCallbackContent from "./AuthCallbackContent";

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                    <p className="text-white/50">Loading authentication...</p>
                </div>
            }
        >
            <AuthCallbackContent />
        </Suspense>
    );
}
