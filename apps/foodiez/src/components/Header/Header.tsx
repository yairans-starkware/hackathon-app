import { LogOut, Wallet as WalletIcon} from "lucide-react"
import { Button } from "../ui/button"
import { useDynamicContext, Wallet } from "@dynamic-labs/sdk-react-core";
import { DisconnectWalletDialog } from "../Dialogs/DisconnectWalletDialog";
import { useCallback, useState } from "react";

const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const Header = ({
  isConnected, 
  balance, 
  onConnectWallet,
  wallet,
}: {
  isConnected: boolean;
  balance: number;
  onConnectWallet: () => void;
  wallet?: Wallet<any>,
}) => {
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState<boolean>(false);
  const {handleLogOut} = useDynamicContext();

  const handleCloseDisconnectDialog = useCallback(() => {
    setIsDisconnectDialogOpen(false);
  }, [])
  
  const disconnect = useCallback(() => {
    handleLogOut();
    handleCloseDisconnectDialog();
  }, []);

  const openDisconnectDialog = () => {
    setIsDisconnectDialogOpen(true);
  }
  
  return (
    <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">foodiez</h1>
          <div className="flex items-center space-x-4">
              {isConnected ? (
              <>
                <span className="text-sm font-medium text-gray-500">
                  Balance: {balance.toString()} CAT
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {truncateAddress(wallet?.address ?? '')}
                </span>
                <Button variant="ghost" size="icon" onClick={openDisconnectDialog}>
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Disconnect wallet</span>
                </Button>
              </>
            ) : (
              <Button onClick={onConnectWallet}>
                <WalletIcon className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
        <DisconnectWalletDialog onDisconnect={disconnect} open={isDisconnectDialogOpen} onClose={handleCloseDisconnectDialog} />
      </header>
  )
}
