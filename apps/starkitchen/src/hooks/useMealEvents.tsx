import { useCallback, useEffect, useState } from "react";
import { Meal } from "../types/meal";
import { getStartMonthOfEventTracking, getTimestampForFirstDayOfMonth } from "../utils/date";
import { useStarknetWallet, useWalletEvents } from "@catering-app/starknet-contract-connect";
import { useCateringContract } from "./useCateringContract";

// let fetched = false;
export const useMealEvents = () => {
  const [mealEvents, setMealEvents] = useState<Meal[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAllowedUser, setIsAllowedUser] = useState<boolean>();
  const [loadingAllEvents, setLoadingAllEvents] = useState(true);
  const [isSuccessFetchingUserEvents, setSuccessFetchingUserEvents] = useState(false);
  const [foodieRank, setFoodieRank] = useState<number>();
  const cateringContract = useCateringContract();

  const starknetWallet = useStarknetWallet();
  const {isFullyLoaded} = useWalletEvents();

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
        // if (fetched) {
        //   return;
        // }
        const [allTimeReportResponse, isAdminResponse, isAllowedUserResponse, mealEventsResponse, userMealEventsResponse] = await Promise.all([
          starknetWallet?.address ? cateringContract?.read.get_participation_report_by_time({seconds: 0}, {seconds: Math.floor(Date.now() / 1000)}) : Promise.resolve(null),
          starknetWallet?.address ? cateringContract?.read.is_admin(starknetWallet?.address) : Promise.resolve(false),
          starknetWallet?.address ? cateringContract.read?.is_allowed_user(starknetWallet?.address) : Promise.resolve(false),
          cateringContract.read.get_events_infos_by_time({seconds: aYearAgoTimestampSeconds},{ seconds: aMonthFromNowTimestampSeconds }),
          starknetWallet?.address ? cateringContract.read.get_user_events_by_time(starknetWallet?.address, {seconds: aYearAgoTimestampSeconds},{ seconds: aMonthFromNowTimestampSeconds }) : Promise.resolve([]),
        ])

        // fetched = true;
        setIsAdmin(isAdminResponse);
        setIsAllowedUser(isAllowedUserResponse);
        setMealEvents(addUserParticipationToMealEvents(mealEventsResponse, userMealEventsResponse));
        setLoadingAllEvents(false);
        setFoodieRank(findOverallRankFromReport(allTimeReportResponse, starknetWallet.address));
        if (starknetWallet?.address) {
          setSuccessFetchingUserEvents(true);
        }
      } catch (e) {
        console.log('Caught an error while fetching meal events:', e);
      }
    }

    if (isFullyLoaded) {
      fetchContractData();
    }
  }, [starknetWallet?.address, isFullyLoaded]);

  const futureMeals: Meal[] = mealEvents.filter((mealEvent) => Number(mealEvent.info.time.seconds) * 1000 > Date.now()).slice(0, 7);
  const pastMeals = mealEvents.filter((mealEvent) => Number(mealEvent.info.time.seconds) * 1000 <= Date.now());

  return {
    isAdmin,
    pastMeals,
    foodieRank,
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

const findOverallRankFromReport = (walletReport: {user: BigInt; n_participations: BigInt}[], user: string) => {
  return walletReport.sort(({n_participations: nParticipationsUserA}, {n_participations: nParticipationsUserB}) => nParticipationsUserA < nParticipationsUserB ? 1 : -1).findIndex(({user: trimmedUserAddress}) => user.includes(trimmedUserAddress.toString(16))) + 1;
}
