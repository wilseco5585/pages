import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Users, 
  Car, 
  UserCheck, 
  UserX, 
  Car as CarIcon, 
  CheckCircle, 
  XCircle, 
  Search, 
  Plus,
  ArrowLeft,
  LogOut,
  Shield,
  AlertTriangle
} from 'lucide-react'

const SupervisorDashboard = ({ onBack, onLogout, currentUser }) => {
  const [users, setUsers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [vehicleSearchTerm, setVehicleSearchTerm] = useState('')
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    id: '',
    name: '',
    username: '',
    password: '',
    type: 'ciudadano',
    phone: '',
    email: '',
    isApproved: false,
    vehicleAccess: false
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
    setUsers(storedUsers.filter(user => user.type !== 'supervisor' && user.type !== 'administrador'))
    setVehicles(storedVehicles)
  }

  const addUser = () => {
    if (!newUser.id || !newUser.name || !newUser.username || !newUser.password) {
      alert('Por favor complete al menos Carnet de Identidad, nombre, usuario y contraseña')
      return
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const userExists = existingUsers.find(user => user.id === newUser.id || user.username === newUser.username)
    
    if (userExists) {
      alert('Ya existe un usuario con ese Carnet de Identidad o nombre de usuario')
      return
    }

    const userToAdd = {
      ...newUser,
      createdAt: new Date().toISOString(),
      approvedBy: currentUser.id,
      approvedAt: new Date().toISOString()
    }

    const updatedUsers = [...existingUsers, userToAdd]
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    
    setNewUser({
      id: '',
      name: '',
      username: '',
      password: '',
      type: 'ciudadano',
      phone: '',
      email: '',
      isApproved: false,
      vehicleAccess: false
    })
    setShowAddUser(false)
    loadData()
  }

  const toggleUserApproval = (userId) => {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = existingUsers.map(user => {
      if (user.id === userId) {
        // Si es ciudadano y se aprueba, también activar vehicleAccess
        if (!user.isApproved && user.type === 'ciudadano') {
          return {
            ...user,
            isApproved: true,
            vehicleAccess: true,
            approvedBy: currentUser.id,
            approvedAt: new Date().toISOString()
          }
        } else {
          // Revocar acceso y vehículos
          return {
            ...user,
            isApproved: false,
            vehicleAccess: false
          }
        }
      }
      return user
    })
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    loadData()
  }

  const toggleVehicleAccess = (userId) => {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = existingUsers.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          vehicleAccess: !user.vehicleAccess,
          vehicleAccessApprovedBy: currentUser.id,
          vehicleAccessApprovedAt: new Date().toISOString()
        }
      }
      return user
    })
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    loadData()
  }

  const getUserVehicles = (userId) => {
    return vehicles.filter(vehicle => vehicle.ownerId === userId)
  }

  const getVehicleApprovalStatus = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    return vehicle?.isApproved || false
  }

  const toggleVehicleApproval = (vehicleId) => {
    const existingVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
    const updatedVehicles = existingVehicles.map(vehicle => {
      if (vehicle.id === vehicleId) {
        return {
          ...vehicle,
          isApproved: !vehicle.isApproved,
          approvedBy: currentUser.id,
          approvedAt: new Date().toISOString()
        }
      }
      return vehicle
    })
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles))
    loadData()
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.model.toLowerCase().includes(vehicleSearchTerm.toLowerCase()) ||
    vehicle.plate.toLowerCase().includes(vehicleSearchTerm.toLowerCase()) ||
    vehicle.id.toLowerCase().includes(vehicleSearchTerm.toLowerCase())
  )

  const pendingUsers = filteredUsers.filter(user => !user.isApproved)
  const approvedUsers = filteredUsers.filter(user => user.isApproved)
  const pendingVehicles = filteredVehicles.filter(vehicle => !vehicle.isApproved)
  const approvedVehicles = filteredVehicles.filter(vehicle => vehicle.isApproved)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={onBack} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Panel de Supervisión</h1>
                  <p className="text-sm text-gray-600">Control de acceso de usuarios y vehículos</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-600">Supervisor</p>
              </div>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Gestión de Usuarios
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center">
              <Car className="w-4 h-4 mr-2" />
              Gestión de Vehículos
            </TabsTrigger>
          </TabsList>

          {/* Gestión de Usuarios */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                <p className="text-gray-600">Aprueba el acceso de usuarios al sistema</p>
              </div>
              <Button onClick={() => setShowAddUser(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ingresar Nuevo Usuario
              </Button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pendingUsers.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{approvedUsers.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Buscar usuarios por nombre, CI o usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Lista de usuarios */}
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{user.name}</h3>
                          <Badge variant={user.isApproved ? "default" : "secondary"}>
                            {user.isApproved ? "Aprobado" : "Pendiente"}
                          </Badge>
                          <Badge variant={user.vehicleAccess ? "default" : "outline"}>
                            {user.vehicleAccess ? "Acceso Vehículos" : "Sin Acceso Vehículos"}
                          </Badge>
                        </div>
                        {/* Mostrar vehículos del usuario */}
                        {user.vehicleAccess && getUserVehicles(user.id).length > 0 && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">Vehículos del usuario:</p>
                            <div className="space-y-2">
                              {getUserVehicles(user.id).map((vehicle) => (
                                <div key={vehicle.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{vehicle.model}</p>
                                    <p className="text-xs text-gray-600">Placa: {vehicle.plate} | ID: {vehicle.id}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant={getVehicleApprovalStatus(vehicle.id) ? "default" : "secondary"}>
                                      {getVehicleApprovalStatus(vehicle.id) ? "Aprobado" : "Pendiente"}
                                    </Badge>
                                    <Button
                                      variant={getVehicleApprovalStatus(vehicle.id) ? "outline" : "default"}
                                      size="sm"
                                      onClick={() => toggleVehicleApproval(vehicle.id)}
                                    >
                                      {getVehicleApprovalStatus(vehicle.id) ? (
                                        <>
                                          <XCircle className="w-4 h-4 mr-1" />
                                          Revocar
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="w-4 h-4 mr-1" />
                                          Aprobar
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          CI: {user.id} | Usuario: {user.username} | Tipo: {user.type}
                        </p>
                        {user.phone && <p className="text-sm text-gray-600">Tel: {user.phone}</p>}
                        {user.email && <p className="text-sm text-gray-600">Email: {user.email}</p>}
                        {user.approvedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Aprobado: {new Date(user.approvedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant={user.isApproved ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleUserApproval(user.id)}
                        >
                          {user.isApproved ? (
                            <>
                              <UserX className="w-4 h-4 mr-1" />
                              Revocar Acceso
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 mr-1" />
                              Aprobar Acceso
                            </>
                          )}
                        </Button>
                        <Button
                          variant={user.vehicleAccess ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleVehicleAccess(user.id)}
                          disabled={!user.isApproved}
                        >
                          {user.vehicleAccess ? (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Revocar Vehículos
                            </>
                          ) : (
                            <>
                              <CarIcon className="w-4 h-4 mr-1" />
                              Permitir Vehículos
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Gestión de Vehículos */}
          <TabsContent value="vehicles" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Vehículos</h2>
              <p className="text-gray-600">Aprueba qué vehículos pueden cargar combustible</p>
            </div>

            {/* Estadísticas de vehículos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Vehículos</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{vehicles.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes de Carga</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pendingVehicles.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aprobados para Carga</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{approvedVehicles.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios con Vehículos</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {new Set(vehicles.map(v => v.ownerId)).size}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Buscar vehículos por modelo, placa o ID..."
                value={vehicleSearchTerm}
                onChange={(e) => setVehicleSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Lista de vehículos */}
            <div className="space-y-4">
              {filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{vehicle.model}</h3>
                          <Badge variant={vehicle.isApproved ? "default" : "secondary"}>
                            {vehicle.isApproved ? "Aprobado para Carga" : "Pendiente de Aprobación"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          ID: {vehicle.id} | Placa: {vehicle.plate}
                        </p>
                        {vehicle.ownerId && (
                          <p className="text-sm text-gray-600">Propietario CI: {vehicle.ownerId}</p>
                        )}
                        {vehicle.year && vehicle.color && (
                          <p className="text-sm text-gray-600">
                            {vehicle.year} | {vehicle.color}
                          </p>
                        )}
                        {vehicle.approvedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Aprobado: {new Date(vehicle.approvedAt).toLocaleDateString()}
                          </p>
                        )}
                        {!vehicle.isApproved && (
                          <p className="text-xs text-orange-600 mt-1 font-medium">
                            ⚠️ Este vehículo no puede cargar combustible hasta ser aprobado
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant={vehicle.isApproved ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleVehicleApproval(vehicle.id)}
                        >
                          {vehicle.isApproved ? (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Revocar Carga
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Permitir Carga
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal para agregar usuario */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ingresar Nuevo Usuario</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="userId">Carnet de Identidad *</Label>
                <Input
                  id="userId"
                  value={newUser.id}
                  onChange={(e) => setNewUser({...newUser, id: e.target.value})}
                  placeholder="V-12345678"
                />
              </div>
              <div>
                <Label htmlFor="userName">Nombre Completo *</Label>
                <Input
                  id="userName"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <Label htmlFor="username">Usuario *</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  placeholder="juan.perez"
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="123456"
                />
              </div>
              <div>
                <Label htmlFor="userType">Tipo de Usuario</Label>
                <Select value={newUser.type} onValueChange={(value) => setNewUser({...newUser, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ciudadano">Ciudadano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  placeholder="+58 412 1234567"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="usuario@email.com"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <Button onClick={addUser} className="flex-1">
                Agregar Usuario
              </Button>
              <Button variant="outline" onClick={() => setShowAddUser(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupervisorDashboard 