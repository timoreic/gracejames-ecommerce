import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../slices/productsSlice';
import productReducer from '../slices/productSlice';
import productCreateReducer from '../slices/productCreateSlice';
import productDeleteReducer from '../slices/productDeleteSlice';
import productUpdateReducer from '../slices/productUpdateSlice';
import sizeReducer from '../slices/sizeSlice';
import sizeCreateReducer from '../slices/sizeCreateSlice';
import sizeDeleteReducer from '../slices/sizeDeleteSlice';
import sizeUpdateReducer from '../slices/sizeUpdateSlice';
import sizesReducer from '../slices/sizesSlice';
import materialReducer from '../slices/materialSlice';
import materialCreateReducer from '../slices/materialCreateSlice';
import materialDeleteReducer from '../slices/materialDeleteSlice';
import materialUpdateReducer from '../slices/materialUpdateSlice';
import materialsReducer from '../slices/materialsSlice';
import cartReducer from '../slices/cartSlice';
import shippingAddressReducer from '../slices/shippingAddressSlice';
import userReducer from '../slices/userSlice';
import userDeleteReducer from '../slices/userDeleteSlice';
import usersReducer from '../slices/usersSlice';
import ordersUserReducer from '../slices/ordersUserSlice';
import ordersAllReducer from '../slices/ordersAllSlice';
import orderReducer from '../slices/orderSlice';
import orderDetailsReducer from '../slices/orderDetailsSlice';
import orderPayReducer from '../slices/orderPaySlice';
import orderDeliverReducer from '../slices/orderDeliverSlice';
import displaysReducer from '../slices/displaysSlice';
import displayReducer from '../slices/displaySlice';
import displayCreateReducer from '../slices/displayCreateSlice';
import displayDeleteReducer from '../slices/displayDeleteSlice';
import displayUpdateReducer from '../slices/displayUpdateSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    product: productReducer,
    productCreate: productCreateReducer,
    productDelete: productDeleteReducer,
    productUpdate: productUpdateReducer,
    size: sizeReducer,
    sizeCreate: sizeCreateReducer,
    sizeDelete: sizeDeleteReducer,
    sizeUpdate: sizeUpdateReducer,
    sizes: sizesReducer,
    material: materialReducer,
    materialCreate: materialCreateReducer,
    materialDelete: materialDeleteReducer,
    materialUpdate: materialUpdateReducer,
    materials: materialsReducer,
    cart: cartReducer,
    shippingAddress: shippingAddressReducer,
    user: userReducer,
    userDelete: userDeleteReducer,
    users: usersReducer,
    ordersUser: ordersUserReducer,
    ordersAll: ordersAllReducer,
    order: orderReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderDeliver: orderDeliverReducer,
    displays: displaysReducer,
    display: displayReducer,
    displayCreate: displayCreateReducer,
    displayDelete: displayDeleteReducer,
    displayUpdate: displayUpdateReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
