# Fuel Manager

Una aplicación desarrollada con React y Tailwind CSS para la gestión de combustible con sistema de autenticación dual y gestión de vehículos con fotos.

## Características Principales

### 🔐 Sistema de Autenticación Dual
- **Selección de tipo de usuario**: Pantalla inicial para elegir entre acceso ciudadano o administrador
- **Acceso ciudadano**: Los ciudadanos y motorizados pueden consultar y agregar sus vehículos
- **Acceso administrativo**: Solo los administradores pueden gestionar el sistema completo
- **Sesiones persistentes**: Mantiene la sesión activa entre recargas de página

### 👥 Panel Ciudadano
- **Consulta de vehículos**: Ver solo los vehículos registrados a nombre del usuario
- **Agregar vehículos**: Los usuarios pueden registrar sus propios vehículos
- **Subida de fotos**: Incluir fotos de los vehículos durante el registro
- **Información de perfil**: Datos personales y estadísticas del usuario
- **Búsqueda de vehículos**: Filtrado por modelo, placa o ID
- **Interfaz simplificada**: Diseño enfocado en la consulta y gestión de información

### ⚙️ Panel de Administración
- **Gestión de usuarios**: Registro y administración de ciudadanos, motorizados y administradores
- **Gestión de vehículos**: Control completo de vehículos con información detallada y fotos
- **Gestión de estaciones**: Control de estaciones de servicio con información completa
- **Registro de combustible**: Historial detallado de todas las cargas realizadas
- **Búsqueda avanzada**: Filtrado de datos por diferentes criterios
- **Exportación de datos**: Descarga de toda la información en formato JSON
- **Estadísticas**: Contadores en tiempo real de usuarios, vehículos, estaciones y registros

## Tecnologías Utilizadas

- **React 19**: Framework principal para la interfaz de usuario
- **Tailwind CSS**: Framework de estilos para diseño responsivo
- **Shadcn/UI**: Componentes de interfaz de usuario pre-diseñados
- **Lucide React**: Iconografía moderna y consistente
- **Vite**: Herramienta de construcción y desarrollo

## Estructura del Proyecto

```
fuel-manager/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx        # Formulario de autenticación
│   │   │   └── UserTypeSelector.jsx # Selector de tipo de usuario
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx   # Panel de administración
│   │   ├── citizen/
│   │   │   ├── CitizenDashboard.jsx # Panel ciudadano
│   │   │   └── AddVehicleForm.jsx   # Formulario para agregar vehículos
│   │   └── ui/                      # Componentes de UI (shadcn/ui)
│   ├── utils/
│   │   └── initData.js              # Datos de inicialización
│   ├── App.jsx                      # Componente principal
│   ├── App.css                      # Estilos principales
│   └── main.jsx                     # Punto de entrada
├── public/                          # Archivos estáticos
├── package.json                     # Dependencias del proyecto
└── README.md                        # Documentación
```

## Instalación y Uso

### Prerrequisitos
- Node.js 18 o superior
- pnpm (recomendado) o npm

### Instalación
```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Navegar al directorio
cd fuel-manager

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev
```

### Construcción para producción
```bash
# Construir la aplicación
pnpm run build

# Vista previa de la construcción
pnpm run preview
```

## Acceso al Sistema

### Pantalla de Selección
Al abrir la aplicación, verás dos opciones:
1. **Acceso Ciudadano**: Para consultar y agregar vehículos personales
2. **Panel de Administración**: Para gestión completa del sistema

### Usuarios de Prueba

#### Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Carnet de Identidad**: `V-12345678`

#### Supervisor
- **Usuario**: `supervisor`
- **Contraseña**: `super123`
- **Carnet de Identidad**: `V-55555555`

#### Ciudadanos
- **Usuario**: `juan.perez` | **Contraseña**: `123456` | **CI**: `V-11111111`
- **Usuario**: `maria.gonzalez` | **Contraseña**: `123456` | **CI**: `V-33333333`

