import { useCallback, useEffect, useMemo, useState } from "react";
import { ReadCateringContract } from "../providers/starknet-provider";
import { useDynamicContext, useUserWallets } from "@dynamic-labs/sdk-react-core";
import { Meal } from "../types/meal";
import { getStartMonthOfEventTracking, getTimestampForFirstDayOfMonth } from "../utils/date";

export const useMealEvents = () => {
  const [mealEvents, setMealEvents] = useState<Meal[]>([]);
  const [userMealEvents, setUserMealEvents] = useState<Meal[]>([]);
  const [isAllowedUser, setIsAllowedUser] = useState<boolean>();
  const [loading, setLoading] = useState(true);
  const wallets = useUserWallets();
  const {sdkHasLoaded} = useDynamicContext();
  
  const starknetWallet = useMemo(() => wallets.find(wallet => wallet.chain === 'STARK'), [wallets]);
  
  const updateMeal = useCallback((mealId: string) => {
    const indexOfUpdatedMeal = mealEvents.map((meal) => meal.id).indexOf(mealId);
    const oldMeal = mealEvents[indexOfUpdatedMeal];
    const newMeal = {
      ...oldMeal,
      registered: !oldMeal.registered,
    }

    setMealEvents([...mealEvents.slice(0, indexOfUpdatedMeal), newMeal, ...mealEvents.slice(indexOfUpdatedMeal + 1)]);
  }, [mealEvents]);

  useEffect(() => {
    const fetchContractData = async () => {
      const aYearAgoTimestampSeconds = getTimestampForFirstDayOfMonth(getStartMonthOfEventTracking());
      const aMonthFromNowTimestampSeconds = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      const [isAllowedUserData, mealEventsData, userMealEventsData] = await Promise.all([
        starknetWallet?.address ? ReadCateringContract?.is_allowed_user(starknetWallet?.address) : Promise.resolve(false),
        ReadCateringContract.get_events_infos_by_time({seconds: aYearAgoTimestampSeconds},{ seconds: aMonthFromNowTimestampSeconds }),
        starknetWallet?.address ? ReadCateringContract.get_user_events_by_time(starknetWallet?.address, {seconds: aYearAgoTimestampSeconds},{ seconds: aMonthFromNowTimestampSeconds }) : Promise.resolve([]),
      ])

      setIsAllowedUser(isAllowedUserData);
      setUserMealEvents(userMealEventsData);
      setMealEvents(mealEventsData);
      setLoading(false);
    }

    if (sdkHasLoaded) {
      fetchContractData();
    }
  }, [starknetWallet?.address, sdkHasLoaded]);

  const futureMeals: Meal[] = mealEvents.filter((mealEvent) => Number(mealEvent.time.seconds) * 1000 > Date.now()).slice(0, 10);
  const pastMeals = mealEvents.filter((mealEvent) => Number(mealEvent.time.seconds) * 1000 <= Date.now());

  return {pastMeals, futureMeals: addUserParticipationToMealEvents(futureMeals, userMealEvents), isAllowedUser, loading, updateMeal};
}

const addUserParticipationToMealEvents = (futureMeals: Meal[], userMealEvents: Meal[]) => {
  if (!userMealEvents.length) {
    return futureMeals
  } else {
    return futureMeals.map((meal) => {
      return {
        ...meal,
        registered: !!userMealEvents.find(({id, registered}) => (meal.id === id) && registered),
      } 
    })
  }
}
