import { Order } from "../models/order.js";
import { OrderItem } from "../models/orderItem.js";
import { OrderRepository } from "../repository/orderRepository.js";

export class OrderService {

  constructor() {
    this.repo = new OrderRepository();
  }

  // Criar novo pedido
  async create(data) {
    
    // Verifica se já existe um pedido com mesmo ID
    const existingOrder = await this.repo.getOrderById(data.orderId);
    if (existingOrder) {
      throw new Error(`Pedido ${data.orderId} já existe`);
    }

    
    // Verifica se há itens duplicados no mesmo pedido
    const productIds = new Set();
    for (const item of data.items) {
      if (productIds.has(item.productId)) {
        throw new Error(
          `O pedido ${data.orderId} já contém um item com o productId ${item.productId}`
        );
      }
      productIds.add(item.productId);
    }

    
    // Cria objetos internos para manipulação
    const items = data.items.map(i => new OrderItem(i.productId, i.quantity, i.price));
    const order = new Order(data.orderId, data.value, data.creationDate, items);

    // Persiste pedido e itens no banco
    await this.repo.create(order, items);
    return order;
  }


   // Buscar pedido por ID
  async getOrderById(orderId) {
    return await this.repo.getOrderById(orderId);
  }


  // Listar todos os pedidos
  async list() {
    const orders = await this.repo.list();
    const fullOrders = [];

    for (const o of orders) {
      const items = await this.repo.getItemsByOrderId(o.orderId);
      const cleanItems = items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price
      }));
      fullOrders.push({ ...o, items: cleanItems });
    }

    return fullOrders;
  }


  // Atualizar pedido existente
  async update(orderId, data) {

  // Confirma que o pedido existe
  const existing = await this.repo.getOrderById(orderId);
  if (!existing) throw new Error(`O pedido ${orderId} não foi localizado`);

 
  const updatedOrder = {
    orderId: orderId, 
    value: data.value ?? existing.value,
    creationDate: data.creationDate ?? existing.creationDate,
    items: data.items?.map(i => new OrderItem(
      i.productId,
      i.quantity,
      i.price
    )) ?? existing.items.map(i => new OrderItem(i.productId, i.quantity, i.price))
  };

  // Persiste alterações no banco
  await this.repo.update(orderId, updatedOrder, updatedOrder.items);
  return updatedOrder;
}


  // Deletar pedido
  async delete(orderId) {
    const existing = await this.repo.getOrderById(orderId);
    if (!existing) throw new Error(`O pedido ${orderId} não foi localizado`);

    await this.repo.delete(orderId);
  }
}
