# 🔧 Guía de Instalación y Configuración

## 📋 Requisitos Previos

- **Node.js** 18+ instalado
- **MongoDB** (local o MongoDB Atlas)
- **Git** para clonar el repositorio
- **Cuenta GitHub** (para OAuth - opcional)

## 🚀 Instalación Rápida

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/finalProject.git
cd finalProject
```

### 2. Configurar Backend
```bash
cd server
npm install
```

#### Crear archivo .env
```bash
cp .env.example .env
```

#### Configurar variables de entorno en `server/.env`:
```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/habitos
# O usar MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/habitos

# Configuración del servidor
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Sesión (cambiar en producción)
SESSION_SECRET=tu-clave-secreta-muy-larga-y-segura

# IA Google Gemini (opcional)
GEMINI_API_KEY=tu-api-key-de-gemini

# OAuth GitHub (opcional - ver configuración OAuth)
GITHUB_CLIENT_ID=tu-client-id
GITHUB_CLIENT_SECRET=tu-client-secret  
GITHUB_CALLBACK_URL=http://localhost:3001/auth/github/callback
```

### 3. Configurar Frontend
```bash
cd ../frontend
npm install
```

#### Crear archivo .env
```bash
cp .env.example .env
```

#### Configurar variables en `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001
```

### 4. Ejecutar la Aplicación

#### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

#### Terminal 2 - Frontend:
```bash
cd frontend  
npm run dev
```

#### Acceder a la aplicación:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001

## 🔐 Configuración OAuth GitHub (Opcional)

### 1. Crear GitHub App
1. Ve a: https://github.com/settings/applications/new
2. Completa los campos:
   - **Application name**: `Hábitos & Rachas`
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:3001/auth/github/callback`
3. Guarda **Client ID** y **Client Secret**

### 2. Actualizar .env del Backend
```env
GITHUB_CLIENT_ID=tu_client_id_real
GITHUB_CLIENT_SECRET=tu_client_secret_real
GITHUB_CALLBACK_URL=http://localhost:3001/auth/github/callback
```

### 3. Reiniciar el Backend
```bash
# En el terminal del backend
# Ctrl+C para detener
npm run dev
```

## 🗄️ Configuración de Base de Datos

### Opción 1: MongoDB Local
```bash
# Instalar MongoDB localmente
# Windows: descargar desde mongodb.com
# macOS: brew install mongodb/brew/mongodb-community
# Linux: sudo apt install mongodb

# Usar en .env:
MONGODB_URI=mongodb://localhost:27017/habitos
```

### Opción 2: MongoDB Atlas (Recomendado)
1. Crear cuenta en [MongoDB Atlas](https://cloud.mongodb.com)
2. Crear cluster gratuito
3. Configurar acceso de red (whitelist IP)
4. Crear usuario de base de datos
5. Obtener connection string
6. Usar en .env:
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/habitos
```

## 🤖 Configuración Google Gemini IA (Opcional)

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una API key
3. Agrega a `server/.env`:
```env
GEMINI_API_KEY=tu_api_key_aqui
```

> **Nota**: Sin API key, la aplicación usa sugerencias predefinidas.

## ✅ Verificación de Instalación

### Backend Funcionando ✓
- [ ] Terminal muestra: `🚀 API http://localhost:3001`
- [ ] Terminal muestra: `✅ MongoDB conectado`
- [ ] Navegador: http://localhost:3001/api/habits devuelve array

### Frontend Funcionando ✓  
- [ ] Terminal muestra: `Local: http://localhost:5173/`
- [ ] Navegador: http://localhost:5173 carga la aplicación
- [ ] No hay errores en consola del navegador

### OAuth GitHub (si configurado) ✓
- [ ] Terminal backend muestra: `🔐 Configurando GitHub OAuth Strategy...`
- [ ] Botón "Continuar con GitHub" funciona
- [ ] Login redirecciona correctamente

## 🚨 Solución de Problemas

### Error: "OAuth2Strategy requires a clientID option"
**Solución**: Configurar variables GitHub OAuth o usar valores temporales:
```env
GITHUB_CLIENT_ID=temp_client_id_for_dev
GITHUB_CLIENT_SECRET=temp_client_secret_for_dev
```

### Error: "Cannot connect to MongoDB"
**Soluciones**:
1. Verificar que MongoDB esté ejecutándose
2. Revisar connection string en MONGODB_URI
3. Verificar credenciales y whitelist en MongoDB Atlas

### Error: "CORS policy"
**Solución**: Verificar que FRONTEND_URL en backend coincida con URL del frontend

### Puerto ya en uso
**Solución**: 
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux  
lsof -ti:3001 | xargs kill -9
```

### Frontend no conecta con Backend
**Verificar**:
1. VITE_API_URL en frontend/.env
2. FRONTEND_URL en server/.env  
3. Ambos servidores ejecutándose
4. Puertos correctos (3001 backend, 5173 frontend)

## 📦 Scripts Disponibles

### Backend (`server/`)
```bash
npm run dev          # Modo desarrollo con nodemon
npm start           # Modo producción
npm run build       # (si hay build step)
```

### Frontend (`frontend/`)
```bash
npm run dev         # Servidor desarrollo Vite
npm run build       # Build para producción
npm run preview     # Preview del build
```

## 🎯 Próximos Pasos

1. **Desarrollo Local**: ✅ Aplicación funcionando
2. **OAuth GitHub**: Configurar para autenticación real
3. **Deployment**: Seguir [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Personalización**: Modificar estilos, agregar features

## 💡 Tips de Desarrollo

- **Hot Reload**: Ambos servidores se recargan automáticamente
- **Debug**: Usar `console.log()` en backend, Dev Tools en frontend
- **Base de datos**: Usar MongoDB Compass para visualizar datos
- **API Testing**: Usar Postman o Thunder Client para probar endpoints

---

🎉 **¡Aplicación configurada exitosamente!**

Para deployment en producción, ver [DEPLOYMENT.md](./DEPLOYMENT.md)
