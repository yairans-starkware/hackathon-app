import { useState } from 'react';
import { Header } from './Header/Header';
import { useStarknetWallet } from '@catering-app/starknet-contract-connect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, PieChart, Users } from 'lucide-react';
import { AppTabs } from '../types/ui';
import { UpcomingMealsTab } from './UpcomingMealsTab/UpcomingMealsTab';
import { StatsTab } from './StatsTab/StatsTab';
import { useMealEvents } from '../hooks/useMealEvents';
import { ManagementTab } from './ManagementTab/ManagementTab';

export const StarkitchenApp = () => {
  const starknetWallet = useStarknetWallet();
  const [activeTab, setActiveTab] = useState<string>(AppTabs.MEAL_REGISTRATION);
  const {pastMeals, futureMeals, isAllowedUser, loadingAllEvents, isSuccessFetchingUserEvents, updateMeal, setSuccessFetchingUserEvents} = useMealEvents();


  const isWalletConnected = Boolean(starknetWallet);

  const onConnectWallet = async () => {
    setSuccessFetchingUserEvents(false);
  }

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <Header wallet={starknetWallet} isConnected={isWalletConnected} onConnectWallet={onConnectWallet} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value={AppTabs.MEAL_REGISTRATION}>
            <Calendar className="mr-2 h-4 w-4" />
            Meal Registration
          </TabsTrigger>
          <TabsTrigger disabled={!isWalletConnected} value={AppTabs.STATS_AND_PREV_MEALS}>
            <PieChart className="mr-2 h-4 w-4" />
            History & Stats
          </TabsTrigger>
          <TabsTrigger value={AppTabs.MANAGEMENT}>
              <Users className="mr-2 h-4 w-4" />
              Management
            </TabsTrigger>
        </TabsList>
        <TabsContent value={AppTabs.MEAL_REGISTRATION} className="space-y-12">
          <UpcomingMealsTab
            updateMeal={updateMeal}
            loadingAllEvents={loadingAllEvents}
            isSuccessFetchingUserEvents={isSuccessFetchingUserEvents}
            isAllowedUser={isAllowedUser}
            futureMeals={futureMeals}
            pastMeals={pastMeals}
            address={starknetWallet?.address} 
            onConnectWallet={onConnectWallet}
            isWalletConnected={isWalletConnected}
          />
        </TabsContent>
        <TabsContent value={AppTabs.STATS_AND_PREV_MEALS} className="space-y-12">
          <StatsTab
            setActiveTab={setActiveTab}
            meals={pastMeals}
          />
        </TabsContent>
        <TabsContent value={AppTabs.MANAGEMENT} className="space-y-12">
          <ManagementTab />  
        </TabsContent>
      </Tabs>
      </main>
    </div>
  )
}
