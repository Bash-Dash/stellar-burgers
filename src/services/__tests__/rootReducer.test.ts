import store from '../store';
import { ingredientsSlice } from '../slices/ingredientsSlice';
import { burgerConstructorSlice } from '../slices/constructorSlice';
import { userSlice } from '../slices/userSlice';
import { feedSlice } from '../slices/feedSlice';
import { ordersSlice } from '../slices/ordersSlice';
import { profileOrdersSlice } from '../slices/profileOrdersSlice';

describe('rootReducer', () => {
  it('should have correct initial state structure', () => {
    const state = store.getState();

    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgers');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('profileOrders');
  });

  it('should handle unknown action without errors', () => {
    const initialState = store.getState();

    expect(() => {
      store.dispatch({ type: 'UNKNOWN_ACTION' });
    }).not.toThrow();

    expect(store.getState()).toEqual(initialState);
  });

  it('should contain correct initial state for each slice', () => {
    const state = store.getState();

    expect(state.user).toEqual(userSlice.getInitialState());
    expect(state.ingredients).toEqual(ingredientsSlice.getInitialState());
    expect(state.burgers).toEqual(burgerConstructorSlice.getInitialState());
    expect(state.feed).toEqual(feedSlice.getInitialState());
    expect(state.order).toEqual(ordersSlice.getInitialState());
    expect(state.profileOrders).toEqual(profileOrdersSlice.getInitialState());
  });
});
