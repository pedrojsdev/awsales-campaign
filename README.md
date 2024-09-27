# Awsales-Campaign

## Descrição
Este é um projeto desenvolvido em Node.js utilizando TypeScript, Prisma ORM, Vitest para testes e Docker para o banco de dados (postgreSQL).

## Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Instalação

1. Clone o repositório para sua máquina local:
    ```bash
    git clone https://github.com/pedrojsdev/awsales-campaign.git
    ```

2. Acesse o diretório do projeto:
    ```bash
    cd awsales-campaign
    ```

3. Instale as dependências:
    ```bash
    npm install
    ```

4. Configure as variáveis de ambiente. Copie o arquivo `.env.example` para `.env` e ajuste as configurações necessárias:
    ```bash
    cp .env.example .env
    ```

## Como rodar o projeto

### Usando Docker

1. Certifique-se de que o Docker está rodando em seu sistema.
   
2. Execute o comando abaixo para iniciar os containers:
    ```bash
    docker-compose up
    ```

3. A aplicação estará disponível em `http://localhost:3000`.

### Rodando localmente sem Docker

1. Execute as migrações do Prisma:
    ```bash
    npx prisma migrate dev
    ```

2. Inicie o servidor:
    ```bash
    npm run dev
    ```

3. A aplicação estará disponível em `http://localhost:3000`.

## Testes

Para rodar os testes, utilize o comando:

```bash
npm run test
```
