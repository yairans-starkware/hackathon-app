import { RpcProvider, Contract } from "starknet";
import CateringAbi from './catering-abi.json'

export const CONTRACT_ADDRESS = '0x06e4c74c5203d0d16b54c9b9b075957e53a80bfc31ea1f98a8d5a733926f7ef0';

export const SepoliaRPCProvider = new RpcProvider({
  // nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno/v0_7",
  nodeUrl: "https://starknet-sepolia.public.blastapi.io",
});

export const ReadCateringContract = new Contract(CateringAbi, CONTRACT_ADDRESS, SepoliaRPCProvider);
