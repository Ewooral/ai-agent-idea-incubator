#!/bin/bash

# 🚀 Deployment Script for Idea Incubator using PNPM + PM2

# 🔧 Load Node.js environment from NVM
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use --lts

# 📂 Pull latest code
echo "🔁 Pulling latest changes from GitHub..."
# Discard any local changes on the server and reset to match the remote branch
git reset --hard origin/master
git pull origin master

# 📦 Install dependencies using PNPM
echo "📦 Installing dependencies with pnpm..."
pnpm install

# 🛠️ Build the app
echo "🔨 Building the project with pnpm..."
pnpm build

# 🚦 Start or restart the app with PM2
APP_NAME="idea-incubator"
echo "🚦 Restarting or starting the app: '$APP_NAME'..."
pm2 restart "$APP_NAME" || pm2 start "pnpm" --name "$APP_NAME" -- start

# 💾 Save the PM2 process list for startup
echo "💾 Saving PM2 process list..."
pm2 save

# ✅ Done
echo ""
echo "✅ Deployment complete! Your app should now be live at https://ewooral.com"
echo "📈 Managed by PM2 under process name: $APP_NAME"