#### Motorizados
- **Usuario**: `carlos.rodriguez` | **Contraseña**: `123456` | **CI**: `V-22222222`
- **Usuario**: `pedro.lopez` | **Contraseña**: `123456` | **CI**: `V-44444444`

### Datos de Ejemplo Incluidos
La aplicación incluye datos de ejemplo para facilitar las pruebas:
- 1 usuario administrador
- 2 usuarios ciudadanos
- 2 usuarios motorizados
- 2 estaciones de servicio
- 4 vehículos de ejemplo (asignados a diferentes usuarios)

## Funcionalidades Detalladas

### Sistema de Autenticación Triple
- **Selección de tipo**: Pantalla inicial para elegir tipo de acceso (Ciudadano, Supervisor, Administrador)
- **Validación de permisos**: Control de acceso basado en tipo de usuario
- **Login seguro**: Validación de credenciales específica por tipo
- **Sesiones persistentes**: Mantiene la sesión activa
- **Logout**: Cierre de sesión seguro

### Panel Ciudadano
- **Perfil personal**: Información del usuario logueado
- **Mis vehículos**: Lista de vehículos registrados a nombre del usuario
- **Agregar vehículos**: Formulario completo para registrar nuevos vehículos (requiere aprobación del supervisor)
- **Subida de fotos**: Incluir imágenes de los vehículos (máximo 5MB)
- **Búsqueda**: Filtrado de vehículos personales
- **Estadísticas**: Conteo de vehículos registrados
- **Interfaz limpia**: Diseño enfocado en consulta y gestión
- **Control de acceso**: Solo usuarios aprobados pueden registrar vehículos

### Panel de Supervisión
- **Gestión de usuarios**: Aprobar o revocar acceso de usuarios al sistema
- **Control de vehículos**: Aprobar o revocar acceso para registro de vehículos
- **Aprobación individual de vehículos**: Control específico de qué vehículos pueden cargar combustible
- **Vista de vehículos por usuario**: Ver todos los vehículos de cada usuario y su estado de aprobación
- **Ingreso de usuarios**: Crear nuevos usuarios en el sistema
- **Estadísticas**: Conteo de usuarios y vehículos pendientes y aprobados
- **Búsqueda**: Filtrado de usuarios y vehículos por diferentes criterios
- **Historial de aprobaciones**: Registro de quién y cuándo aprobó cada elemento

### Gestión de Vehículos con Fotos
- **Información completa**: ID, modelo, placa, propietario, año, color, descripción
- **Fotos de vehículos**: Almacenamiento en base64 para persistencia
- **Validación de archivos**: Verificación de tipo y tamaño de imagen
- **Preview de fotos**: Vista previa antes de guardar
- **Generación automática de ID**: IDs únicos para nuevos vehículos
- **Validación de placas**: Verificación de placas duplicadas
- **Aprobación individual**: Cada vehículo debe ser aprobado individualmente por el supervisor para cargar combustible
- **Estado de aprobación visible**: Los usuarios pueden ver qué vehículos están aprobados y cuáles pendientes

### Gestión de Usuarios (Admin)
- **Tipos de usuario**: Ciudadano, Motorizado, Administrador
- **Información completa**: Carnet de Identidad, nombre, usuario, contraseña, tipo, teléfono, email
- **Operaciones CRUD**: Crear, leer, actualizar y eliminar usuarios
- **Búsqueda**: Filtrado por nombre, Carnet de Identidad o usuario

### Gestión de Vehículos (Admin)
- **Información detallada**: ID, modelo, placa, propietario (Carnet de Identidad), año, color, descripción
- **Visualización de fotos**: Muestra las fotos subidas por los usuarios
- **Vinculación con usuarios**: Asociación con propietarios por Carnet de Identidad
- **Operaciones CRUD**: Gestión completa de vehículos
- **Búsqueda**: Filtrado por modelo, ID o placa

