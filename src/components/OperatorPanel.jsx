import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ArrowLeft } from 'lucide-react'

const OperatorPanel = ({ onBack, currentUser }) => {
  const [ci, setCi] = useState('')
  const [user, setUser] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [fuelRecords, setFuelRecords] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [stationId, setStationId] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [fuelAmount, setFuelAmount] = useState('')
  const [stations, setStations] = useState([])
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [fuelDate, setFuelDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  const handleSearch = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find(u => u.id === ci)
    setUser(found || null)
    if (found) {
      const allVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
      setVehicles(allVehicles.filter(v => v.ownerId === found.id))
      setFuelRecords(JSON.parse(localStorage.getItem('fuelRecords') || '[]').filter(r => r.citizenId === found.id))
    } else {
      setVehicles([])
      setFuelRecords([])
    }
    setSelectedVehicle('')
    setStationId('')
    setFuelType('')
    setFuelAmount('')
    setSuccess('')
    setStations(JSON.parse(localStorage.getItem('stations') || '[]'))
  }

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const getAllowedDays = (lastDigit) => {
    lastDigit = Number(lastDigit)
    if ([1,2,3].includes(lastDigit)) return [1, 4] // Lunes, Jueves
    if ([4,5,6].includes(lastDigit)) return [2, 5] // Martes, Viernes
    if ([7,8,9,0].includes(lastDigit)) return [3, 6] // Miércoles, Sábado
    return []
  }

  const handleRegisterFuel = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!user || !selectedVehicle || !stationId || !fuelType || !fuelAmount) return

    // Validar que el vehículo esté aprobado
    const veh = vehicles.find(v => v.id === selectedVehicle)
    if (!veh || veh.isApproved === false) {
      setError('A este vehículo no se le puede cargar combustible hasta ser aprobado')
      return
    }

    // Usar la fecha seleccionada o la de hoy
    const dateToUse = fuelDate || new Date().toISOString().split('T')[0]
    // Corregir para obtener el día local correctamente
    const [year, month, day] = dateToUse.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    const dayOfWeek = dateObj.getDay() // 0: domingo, 1: lunes, ... 6: sábado

    if (dayOfWeek === 0) {
      setError('Hoy no es día de cargar combustible.')
      return
    }
    const lastDigit = Number(user.id.trim().slice(-1))
    const allowedDays = getAllowedDays(lastDigit)
    if (!allowedDays.includes(dayOfWeek)) {
      const dias = allowedDays.map(d => dayNames[d]).join(', ')
      setError(`No le corresponde cargar combustible este día según el último dígito de su cédula. Días permitidos: ${dias}.`)
      return
    }

    // Validar si ya cargó ese día
    const allRecords = JSON.parse(localStorage.getItem('fuelRecords') || '[]')
    const alreadyLoadedToday = allRecords.some(
      r => r.vehicleId === selectedVehicle && r.date === dateToUse
    )
    if (alreadyLoadedToday) {
      setError('La persona ya ha cargado combustible ese día.')
      return
    }

    const newRecord = {
      id: Date.now().toString(),
      citizenId: user.id,
      vehicleId: selectedVehicle,
      stationId,
      fuelType,
      fuelAmount,
      date: dateToUse,
      time: new Date().toLocaleTimeString(),
      timestamp: new Date().toISOString()
    }
    const updated = [...allRecords, newRecord]
    localStorage.setItem('fuelRecords', JSON.stringify(updated))
    setFuelRecords(updated.filter(r => r.citizenId === user.id))
    setSuccess('Carga registrada correctamente')
    setFuelAmount('')
    setFuelType('')
    setStationId('')
    setSelectedVehicle('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center mb-4 justify-between">
            <div className="flex items-center">
              <Button variant="outline" onClick={onBack} className="mr-4">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-2xl">Panel Operador</CardTitle>
            </div>
            {currentUser && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-600">Operador</p>
              </div>
            )}
          </div>
          <CardDescription>
            Busca un ciudadano por CI para verificar y registrar carga de combustible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex gap-2 mb-6" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
            <Input placeholder="Carnet de Identidad" value={ci} onChange={e => setCi(e.target.value)} required />
            <Button type="submit">Buscar</Button>
          </form>

          {user && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold">Nombre:</span> {user.name}
                <Badge variant={user.isApproved !== false && user.vehicleAccess !== false ? 'default' : 'secondary'}>
                  {user.isApproved !== false && user.vehicleAccess !== false ? 'Aprobado' : 'No aprobado'}
                </Badge>
              </div>
              <div className="mb-2 text-sm text-gray-600">CI: {user.id} | Usuario: {user.username}</div>
              <div className="mb-2">
                <span className="font-semibold">Vehículos:</span>
                <ul className="ml-4 mt-1">
                  {vehicles.length === 0 && <li className="text-gray-500">No tiene vehículos registrados</li>}
                  {vehicles.map(v => (
                    <li key={v.id} className="flex items-center gap-2">
                      {v.model} ({v.plate})
                      <Badge variant={v.isApproved !== false ? 'default' : 'secondary'}>
                        {v.isApproved !== false ? 'Aprobado' : 'No aprobado'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {user && user.isApproved !== false && user.vehicleAccess !== false && vehicles.some(v => v.isApproved !== false) && (
            <form className="mb-6" onSubmit={handleRegisterFuel}>
              <div className="grid md:grid-cols-2 gap-4 items-end">
                <div>
                  <Label>Vehículo</Label>
                  <select className="w-full border rounded px-2 py-1" value={selectedVehicle} onChange={e => setSelectedVehicle(e.target.value)} required>
                    <option value="">Selecciona un vehículo</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id} disabled={v.isApproved === false}>
                        {v.model} ({v.plate}) {v.isApproved === false ? ' - No aprobado' : ''}
                      </option>
                    ))}
                  </select>
                  {selectedVehicle && vehicles.find(v => v.id === selectedVehicle)?.isApproved === false && (
                    <div className="text-orange-600 text-xs mt-1">A este vehículo no se le puede cargar combustible hasta ser aprobado</div>
                  )}
                </div>
                <div>
                  <Label>Estación</Label>
                  <select className="w-full border rounded px-2 py-1" value={stationId} onChange={e => setStationId(e.target.value)} required>
                    <option value="">Selecciona una estación</option>
                    {stations.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Tipo de Combustible</Label>
                  <select className="w-full border rounded px-2 py-1" value={fuelType} onChange={e => setFuelType(e.target.value)} required>
                    <option value="">Selecciona tipo</option>
                    {stationId && stations.find(s => s.id === stationId)?.fuelTypes.map(ft => (
                      <option key={ft} value={ft}>{ft}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Cantidad (L)</Label>
                  <Input type="number" min="1" step="0.01" value={fuelAmount} onChange={e => setFuelAmount(e.target.value)} required />
                </div>
                <div>
                  <Label>Fecha de carga</Label>
                  <Input type="date" value={fuelDate} onChange={e => setFuelDate(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full">Registrar Carga</Button>
                </div>
              </div>
              {success && <div className="text-green-600 mt-2">{success}</div>}
              {error && <div className="text-red-600 mt-2">{error}</div>}
            </form>
          )}

          {user && (
            <div>
              <h3 className="font-semibold mb-2">Historial de Cargas</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {fuelRecords.length === 0 && <div className="text-gray-500">No hay cargas registradas</div>}
                {fuelRecords.map(r => (
                  <div key={r.id} className="p-2 border rounded bg-white">
                    <div className="flex justify-between">
                      <span>{r.date} {r.time}</span>
                      <span className="text-xs text-gray-500">{r.stationId}</span>
                    </div>
                    <div className="text-sm">{r.fuelAmount}L de {r.fuelType} - Vehículo: {vehicles.find(v => v.id === r.vehicleId)?.model || r.vehicleId}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default OperatorPanel 