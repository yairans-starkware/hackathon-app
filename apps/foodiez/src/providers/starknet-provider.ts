import { RpcProvider, Contract } from "starknet";
import CateringAbi from './catering-abi.json'

export const CONTRACT_ADDRESS = '0x028790776598dcd77cc79d8fd2be72b70bf600953084d6ce854b3e9edb5cdff1';

export const SepoliaRPCProvider = new RpcProvider({
  nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno/v0_7",
});

export const ReadCateringContract = new Contract(CateringAbi, CONTRACT_ADDRESS, SepoliaRPCProvider);
