#!/data/data/com.termux/files/usr/bin/bash

# Script para arreglar errores de descarga en Termux y configurar Node.js correctamente
# Por: ChatGPT para usuario DOG TV ;)

clear
echo "🔧 Reparando mirrors y configurando entorno..."

# Paso 1: Cambiar mirror a uno confiable
echo "➡️ Configurando mirror oficial de Termux"
echo "deb https://packages.termux.dev/apt/termux-main stable main" > $PREFIX/etc/apt/sources.list

# Paso 2: Actualizar paquetes
apt update && apt upgrade -y

# Paso 3: Limpiar basura anterior
apt clean && apt autoclean

# Paso 4: Instalar Node.js LTS desde Termux
pkg install -y nodejs-lts

# Paso 5: Verificar instalación
echo "📦 Verificando instalación de Node.js y npm"
node -v
npm -v

# Extra: Instalar utilidades útiles (opcional)
# pkg install -y git nano curl unzip

echo "✅ Listo. Ya puedes usar Node.js y NPM sin errores!"
