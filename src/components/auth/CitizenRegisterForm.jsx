import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { AlertCircle, User, ArrowLeft } from 'lucide-react'

const CitizenRegisterForm = ({ onSuccess, onBack }) => {
  const [form, setForm] = useState({
    id: '',
    name: '',
    username: '',
    password: '',
    email: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Validar campos obligatorios
    if (!form.id || !form.name || !form.username || !form.password) {
      setError('Por favor complete al menos Carnet de Identidad, nombre, usuario y contraseña')
      setIsLoading(false)
      return
    }

    // Obtener usuarios existentes
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find(u => u.username === form.username)) {
      setError('El nombre de usuario ya existe')
      setIsLoading(false)
      return
    }

    // Crear usuario ciudadano pendiente
    const newUser = {
      ...form,
      type: 'ciudadano',
      vehicleAccess: false,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('users', JSON.stringify([...users, newUser]))
    setSuccess('Usuario registrado correctamente. Espera la aprobación del supervisor.')
    setIsLoading(false)
    setTimeout(() => {
      if (onSuccess) onSuccess()
    }, 1500)
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
          <CardTitle className="text-2xl">Registro de Ciudadano</CardTitle>
          <CardDescription>
            Ingresa tus datos para solicitar acceso al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="id">Carnet de Identidad *</Label>
              <Input id="id" value={form.id} onChange={e => handleChange('id', e.target.value)} placeholder="V-12345678" required disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input id="name" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="Juan Pérez" required disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="username">Usuario *</Label>
              <Input id="username" value={form.username} onChange={e => handleChange('username', e.target.value)} placeholder="juan.perez" required disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="password">Contraseña *</Label>
              <Input id="password" type="password" value={form.password} onChange={e => handleChange('password', e.target.value)} placeholder="••••••••" required disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="usuario@email.com" disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+58 412 1234567" disabled={isLoading} />
            </div>
            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-sm text-green-700">{success}</span>
              </div>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CitizenRegisterForm 