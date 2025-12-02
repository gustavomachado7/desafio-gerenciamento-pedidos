// Controller responsável por receber requisições e enviar respostas
import { OrderService } from "../services/orderService.js";

const service = new OrderService();

export class OrderController {

  // Criar um novo pedido
  static async create(req, res) {
  try {
    // Valida se todos os campos obrigatórios estão presentes
    const error = validateOrder(req.body);
    if (error) return res.status(400).json({ error });

    // Mapeia o body recebido para o formato interno do sistema
    const mapped = mapRequest(req.body);

    // Chama o service para criar o pedido
    const result = await service.create(mapped);

    res.status(201).json(result); // Retorna o pedido criado
    
  } catch (err) {
    // Trata erros de pedido duplicado
    if (err.message.includes("já existe")) {
      return res.status(400).json({ error: err.message });
    }

    // Trata erro de item duplicado no mesmo pedido
    if (err.message.includes("já contém um item")) {
      return res.status(400).json({ error: err.message });
    }

    // Erros inesperados
    res.status(500).json({ error: err.message });
  }
}


    // Buscar pedido por número
  static async getOrderById(req, res) {
    try {
      const { numeroPedido } = req.params;

      // Busca pedido completo (incluindo items) no service
      const order = await service.getOrderById(numeroPedido);
      if (!order) return res.status(404).json({ error: `O pedido ${numeroPedido} não foi localizado` });
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }


  // Listar todos os pedidos
  static async list(req, res) {
    try {
      const orders = await service.list();
      if (!orders || orders.length === 0) {
        return res.status(404).json({ error: "Não há nenhum pedido cadastrado" });
      }
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }


   // Atualizar pedido
  static async update(req, res) {
    try {
      const { numeroPedido } = req.params;
      const error = validateOrder(req.body, true, numeroPedido);
      if (error) return res.status(400).json({ error });

      // Mapeia body para formato interno, garantindo que numeroPedido da URL seja respeitado
      const mapped = mapRequest(req.body, numeroPedido);

      // Chama o service para atualizar o pedido
      const result = await service.update(numeroPedido, mapped);
      
      res.status(200).json({
        message: `Pedido ${numeroPedido} atualizado com sucesso`,
        order: result
      });
    } catch (err) {
      if (err.message.includes("não foi localizado")) {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  }


   // Deletar pedido
  static async delete(req, res) {
  try {
    const { numeroPedido } = req.params;

     // Chama service para deletar o pedido
    await service.delete(numeroPedido);
    
    res.status(200).json({
      message: `Pedido ${numeroPedido} deletado com sucesso`
    });
  } catch (err) {
    if (err.message.includes("não foi localizado")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
}
}


// Função auxiliar para mapear JSON do cliente para formato interno 
function mapRequest(body, forcedId) {
  return {
    orderId: forcedId ?? body.numeroPedido,
    value: body.valorTotal,
    creationDate: body.dataCriacao,
    items: body.items.map(i => ({
      productId: i.idItem,
      quantity: i.quantidadeItem,
      price: i.valorItem
    }))
  };
}


// Validação do pedido recebido
function validateOrder(body, isUpdate = false, numeroPedidoUrl = null) {
  if (!body) return "Body do pedido está vazio";

  if (!isUpdate && !body.numeroPedido) return "numeroPedido é obrigatório";

  if (isUpdate && body.numeroPedido && body.numeroPedido !== numeroPedidoUrl) {
    return "Não é possível alterar o ID do pedido";
  }

  if (!body.valorTotal) return "valorTotal é obrigatório";
  if (!body.dataCriacao) return "dataCriacao é obrigatória";
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return "items deve ser um array com pelo menos 1 item";
  }

  for (const [index, item] of body.items.entries()) {
    if (item.idItem === undefined) return `idItem do item ${index + 1} é obrigatório`;
    if (item.quantidadeItem === undefined) return `quantidadeItem do item ${index + 1} é obrigatório`;
    if (item.valorItem === undefined) return `valorItem do item ${index + 1} é obrigatório`;
  }

  return null; // Tudo ok
}


