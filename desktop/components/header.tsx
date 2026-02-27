'use client'

import { useState, useEffect } from 'react'
import { Menu, User, X, Minus, Maximize } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface HeaderProps {
  onPageChange?: (page: string) => void
}

export function Header({ onPageChange }: HeaderProps = {}) {
  const [userPicture, setUserPicture] = useState<string | null>(null)

  useEffect(() => {
    // Load user data from localStorage
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserPicture(user.picture || null)
      } catch (e) {
        console.error('Failed to parse user data:', e)
      }
    }
  }, [])

  const handleExit = () => {
    if (typeof window !== "undefined" && window.api) {
      window.api.close();
    }
  };

  const handleMinimize = () => {
    if (typeof window !== "undefined" && window.api) {
      window.api.minimize();
    }
  };

  const handleMaximize = () => {
    if (typeof window !== "undefined" && window.api) {
      window.api.maximize();
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <h1 className="text-lg font-semibold text-foreground">PentaSec</h1>
          <span className="text-xs text-muted px-2 py-1 bg-card rounded-md">v1.0.0</span>
        </div>
        <span className="text-xs text-muted">AI-Powered Pentest Reporting</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="btn-ghost hover:bg-primary/10 transition-colors rounded-full p-1"
          onClick={() => onPageChange?.('settings')}
          title="Profile & Settings"
        >
          {userPicture ? (
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <Image
                src={userPicture}
                alt="Profile"
                width={32}
                height={32}
                className="object-cover"
                onError={() => setUserPicture(null)}
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          )}
        </button>
        <div className="w-px h-6 bg-border mx-2" />
        <button className="btn-ghost hover:bg-white/10" onClick={handleMinimize}>
          <Minus className="w-4 h-4" />
        </button>
        <button className="btn-ghost hover:bg-white/10" onClick={handleMaximize}>
          <Maximize className="w-4 h-4" />
        </button>
        <button className="btn-ghost text-red-500 hover:text-red-600 hover:bg-red-100/10" onClick={handleExit}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
