import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  ArrowLeft, 
  Users, 
  MapPin, 
  Fuel, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Download,
  Calendar,
  Car,
  LogOut,
  Image
} from 'lucide-react'
import { Badge } from '@/components/ui/badge.jsx'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog.jsx'

const AdminDashboard = ({ onBack, currentUser, onLogout }) => {
  const [users, setUsers] = useState([])
  const [stations, setStations] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [fuelRecords, setFuelRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('users')
  const [error, setError] = useState('')

  // Estados para formularios
  const [newUser, setNewUser] = useState({
    id: '',
    name: '',
    username: '',
    password: '',
    type: 'ciudadano',
    phone: '',
    email: ''
  })

  const [newStation, setNewStation] = useState({
    id: '',
    name: '',
    address: '',
    manager: '',
    phone: '',
    fuelTypes: ['gasolina', 'diesel']
  })

  const [newVehicle, setNewVehicle] = useState({
    id: '',
    model: '',
    plate: '',
    ownerId: '',
    year: '',
    color: ''
  })

  // Estados para el formulario de registro de carga de combustible
  const [fuelForm, setFuelForm] = useState({
    citizenId: '',
    vehicleId: '',
    stationId: '',
    fuelType: '',
    fuelAmount: '',
    date: '',
    time: '',
    timestamp: ''
  })

  useEffect(() => {
    // Cargar datos del localStorage
    loadData()
  }, [])

  const loadData = () => {
    const savedUsers = localStorage.getItem('users')
    const savedStations = localStorage.getItem('stations')
    const savedVehicles = localStorage.getItem('vehicles')
    const savedRecords = localStorage.getItem('fuelRecords')

    if (savedUsers) setUsers(JSON.parse(savedUsers))
    if (savedStations) setStations(JSON.parse(savedStations))
    if (savedVehicles) setVehicles(JSON.parse(savedVehicles))
    if (savedRecords) setFuelRecords(JSON.parse(savedRecords))
  }

  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }

  const saveStations = (updatedStations) => {
    setStations(updatedStations)
    localStorage.setItem('stations', JSON.stringify(updatedStations))
  }

  const saveVehicles = (updatedVehicles) => {
    setVehicles(updatedVehicles)
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles))
  }

  const addUser = () => {
    if (!newUser.id || !newUser.name || !newUser.username || !newUser.password) {
      alert('Por favor complete al menos Carnet de Identidad, nombre, usuario y contraseña')
      return
    }

    // Check if username already exists
    if (users.find(u => u.username === newUser.username)) {
      alert('El nombre de usuario ya existe')
      return
    }

    const userWithTimestamp = {
      ...newUser,
      createdAt: new Date().toISOString()
    }

    const updatedUsers = [...users, userWithTimestamp]
    saveUsers(updatedUsers)
    
    setNewUser({
      id: '',
      name: '',
      username: '',
      password: '',
      type: 'ciudadano',
      phone: '',
      email: ''
    })
  }

  const deleteUser = (userId) => {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      const updatedUsers = users.filter(user => user.id !== userId)
      saveUsers(updatedUsers)
    }
  }

  const addStation = () => {
    if (!newStation.id || !newStation.name) {
      alert('Por favor complete al menos ID y nombre de la estación')
      return
    }

    const stationWithTimestamp = {
      ...newStation,
      createdAt: new Date().toISOString()
    }

    const updatedStations = [...stations, stationWithTimestamp]
    saveStations(updatedStations)
    
    setNewStation({
      id: '',
      name: '',
      address: '',
      manager: '',
      phone: '',
      fuelTypes: ['gasolina', 'diesel']
    })
  }

  const deleteStation = (stationId) => {
    if (confirm('¿Está seguro de eliminar esta estación?')) {
      const updatedStations = stations.filter(station => station.id !== stationId)
      saveStations(updatedStations)
    }
  }

  const addVehicle = () => {
    if (!newVehicle.id || !newVehicle.model || !newVehicle.plate) {
      alert('Por favor complete al menos ID, modelo y placa del vehículo')
      return
    }

    // Check if vehicle ID already exists
    if (vehicles.find(v => v.id === newVehicle.id)) {
      alert('El ID del vehículo ya existe')
      return
    }

    const vehicleWithTimestamp = {
      ...newVehicle,
      createdAt: new Date().toISOString()
    }

    const updatedVehicles = [...vehicles, vehicleWithTimestamp]
    saveVehicles(updatedVehicles)
    
    setNewVehicle({
      id: '',
      model: '',
      plate: '',
      ownerId: '',
      year: '',
      color: ''
    })
  }

  const deleteVehicle = (vehicleId) => {
    if (confirm('¿Está seguro de eliminar este vehículo?')) {
      const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId)
      saveVehicles(updatedVehicles)
    }
  }

  const exportData = () => {
    const data = {
      users,
      stations,
      vehicles,
      fuelRecords,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fuel-manager-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredRecords = fuelRecords.filter(record => 
    record.citizenId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.stationId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFuelFormChange = (field, value) => {
    setFuelForm(prev => ({ ...prev, [field]: value }))
  }

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const getAllowedDays = (lastDigit) => {
    lastDigit = Number(lastDigit)
    if ([1,2,3].includes(lastDigit)) return [1, 4] // Lunes, Jueves
    if ([4,5,6].includes(lastDigit)) return [2, 5] // Martes, Viernes
    if ([7,8,9,0].includes(lastDigit)) return [3, 6] // Miércoles, Sábado
    return []
  }

  const handleAddFuelRecord = (e) => {
    e.preventDefault()
    setError('')
    if (!fuelForm.citizenId || !fuelForm.vehicleId || !fuelForm.stationId || !fuelForm.fuelType || !fuelForm.fuelAmount) {
      setError('Por favor complete todos los campos del formulario')
      return
    }
    // Validar que el vehículo esté aprobado
    const veh = vehicles.find(v => v.id === fuelForm.vehicleId)
    if (!veh || veh.isApproved === false) {
      setError('A este vehículo no se le puede cargar combustible hasta ser aprobado')
      return
    }
    const dateToUse = fuelForm.date || new Date().toISOString().split('T')[0]
    // Corregir para obtener el día local correctamente
    const [year, month, day] = dateToUse.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    const dayOfWeek = dateObj.getDay() // 0: domingo, 1: lunes, ... 6: sábado
    if (dayOfWeek === 0) {
      setError('Hoy no es día de cargar combustible.')
      return
    }
    const userObj = users.find(u => u.id === fuelForm.citizenId)
    if (!userObj) {
      setError('Usuario no encontrado.')
      return
    }
    const lastDigit = Number(userObj.id.trim().slice(-1))
    const allowedDays = getAllowedDays(lastDigit)
    if (!allowedDays.includes(dayOfWeek)) {
      const dias = allowedDays.map(d => dayNames[d]).join(', ')
      setError(`No le corresponde cargar combustible este día según el último dígito de su cédula. Días permitidos: ${dias}.`)
      return
    }

    // Validar si ya cargó ese día
    const alreadyLoadedToday = fuelRecords.some(
      r => r.vehicleId === fuelForm.vehicleId && r.date === dateToUse
    )
    if (alreadyLoadedToday) {
      setError('La persona ya ha cargado combustible ese día.')
      return
    }

    const recordWithTimestamp = {
      ...fuelForm,
      id: Date.now().toString(), // Generar un ID único temporal
      date: dateToUse,
      time: new Date().toLocaleTimeString(),
      timestamp: new Date().toISOString()
    }

    const updatedRecords = [...fuelRecords, recordWithTimestamp]
    setFuelRecords(updatedRecords)
    localStorage.setItem('fuelRecords', JSON.stringify(updatedRecords))

    // Limpiar el formulario
    setFuelForm({
      citizenId: '',
      vehicleId: '',
      stationId: '',
      fuelType: '',
      fuelAmount: '',
      date: '',
      time: '',
      timestamp: ''
    })
  }

  const handleDeleteFuelRecord = (id) => {
    const updated = fuelRecords.filter(r => r.id !== id)
    setFuelRecords(updated)
    localStorage.setItem('fuelRecords', JSON.stringify(updated))
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Conectado como: {currentUser?.name}
            </span>
            <Button onClick={onLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Datos
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-gray-600">Usuarios</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <MapPin className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stations.length}</p>
                  <p className="text-sm text-gray-600">Estaciones</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Car className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{vehicles.length}</p>
                  <p className="text-sm text-gray-600">Vehículos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Fuel className="w-8 h-8 text-red-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{fuelRecords.length}</p>
                  <p className="text-sm text-gray-600">Registros</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Buscar usuarios, estaciones, vehículos o registros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs de contenido */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="vehicles">Vehículos</TabsTrigger>
            <TabsTrigger value="stations">Estaciones</TabsTrigger>
            <TabsTrigger value="records">Registros</TabsTrigger>
          </TabsList>

          {/* Tab de Usuarios */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agregar Nuevo Usuario</CardTitle>
                <CardDescription>
                  Registre ciudadanos, motorizados y administradores en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
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
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userType">Tipo de Usuario</Label>
                    <select
                      id="userType"
                      value={newUser.type}
                      onChange={(e) => setNewUser({...newUser, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ciudadano">Ciudadano</option>
                      <option value="operador">Operador</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="administrador">Administrador</option>
                    </select>
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
                  <div className="md:col-span-2">
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
                <Button onClick={addUser} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Usuario
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Usuarios ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">CI: {user.id} | Usuario: {user.username} | Tipo: {user.type}</p>
                        {user.phone && (
                          <p className="text-sm text-gray-600">Tel: {user.phone}</p>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No hay usuarios registrados</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Vehículos */}
          <TabsContent value="vehicles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Vehículos ({filteredVehicles.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex gap-3">
                        {/* Foto del vehículo */}
                        <div className="flex-shrink-0">
                          {vehicle.photo ? (
                            <img
                              src={vehicle.photo}
                              alt={`Foto de ${vehicle.model}`}
                              className="w-16 h-16 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center">
                              <Image className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Información del vehículo */}
                        <div>
                          <div className="flex items-center mb-1">
                            <p className="font-medium">{vehicle.model}</p>
                            <Badge 
                              variant={vehicle.isApproved ? "default" : "secondary"} 
                              className="ml-2"
                            >
                              {vehicle.isApproved ? "Aprobado para Carga" : "Pendiente de Aprobación"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">ID: {vehicle.id} | Placa: {vehicle.plate}</p>
                          {vehicle.ownerId && (
                            <p className="text-sm text-gray-600">Propietario CI: {vehicle.ownerId}</p>
                          )}
                          {vehicle.year && vehicle.color && (
                            <p className="text-sm text-gray-600">{vehicle.year} - {vehicle.color}</p>
                          )}
                          {vehicle.description && (
                            <p className="text-sm text-gray-500 truncate max-w-xs">{vehicle.description}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteVehicle(vehicle.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {filteredVehicles.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No hay vehículos registrados</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Estaciones */}
          <TabsContent value="stations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agregar Nueva Estación</CardTitle>
                <CardDescription>
                  Registre estaciones de servicio en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stationId">ID Estación *</Label>
                    <Input
                      id="stationId"
                      value={newStation.id}
                      onChange={(e) => setNewStation({...newStation, id: e.target.value})}
                      placeholder="EST-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stationName">Nombre de la Estación *</Label>
                    <Input
                      id="stationName"
                      value={newStation.name}
                      onChange={(e) => setNewStation({...newStation, name: e.target.value})}
                      placeholder="Estación Central"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={newStation.address}
                      onChange={(e) => setNewStation({...newStation, address: e.target.value})}
                      placeholder="Av. Principal, Caracas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manager">Encargado</Label>
                    <Input
                      id="manager"
                      value={newStation.manager}
                      onChange={(e) => setNewStation({...newStation, manager: e.target.value})}
                      placeholder="María González"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stationPhone">Teléfono</Label>
                    <Input
                      id="stationPhone"
                      value={newStation.phone}
                      onChange={(e) => setNewStation({...newStation, phone: e.target.value})}
                      placeholder="+58 212 1234567"
                    />
                  </div>
                </div>
                <Button onClick={addStation} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Estación
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Estaciones ({filteredStations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredStations.map((station) => (
                    <div key={station.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{station.name}</p>
                        <p className="text-sm text-gray-600">ID: {station.id}</p>
                        {station.address && (
                          <p className="text-sm text-gray-600">Dirección: {station.address}</p>
                        )}
                        {station.manager && (
                          <p className="text-sm text-gray-600">Encargado: {station.manager}</p>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteStation(station.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {filteredStations.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No hay estaciones registradas</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Registros */}
          <TabsContent value="records" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Nueva Carga de Combustible</CardTitle>
              </CardHeader>
              <CardContent>
                <form id="fuel-record-form" className="grid md:grid-cols-3 gap-4 items-end" onSubmit={handleAddFuelRecord}>
                  <div>
                    <Label>Ciudadano</Label>
                    <select className="w-full border rounded px-2 py-1" value={fuelForm.citizenId} onChange={e => handleFuelFormChange('citizenId', e.target.value)} required>
                      <option value="">Selecciona un ciudadano</option>
                      {users.filter(u => u.type === 'ciudadano' && u.isApproved !== false && u.vehicleAccess !== false).map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Vehículo</Label>
                    <select className="w-full border rounded px-2 py-1" value={fuelForm.vehicleId} onChange={e => handleFuelFormChange('vehicleId', e.target.value)} required disabled={!fuelForm.citizenId}>
                      <option value="">Selecciona un vehículo</option>
                      {vehicles.filter(v => v.ownerId === fuelForm.citizenId && v.isApproved !== false).map(v => (
                        <option key={v.id} value={v.id}>{v.model} ({v.plate})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Estación</Label>
                    <select className="w-full border rounded px-2 py-1" value={fuelForm.stationId} onChange={e => handleFuelFormChange('stationId', e.target.value)} required>
                      <option value="">Selecciona una estación</option>
                      {stations.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Tipo de Combustible</Label>
                    <select className="w-full border rounded px-2 py-1" value={fuelForm.fuelType} onChange={e => handleFuelFormChange('fuelType', e.target.value)} required>
                      <option value="">Selecciona tipo</option>
                      {fuelForm.stationId && stations.find(s => s.id === fuelForm.stationId)?.fuelTypes.map(ft => (
                        <option key={ft} value={ft}>{ft}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Cantidad (L)</Label>
                    <Input type="number" min="1" step="0.01" value={fuelForm.fuelAmount} onChange={e => handleFuelFormChange('fuelAmount', e.target.value)} required />
                  </div>
                  <div>
                    <Label>Fecha de carga</Label>
                    <Input type="date" value={fuelForm.date || new Date().toISOString().split('T')[0]} onChange={e => handleFuelFormChange('date', e.target.value)} />
                  </div>
                  <div>
                    <Button type="submit" className="w-full">Registrar Carga</Button>
                  </div>
                </form>
                {error && <div className="text-red-600 mt-2">{error}</div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registros de Combustible ({filteredRecords.length})</CardTitle>
                <CardDescription>
                  Historial de todas las cargas de combustible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredRecords.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg bg-white flex justify-between items-center">
                      <div className="grid md:grid-cols-2 gap-4 flex-1">
                        <div>
                          <p className="font-medium">Ciudadano: {record.citizenId}</p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {record.fuelAmount}L de {record.fuelType}
                          </p>
                          <p className="text-sm text-gray-600">
                            Fecha: {record.date} {record.time}
                          </p>
                        </div>
                        <div>
                          {record.stationId && (
                            <p className="text-sm text-gray-600">Estación: {record.stationId}</p>
                          )}
                          {record.vehicleId && (
                            <p className="text-sm text-gray-600">Vehículo: {record.vehicleId}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            Registrado: {new Date(record.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" className="ml-4" title="Eliminar registro">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que deseas eliminar este registro de carga de combustible? Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteFuelRecord(record.id)} autoFocus>Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                  {filteredRecords.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No hay registros de combustible</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard

