import { RpcProvider, Contract } from "starknet";
import CateringAbi from './catering-abi.json'

export const CONTRACT_ADDRESS = '0x028b75152c35d0f4bc5faa3676e43e32644f16872160f77195ae866b66f33776';

export const SepoliaRPCProvider = new RpcProvider({
  // nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno/v0_7",
  nodeUrl: "https://starknet-sepolia.public.blastapi.io",
});

export const ReadCateringContract = new Contract(CateringAbi, CONTRACT_ADDRESS, SepoliaRPCProvider);
