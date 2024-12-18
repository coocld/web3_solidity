import { configureStore } from '@reduxjs/toolkit'
import balanceReducer from './slice/balanceSlice'
import orderSlice from './slice/orderSlice'
export default configureStore({
  reducer: {
    balance: balanceReducer,
    order: orderSlice,
  }
})