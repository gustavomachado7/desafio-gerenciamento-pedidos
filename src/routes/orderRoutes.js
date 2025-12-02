import { Router } from "express";
import { OrderController } from "../controllers/orderController.js";

const router = Router();

// Criar um novo pedido
// Recebe JSON no body com numeroPedido, valorTotal, dataCriacao e items
router.post("/", OrderController.create);


// Listar todos os pedidos
// Retorna array com todos os pedidos cadastrados
router.get("/list", OrderController.list);


// Buscar um pedido específico pelo numeroPedido
// numeroPedido é passado como parâmetro na URL
router.get("/:numeroPedido", OrderController.getOrderById);


// Atualizar um pedido existente
// numeroPedido na URL indica qual pedido atualizar
// Body JSON deve conter os campos a atualizar (valorTotal, dataCriacao, items)
router.put("/:numeroPedido", OrderController.update);


// Deletar um pedido
// numeroPedido na URL indica qual pedido remover
router.delete("/:numeroPedido", OrderController.delete);

export default router;
