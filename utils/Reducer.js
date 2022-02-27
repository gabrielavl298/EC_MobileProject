export const initialState = {
    basket: [],
    user: {
        auth: false,
        userID: undefined,
        email: undefined,
        username: undefined
    },
    localOrders: []
}

//Action for cart
export const actionTypes = {
    ADD_TO_BASKET: "ADD_TO_BASKET", //Add product to basket
    REMOVE_FROM_BASKET: "REMOVE_FROM_BASKET", //Delete product from basket
    ADD_ONE_TO_BASKET: "ADD_ONE_TO_BASKET", //Add product counter by one
    REMOVE_ONE_TO_BASKET: "REMOVE_ONE_TO_BASKET", //Quit product counter by one
    SET_QUANTITY_TO_BASKET : "SET_QUANTITY_TO_BASKET", //Set the quantity of a product
    SET_ENABLE_TO_BASKET : "SET_ENABLE_TO_BASKET", //Set if product is enabled to checkout
    CLONE_BASKET_FROM_DB: "CLONE_BASKET_FROM_DB", //Get the basket from db
    DELETE_LOCAL_BASKET: "DELETE_LOCAL_BASKET" // Delete basket when log out

}

//Action for Auth
export const authActionTypes = {
    AUTH_USER: "AUTH_USER",
    LOGOUT_USER: "LOGOUT_USER"
}

//Action for Auth
export const orderActionTypes = {
    ADD_ORDER_TO_LIST: "ADD_ORDER_TO_LIST",
    CLONE_ORDER_LIST_FROM_DB: "CLONE_ORDER_LIST_FROM_DB",
    DELETE_LOCAL_ORDER_LIST: "DELETE_LOCAL_ORDER_LIST"
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

        case "CLONE_BASKET_FROM_DB":
            console.log("Entro a reduce : CLONE BASKET FROM DB. \n data: \n", action)
            return {
                ...state,
                basket: action.array
            }

        case "DELETE_LOCAL_BASKET":
            console.log("Entro a reduce : DELETE LOCAL BASKET");
            return {
                ...state,
                basket: new Array()
            }

        /* AUTH CASES */
        case "AUTH_USER":
            return {
                ...state,
                user: {
                    auth: true,
                    userID: action.user.userID,
                    email: action.user.email,
                    username: action.user.username
                }
             }

        case "LOGOUT_USER":
            return {
                ...state,
                user: {
                    auth: false,
                    userID: undefined,
                    email: undefined,
                    username: undefined
                }
            }

        case "ADD_ORDER_TO_LIST":
            //console.log("Entro a reduce : ADD ORDER LIST. \n data: \n",  action)
            return {
                ...state,
                localOrders: [...state.localOrders, action.data]
            }

        case "CLONE_ORDER_LIST_FROM_DB":
            //console.log("Entro a reduce : CLONE ORDER LIST. \n data: \n", action)
            return {
                ...state,
                localOrders : action.array
            }

        case "DELETE_LOCAL_ORDER_LIST":
            let newArray = [];
            return {
                ...state,
                localOrders: newArray
            }
        default: return state;
    }
}

export default reducer;