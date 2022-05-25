import { common } from 'libs/common/com.evn';
export const environment = {
    production: false,
    poolId: "p2",
    liquiditySymbol: "CSLP-03",
    tokenSymbol: "KST",
    virtualPriceDiff: 0.006,
    coins: [{ symbol: 'tUSDC' }, { symbol: 'tCUSD' }, { symbol: 'tUSDT' }],
    rpc: {
        56: "https://bsc-dataseed.binance.org/",
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
		44787: 'https://alfajores-forno.celo-testnet.org'
    },
    chains: {
        44787: {
            enabled: true,
            name: 'Testnet',
            contracts: {
                proxy: {
                    address: common.proxy.address
                },
                pid: 1
            }
        }
    },
};
