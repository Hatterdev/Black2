import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { ethers } from "ethers";
import Web3 from "web3";

export const CHAIN_ID = 56; // Para a mainnet BSC
export const infura_Id = "84842078b09946638c03157f83405213";

export const supportNetwork = {
  56: {
    rpc: "https://bsc-dataseed.binance.org/",
  },
  84531: {
    rpc: "https://goerli.basescan.org",
  },
  default: {
    rpc: "https://bsc-dataseed.binance.org/",
  },
};

export const getRpcUrl = () => {
  return {
    56: "https://bsc-dataseed.binance.org/",
    84531: "https://goerli.basescan.org",
  } [CHAIN_ID];
};

export const getWeb3 = (chainId) => {
  let setRpc = supportNetwork[chainId] ?
    supportNetwork[chainId].rpc :
    supportNetwork["default"].rpc;
  return new Web3(setRpc);
};

export const supportChainId = Object.keys(supportNetwork).map(function(key) {
  return parseInt(key);
});

export const injected = new InjectedConnector({
  supportedChainIds: supportChainId,
});

export const walletconnect = new WalletConnectConnector({
  rpc: {
    56: "https://bsc-dataseed.binance.org/",
    84531: "https://goerli.basescan.org",
  },
  qrcode: true,
  infuraId: infura_Id,
});

export const coinbaseWallet = new WalletLinkConnector({
  url: "https://bsc-dataseed.binance.org/",
  appName: "BLACK SALE",
  supportedChainIds: supportChainId,
});

export const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
  getRpcUrl()
);