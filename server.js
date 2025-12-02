import express from "express";
import orderRoutes from "./src/routes/orderRoutes.js";

const app = express();

// Middleware para processar JSON apenas em POST e PUT
// Evita parse desnecessário em GET/DELETE
app.use("/order", (req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    express.json()(req, res, next); // converte body em JSON
  } else {
    next(); // segue para o próximo middleware/rota
  }
});

// Rotas relacionadas a pedidos
app.use("/order", orderRoutes);

// Inicializa o servidor na porta 3000
app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
