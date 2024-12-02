import React from "react";
import { Button } from './ui/button';
import { Wallet as WalletIcon } from "lucide-react";
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
export const ConnectWalletButton = ({ onConnect }) => {
    const { setShowAuthFlow } = useDynamicContext();
    const onConnectWallet = () => {
        console.log('@@@@@@@@@set');
        onConnect === null || onConnect === void 0 ? void 0 : onConnect();
        setShowAuthFlow(true);
    };
    return (React.createElement(Button, { onClick: onConnectWallet },
        React.createElement(WalletIcon, { className: "mr-2 h-4 w-4" }),
        "Connect Wallet"));
};
//# sourceMappingURL=ConnectWalletButton.js.map