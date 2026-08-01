#!/bin/bash
set -euo pipefail

echo "🚀 Configurando ambiente local (Docker Compose)..."

if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker não está rodando. Inicie o Docker Desktop e tente novamente."
  exit 1
fi

if [ ! -f .env ]; then
  echo "📄 Criando .env a partir de .env.example..."
  cp .env.example .env
fi

echo "🔄 Parando containers existentes..."
docker compose down

echo "🔨 Construindo e iniciando MySQL + API + Frontend..."
docker compose up --build -d

echo "⏳ Aguardando healthcheck da API..."
for i in {1..36}; do
  if curl -fsS http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ API saudável"
    break
  fi
  sleep 5
  if [ "$i" -eq 36 ]; then
    echo "⚠️  API ainda não respondeu. Veja: docker compose logs -f api"
  fi
done

docker compose ps

echo ""
echo "✅ Ambiente local no ar"
echo "   - API:       http://localhost:3000"
echo "   - Health:    http://localhost:3000/health"
echo "   - Frontend:  http://localhost:8081"
echo "   - MySQL:     localhost:3306"
echo ""
echo "Seed:"
echo "   Psicólogo  joao.silva@exemplo.com / 123456"
echo "   Paciente   carlos.souza@exemplo.com / 1234"
echo ""
echo "Logs: docker compose logs -f"
echo "Parar: docker compose down"
