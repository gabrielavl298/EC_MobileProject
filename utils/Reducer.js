;;export const initialState = {
    basket: []
}

export const actionTypes = {
    ADD_TO_BASKET: "ADD_TO_BASKET",
    REMOVE_FROM_CART: "REMOVE_FROM_CART"
}

const reducer = (state, action) => {
    console.log(action);
    switch(action.type){
        case "ADD_TO_BASKET":
            return {
                ...state,
                basket: [...state.basket, action.item]
            }
        
        case "REMOVE_FROM_CART":
            const index = state.basket.findIndex(basketItem => basketItem.id === action.id)
            let newBasket = [...state.basket];

            if(index >= 0 ){
                newBasket.splice(index, 1);
            }else{
                console.log("Can't remove product")
            }
            return {
               ...state,
               basket: newBasket
            }
        default: return state;
    }
}

export default reducer;