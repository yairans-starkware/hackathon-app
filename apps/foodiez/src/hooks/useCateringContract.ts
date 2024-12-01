import { AccountInterface, Contract } from "starknet";
import { CONTRACT_ADDRESS } from "../providers/starknet-provider";
import CateringAbi from '../providers/catering-abi.json';
import { useEffect, useState } from "react";
import { useStarknetWallet } from "@catering-app/starknet-contract-connect";

export const useCateringContract = () => {
  const [contract, setContract] = useState<Contract>();
  const starknetWallet = useStarknetWallet();
  
  useEffect(() => {
    starknetWallet?.getWalletAccount().then((walletAccount) => {
      const cateringContract = new Contract(CateringAbi, CONTRACT_ADDRESS, walletAccount as unknown as AccountInterface);
      setContract(cateringContract);
    });
  }, [starknetWallet])

  return contract;
}
