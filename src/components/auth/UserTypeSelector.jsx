import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Users, Shield, ArrowLeft, Fuel } from 'lucide-react'

const UserTypeSelector = ({ onSelectType, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center mb-2">
            <Fuel className="w-12 h-12 text-primary mb-2" />
            <h1 className="text-4xl font-bold text-gray-900">Gestor de Combustible</h1>
          </div>
          <p className="text-lg text-gray-600">
            Selecciona tu tipo de usuario
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Opción para Ciudadanos */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => onSelectType('citizen')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Acceso Ciudadano</CardTitle>
              <CardDescription>
                Consulta tus vehículos registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Ver tus vehículos registrados</p>
                <p>• Consultar información de tu cuenta</p>
                <p>• Acceso limitado al sistema</p>
              </div>
              <Button className="w-full mt-4" size="lg">
                <Users className="w-4 h-4 mr-2" />
                Ingresar como Ciudadano
              </Button>
            </CardContent>
          </Card>

          {/* Opción para Supervisores */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onSelectType('supervisor')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Panel de Supervisión</CardTitle>
              <CardDescription>
                Control de acceso de usuarios y vehículos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Aprobar acceso de usuarios</p>
                <p>• Aprobar registro de vehículos</p>
                <p>• Control de permisos de carga</p>
                <p>• Ingresar nuevos usuarios</p>
              </div>
              <Button className="w-full mt-4" variant="outline" size="lg">
                <Shield className="w-4 h-4 mr-2" />
                Ingresar como Supervisor
              </Button>
            </CardContent>
          </Card>

          {/* Opción para Administradores */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => onSelectType('admin')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Panel de Administración</CardTitle>
              <CardDescription>
                Gestión completa del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Gestionar usuarios y vehículos</p>
                <p>• Administrar estaciones de servicio</p>
                <p>• Ver registros de combustible</p>
                <p>• Exportar datos del sistema</p>
              </div>
              <Button className="w-full mt-4" variant="outline" size="lg">
                <Shield className="w-4 h-4 mr-2" />
                Ingresar como Administrador
              </Button>
            </CardContent>
          </Card>

          {/* Opción para Operadores */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectType('operator')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Panel Operador</CardTitle>
              <CardDescription>
                Registrar y verificar cargas de combustible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Registrar cargas de combustible</p>
                <p>• Verificar estado de usuarios y vehículos</p>
                <p>• Acceso restringido</p>
              </div>
              <Button className="w-full mt-4" size="lg">
                <Shield className="w-4 h-4 mr-2" />
                Ingresar como Operador
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Selecciona el tipo de acceso que necesitas para continuar
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserTypeSelector 