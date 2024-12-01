import { useUserWallets } from "@dynamic-labs/sdk-react-core";
import { useMemo } from "react";
export const useStarknetWallet = () => {
    const wallets = useUserWallets();
    const starknetWallet = useMemo(() => {
        return wallets.find(wallet => wallet.chain === 'STARK');
    }, [wallets]);
    return starknetWallet;
};
//# sourceMappingURL=useStarknetWallet.js.map