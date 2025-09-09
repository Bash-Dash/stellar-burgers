import { createOrder, ordersSlice } from '../slices/ordersSlice';
import { TOrder } from '../../utils/types';

const mockOrder: TOrder = {
  _id: '1',
  ingredients: ['ingredient1', 'ingredient2'],
  status: 'done',
  name: 'Test Order',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 12345
};

describe('orders slice reducer', () => {
  const initialState = {
    currentOrder: null,
    ordersList: [],
    isLoading: false,
    error: null,
    orderRequest: false,
    orderModalData: null
  };

  it('should return initial state', () => {
    const result = ordersSlice.reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should handle createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const result = ordersSlice.reducer(initialState, action);

    expect(result.orderRequest).toBe(true);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle createOrder.fulfilled', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };
    const result = ordersSlice.reducer(
      { ...initialState, orderRequest: true, isLoading: true },
      action
    );

    expect(result.orderRequest).toBe(false);
    expect(result.isLoading).toBe(false);
    expect(result.orderModalData).toEqual(mockOrder);
    expect(result.error).toBeNull();
  });

  it('should handle createOrder.rejected', () => {
    const errorMessage = 'Failed to create order';
    const action = {
      type: createOrder.rejected.type,
      payload: errorMessage
    };
    const result = ordersSlice.reducer(
      { ...initialState, orderRequest: true, isLoading: true },
      action
    );

    expect(result.orderRequest).toBe(false);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(errorMessage);
  });
});
