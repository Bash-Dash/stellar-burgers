import store from '../store';

describe('rootReducer', () => {
  it('should have correct initial state structure', () => {
    const state = store.getState();

    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgers');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('profileOrders');

    // Проверяем структуру каждого слайса
    expect(state.burgers).toHaveProperty('bun');
    expect(state.burgers).toHaveProperty('ingredients');
    expect(state.burgers).toHaveProperty('orderRequest');

    expect(state.ingredients).toHaveProperty('ingredients');
    expect(state.ingredients).toHaveProperty('isLoading');
    expect(state.ingredients).toHaveProperty('error');
  });

  it('should handle unknown action without errors', () => {
    const initialState = store.getState();

    // Store не должен падать при неизвестном действии
    expect(() => {
      store.dispatch({ type: 'UNKNOWN_ACTION' });
    }).not.toThrow();

    // Состояние должно остаться неизменным
    expect(store.getState()).toEqual(initialState);
  });
});
