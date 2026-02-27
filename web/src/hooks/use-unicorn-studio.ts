"use client"

import { useEffect, useState } from "react"

export function useUnicornStudio(projectId: string) {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        // Check if script is already present
        const existingScript = document.querySelector('script[src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.36/dist/unicornStudio.umd.js"]')

        const initUnicorn = () => {
            // @ts-ignore
            if (window.UnicornStudio) {
                // @ts-ignore
                window.UnicornStudio.init()
                setIsLoaded(true)
            }
        }

        if (!existingScript) {
            const script = document.createElement("script")
            script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.36/dist/unicornStudio.umd.js"
            script.dataset.unicornScript = "true"
            script.onload = initUnicorn
            document.head.appendChild(script)
        } else {
            // If already loaded, just init
            // @ts-ignore
            if (window.UnicornStudio) {
                initUnicorn()
            } else {
                // If script tag exists but not loaded yet (race condition), wait for it
                existingScript.addEventListener('load', initUnicorn)
                return () => existingScript.removeEventListener('load', initUnicorn)
            }
        }

        // Cleanup function
        return () => {
            // @ts-ignore
            if (window.UnicornStudio && typeof window.UnicornStudio.destroy === 'function') {
                // @ts-ignore
                window.UnicornStudio.destroy()
                // @ts-ignore
                window.UnicornStudio.isInitialized = false
            }
        }
    }, [projectId])

    return isLoaded
}
