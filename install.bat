@echo off
echo 🚀 Instalando dependencias del proyecto Hábitos & Rachas...

REM Instalar dependencias del backend
echo 📦 Instalando dependencias del backend...
cd server
call npm install

REM Instalar dependencias del frontend  
echo 📦 Instalando dependencias del frontend...
cd ../frontend
call npm install

echo ✅ ¡Instalación completada!
echo.
echo 📋 Próximos pasos:
echo 1. Configurar archivos .env en server/ y frontend/
echo 2. Iniciar MongoDB
echo 3. Ejecutar 'npm run dev' en ambas carpetas
echo.
echo 🔗 URLs:
echo    - Frontend: http://localhost:5173
echo    - Backend:  http://localhost:5000

pause
