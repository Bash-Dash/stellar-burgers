import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderBurger,
  closeOrderModal
} from '../../services/slices/constructorSlice';
import { getCookie, setCookie } from '../../utils/cookie';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.user);
  const bun = useSelector((state) => state.burgers.bun);
  const ingredients = useSelector((state) => state.burgers.ingredients);
  const orderRequest = useSelector((state) => state.burgers.orderRequest);
  const orderModalData = useSelector((state) => state.burgers.orderModalData);

  const ingredientIds = useMemo(() => {
    if (!bun) return [];
    return [
      bun._id,
      ...ingredients.map(
        (ingredient: TConstructorIngredient) => ingredient._id
      ),
      bun._id
    ];
  }, [bun, ingredients]);

  const totalPrice = useMemo(() => {
    const bunCost = bun ? bun.price * 2 : 0;
    const ingredientsCost = ingredients.reduce(
      (sum: number, ingredient: TConstructorIngredient) =>
        sum + ingredient.price,
      0
    );
    return bunCost + ingredientsCost;
  }, [bun, ingredients]);

  const handleOrderClick = () => {
    const token = getCookie('accessToken');

    if (!isAuthenticated || !token) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    if (!bun) {
      alert('Выберите булку!');
      return;
    }

    if (ingredients.length === 0) {
      alert('Добавьте ингредиенты!');
      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((ing) => ing._id),
      bun._id
    ];

    dispatch(getOrderBurger(ingredientIds));
  };

  const handleCloseModal = () => {
    dispatch(closeOrderModal());
    navigate('/');
  };

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};
