// Función para inicializar datos por defecto
export const initializeDefaultData = () => {
  // Verificar si ya existen datos
  const existingUsers = localStorage.getItem('users')
  
  if (!existingUsers) {
    // Crear usuario administrador por defecto
    const defaultAdmin = {
      id: 'V-12345678',
      name: 'Administrador',
      username: 'admin',
      password: 'admin123',
      type: 'administrador',
      phone: '+58 412 1234567',
      email: 'admin@fuelmanager.com',
      createdAt: new Date().toISOString()
    }

    // Crear supervisor por defecto
    const defaultSupervisor = {
      id: 'V-55555555',
      name: 'Supervisor del Sistema',
      username: 'supervisor',
      password: 'super123',
      type: 'supervisor',
      phone: '+58 412 5555555',
      email: 'supervisor@fuelmanager.com',
      createdAt: new Date().toISOString()
    }

    // Crear algunos usuarios de ejemplo
    const sampleUsers = [
      {
        id: 'V-11111111',
        name: 'Juan Pérez',
        username: 'juan.perez',
        password: '123456',
        type: 'ciudadano',
        phone: '+58 412 1111111',
        email: 'juan@email.com',
        createdAt: new Date().toISOString()
      },
      {
        id: 'V-33333333',
        name: 'María González',
        username: 'maria.gonzalez',
        password: '123456',
        type: 'ciudadano',
        phone: '+58 412 3333333',
        email: 'maria@email.com',
        createdAt: new Date().toISOString()
      }
    ]

    // Crear algunas estaciones de ejemplo
    const sampleStations = [
      {
        id: 'EST-001',
        name: 'Estación Central',
        address: 'Av. Principal, Caracas',
        manager: 'María González',
        phone: '+58 212 1234567',
        fuelTypes: ['gasolina', 'diesel'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'EST-002',
        name: 'Estación Norte',
        address: 'Av. Norte, Caracas',
        manager: 'Pedro López',
        phone: '+58 212 7654321',
        fuelTypes: ['gasolina', 'diesel', 'gas'],
        createdAt: new Date().toISOString()
      }
    ]

    // Crear algunos vehículos de ejemplo
    const sampleVehicles = [
      {
        id: 'VEH-001',
        model: 'Toyota Corolla',
        plate: 'ABC-123',
        ownerId: 'V-11111111',
        year: '2020',
        color: 'Blanco',
        createdAt: new Date().toISOString(),
        isApproved: false
      },
      {
        id: 'VEH-002',
        model: 'Honda Civic',
        plate: 'XYZ-789',
        ownerId: 'V-22222222',
        year: '2019',
        color: 'Negro',
        createdAt: new Date().toISOString(),
        isApproved: false
      },
      {
        id: 'VEH-003',
        model: 'Ford Focus',
        plate: 'DEF-456',
        ownerId: 'V-33333333',
        year: '2021',
        color: 'Azul',
        createdAt: new Date().toISOString(),
        isApproved: false
      },
      {
        id: 'VEH-004',
        model: 'Chevrolet Aveo',
        plate: 'GHI-789',
        ownerId: 'V-44444444',
        year: '2018',
        color: 'Rojo',
        createdAt: new Date().toISOString(),
        isApproved: false
      }
    ]

    // Guardar datos en localStorage
    localStorage.setItem('users', JSON.stringify([defaultAdmin, defaultSupervisor, ...sampleUsers]))
    localStorage.setItem('stations', JSON.stringify(sampleStations))
    localStorage.setItem('vehicles', JSON.stringify(sampleVehicles))
    localStorage.setItem('fuelRecords', JSON.stringify([]))

    console.log('Datos de ejemplo inicializados correctamente')
    console.log('Usuario administrador: admin / admin123')
    console.log('Usuario supervisor: supervisor / super123')
    console.log('Usuarios ciudadanos: juan.perez / 123456, maria.gonzalez / 123456')
    console.log('Usuarios motorizados: carlos.rodriguez / 123456, pedro.lopez / 123456')
  }
}

// Función para limpiar todos los datos (solo para desarrollo)
export const clearAllData = () => {
  localStorage.removeItem('users')
  localStorage.removeItem('stations')
  localStorage.removeItem('vehicles')
  localStorage.removeItem('fuelRecords')
  localStorage.removeItem('currentUser')
  console.log('Todos los datos han sido eliminados')
}

// Función para agregar supervisor si no existe
export const ensureSupervisorExists = () => {
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
  const supervisorExists = existingUsers.find(user => user.type === 'supervisor')
  
  if (!supervisorExists) {
    const defaultSupervisor = {
      id: 'V-55555555',
      name: 'Supervisor del Sistema',
      username: 'supervisor',
      password: 'super123',
      type: 'supervisor',
      phone: '+58 412 5555555',
      email: 'supervisor@fuelmanager.com',
      createdAt: new Date().toISOString()
    }
    
    const updatedUsers = [...existingUsers, defaultSupervisor]
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    console.log('Supervisor agregado al sistema')
    console.log('Usuario supervisor: supervisor / super123')
  }
} 