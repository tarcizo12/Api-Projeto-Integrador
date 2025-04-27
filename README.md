# Api-Projeto-Integrador
Repositório destinado á api do projeto integrador

## Introdução à API

Esta API fornece uma interface para gerenciar e consultar informações de pacientes. O projeto utiliza Node.js com TypeScript e Express para criar endpoints RESTful que permitem a interação com os dados dos pacientes. A API está projetada para ser modular e escalável, facilitando a adição de novos recursos no futuro.

## Comandos para Iniciar o Projeto

### Pré-requisitos

Certifique-se de que o [Node.js](https://nodejs.org/) e o [TypeScript](https://www.typescriptlang.org/) estão instalados no seu sistema.

### Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/tarcizo12/Api-Projeto-Integradorhttps://github.com/tarcizo12/Api-Projeto-Integrador
cd 'Api-Projeto-Integrador'
npm install
```

### Scripts
- **Iniciar a API em modo desenvolvimento** (com reinicialização automática):

  ```bash
  npm start
  ```

## Rotas
- **Rotas que estão disponíveis na API até o momento estarão salvas no colletions do postman** 
  ```Path
    postman\Api-Projeto-Integrador.postman_collection.json
  ```


### Exemplos de Requisições
**Requisição GET: (exemplo)**

```bash
curl -X GET http://localhost:3000/paciente/all
curl -X GET http://localhost:3000/psicologo/all
curl -X GET http://localhost:3000/anotacao/all
curl -X GET http://localhost:3000/atividade/all
```

**Requisição PUT:**

```bash
TODO
```

**Requisição POST:**

```bash
TODO
```

**Requisição DELETE:**

```bash
TODO
```

# Comandos Docker
### Start all services (detached mode)
docker-compose up -d

### Stop and remove containers
docker-compose down

### Rebuild with code changes
docker-compose up -d --build

### Access MySQL CLI
docker exec -it mysql-projeto-integrador mysql -u root -p
Password: root123

### View API logs
docker logs api-projeto-integrador -f

## Observações
- **Ambiente de Desenvolvimento:** Utilize o script `npm run dev` para iniciar o servidor com `nodemon`, que reinicia automaticamente o servidor quando mudanças são detectadas no código.

- **Escruta de MD:** Sempre que houver a criação de um novo endpoint, catalogar no README para posteriormente ser catalogado no swagger. 

- **Configuração:** Certifique-se de que o arquivo `.env` está configurado corretamente para conectar a API ao banco de dados, se aplicável.


