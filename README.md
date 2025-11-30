# Sistema de Gestión de Mantenimiento para Máquinas Bancarias

Una aplicación completa para la gestión integral del mantenimiento de máquinas bancarias (cajeros automáticos, contadoras de billetes, recicladoras, etc.) con funcionalidades avanzadas de Industria 4.0.

## 🚀 Características Principales

### 📊 Dashboard y Estadísticas
- Panel principal con métricas clave en tiempo real
- Gráficos interactivos de mantenimientos, costos y rendimiento
- Alertas automáticas de stock bajo y mantenimientos pendientes
- Vista general del estado de todas las máquinas

### 🔧 Gestión de Inventario
- **Máquinas**: Registro completo con ubicación, estado y historial
- **Técnicos**: Gestión de especialidades, disponibilidad y asignaciones
- **Repuestos**: Control de stock con alertas automáticas
- **Mantenimientos**: Planificación preventiva y correctiva

### 📅 Calendario Visual
- Vista mensual/semanal/diaria de mantenimientos
- Drag & drop para reprogramar fechas
- Códigos de colores por tipo (preventivo/correctivo)
- Filtros por técnico y máquina

### 🎫 Sistema de Tickets
- Reporte de incidencias urgentes
- Workflow completo: abierto → asignado → en progreso → resuelto
- Priorización automática por criticidad
- Seguimiento de resolución

### 📋 Plantillas de Mantenimiento
- Recetas reutilizables para mantenimientos estándar
- Checklists paso a paso
- Repuestos requeridos predefinidos
- Tiempos estimados de ejecución

### 📊 Reportes Profesionales
- Generación de reportes en PDF y Excel
- Historial de mantenimientos por máquina/técnico
- Análisis de costos y rendimiento
- Cumplimiento normativo

## 🏭 Funcionalidades Avanzadas (Industria 4.0)

### 🔗 Monitoreo IoT
- Sensores en tiempo real (temperatura, vibraciones, consumo)
- Alertas automáticas antes de fallos
- Historial de datos para análisis predictivo

### 🎤 Control por Voz
- Comandos en español: "mostrar mantenimientos de hoy"
- Navegación hands-free para técnicos
- Integración con dispositivos móviles

### ⛓️ Trazabilidad Blockchain
- Registros inmutables de mantenimientos realizados
- Certificados digitales de cumplimiento
- Auditoría completa y verificable

### 🤖 Realidad Aumentada
- Guías 3D superpuestas en máquinas reales
- Instrucciones visuales paso a paso
- Soporte para gafas AR y tablets

### 🔗 Integración ERP
- Conexión con SAP, Oracle y otros sistemas
- Sincronización automática de datos
- Flujo bidireccional de información

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con **Express.js**
- **Sequelize ORM** con **SQLite/PostgreSQL**
- **JWT** para autenticación
- **bcrypt** para encriptación de contraseñas
- **express-validator** para validación
- **helmet** y **CORS** para seguridad

### Frontend
- **React 18** con **Vite**
- **Material-UI (MUI)** para componentes
- **React Router** para navegación
- **Chart.js** para gráficos
- **React Big Calendar** para calendario
- **Axios** para llamadas API
- **JWT Decode** para tokens

### Base de Datos
- **SQLite** para desarrollo
- **PostgreSQL** para producción
- **13 tablas** con relaciones complejas
- **Migraciones** automatizadas

## 📁 Estructura del Proyecto

```
sgm-bancario/
├── backend/                 # API REST
│   ├── controllers/         # Lógica de negocio
│   ├── models/             # Modelos de datos
│   ├── routes/             # Definición de rutas
│   ├── migrations/         # Migraciones de BD
│   ├── seeders/            # Datos iniciales
│   ├── middleware/         # Middlewares personalizados
│   ├── config/             # Configuración de BD
│   └── app.js              # Aplicación principal
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── services/       # Servicios API
│   │   ├── context/        # Contextos React
│   │   ├── utils/          # Utilidades
│   │   └── App.jsx         # Aplicación principal
│   └── package.json
├── diseno-arquitectura.md   # Documentación técnica
├── README.md               # Este archivo
└── .gitignore
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Git

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/sgm-bancario.git
   cd sgm-bancario
   ```

2. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   ```

3. **Instalar dependencias del frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configurar base de datos**
   ```bash
   cd ../backend
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

5. **Iniciar servidores**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Acceder a la aplicación**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Credenciales por Defecto
- **Email:** admin@mantto.com
- **Contraseña:** admin123

## 📖 Uso de la Aplicación

### Primeros Pasos
1. Inicia sesión con las credenciales de administrador
2. Explora el dashboard para ver métricas generales
3. Registra tus primeras máquinas en "Máquinas"
4. Agrega técnicos en "Técnicos"
5. Crea mantenimientos preventivos en "Mantenimientos"
6. Revisa el calendario para planificar trabajos

### Funcionalidades Clave
- **Dashboard**: Vista general del estado del sistema
- **Máquinas**: Inventario completo con estados y ubicaciones
- **Técnicos**: Gestión de personal y especialidades
- **Mantenimientos**: Planificación y seguimiento de trabajos
- **Calendario**: Vista visual de todos los mantenimientos
- **Reportes**: Generación de informes profesionales

## 🔧 Configuración Avanzada

### Variables de Entorno
Crear archivo `.env` en la carpeta `backend/`:

```env
DATABASE_URL=sqlite://./database.sqlite
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
PORT=5000
NODE_ENV=development
```

### Base de Datos PostgreSQL
Para producción, cambiar la configuración en `backend/config/database.js`:

```javascript
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Email: soporte@sgm-bancario.com

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] App móvil para técnicos
- [ ] IA predictiva de fallos
- [ ] Integración con WhatsApp para alertas
- [ ] Módulo de capacitación AR
- [ ] API pública para integraciones
- [ ] Multi-tenancy para múltiples bancos

---

**Desarrollado con ❤️ para la optimización del mantenimiento bancario**