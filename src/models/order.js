export class Order {
  constructor(numeroPedido, valorTotal, dataCriacao, items) {
    this.orderId = numeroPedido; // mapeado internamente como orderId
    this.value = valorTotal;
    this.creationDate = dataCriacao;
    this.items = items;
  }
}
