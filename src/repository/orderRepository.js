import db from "../../database/db.js";

export class OrderRepository {

   // Criar pedido no banco de dados
  async create(order, items) {

    // Insere na tabela "order"
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO "order" (orderId, value, creationDate) VALUES (?, ?, ?)`,
        [order.orderId, order.value, order.creationDate],
        (err) => (err ? reject(err) : resolve())
      );
    });

    // Insere os itens do pedido
    for (const item of items) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO "items" (orderId, productId, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [order.orderId, item.productId, item.quantity, item.price],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }
  }


  // Buscar pedido por ID (incluindo itens)
  async getOrderById(orderId) {
    const order = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM "order" WHERE orderId = ?`,
        [orderId],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });

    if (!order) return null;

    const items = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM "items" WHERE orderId = ?`,
        [orderId],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    return { ...order, items };
  }


   // Buscar itens de um pedido
  async getItemsByOrderId(orderId) {
    return await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM "items" WHERE orderId = ?`,
        [orderId],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });
  }


  // Listar todos os pedidos
  async list() {
    return await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM "order"`, [], (err, rows) =>
        err ? reject(err) : resolve(rows)
      );
    });
  }


   // Atualizar pedido
  async update(orderId, order, items) {

    // Atualiza os dados do pedido
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE "order" SET value = ?, creationDate = ? WHERE orderId = ?`,
        [order.value, order.creationDate, orderId],
        (err) => (err ? reject(err) : resolve())
      );
    });

    // Remove itens antigos para atualizar os novos
    await new Promise((resolve, reject) => {
      db.run(`DELETE FROM "items" WHERE orderId = ?`, [orderId], (err) =>
        err ? reject(err) : resolve()
      );
    });

     // Insere novamente os itens atualizados
    for (const item of items) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO "items" (orderId, productId, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [orderId, item.productId, item.quantity, item.price],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }
  }


   // Deletar pedido
  async delete(orderId) {

    // Deleta itens primeiro para manter integridade referencial
    await new Promise((resolve, reject) => {
      db.run(`DELETE FROM "items" WHERE orderId = ?`, [orderId], (err) =>
        err ? reject(err) : resolve()
      );
    });

    // Deleta pedido
    await new Promise((resolve, reject) => {
      db.run(`DELETE FROM "order" WHERE orderId = ?`, [orderId], (err) =>
        err ? reject(err) : resolve()
      );
    });
  }
}
