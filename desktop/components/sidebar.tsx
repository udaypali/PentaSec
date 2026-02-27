'use client'

import { useState } from 'react'
import { Home, FileText, Shield, Lock, Archive, ChevronDown, ChevronUp, Settings } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onPageChange: (page: string) => void
  currentPage: string
}

export function Sidebar({ isOpen, onPageChange, currentPage }: SidebarProps) {
  const [activeItem, setActiveItem] = useState<string>(currentPage);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'reports', label: 'Report Builder', icon: FileText },
    { id: 'redaction', label: 'AI Redaction', icon: Shield },
    { id: 'vault', label: 'Evidence Vault', icon: Lock },
    { id: 'archive', label: 'Report Archive', icon: Archive },
  ]

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-surface border-r border-border transition-all duration-300 flex flex-col overflow-hidden`}>
      <div className="flex items-center justify-between p-4 border-b border-border h-20">
        <div className={`flex items-center gap-3 ${!isOpen && 'justify-center w-full'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-secondary flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-background" />
          </div>
          {isOpen && <span className="font-bold text-sm text-foreground">PentaSec</span>}
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto scrollbar-custom">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                ? 'bg-primary/20 text-primary border-l-2 border-primary'
                : 'text-muted hover:text-foreground hover:bg-surface-variant'
                }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-2">
        <button
          onClick={() => onPageChange('settings')}
          className={`w-full px-4 py-2 text-sm font-medium bg-card border border-border rounded-lg text-muted hover:text-foreground transition-colors flex items-center gap-2 ${currentPage === 'settings' ? 'text-primary border-primary' : ''}`}
        >
          <Settings className="w-4 h-4" />
          {isOpen && 'Settings'}
        </button>
      </div>
    </aside >
  )
}
