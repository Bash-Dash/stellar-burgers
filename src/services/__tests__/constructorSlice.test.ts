import {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor,
  burgerConstructorSlice
} from '../slices/constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: 'bun1',
  name: 'Test Bun',
  type: 'bun',
  proteins: 5,
  fat: 5,
  carbohydrates: 5,
  calories: 100,
  price: 100,
  image: 'test.jpg',
  image_large: 'test-large.jpg',
  image_mobile: 'test-mobile.jpg'
};

const mockMain: TIngredient = {
  _id: 'main1',
  name: 'Test Main',
  type: 'main',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 200,
  price: 200,
  image: 'test.jpg',
  image_large: 'test-large.jpg',
  image_mobile: 'test-mobile.jpg'
};

describe('constructor slice reducer', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null,
    loading: false,
    error: null
  };

  it('should return initial state', () => {
    const result = burgerConstructorSlice.reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should handle adding a bun', () => {
    const action = addIngredient(mockBun);
    const result = burgerConstructorSlice.reducer(initialState, action);

    expect(result.bun).toEqual({
      ...mockBun,
      id: expect.any(String)
    });
    expect(result.ingredients).toHaveLength(0);
  });

  it('should handle adding a main ingredient', () => {
    const action = addIngredient(mockMain);
    const result = burgerConstructorSlice.reducer(initialState, action);

    expect(result.bun).toBeNull();
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toEqual({
      ...mockMain,
      id: expect.any(String)
    });
  });

  it('should handle removing an ingredient', () => {
    const addAction = addIngredient(mockMain);
    const stateWithIngredient = burgerConstructorSlice.reducer(
      initialState,
      addAction
    );
    const ingredientId = stateWithIngredient.ingredients[0].id;

    const removeAction = removeIngredient(ingredientId);
    const result = burgerConstructorSlice.reducer(
      stateWithIngredient,
      removeAction
    );

    expect(result.ingredients).toHaveLength(0);
  });

  it('should handle moving ingredient up', () => {
    const mockMain2: TIngredient = {
      ...mockMain,
      _id: 'main2'
    };

    const addAction1 = addIngredient(mockMain);
    const state1 = burgerConstructorSlice.reducer(initialState, addAction1);

    const addAction2 = addIngredient(mockMain2);
    const state2 = burgerConstructorSlice.reducer(state1, addAction2);

    const ingredientId = state2.ingredients[1].id;
    const moveAction = moveIngredientUp(ingredientId);
    const result = burgerConstructorSlice.reducer(state2, moveAction);

    expect(result.ingredients[0]._id).toBe('main2');
    expect(result.ingredients[1]._id).toBe('main1');
  });

  it('should handle moving ingredient down', () => {
    const mockMain2: TIngredient = {
      ...mockMain,
      _id: 'main2'
    };

    const addAction1 = addIngredient(mockMain);
    const state1 = burgerConstructorSlice.reducer(initialState, addAction1);

    const addAction2 = addIngredient(mockMain2);
    const state2 = burgerConstructorSlice.reducer(state1, addAction2);

    const ingredientId = state2.ingredients[0].id;
    const moveAction = moveIngredientDown(ingredientId);
    const result = burgerConstructorSlice.reducer(state2, moveAction);

    expect(result.ingredients[0]._id).toBe('main2');
    expect(result.ingredients[1]._id).toBe('main1');
  });

  it('should handle reset constructor', () => {
    const addBunAction = addIngredient(mockBun);
    const addMainAction = addIngredient(mockMain);

    let state = burgerConstructorSlice.reducer(initialState, addBunAction);
    state = burgerConstructorSlice.reducer(state, addMainAction);

    const resetAction = resetConstructor();
    const result = burgerConstructorSlice.reducer(state, resetAction);

    expect(result.bun).toBeNull();
    expect(result.ingredients).toHaveLength(0);
  });
});
