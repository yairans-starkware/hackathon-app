import { useCallback, useEffect, useState } from "react";
import { ReadCateringContract } from "../providers/starknet-provider";
import { useUserWallets } from "@dynamic-labs/sdk-react-core";
import { Meal } from "../types/meal";
import { useCateringContract } from "./useCateringContract";

export const useMealEvents = () => {
  const [mealEvents, setMealEvents] = useState<Meal[]>([]);
  const [balance, setBalance] = useState<number>();
  const wallets = useUserWallets();
  const starknetWallet = wallets.find(wallet => wallet.chain === 'STARK');
  const contract = useCateringContract();

  console.log('@@@@@@mealEvents', mealEvents);
  const updateMeal = useCallback((mealId: string) => {
    const indexOfUpdatedMeal = mealEvents.map((meal) => meal.id).indexOf(mealId);
    const oldMeal = mealEvents[indexOfUpdatedMeal];
    const newMeal = {
      ...oldMeal,
      registered: !oldMeal.registered,
    }

    setBalance(oldMeal.registered ? balance! + 1 : balance! - 1);
    setMealEvents([...mealEvents.slice(0, indexOfUpdatedMeal), newMeal, ...mealEvents.slice(indexOfUpdatedMeal + 1)]);
  }, [mealEvents, balance]);

  useEffect(() => {
    const setWalletBalance = async () => {
      const walletBalance = Number((await ReadCateringContract?.balanceOf(starknetWallet?.address)));
      setBalance(walletBalance);
    }

    if (starknetWallet && contract) {
      setWalletBalance();
    }
  }, [starknetWallet, contract])

  useEffect(() => {
    const eventData = async () => {
      const eventCount = await ReadCateringContract.n_events();
      const events = await ReadCateringContract?.get_user_evernts(starknetWallet?.address, eventCount.toString())
      setMealEvents(events)
    }

    eventData();
  }, [starknetWallet?.address]);

  const futureMeals: Meal[] = mealEvents.filter((mealEvent) => mealEvent.time > Date.now());
  const pastMeals = mealEvents.filter((mealEvent) => mealEvent.time <= Date.now());;

  return {pastMeals, futureMeals, balance, updateMeal, setBalance};
}
