import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  ArrowLeft, 
  Car, 
  User, 
  Search,
  LogOut,
  Phone,
  Mail,
  Calendar,
  Plus,
  Image,
  Trash2
} from 'lucide-react'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog.jsx'
import AddVehicleForm from './AddVehicleForm.jsx'

const CitizenDashboard = ({ onBack, currentUser, onLogout }) => {
  const [vehicles, setVehicles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState(null)

  useEffect(() => {
    loadUserVehicles()
  }, [currentUser])

  const loadUserVehicles = () => {
    const allVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
    // Filtrar vehículos que pertenecen al usuario actual
    const userVehicles = allVehicles.filter(vehicle => 
      vehicle.ownerId === currentUser.id
    )
    setVehicles(userVehicles)
  }

  const handleVehicleAdded = (newVehicle) => {
    setVehicles(prev => [newVehicle, ...prev])
    setShowAddForm(false)
  }

  const handleRemoveVehicle = (vehicleId) => {
    // Eliminar del localStorage
    const allVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
    const updatedVehicles = allVehicles.filter(v => v.id !== vehicleId)
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles))
    // Eliminar del estado
    setVehicles(prev => prev.filter(v => v.id !== vehicleId))
    setVehicleToDelete(null)
  }

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="outline" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Panel Ciudadano</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Bienvenido, {currentUser?.name}
            </span>
            <Button onClick={onLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {showAddForm ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Agregar Nuevo Vehículo</h2>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
            </div>
            <AddVehicleForm
              onVehicleAdded={handleVehicleAdded}
              onCancel={() => setShowAddForm(false)}
              currentUser={currentUser}
            />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Información del Usuario */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Mi Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Nombre</p>
                      <p className="text-lg">{currentUser?.name}</p>
                    </div>
                                      <div>
                    <p className="text-sm font-medium text-gray-600">Carnet de Identidad</p>
                    <p className="text-lg">{currentUser?.id}</p>
                  </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tipo</p>
                      <p className="text-lg capitalize">{currentUser?.type}</p>
                    </div>
                    {currentUser?.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm">{currentUser.phone}</span>
                      </div>
                    )}
                    {currentUser?.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm">{currentUser.email}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm">
                        Registrado: {new Date(currentUser?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Mis Vehículos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Car className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{vehicles.length}</p>
                      <p className="text-sm text-gray-600">Vehículos registrados</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowAddForm(true)} 
                    className="w-full mt-4"
                    size="sm"
                    disabled={!currentUser?.vehicleAccess}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {currentUser?.vehicleAccess ? 'Agregar Vehículo' : 'Acceso Pendiente'}
                  </Button>
                  {!currentUser?.vehicleAccess && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      El supervisor debe aprobar tu acceso para registrar vehículos
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Lista de Vehículos */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Mis Vehículos ({filteredVehicles.length})</CardTitle>
                      <CardDescription>
                        Vehículos registrados a tu nombre
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => setShowAddForm(true)}
                      size="sm"
                      disabled={!currentUser?.vehicleAccess}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {currentUser?.vehicleAccess ? 'Agregar Vehículo' : 'Acceso Pendiente'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Barra de búsqueda */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        placeholder="Buscar vehículos por modelo, placa o ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Lista de vehículos */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                        <div className="flex gap-4">
                          {/* Foto del vehículo */}
                          <div className="flex-shrink-0">
                            {vehicle.photo ? (
                              <img
                                src={vehicle.photo}
                                alt={`Foto de ${vehicle.model}`}
                                className="w-24 h-24 object-cover rounded-lg border"
                              />
                            ) : (
                              <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                                <Image className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Información del vehículo */}
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <Car className="w-5 h-5 text-blue-600 mr-2" />
                              <h3 className="font-semibold text-lg">{vehicle.model}</h3>
                              <Badge 
                                variant={vehicle.isApproved ? "default" : "secondary"} 
                                className="ml-2"
                              >
                                {vehicle.isApproved ? "Aprobado para Carga" : "Pendiente de Aprobación"}
                              </Badge>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="ml-2"
                                    title="Eliminar vehículo"
                                    onClick={() => setVehicleToDelete(vehicle)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Eliminar vehículo?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      ¿Estás seguro de que deseas eliminar el vehículo <b>{vehicle.model}</b> con placa <b>{vehicle.plate}</b>? Esta acción no se puede deshacer.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setVehicleToDelete(null)}>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleRemoveVehicle(vehicle.id)} autoFocus>Eliminar</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">ID Vehículo</p>
                                <p className="font-medium">{vehicle.id}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Placa</p>
                                <p className="font-medium">{vehicle.plate}</p>
                              </div>
                              {vehicle.year && (
                                <div>
                                  <p className="text-gray-600">Año</p>
                                  <p className="font-medium">{vehicle.year}</p>
                                </div>
                              )}
                              {vehicle.color && (
                                <div>
                                  <p className="text-gray-600">Color</p>
                                  <p className="font-medium capitalize">{vehicle.color}</p>
                                </div>
                              )}
                            </div>
                            {vehicle.description && (
                              <div className="mt-2">
                                <p className="text-gray-600 text-sm">Descripción</p>
                                <p className="text-sm">{vehicle.description}</p>
                              </div>
                            )}
                            {!vehicle.isApproved && (
                              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded">
                                <p className="text-xs text-orange-700">
                                  ⚠️ Este vehículo está pendiente de aprobación para cargar combustible
                                </p>
                              </div>
                            )}
                            <div className="mt-2 text-xs text-gray-500">
                              Registrado: {new Date(vehicle.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredVehicles.length === 0 && (
                      <div className="text-center py-8">
                        {searchTerm ? (
                          <div>
                            <p className="text-gray-500 mb-2">No se encontraron vehículos con esa búsqueda</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSearchTerm('')}
                            >
                              Limpiar búsqueda
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No tienes vehículos registrados</p>
                            <p className="text-sm text-gray-400 mt-1 mb-4">
                              Agrega tu primer vehículo para comenzar
                            </p>
                            <Button 
                              onClick={() => setShowAddForm(true)}
                              size="sm"
                              disabled={!currentUser?.vehicleAccess}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              {currentUser?.vehicleAccess ? 'Agregar Mi Primer Vehículo' : 'Acceso Pendiente'}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CitizenDashboard 