# 🎯 Hábitos & Rachas

Una aplicación web completa para crear, seguir y mantener hábitos saludables usando el método de "rachas" para motivación. Incluye autenticación OAuth, estadísticas detalladas y sugerencias de IA.

## ✨ Características

- 🔐 **Autenticación GitHub OAuth** - Login seguro con tu cuenta GitHub
- 📊 **Estadísticas Detalladas** - Tracking de rachas, porcentajes de éxito y progreso
- 🤖 **Sugerencias de IA** - Powered by Google Gemini para recomendaciones personalizadas
- 📱 **Responsive Design** - Funciona perfectamente en móvil y desktop
- ⚡ **Real-time Updates** - Sincronización instantánea de datos
- 🎨 **UI Moderna** - Interfaz intuitiva y atractiva

## 🚀 Demo en Vivo

- **Frontend**: https://final-project-rho-gilt-10.vercel.app/ 
- **API**:

## 🛠️ Stack Tecnológico

### Frontend

- **React 18** con Vite
- **CSS moderno** con variables y gradientes
- **Hooks personalizados** para manejo de estado

### Backend

- **Node.js** con Express
- **MongoDB** con Mongoose
- **Google Gemini AI** para sugerencias
- **Middleware personalizado** para validaciones

## 📁 Estructura del Proyecto

```
finalProject/
├── frontend/           # Aplicación React
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── hooks/      # Custom hooks
│   │   ├── pages/      # Páginas de la aplicación
│   │   └── main.jsx    # Punto de entrada
│   └── package.json
├── server/             # API REST con Express
│   ├── src/
│   │   ├── models/     # Modelos de MongoDB
│   │   ├── routes/     # Rutas de la API
│   │   ├── services/   # Servicios (IA, estadísticas)
│   │   └── middleware/ # Middleware personalizado
│   └── package.json
└── README.md
```

## 🚀 Instalación y Configuración

### Prerequisitos

- Node.js 18+
- MongoDB (local o Atlas)
- API Key de Google Gemini (opcional)

### 1. Clonar el repositorio

```bash
git clone https://github.com/gabrielariver/finalProject.git
cd finalProject
```

### 2. Configurar el Backend

```bash
cd server
npm install
```

Crear archivo `.env` basado en `.env.example`:

```env
MONGODB_URI=mongodb://localhost:27017/habitos-app
FRONTEND_URL=http://localhost:5173
PORT=5000
GEMINI_API_KEY=tu_api_key_aqui
```

Iniciar el servidor:

```bash
npm run dev
```

### 3. Configurar el Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:3001
```

Iniciar la aplicación:

```bash
npm run dev
```

## 📊 API Endpoints

### Hábitos

- `GET /api/habits` - Obtener todos los hábitos con estadísticas
- `POST /api/habits` - Crear nuevo hábito
- `PUT /api/habits/:id` - Actualizar hábito
- `DELETE /api/habits/:id` - Eliminar hábito
- `GET /api/habits/stats` - Estadísticas generales

### Check-ins

- `POST /api/checkins/today` - Toggle check-in de hoy
- `GET /api/checkins/today` - Obtener check-ins de hoy
- `GET /api/checkins/habit/:id` - Historial de un hábito
- `GET /api/checkins/stats/weekly` - Estadísticas semanales

### IA (Sugerencias)

- `POST /api/ai/suggest` - Generar sugerencias de hábitos
- `POST /api/ai/explain` - Explicar beneficios de un hábito

## 🎨 Características de la UI

### Dashboard Principal

- **Estadísticas en tiempo real**: Total de hábitos, rachas activas, cumplimiento promedio
- **Grid de hábitos**: Vista de tarjetas con información y acciones
- **Check-in rápido**: Botón para marcar/desmarcar completado

### Gestión de Hábitos

- **Modal de creación**: Nombre, color personalizado, emoji
- **Edición inline**: Modificar hábitos existentes
- **Eliminación segura**: Confirmación antes de eliminar

### Sugerencias con IA

- **Perfil personalizado**: Edad, intereses, objetivos
- **Sugerencias contextuales**: Basadas en hábitos actuales
- **Categorización**: Salud, productividad, bienestar, aprendizaje

## 🔧 Desarrollo

### Scripts Disponibles

**Backend:**

```bash
npm run dev    # Desarrollo con nodemon
npm start      # Producción
```

**Frontend:**

```bash
npm run dev    # Servidor de desarrollo
npm run build  # Build para producción
npm run preview # Preview del build
```

### Estructura de Datos

**Hábito:**

```javascript
{
  _id: ObjectId,
  clientId: String,
  name: String,
  color: String,
  emoji: String,
  createdAt: Date,
  stats: {
    currentStreak: Number,
    bestStreak: Number,
    completionRate: Number
  }
}
```

**Check-in:**

```javascript
{
  _id: ObjectId,
  clientId: String,
  habitId: ObjectId,
  day: String, // YYYY-MM-DD
  createdAt: Date
}
```

## 🚀 Deployment

### Variables de Entorno para Producción

**Backend (.env):**

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/habitos
FRONTEND_URL=https://tu-app.vercel.app
GEMINI_API_KEY=tu_api_key_production
PORT=5000
```

**Frontend (.env):**

```env
VITE_API_URL=https://tu-api.render.com
```

### Plataformas Recomendadas

- **Frontend**: Vercel, Netlify
- **Backend**: Render, Railway, Heroku
- **Base de datos**: MongoDB Atlas

## 🔒 Seguridad

- **Validación de entrada**: Sanitización de datos en todas las rutas
- **Límites de rate**: Protección contra spam
- **Validación de ObjectIds**: Prevención de inyección
- **CORS configurado**: Solo orígenes permitidos
- **Manejo de errores**: No exposición de información sensible

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📋 Roadmap

### Sprint 1 ✅

- [x] Configuración y arquitectura base
- [x] CRUD de hábitos
- [x] Check-ins diarios
- [x] UI inicial

### Sprint 2 ✅

- [x] Estadísticas y métricas
- [x] Edición y eliminación de hábitos
- [x] Dashboard mejorado
- [x] Validaciones robustas

### Sprint 3 ✅

- [x] Integración con Gemini AI
- [x] Sugerencias personalizadas
- [x] Manejo de errores mejorado
- [x] Documentación completa

### Futuras Mejoras 🚧

- [ ] Autenticación OAuth con GitHub
- [ ] Notificaciones push
- [ ] Exportar datos
- [ ] Temas personalizables
- [ ] Gamificación (puntos, logros)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

**Grupo K:**

- Gabriela Rivera
- Mario Ramírez
- Cecilia Tomala
- Fernando Benavides

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
