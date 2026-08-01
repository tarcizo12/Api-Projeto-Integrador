# Setup local com Docker

## Subir o stack completo (MySQL + API + Frontend web)

Na pasta da API:

```bash
cp .env.example .env
./setup-local.sh
# ou:
docker compose up --build
```

| Serviço | URL |
|---------|-----|
| API | http://localhost:3000 |
| Health | http://localhost:3000/health |
| Frontend (Expo web) | http://localhost:8081 |
| MySQL | localhost:3306 |

## Usuários de seed

| Perfil | Email | Senha |
|--------|-------|-------|
| Psicólogo | joao.silva@exemplo.com | 123456 |
| Paciente | carlos.souza@exemplo.com | 1234 |
| Paciente | ana.lima@exemplo.com | 1234 |

## Auth (boas práticas)

- Login/cadastro retornam JWT em `data.token`
- Rotas protegidas exigem `Authorization: Bearer <token>`
- Senhas com bcrypt (seed faz upgrade automático no boot)
- Respostas de usuário **não** incluem o campo `senha`
- Helmet + CORS configuráveis via env

## Comandos úteis

```bash
docker compose logs -f
docker compose logs -f api
docker compose down          # para tudo
docker compose down -v       # para e apaga volumes (reset do banco)
```

## Frontend nativo fora do Docker

```bash
cd ../Frontend-Projeto-Integrador
cp .env.example .env
npx expo start
```

- Web / iOS simulator: `EXPO_PUBLIC_API_URL=http://localhost:3000`
- Emulador Android: `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`
