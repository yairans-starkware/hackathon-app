import { useCallback, useEffect, useMemo, useState } from "react";
import { ReadCateringContract } from "../providers/starknet-provider";
import { useDynamicContext, useUserWallets } from "@dynamic-labs/sdk-react-core";
import { Meal } from "../types/meal";
import { getStartMonthOfEventTracking, getTimestampForFirstDayOfMonth } from "../utils/date";

let fetched = false;
export const useMealEvents = () => {
  const [mealEvents, setMealEvents] = useState<Meal[]>([]);
  const [isAllowedUser, setIsAllowedUser] = useState<boolean>();
  const [loadingAllEvents, setLoadingAllEvents] = useState(true);
  const [isSuccessFetchingUserEvents, setSuccessFetchingUserEvents] = useState(false);
  const wallets = useUserWallets();
  const {sdkHasLoaded} = useDynamicContext();

  const starknetWallet = useMemo(() => wallets.find(wallet => wallet.chain === 'STARK'), [wallets]);

  const updateMeal = useCallback((mealId: string) => {
    const indexOfUpdatedMeal = mealEvents.map((meal) => meal.id).indexOf(mealId);
    const oldMeal = mealEvents[indexOfUpdatedMeal];
    
    const newMeal = {
      ...oldMeal,
      info: {
        ...oldMeal.info,
        registered: !oldMeal.info.registered,
      }
    }

    setMealEvents([...mealEvents.slice(0, indexOfUpdatedMeal), { ...newMeal }, ...mealEvents.slice(indexOfUpdatedMeal + 1)]);
  }, [mealEvents]);

  useEffect(() => {
    const fetchContractData = async () => {
      const aYearAgoTimestampSeconds = getTimestampForFirstDayOfMonth(getStartMonthOfEventTracking());
      const aMonthFromNowTimestampSeconds = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      try {
        if (fetched) {
          return;
        }
        const [isAllowedUserData, mealEventsData, userMealEventsData] = await Promise.all([
          starknetWallet?.address ? ReadCateringContract?.is_allowed_user(starknetWallet?.address) : Promise.resolve(false),
          ReadCateringContract.get_events_infos_by_time({seconds: aYearAgoTimestampSeconds},{ seconds: aMonthFromNowTimestampSeconds }),
          starknetWallet?.address ? ReadCateringContract.get_user_events_by_time(starknetWallet?.address, {seconds: aYearAgoTimestampSeconds},{ seconds: aMonthFromNowTimestampSeconds }) : Promise.resolve([]),
        ])
        fetched = true;
        setIsAllowedUser(isAllowedUserData);
        setMealEvents(addUserParticipationToMealEvents(mealEventsData, userMealEventsData));
        setLoadingAllEvents(false);
        if (starknetWallet?.address) {
          setSuccessFetchingUserEvents(true);
        }
      } catch (e) {
        console.log('Caught an error while fetching meal events:', e);
      }
    }

    if (sdkHasLoaded) {
      fetchContractData();
    }
  }, [starknetWallet?.address, sdkHasLoaded]);

  const futureMeals: Meal[] = mealEvents.filter((mealEvent) => Number(mealEvent.info.time.seconds) * 1000 > Date.now()).slice(0, 7);
  const pastMeals = mealEvents.filter((mealEvent) => Number(mealEvent.info.time.seconds) * 1000 <= Date.now());

  return {
    pastMeals, 
    futureMeals, 
    isAllowedUser, 
    loadingAllEvents,
    isSuccessFetchingUserEvents,
    updateMeal,
    setSuccessFetchingUserEvents,
  };
}

const addUserParticipationToMealEvents = (mealEvents: Meal[], userMealEvents: Meal[]) => {
  if (!userMealEvents.length) {
    return mealEvents
  } else {
    return mealEvents.map((meal) => {
      return {
        ...meal,
        info: {
          ...meal.info,
          registered: !!(userMealEvents.find(({id, info: {registered}}) => (meal.id === id) && registered)),
        }
      } 
    })
  }
}
