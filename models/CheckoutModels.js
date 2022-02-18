export var purchaseUnit = function(value, items) {
    this.unit = {
        amount: {
            currency_code: "MXN",
            value: value,
            breakdown: {
              item_total: {  /* Required when including the `items` array */
                currency_code: "MXN",
                value: value
              }
            }
          },
          items: items
    }
}

export var item = function(name, description, value, quantity){
    this.itemData = {
        name: name, /* Shows within upper-right dropdown during payment approval */
        description: description, /* Item details will also be in the completed paypal.com transaction view */
        unit_amount: {
            currency_code: "MXN",
            value: value
        },
        quantity: quantity
    }
}