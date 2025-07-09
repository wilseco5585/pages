# Guía de Instalación y Uso - Fuel Manager

## 📋 Requisitos del Sistema

### Requisitos Mínimos
- **Node.js**: Versión 18.0 o superior
- **Navegador web moderno** con soporte para:
  - localStorage
  - ES6+ JavaScript

### Navegadores Compatibles
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🚀 Instalación

### Opción 1: Instalación Local

1. **Descargar el proyecto**
   ```bash
   # Si tienes acceso al repositorio
   git clone <url-del-repositorio>
   cd fuel-manager
   ```

2. **Instalar dependencias**
   ```bash
   # Usando pnpm (recomendado)
   pnpm install
   
   # O usando npm
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   # Con pnpm
   pnpm run dev
   
   # Con npm
   npm run dev
   ```

4. **Abrir en navegador**
   - Navegar a: `http://localhost:5173`
   - La aplicación se abrirá automáticamente

### Opción 2: Construcción para Producción

1. **Construir la aplicación**
   ```bash
   pnpm run build
   # o
   npm run build
   ```

2. **Servir archivos estáticos**
   ```bash
   pnpm run preview
   # o
   npm run preview
   ```

## 📱 Uso de la Aplicación

### Pantalla Principal
Al abrir la aplicación verás la opción principal:

**Panel de Administración** - Para gestionar datos del sistema

### ⚙️ Panel de Administración

#### Gestión de Usuarios
1. **Agregar Usuario**
   - Ir a la pestaña "Usuarios"
   - Completar formulario con datos del usuario
   - Campos obligatorios: ID Usuario y Nombre
   - Hacer clic en "Agregar Usuario"

2. **Ver/Eliminar Usuarios**
   - La lista muestra todos los usuarios registrados
   - Usar el botón de eliminar (🗑️) para borrar usuarios
   - Usar la barra de búsqueda para filtrar

#### Gestión de Estaciones
1. **Agregar Estación**
   - Ir a la pestaña "Estaciones"
   - Completar formulario con datos de la estación
   - Campos obligatorios: ID Estación y Nombre
   - Hacer clic en "Agregar Estación"

2. **Ver/Eliminar Estaciones**
   - Similar a la gestión de usuarios
   - Lista completa con información detallada

#### Visualización de Registros
- **Pestaña "Registros"**: Ver historial completo de cargas
- **Búsqueda**: Filtrar por ciudadano o estación
- **Exportar**: Descargar todos los datos en formato JSON

## 🔧 Funcionalidades Avanzadas

### Búsqueda Global
- Usar la barra de búsqueda en el panel de administración
- Busca en usuarios, estaciones y registros simultáneamente
- Filtrado en tiempo real mientras escribes

### Exportación de Datos
1. Ir al Panel de Administración
2. Hacer clic en "Exportar Datos"
3. Se descargará un archivo JSON con toda la información

## 📊 Estructura de Datos

### Usuario
```json
{
  "id": "CIU-001",
  "name": "Juan Pérez",
  "type": "ciudadano",
  "vehicleId": "MOT-123",
  "phone": "+58 412 1234567",
  "email": "juan@email.com",
  "createdAt": "2025-06-16T14:30:00.000Z"
}
```

### Estación
```json
{
  "id": "EST-001",
  "name": "Estación Central",
  "address": "Av. Principal, Caracas",
  "manager": "María González",
  "phone": "+58 212 1234567",
  "fuelTypes": ["gasolina", "diesel"],
  "createdAt": "2025-06-16T14:30:00.000Z"
}
```

### Registro de Combustible
```json
{
  "id": 1718548200000,
  "stationId": "EST-001",
  "citizenId": "CIU-12345",
  "vehicleId": "MOT-789",
  "fuelAmount": "25.50",
  "fuelType": "gasolina",
  "date": "2025-06-16",
  "time": "14:30",
  "timestamp": "2025-06-16T14:30:00.000Z"
}
```

## 🔒 Consideraciones de Seguridad

### Almacenamiento de Datos
- Todos los datos se guardan localmente en el navegador
- No se envían datos a servidores externos
- Los datos persisten entre sesiones del navegador

### Privacidad
- No se recopila información personal adicional
- No hay tracking ni analytics externos
- Funciona completamente offline después de la carga inicial

## 🐛 Solución de Problemas

### Los datos no se guardan
1. Verificar que localStorage está habilitado
2. Comprobar espacio disponible en el navegador
3. Probar en modo incógnito para descartar extensiones

### La aplicación no carga
1. Verificar que Node.js está instalado correctamente
2. Comprobar que todas las dependencias están instaladas
3. Revisar la consola del navegador para errores
4. Verificar que el puerto 5173 está disponible

