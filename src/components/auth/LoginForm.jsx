import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { AlertCircle, User, Lock, ArrowLeft } from 'lucide-react'

const LoginForm = ({ onLogin, userType, onBack, onCitizenRegister = () => {} }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Find user by username
    const user = users.find(u => u.username === credentials.username)
    
    if (!user) {
      setError('Usuario no encontrado')
      setIsLoading(false)
      return
    }

    // Check password
    if (user.password !== credentials.password) {
      setError('Contraseña incorrecta')
      setIsLoading(false)
      return
    }

    // Check user type based on login type
    if (userType === 'admin' && user.type !== 'administrador') {
      setError('Solo los administradores pueden acceder al panel de administración')
      setIsLoading(false)
      return
    }

    if (userType === 'supervisor' && user.type !== 'supervisor') {
      setError('Solo los supervisores pueden acceder al panel de supervisión')
      setIsLoading(false)
      return
    }

    if (userType === 'citizen' && (user.type === 'administrador' || user.type === 'supervisor')) {
      setError('Los administradores y supervisores deben usar sus respectivos paneles')
      setIsLoading(false)
      return
    }

    // Login successful
    setIsLoading(false)
    onLogin(user)
  }

  const getTitle = () => {
    if (userType === 'admin') return 'Panel de Administración'
    if (userType === 'supervisor') return 'Panel de Supervisión'
    return 'Acceso Ciudadano'
  }

  const getDescription = () => {
    if (userType === 'admin') return 'Inicia sesión como administrador'
    if (userType === 'supervisor') return 'Control de acceso de usuarios y vehículos'
    return 'Consulta tus vehículos registrados'
  }

  const getIcon = () => {
    if (userType === 'admin') return 'Shield'
    if (userType === 'supervisor') return 'Shield'
    return 'Users'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Button variant="outline" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">{getTitle()}</CardTitle>
          <CardDescription>
            {getDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                'Iniciando sesión...'
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {userType === 'admin' 
                ? 'Solo los administradores pueden acceder al panel'
                : userType === 'supervisor'
                ? 'Solo los supervisores pueden acceder al panel de supervisión'
                : 'Consulta tus vehículos registrados en el sistema'
              }
            </p>
            {userType === 'citizen' && (
              <button
                type="button"
                className="mt-4 text-blue-600 hover:underline text-sm"
                onClick={onCitizenRegister}
              >
                ¿No tienes cuenta? Crear usuario como ciudadano
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm 