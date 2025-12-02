import sqlite3 from "sqlite3";
sqlite3.verbose(); // ativa mensagens de log detalhadas para debugging

// Cria/abre o banco de dados local
const db = new sqlite3.Database("./database.db");

// serialize garante que os comandos SQL sejam executados em sequência
db.serialize(() => {
  // Criação da tabela "order" (pedido)
  // Campos: orderId (PK), value (valor total do pedido), creationDate (data de criação)
  db.run(`
    CREATE TABLE IF NOT EXISTS "order" (
      orderId TEXT PRIMARY KEY,
      value REAL,
      creationDate TEXT
    );
  `);

  // Criação da tabela "items" (itens do pedido)
  // Cada item está ligado a um pedido via orderId (FK)
  // productId é a identificação do produto, quantity e price representam quantidade e preço
  // PK composta: orderId + productId evita duplicidade de itens por pedido
  db.run(`
    CREATE TABLE IF NOT EXISTS "items" (
      orderId TEXT,
      productId INTEGER,
      quantity INTEGER,
      price REAL,
      PRIMARY KEY (orderId, productId),
      FOREIGN KEY (orderId) REFERENCES "order"(orderId)
    );
  `);
});

// Exporta a conexão para ser usada nos Repositories
export default db;
