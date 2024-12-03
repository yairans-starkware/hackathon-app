import { RpcProvider, Contract } from "starknet";
import CateringAbi from './catering-abi.json'

export const CONTRACT_ADDRESS = '0x049c75609bb077a9427bc26a9935472ec75e5508ed216ef7f7ad2693397deebc';

export const SepoliaRPCProvider = new RpcProvider({
  // nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno/v0_7",
  nodeUrl: "https://starknet-sepolia.public.blastapi.io",
});

export const ReadCateringContract = new Contract(CateringAbi, CONTRACT_ADDRESS, SepoliaRPCProvider);