### Gestión de Estaciones (Admin)
- **Información detallada**: ID, nombre, dirección, encargado, teléfono
- **Tipos de combustible**: Configuración de combustibles disponibles
- **Operaciones CRUD**: Gestión completa de estaciones
- **Búsqueda**: Filtrado por nombre o ID de estación

### Registro de Combustible (Admin)
- **Historial completo**: Todos los registros de cargas realizadas
- **Información detallada**: Ciudadano, estación, vehículo, cantidad, tipo, fecha/hora
- **Búsqueda**: Filtrado por ciudadano o estación
- **Exportación**: Descarga de datos en formato JSON

## Almacenamiento de Datos

La aplicación utiliza localStorage del navegador para persistir los datos:
- `users`: Lista de usuarios registrados
- `vehicles`: Lista de vehículos registrados (incluye fotos en base64)
- `stations`: Lista de estaciones de servicio
- `fuelRecords`: Historial de cargas de combustible
- `currentUser`: Usuario actualmente autenticado

## Flujo de Usuario

### Ciudadanos/Motorizados
1. Seleccionar "Acceso Ciudadano"
2. Ingresar credenciales
3. Ver perfil personal y vehículos registrados
4. Agregar nuevos vehículos con fotos (si tienen acceso aprobado)
5. Buscar y consultar información de vehículos

### Supervisores
1. Seleccionar "Panel de Supervisión"
2. Ingresar credenciales de supervisor
3. Aprobar o revocar acceso de usuarios al sistema
4. Aprobar o revocar acceso para registro de vehículos
5. Aprobar o revocar vehículos individuales para carga de combustible
6. Ver vehículos de cada usuario y su estado de aprobación
7. Ingresar nuevos usuarios al sistema

### Administradores
1. Seleccionar "Panel de Administración"
2. Ingresar credenciales de administrador
3. Acceder a gestión completa del sistema
4. Gestionar usuarios, vehículos (con fotos), estaciones y registros

## Características de Subida de Fotos

### Validaciones
- **Tipos permitidos**: JPG, PNG, GIF
- **Tamaño máximo**: 5MB por imagen
- **Formato de almacenamiento**: Base64 para persistencia local

### Funcionalidades
- **Preview en tiempo real**: Vista previa antes de guardar
- **Eliminación de fotos**: Remover fotos antes de guardar
- **Validación de archivos**: Verificación automática de tipo y tamaño
- **Mensajes de error**: Feedback claro sobre problemas de subida

## Responsividad

La aplicación está optimizada para:
- **Dispositivos móviles**: Interfaz táctil y diseño adaptativo
- **Tablets**: Aprovechamiento del espacio disponible
- **Escritorio**: Experiencia completa con todas las funcionalidades

## Consideraciones de Seguridad

- **Autenticación dual**: Diferentes niveles de acceso
- **Validación de permisos**: Control estricto por tipo de usuario
- **Validación de archivos**: Verificación de tipos y tamaños de imagen
- **Almacenamiento local**: Los datos se mantienen en el dispositivo
- **Validación cliente**: Verificación de datos en el frontend
- **Sesiones**: Control de acceso basado en autenticación

## Futuras Mejoras

- [ ] Base de datos backend para persistencia
- [ ] API REST para sincronización de datos
- [ ] Encriptación de contraseñas
- [ ] Compresión de imágenes automática
- [ ] Almacenamiento en la nube para fotos
- [ ] Notificaciones push
- [ ] Reportes y análisis avanzados
- [ ] Integración con sistemas externos
- [ ] Modo offline con sincronización
- [ ] Historial de cargas por usuario
- [ ] Edición de vehículos existentes
- [ ] Múltiples fotos por vehículo

## Soporte

Para soporte técnico o consultas sobre la aplicación, contacte al equipo de desarrollo.

## Licencia

Este proyecto está bajo licencia MIT. Consulte el archivo LICENSE para más detalles.

