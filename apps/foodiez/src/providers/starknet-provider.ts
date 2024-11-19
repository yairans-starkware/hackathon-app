import { RpcProvider, Contract } from "starknet";
import CateringAbi from './catering-abi.json'

export const CONTRACT_ADDRESS = '0x013f2e25233f413544cebd905999d4cb17e17a0f619e42b1eb32db6e3693ad34';

export const SepoliaRPCProvider = new RpcProvider({
  nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno/v0_7",
});

export const ReadCateringContract = new Contract(CateringAbi, CONTRACT_ADDRESS, SepoliaRPCProvider);

