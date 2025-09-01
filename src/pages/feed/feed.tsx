import { FC, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';
import { TOrder } from '@utils-types';

import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedLoading,
  fetchFeeds
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const total: number = useSelector(selectFeedTotal);
  const totalToday: number = useSelector(selectFeedTotalToday);
  const isLoading: boolean = useSelector(selectFeedLoading);

  const handleGetFeeds = useCallback(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  useEffect(() => {
    handleGetFeeds();
  }, [handleGetFeeds]);

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
