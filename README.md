# Projeto - APIs de Gerenciamento de Pedidos


## Tecnologias Utilizadas
- **Node.js** → Ambiente de execução JavaScript no servidor.
- **Express** → Framework web para criação de APIs RESTful.
- **SQLite** → Banco de dados relacional leve, armazenado localmente (`database.db`).
- **JavaScript ES6+** → Sintaxe moderna para desenvolvimento do backend.
- **Nodemon** → Ferramenta para reiniciar automaticamente o servidor durante o desenvolvimento.
- **Postman** → Testes manuais dos endpoints da API.

---


**Observações sobre o banco de dados:**  
- Foi utilizado **SQLite** local (`database.db`) para persistência de dados.  
- Arquivo do banco está incluído no `.gitignore` (`*.db`) para que outros possam rodar a aplicação sem conflitos.  
- Não foi usado MongoDB, Oracle ou PostgreSQL, mas todos os endpoints funcionais foram implementados.  
- Arquivo `node_modules/` também está no `.gitignore`.  

---


## Observações adicionais
- O JSON recebido no body das requisições é mapeado para o formato interno da aplicação usando a função `mapRequest`.
- Conforme exemplo do PDF, cada item do pedido tem o `idItem` convertido de string para número (`integer`) para garantir consistência no banco de dados.
- `items` dentro de cada pedido não repetem o `productId`, evitando duplicidade de itens no mesmo pedido.
- Mensagens de erro são claras, incluindo quando um item duplicado ou pedido já existe.
- Estrutura separada entre **Controller → Service → Repository** garante boa manutenção e escalabilidade.
- Todos os endpoints foram testados via **Postman**.

---


## Estrutura do Projeto
- **Controller**: Responsável por receber a requisição, validar os dados e chamar o Service.
- **Service**: Contém a lógica de negócio, manipula dados e chama o Repository.
- **Repository**: Responsável por acessar o banco de dados (SQLite) e executar queries.
- **Models**: Contêm as classes `Order` e `OrderItem` para padronizar os objetos da aplicação.

---


## Funcionalidades implementadas
- Funcionalidade completa dos requisitos mínimos.  
- Código bem organizado e comentado.  
- Convenções de nomenclatura seguidas corretamente.  
- Tratamento de erros robusto com mensagens compreensíveis.  
- Uso correto dos códigos HTTP para cada operação.  
- Mensagens de sucesso claras para `create`, `update` e `delete`.  

---


## Como rodar localmente
1. Clonar o repositório.
2. Instalar dependências e rodar o servidor:
```bash
npm install
npm run dev
```
3. Testar endpoints pelo Postman ou outro cliente HTTP.

---


## Endpoints do Projeto
### Criar pedido
- **URL:** `POST /order`
- **Body JSON esperado:**
```json
{
  "numeroPedido": "123",
  "valorTotal": 150,
  "dataCriacao": "2025-12-01",
  "items": [
    { "idItem": "1", "quantidadeItem": 32, "valorItem": 28 },
    { "idItem": "2", "quantidadeItem": 98, "valorItem": 39 }
  ]
}
```
- **Respostas:**
  - `201 Created` → Pedido criado com sucesso.
  - `400 Bad Request` → Campos obrigatórios ausentes ou item/pedido duplicado.
  - `500 Internal Server Error` → Erro inesperado.

---


### Listar pedidos
- **URL:** `GET /order/list`
- **Respostas:**
  - `200 OK` → Retorna array com todos os pedidos.
  - `404 Not Found` → Não há pedidos cadastrados.
  - `500 Internal Server Error` → Erro inesperado.

---


### Buscar pedido por ID
- **URL:** `GET /order/:numeroPedido`
- **Exemplo:** `/order/123`
- **Respostas:**
  - `200 OK` → Retorna o pedido completo, incluindo items.
  - `404 Not Found` → Pedido não encontrado.
  - `500 Internal Server Error` → Erro inesperado.

---


### Atualizar pedido
- **URL:** `PUT /order/:numeroPedido`
- **Body JSON esperado:**
```json
{
  "valorTotal": 500,
  "dataCriacao": "2025-12-01",
  "items": [
    { "idItem": "1", "quantidadeItem": 70, "valorItem": 50 },
    { "idItem": "2", "quantidadeItem": 55, "valorItem": 43 }
  ]
}
```
- **Respostas:**
  - `200 OK` → Pedido atualizado com sucesso.
  - `400 Bad Request` → Tentativa de alterar numeroPedido ou body inválido.
  - `404 Not Found` → Pedido da URL não encontrado.
  - `500 Internal Server Error` → Erro inesperado.


## Deletar pedido
- **URL:** `DELETE /order/:numeroPedido`
- **Respostas:**
- `200 OK` → Pedido deletado com sucesso.  
- `404 Not Found` → Pedido não encontrado.  
- `500 Internal Server Error` → Erro inesperado.

