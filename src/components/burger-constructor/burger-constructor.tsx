import { FC, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import { createOrder } from '../../services/slices/ordersSlice';
import { resetConstructor } from '../../services/slices/constructorSlice';
import { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { orderRequest, orderModalData } = useSelector((state) => state.orders);

  const totalPrice = useMemo(() => {
    const bunCost = bun ? bun.price * 2 : 0;
    const ingredientsCost = ingredients.reduce(
      (sum: number, ing: TConstructorIngredient) => sum + ing.price,
      0
    );
    return bunCost + ingredientsCost;
  }, [bun, ingredients]);

  const ingredientIds = useMemo(() => {
    if (!bun) return [];
    return [
      bun._id,
      ...ingredients.map((ing: TConstructorIngredient) => ing._id),
      bun._id
    ];
  }, [bun, ingredients]);

  const handleOrderClick = useCallback(() => {
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    if (!bun || ingredients.length === 0) {
      return;
    }

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then((order) => {
        dispatch(resetConstructor());
      })
      .catch((error) => {
        console.error('Order creation failed:', error);
      });
  }, [user, bun, ingredients, ingredientIds, dispatch, navigate]);

  const handleCloseModal = useCallback(() => {}, []);

  return (
    <BurgerConstructorUI
      constructorItems={{ bun, ingredients }}
      price={totalPrice}
      orderRequest={orderRequest}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};
