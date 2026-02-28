'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { REMOTE_API } from '@/lib/api';

export default function GoogleAuthButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!isLoading || !sessionId) return;

        // Poll backend every second to check if token was stored by callback page
        const pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`${REMOTE_API}/api/auth/oauth-retrieve/${sessionId}`);
                if (res.ok) {
                    const data = await res.json();
                    clearInterval(pollInterval);
                    setIsLoading(false);

                    // Store token and user data in Electron app's localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // Redirect to dashboard
                    router.push('/');
                }
            } catch (err) {
                console.error('Polling error:', err);
            }
        }, 1000);

        // Stop polling after 2 minutes
        const timeout = setTimeout(() => {
            clearInterval(pollInterval);
            setIsLoading(false);
        }, 120000);

        return () => {
            clearInterval(pollInterval);
            clearTimeout(timeout);
        };
    }, [isLoading, sessionId, router]);

    const handleGoogleLogin = async () => {
        // Generate unique session ID
        const newSessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        setSessionId(newSessionId);
        setIsLoading(true);

        // Fetch client ID from Render backend at runtime
        let clientId: string;
        try {
            const res = await fetch(`${REMOTE_API}/api/auth/config`);
            if (!res.ok) throw new Error('Failed to fetch auth config');
            const config = await res.json();
            clientId = config.googleClientId;
        } catch (err) {
            console.error('Could not fetch auth config:', err);
            setIsLoading(false);
            return;
        }

        const redirectUri = `${REMOTE_API}/api/auth/callback/google`;
        const scope = "email profile openid";
        const responseType = "token id_token";
        const nonce = Math.random().toString(36).substring(7);

        // Use state parameter to pass session ID (standard OAuth practice)
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&nonce=${nonce}&state=${newSessionId}&prompt=select_account`;

        // Check if running in Electron and open in external browser
        if (typeof window !== 'undefined' && window.api && window.api.openExternal) {
            window.api.openExternal(url);
        } else {
            window.location.href = url;
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-background hover:bg-muted/10 border border-border text-foreground font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm">Waiting for authentication...</span>
                </>
            ) : (
                <>
                    <Image
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        width={20}
                        height={20}
                    />
                    <span>Continue with Google</span>
                </>
            )}
        </button>
    );
}
