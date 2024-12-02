import { useEffect, useMemo, useState } from "react";
import { Contract, RpcProvider } from "starknet";
import { useStarknetWallet } from "./useStarknetWallet";
export const SepoliaRPCProvider = new RpcProvider({
    // nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno/v0_7",
    nodeUrl: "https://starknet-sepolia.public.blastapi.io",
});
export const useContract = ({ abi, address }) => {
    const [writeContract, setWriteContract] = useState();
    const readContract = useMemo(() => new Contract(abi, address, SepoliaRPCProvider), [abi]);
    const starknetWallet = useStarknetWallet();
    useEffect(() => {
        starknetWallet === null || starknetWallet === void 0 ? void 0 : starknetWallet.getWalletAccount().then((walletAccount) => {
            const cateringContract = new Contract(abi, address, walletAccount);
            setWriteContract(cateringContract);
        });
    }, [starknetWallet]);
    return {
        write: writeContract,
        read: readContract,
    };
};
//# sourceMappingURL=useContract.js.map