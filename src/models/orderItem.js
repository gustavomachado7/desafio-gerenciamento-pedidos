export class OrderItem {
  constructor(idItem, quantidadeItem, valorItem) {
    this.productId = parseInt(idItem, 10); // garante que o ID seja inteiro
    this.quantity = quantidadeItem;
    this.price = valorItem;
  }
}
