import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import type { TIngredientsCategoryProps } from './type';
import type { TIngredient } from '@utils-types';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const bun = useSelector((state) => state.burgers.bun);
  const constructorIngredients = useSelector(
    (state) => state.burgers.ingredients
  );
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
