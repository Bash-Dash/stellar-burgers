import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { RootState } from '../store';
import { TOrder } from '../../utils/types';

export type TOrdersState = {
  currentOrder: TOrder | null;
  ordersList: TOrder[];
  isLoading: boolean;
  error: string | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

export const initialState: TOrdersState = {
  currentOrder: null,
  ordersList: [],
  isLoading: false,
  error: null,
  orderRequest: false,
  orderModalData: null
};

export const createOrder = createAsyncThunk(
  'orders/create',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0] ?? null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Order not found');
    }
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
    clearOrder(state) {
      state.orderModalData = null;
    },
    resetOrdersState() {
      return initialState;
    },
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.isLoading = false;
        state.orderModalData = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectCurrentOrder = (state: RootState) =>
  state.order.currentOrder;

export const selectOrdersList = (state: RootState) => state.order.ordersList;

export const selectOrderLoading = (state: RootState) => state.order.isLoading;

export const selectOrderError = (state: RootState) => state.order.error;

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;

export const { clearCurrentOrder, clearOrderModal, resetOrdersState } =
  ordersSlice.actions;

export default ordersSlice.reducer;
