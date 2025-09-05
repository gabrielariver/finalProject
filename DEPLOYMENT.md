# 🚀 Guía de Deployment - Hábitos & Rachas

## 📋 Preparativos

### 1. Crear GitHub App para Producción
1. Ve a: https://github.com/settings/applications/new
2. Configuración:
   - **Application name**: `Hábitos & Rachas Production`
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**: `https://your-api.render.com/auth/github/callback`
3. Guarda el **Client ID** y **Client Secret**

### 2. Preparar MongoDB Atlas
1. Crea un cluster en [MongoDB Atlas](https://cloud.mongodb.com)
2. Configura acceso de red (0.0.0.0/0 para desarrollo)
3. Crea usuario de base de datos
4. Obtén la connection string

## 🔧 Backend Deployment (Render.com)

### Paso 1: Preparar el Repositorio
```bash
git add .
git commit -m "Deploy: Add OAuth and production config"
git push origin main
```

### Paso 2: Configurar en Render
1. Ve a [render.com](https://render.com) y conecta tu GitHub
2. Crea nuevo **Web Service**
3. Conecta tu repositorio `finalProject`
4. Configuración:
   - **Name**: `habitos-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Paso 3: Variables de Entorno en Render
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habitos
FRONTEND_URL=https://habitos-app.vercel.app
GITHUB_CLIENT_ID=your_production_client_id
GITHUB_CLIENT_SECRET=your_production_client_secret
GITHUB_CALLBACK_URL=https://habitos-backend.render.com/auth/github/callback
GEMINI_API_KEY=your_gemini_api_key
SESSION_SECRET=super-secure-random-string
```

## 🌐 Frontend Deployment (Vercel)

### Paso 1: Configurar Variables de Entorno
Crea `.env.production` en `/frontend`:
```
VITE_API_URL=https://habitos-backend.render.com
```

### Paso 2: Deploy a Vercel
```bash
cd frontend
npm install -g vercel
vercel --prod
```

O conecta tu GitHub repo directamente en [vercel.com](https://vercel.com)

## 🔄 Proceso Completo de Deployment

### 1. Backend primero (Render)
```bash
# 1. Commitear cambios
git add .
git commit -m "Production ready"
git push

# 2. Deploy en Render.com
# - Crear Web Service
# - Configurar variables de entorno
# - Deploy automático
```

### 2. Frontend después (Vercel)
```bash
# 1. Actualizar API URL en .env
VITE_API_URL=https://tu-backend.render.com

# 2. Deploy
cd frontend
vercel --prod
```

### 3. Actualizar GitHub App
- Cambiar callback URL a tu dominio de producción
- Actualizar Homepage URL

## ✅ Verificación Post-Deployment

### Backend
- [ ] API responde en `https://your-backend.render.com`
- [ ] MongoDB conectado
- [ ] Variables de entorno cargadas
- [ ] OAuth GitHub funciona

### Frontend
- [ ] App carga en `https://your-app.vercel.app`
- [ ] Conecta con backend
- [ ] Login con GitHub funciona
- [ ] Todas las funcionalidades operativas

## 🔧 Comandos Útiles

### Logs del Backend
```bash
# En Render dashboard, ver logs en tiempo real
```

### Build Local para Testing
```bash
# Backend
cd server
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## 🚨 Troubleshooting

### Error CORS
- Verificar `FRONTEND_URL` en backend
- Agregar dominio correcto en CORS config

### OAuth no funciona
- Verificar callback URL en GitHub App
- Confirmar variables GITHUB_CLIENT_ID y SECRET

### Base de datos no conecta
- Verificar connection string MongoDB
- Confirmar whitelist IP en MongoDB Atlas

## 📊 URLs Finales

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.render.com
- **OAuth Login**: https://your-backend.render.com/auth/github

## 🎉 ¡Deployment Completado!

Tu aplicación está lista para producción con:
- ✅ Autenticación OAuth GitHub
- ✅ Base de datos MongoDB Atlas
- ✅ API deployada en Render
- ✅ Frontend deployado en Vercel
- ✅ SSL/HTTPS habilitado
- ✅ Variables de entorno seguras
