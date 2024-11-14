import { Wallet } from "lucide-react"
import { Button } from "../ui/button"

export const Header = ({
  isConnected, 
  balance, 
  onConnectWallet
}: {
  isConnected: boolean;
  balance: number;
  onConnectWallet: () => void;
}) => {
  return (
    <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">foodiez</h1>
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <span className="text-sm font-medium text-gray-500">
                Balance: ${balance.toFixed(2)}
              </span>
            ) : null}
            <Button onClick={onConnectWallet} disabled={isConnected}>
              <Wallet className="mr-2 h-4 w-4" />
              {isConnected ? 'Connected' : 'Connect Wallet'}
            </Button>
          </div>
        </div>
      </header>
  )
}