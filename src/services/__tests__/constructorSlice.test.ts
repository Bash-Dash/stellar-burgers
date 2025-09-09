import constructorReducer, {
  initialState,
  addIngredient,
  removeIngredient,
  resetConstructor
} from '../slices/constructorSlice';
import { TIngredient } from '../../utils/types';

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
  it('should return initial state', () => {
    const result = constructorReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should handle adding a bun', () => {
    const action = addIngredient(mockBun);
    const result = constructorReducer(initialState, action);

    expect(result.bun).toEqual({
      ...mockBun,
      id: expect.any(String)
    });
    expect(result.ingredients).toHaveLength(0);
  });

  it('should handle adding a main ingredient', () => {
    const action = addIngredient(mockMain);
    const result = constructorReducer(initialState, action);

    expect(result.bun).toBeNull();
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toEqual({
      ...mockMain,
      id: expect.any(String)
    });
  });

  it('should handle removing an ingredient', () => {
    const addAction = addIngredient(mockMain);
    const stateWithIngredient = constructorReducer(initialState, addAction);
    const ingredientId = stateWithIngredient.ingredients[0].id;

    const removeAction = removeIngredient(ingredientId);
    const result = constructorReducer(stateWithIngredient, removeAction);

    expect(result.ingredients).toHaveLength(0);
  });

  it('should handle reset constructor', () => {
    const addBunAction = addIngredient(mockBun);
    const addMainAction = addIngredient(mockMain);

    let state = constructorReducer(initialState, addBunAction);
    state = constructorReducer(state, addMainAction);

    const resetAction = resetConstructor();
    const result = constructorReducer(state, resetAction);

    expect(result.bun).toBeNull();
    expect(result.ingredients).toHaveLength(0);
  });
});
