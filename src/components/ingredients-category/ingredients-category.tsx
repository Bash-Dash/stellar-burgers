import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import type { TIngredientsCategoryProps } from './type';
import type { TIngredient } from '@utils-types';
import { selectConstructor } from '../../services/slices/constructorSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { bun, ingredients: constructorIngredients } =
    useSelector(selectConstructor);

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};

    constructorIngredients.forEach((ingredient: TIngredient) => {
      counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
    });

    if (bun?._id) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
