import { LogOut } from "lucide-react"
import { Button } from "../ui/button"
import { DisconnectWalletDialog } from "../Dialogs/DisconnectWalletDialog";
import { useCallback, useState } from "react";
import { SrcPrefix } from "../../utils/consts";
import { truncateAddress } from "../../utils/string";
import { ConnectWalletButton, useWalletEvents, Wallet } from "@catering-app/starknet-contract-connect";

export const Header = ({
  isConnected,
  onConnectWallet,
  wallet,
}: {
  isConnected: boolean;
  onConnectWallet: () => void;
  wallet?: Wallet<any>,
}) => {
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState<boolean>(false);
  const {handleLogOut} = useWalletEvents();

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
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img src={`${SrcPrefix}/starkitchen-logo-transparent.png`} alt="StarKitchen Logo" className="h-12" />
              <h1 className="text-3xl font-bold text-gray-900">StarKitchen</h1>
            </div>
            <div className="flex items-center space-x-4">
                {isConnected ? (
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                  <span className="text-sm font-medium text-gray-500">
                    {truncateAddress(wallet?.address ?? '')}
                  </span>
                  <Button variant="ghost" size="sm" onClick={openDisconnectDialog}>
                    <LogOut className="h-4 w-4" />
                    <span>Disconnect wallet</span>
                  </Button>
                </div>
              ) : (
                <ConnectWalletButton onConnect={onConnectWallet} />
              )}
            </div>
          </div>
        </div>
        <DisconnectWalletDialog onDisconnect={disconnect} open={isDisconnectDialogOpen} onClose={handleCloseDisconnectDialog} />
      </header>
  )
}
