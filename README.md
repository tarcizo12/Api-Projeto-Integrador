```markdown
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
  npm run dev
  ```

- **Iniciar a API** (executa o código TypeScript diretamente):

  ```bash
  npm start
  ```

- **Compilar o código TypeScript para JavaScript**:

  ```bash
  npm run build
  ```

## Rotas

Rotas que estão disponíveis na API até o momento:
### `/psicologo/all`

- **Método:** `GET`
- **Descrição:** Retorna todos os usuários psicologo.
- **Resposta:** `200 OK` com a lista de usuários psicologo.

### Exemplos de Requisições

**Requisiçãoções GET:**

```bash
curl -X GET http://localhost:3000/paciente/all
curl -X GET http://localhost:3000/psicologo/all
curl -X GET http://localhost:3000/anotacao/all
curl -X GET http://localhost:3000/atividade/all
```

**Requisiçãoções PUT:**

```bash
TODO
```

**Requisiçãoções POST:**

```bash
TODO
```

**Requisiçãoções DELETE:**

```bash
TODO
```

**Respostas previstas:**

```json
{
  "mensagem": "Esses são todos os usuários pacientes: ... TODO"
}
```

## Observações

- **Ambiente de Desenvolvimento:** Utilize o script `npm run dev` para iniciar o servidor com `nodemon`, que reinicia automaticamente o servidor quando mudanças são detectadas no código.
- **Ambiente de Produção:** Para compilar o código e executar a versão compilada, utilize o script `npm run build` seguido de `npm start`.
- **Configuração:** Certifique-se de que o arquivo `.env` está configurado corretamente para conectar a API ao banco de dados, se aplicável.
- **Contribuições:** Sinta-se à vontade para enviar pull requests e sugestões. Para relatar problemas ou pedir recursos, abra uma issue no 
repositório.

```
