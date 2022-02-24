export var Order = function(productID, quantity, time, total) {
    this.orderData = {
        productID: productID,
        quantity: quantity,
        time: time,
        total: total
    }
}