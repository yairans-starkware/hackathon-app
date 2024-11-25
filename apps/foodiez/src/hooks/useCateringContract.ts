import { AccountInterface, Contract } from "starknet";
import { CONTRACT_ADDRESS } from "../providers/starknet-provider";
import CateringAbi from '../providers/catering-abi.json';
import { useUserWallets } from "@dynamic-labs/sdk-react-core";
import { useEffect, useMemo, useState } from "react";
import { StarknetWallet } from "@dynamic-labs/starknet";

export const useCateringContract = () => {
  const [contract, setContract] = useState<Contract>();
  const wallets = useUserWallets();
  const starknetWallet = useMemo(() => {
    return wallets.find(wallet => wallet.chain === 'STARK') as StarknetWallet;
  }, [wallets]);

  useEffect(() => {
    starknetWallet?.getWalletAccount().then((walletAccount) => {
      const cateringContract = new Contract(CateringAbi, CONTRACT_ADDRESS, walletAccount as unknown as AccountInterface);
      setContract(cateringContract);
    });
  }, [starknetWallet])

  return contract;
}
