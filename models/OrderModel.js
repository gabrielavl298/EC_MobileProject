export var Order = function(productData, quantity, time, total) {
    this.orderData = {
        productData: productData, 
        quantity: quantity,
        time: time,
        total: total
    }
}