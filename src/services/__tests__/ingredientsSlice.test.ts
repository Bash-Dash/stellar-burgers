import ingredientsReducer, { initialState } from '../slices/ingredientsSlice';
import { TIngredient } from '../../utils/types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Test Ingredient 1',
    type: 'main',
    proteins: 10,
    fat: 5,
    carbohydrates: 15,
    calories: 100,
    price: 200,
    image: 'test1.jpg',
    image_large: 'test1-large.jpg',
    image_mobile: 'test1-mobile.jpg'
  }
];

describe('ingredients slice reducer', () => {
  it('should return initial state', () => {
    const result = ingredientsReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should handle fetchIngredients.pending', () => {
    const action = { type: 'ingredients/fetchIngredients/pending' };
    const result = ingredientsReducer(initialState, action);

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const action = {
      type: 'ingredients/fetchIngredients/fulfilled',
      payload: mockIngredients
    };
    const result = ingredientsReducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(result.isLoading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
    expect(result.error).toBeNull();
  });

  it('should handle fetchIngredients.rejected', () => {
    const errorMessage = 'Failed to fetch ingredients';
    const action = {
      type: 'ingredients/fetchIngredients/rejected',
      payload: errorMessage
    };
    const result = ingredientsReducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(errorMessage);
    expect(result.ingredients).toEqual([]);
  });
});
