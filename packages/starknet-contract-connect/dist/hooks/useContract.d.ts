import { Abi, Contract, RpcProvider } from "starknet";
export declare const SepoliaRPCProvider: RpcProvider;
export declare const useContract: ({ abi, address }: {
    abi: Abi;
    address: string;
}) => {
    write: Contract | undefined;
    read: Contract;
};
//# sourceMappingURL=useContract.d.ts.map