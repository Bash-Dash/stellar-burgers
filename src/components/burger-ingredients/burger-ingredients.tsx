import { useState, useEffect, useRef, FC, memo, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from '../../services/store';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { Preloader } from '@ui';
import { TIngredient, TTabMode } from '../../utils/types';

export const BurgerIngredients: FC = memo(() => {
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const isLoading = useSelector((state) => state.ingredients.isLoading);
  const error = useSelector((state) => state.ingredients.error);

  const bun = useSelector((state) => state.burgers.bun);
  const constructorIngredients = useSelector(
    (state) => state.burgers.ingredients
  );
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const bunTitleRef = useRef<HTMLHeadingElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const saucesTitleRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, bunsInView] = useInView({
    threshold: 0
  });

  const [mainsRef, mainsInView] = useInView({
    threshold: 0
  });

  const [saucesRef, saucesInView] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (bunsInView) setCurrentTab('bun');
    else if (saucesInView) setCurrentTab('sauce');
    else if (mainsInView) setCurrentTab('main');
  }, [bunsInView, mainsInView, saucesInView]);

  const filteredIngredients = useMemo(
    () => ({
      buns: ingredients.filter((item: TIngredient) => item.type === 'bun'),
      mains: ingredients.filter((item: TIngredient) => item.type === 'main'),
      sauces: ingredients.filter((item: TIngredient) => item.type === 'sauce')
    }),
    [ingredients]
  );

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};
    constructorIngredients.forEach((item: TIngredient) => {
      counters[item._id] = (counters[item._id] || 0) + 1;
    });
    if (bun) {
      counters[bun._id] = 2;
    }
    return counters;
  }, [bun, constructorIngredients]);

  const handleTabClick = (val: string) => {
    const tab = val as TTabMode;
    setCurrentTab(tab);
    const ref =
      tab === 'bun'
        ? bunTitleRef
        : tab === 'sauce'
          ? saucesTitleRef
          : mainTitleRef;

    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) return <Preloader />;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={filteredIngredients.buns}
      mains={filteredIngredients.mains}
      sauces={filteredIngredients.sauces}
      titleBunRef={bunTitleRef}
      titleMainRef={mainTitleRef}
      titleSaucesRef={saucesTitleRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={handleTabClick}
    />
  );
});
