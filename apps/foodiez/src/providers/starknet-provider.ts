import { RpcProvider, Contract } from "starknet";
import CateringAbi from './catering-abi.json'

export const CONTRACT_ADDRESS = '0x065493c28778c5deb6f2c5f39424c0907e39e5949ab6f4b8b39cdc87364b8aa6';

export const SepoliaRPCProvider = new RpcProvider({
  // nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno/v0_7",
  nodeUrl: "https://starknet-sepolia.public.blastapi.io",
});

export const ReadCateringContract = new Contract(CateringAbi, CONTRACT_ADDRESS, SepoliaRPCProvider);
