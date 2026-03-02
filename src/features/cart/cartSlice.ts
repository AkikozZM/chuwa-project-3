import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

interface ProductCart {
    id: string,
    name: string,
    price: number,
    quantity: number;
    imageUrl?: string;
}

type ProductsInCart = Record<string, ProductCart>

export interface CartState {
    total: number;
    isOpen: boolean;
    productsInCart: ProductsInCart;
}

// Define the initial state using that type
const initialState: CartState = {
    total: 0,
    isOpen: false,
    productsInCart: {},
}
export const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        increment(state, action: PayloadAction<{ id: string, name: string, price: number, imageUrl?: string }>) {
            const { id, name, price, imageUrl } = action.payload
            if (state.productsInCart[id]) {
                state.productsInCart[id].quantity += 1;
                state.total += price;
                return;
            }
            state.productsInCart[id] = {
                id,
                name,
                price,
                quantity: 1,
                imageUrl,
            }
            state.total += price;
        },

        decrement(state, action: PayloadAction<{ id: string }>) {
            const { id } = action.payload
            if (state.productsInCart[id]) {
                if (state.productsInCart[id].quantity > 1) {
                    state.productsInCart[id].quantity -= 1;
                    state.total -= state.productsInCart[id].price;
                } else {
                    state.total -= state.productsInCart[id].price;
                    delete state.productsInCart[id];
                }
            }
        },

        setQuantity(state, action: PayloadAction<{ id: string, quantity: number }>) {
            const { id, quantity } = action.payload
            if (state.productsInCart[id]) {
                const changedQuantity = Math.max(0, quantity);
                const diff_price = (changedQuantity - state.productsInCart[id].quantity) * state.productsInCart[id].price;
                if (changedQuantity === 0) {
                    delete state.productsInCart[id];
                } else {
                    state.productsInCart[id].quantity = changedQuantity;
                }

                state.total += diff_price;
            }
        },

        removeFromCart(state, action: PayloadAction<{ id: string }>) {
            const { id } = action.payload
            if (state.productsInCart[id]) {

                state.total -= state.productsInCart[id].price * state.productsInCart[id].quantity;
                delete state.productsInCart[id];
            }
        },

        clearCart(state) {
            state.productsInCart = {};
            state.total = 0;
        },

        openCart(state) {
            state.isOpen = true;
        },

        closeCart(state) {
            state.isOpen = false;
        },

        toggleCart(state) {
            state.isOpen = !state.isOpen;
        }
    }
})

export const { increment, decrement, removeFromCart, setQuantity, clearCart, openCart, closeCart, toggleCart } = CartSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectProductsInCart = (state: RootState) => state.cart.productsInCart
export const selectTotal = (state: RootState) => state.cart.total

export default CartSlice.reducer