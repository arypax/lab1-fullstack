import React, { createContext, useContext, useMemo, useState } from 'react'

export type AuthContextValue = {
  userName: string | null
  login: (name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null)
  const value = useMemo<AuthContextValue>(() => ({
    userName,
    login: (name: string) => setUserName(name),
    logout: () => setUserName(null),
  }), [userName])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


