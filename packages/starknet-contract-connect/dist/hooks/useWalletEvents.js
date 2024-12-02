import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
export const useWalletEvents = () => {
    const { handleLogOut, sdkHasLoaded } = useDynamicContext();
    return {
        handleLogOut,
        isFullyLoaded: sdkHasLoaded,
    };
};
//# sourceMappingURL=useWalletEvents.js.map