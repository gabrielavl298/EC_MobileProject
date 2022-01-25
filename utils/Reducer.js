export const initialState = {
    basket: []
}

//Action for cart
export const actionTypes = {
    ADD_TO_BASKET: "ADD_TO_BASKET", //Add product to basket
    REMOVE_FROM_BASKET: "REMOVE_FROM_BASKET", //Delete product from basket
    ADD_ONE_TO_BASKET: "ADD_ONE_TO_BASKET", //Add product counter by one
    REMOVE_ONE_TO_BASKET: "REMOVE_ONE_TO_BASKET", //Quit product counter by one
    SET_QUANTITY_TO_BASKET : "SET_QUANTITY_TO_BASKET", //Set the quantity of a product
    SET_ENABLE_TO_BASKET : "SET_ENABLE_TO_BASKET", //Set if product is enabled to checkout

}

const reducer = (state, action) => {
    let index;
    let newBasket;
    switch(action.type){
        case "ADD_TO_BASKET":
            index = state.basket.findIndex(basketItem => basketItem.id === action.item.id);
            newBasket = [...state.basket];
            if(index >= 0 ){
                newBasket[index].cantidad++;
            }else{
                newBasket = [...state.basket, action.item];
            }
            return {
                ...state,
                basket: newBasket
            }
        
        case "REMOVE_FROM_BASKET":
            index = state.basket.findIndex(basketItem => basketItem.id === action.id);
            newBasket = [...state.basket];

            if(index >= 0 ){
                newBasket.splice(index, 1);
            }else{
                console.log("Can't remove product")
            }
            return {
               ...state,
               basket: newBasket
            }

        case "ADD_ONE_TO_BASKET":
            index = state.basket.findIndex(basketItem => basketItem.id === action.id);
            newBasket = [...state.basket];
            newBasket[index].cantidad++;

            return {
                ...state,
               basket: newBasket
            }

        case "REMOVE_ONE_TO_BASKET":
            index = state.basket.findIndex(basketItem => basketItem.id === action.id);
            newBasket = [...state.basket];
            if(newBasket[index].cantidad > 1){
                newBasket[index].cantidad--;
            }else{
                newBasket[index].cantidad = 1;
            }

            return {
                ...state,
                basket: newBasket
            }

        case "SET_QUANTITY_TO_BASKET":
            index = state.basket.findIndex(basketItem => basketItem.id === action.id);
            newBasket = [...state.basket];
            newBasket[index].cantidad = action.cantidad;

            return {
                ...state,
                basket: newBasket
            }

        case "SET_ENABLE_TO_BASKET":
            index = state.basket.findIndex(basketItem => basketItem.id === action.id);
            newBasket = [...state.basket];
            newBasket[index].habilitado = action.habilitado;

            return {
                ...state,
                basket: newBasket
            }

        default: return state;
    }
}

export default reducer;