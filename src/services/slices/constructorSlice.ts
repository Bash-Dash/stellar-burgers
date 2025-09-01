import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import type { TConstructorIngredient, TIngredient } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';
import type { RootState } from '../store';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: any | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

export const getOrderBurger = createAsyncThunk(
  'constructor/getOrderBurger',
  orderBurgerApi
);

export const moveIngredient = (
  ingredients: TConstructorIngredient[],
  from: number,
  to: number
): TConstructorIngredient[] => {
  const result = [...ingredients];
  const [moved] = result.splice(from, 1);
  result.splice(to, 0, moved);
  return result;
};

export const burgerConstructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (item: TIngredient) => ({
        payload: { ...item, id: nanoid() }
      })
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item: TConstructorIngredient) => item.id !== action.payload
      );
    },

    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (item: TConstructorIngredient) => item.id === action.payload
      );
      if (index > 0) {
        state.ingredients = moveIngredient(state.ingredients, index, index - 1);
      }
    },

    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (item: TConstructorIngredient) => item.id === action.payload
      );
      if (index < state.ingredients.length - 1) {
        state.ingredients = moveIngredient(state.ingredients, index, index + 1);
      }
    },

    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },

    setRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },

    resetModal: (state) => {
      state.orderModalData = null;
    },

    closeOrderModal: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderBurger.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderRequest = true;
      })
      .addCase(getOrderBurger.fulfilled, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = null;
        state.orderModalData = action.payload.order;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(getOrderBurger.rejected, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = action.payload as string;
      });
  }
});

export const getConstructorState = (state: RootState) => ({
  bun: state.burgers.bun,
  ingredients: state.burgers.ingredients
});

export const getOrderRequest = (state: RootState) => state.burgers.orderRequest;
export const getOrderModalData = (state: RootState) =>
  state.burgers.orderModalData;

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor,
  setRequest,
  resetModal,
  closeOrderModal
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
