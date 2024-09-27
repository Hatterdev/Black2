import bnbCoin from "../images/coins/bnb-coin.png";

export const supportNetwork = {
  56: {
    name: "BNB Mainnet",
    chainId: 56,
    rpc: "https://bsc-mainnet.public.blastapi.io",
    image: bnbCoin,
    symbol: "BNB",
  },
  default: {
    name: "BNB Mainnet",
    chainId: 56,
    rpc: "https://bsc-mainnet.public.blastapi.io",
    image: bnbCoin,
    symbol: "BNB",
  },
};

export const networkLists = [
  { code: 0, chainId: 97, label: 'BNB Chain Testnet', image: bnbCoin },
  { code: 0, chainId: 56, label: 'BNB Chain', image: bnbCoin },
];

export const RPC_URLS = {
  97: "https://data-seed-prebsc-1-s1.binance.org:8545", // Testnet
  56: "https://bsc-dataseed1.ninicoin.io", // Mainnet
};