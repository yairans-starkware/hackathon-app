import {Button} from './ui/button';
import {Wallet as WalletIcon} from "lucide-react";
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export const ConnectWalletButton = ({onConnect}: {onConnect?: () => void}) => {
  const {setShowAuthFlow} = useDynamicContext();

  const onConnectWallet = () => {
    onConnect?.();
    setShowAuthFlow(true);
  }

  return (
    <Button onClick={onConnectWallet}>
      <WalletIcon className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
