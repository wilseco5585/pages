import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  Plus, 
  Camera, 
  X, 
  Car,
  Save,
  AlertCircle
} from 'lucide-react'

const AddVehicleForm = ({ onVehicleAdded, onCancel, currentUser }) => {
  const [vehicleData, setVehicleData] = useState({
    id: '',
    model: '',
    plate: '',
    year: '',
    color: '',
    description: ''
  })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleInputChange = (field, value) => {
    setVehicleData(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError('')
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona una imagen válida')
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB')
        return
      }

      setPhoto(file)
      setError('')

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const generateVehicleId = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `VEH-${timestamp}-${random}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Verificar permisos de acceso
    if (!currentUser?.vehicleAccess) {
      setError('No tienes permisos para registrar vehículos. Contacta al supervisor.')
      setIsLoading(false)
      return
    }

    // Validar campos obligatorios
    if (!vehicleData.model || !vehicleData.plate) {
      setError('Por favor completa al menos el modelo y la placa del vehículo')
      setIsLoading(false)
      return
    }

    try {
      // Generar ID único si no se proporcionó
      const vehicleId = vehicleData.id || generateVehicleId()

      // Convertir foto a base64 si existe
      let photoBase64 = null
      if (photo) {
        photoBase64 = await convertFileToBase64(photo)
      }

      const newVehicle = {
        id: vehicleId,
        model: vehicleData.model,
        plate: vehicleData.plate.toUpperCase(),
        ownerId: currentUser.id,
        year: vehicleData.year,
        color: vehicleData.color,
        description: vehicleData.description,
        photo: photoBase64,
        createdAt: new Date().toISOString(),
        isApproved: false
      }

      // Obtener vehículos existentes
      const existingVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
      
      // Verificar si la placa ya existe
      if (existingVehicles.find(v => v.plate === newVehicle.plate)) {
        setError('Ya existe un vehículo con esa placa')
        setIsLoading(false)
        return
      }

      // Agregar nuevo vehículo
      const updatedVehicles = [...existingVehicles, newVehicle]
      localStorage.setItem('vehicles', JSON.stringify(updatedVehicles))

      // Limpiar formulario
      setVehicleData({
        id: '',
        model: '',
        plate: '',
        year: '',
        color: '',
        description: ''
      })
      removePhoto()

      // Notificar al componente padre
      onVehicleAdded(newVehicle)
      
    } catch (error) {
      setError('Error al guardar el vehículo. Intenta de nuevo.')
      console.error('Error saving vehicle:', error)
    }

    setIsLoading(false)
  }

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Car className="w-5 h-5 mr-2" />
          Agregar Nuevo Vehículo
        </CardTitle>
        <CardDescription>
          Registra tu vehículo con información detallada y foto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del vehículo */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="model">Modelo del Vehículo *</Label>
              <Input
                id="model"
                value={vehicleData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="Toyota Corolla"
                required
              />
            </div>
            <div>
              <Label htmlFor="plate">Placa *</Label>
              <Input
                id="plate"
                value={vehicleData.plate}
                onChange={(e) => handleInputChange('plate', e.target.value)}
                placeholder="ABC-123"
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={vehicleData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                placeholder="2020"
              />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={vehicleData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="Blanco"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              value={vehicleData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Información adicional sobre el vehículo..."
              rows={3}
            />
          </div>

          {/* Subida de foto */}
          <div>
            <Label>Foto del Vehículo</Label>
            <div className="mt-2 space-y-4">
              {!photoPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Haz clic para seleccionar una foto de tu vehículo
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Seleccionar Foto
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview del vehículo"
                    className="w-full max-w-md mx-auto rounded-lg shadow-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removePhoto}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB
              </p>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                'Guardando...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Vehículo
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddVehicleForm 