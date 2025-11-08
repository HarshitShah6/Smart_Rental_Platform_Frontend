// Higher-Order Component for protecting routes
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/lib/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'

interface WithAuthOptions {
  redirectTo?: string
  requiredRole?: 'TENANT' | 'OWNER' | 'ADMIN'
}

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) => {
  const { redirectTo = '/auth/login', requiredRole } = options

  return function ProtectedRoute(props: P) {
    const router = useRouter()
    const { user, loading } = useAuth()

    useEffect(() => {
      if (!loading && !user) {
        router.replace(redirectTo)
      } else if (!loading && user && requiredRole && user.role !== requiredRole) {
        router.replace('/')
      }
    }, [user, loading, router])

    if (loading || !user) {
      return <LoadingSpinner size="lg" className="min-h-screen" />
    }

    if (requiredRole && user.role !== requiredRole) {
      return <LoadingSpinner size="lg" className="min-h-screen" />
    }

    return <Component {...props} />
  }
}

export default withAuth
