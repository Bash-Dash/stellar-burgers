import { FC, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import {
  fetchOrderByNumber,
  selectCurrentOrder,
  clearCurrentOrder
} from '../../services/slices/ordersSlice';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import type { TIngredient, TOrder } from '../../utils/types';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderData = useSelector(selectCurrentOrder);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(parseInt(number)));
    }
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    type TIngredientWithCount = TIngredient & { count: number };
    type TIngredientsInfo = Record<string, TIngredientWithCount>;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce<TIngredientsInfo>(
      (acc, item) => {
        const ingredient = ingredients.find(
          (ing: TIngredient) => ing._id === item
        );
        if (ingredient) {
          acc[item] = acc[item] || { ...ingredient, count: 0 };
          acc[item].count += 1;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
