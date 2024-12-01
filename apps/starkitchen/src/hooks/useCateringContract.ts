import { CONTRACT_ADDRESS } from "../providers/starknet-provider";
import CateringAbi from '../providers/catering-abi.json';
import { useContract } from "@catering-app/starknet-contract-connect";

export const useCateringContract = () => {
  return useContract({
    abi: CateringAbi,
    address: CONTRACT_ADDRESS,
  })
}
