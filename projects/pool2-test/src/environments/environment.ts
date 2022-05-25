
import { common } from 'libs/common/com.evn';
export const environment = {
    production: false,
    poolId: "p2",
    liquiditySymbol: "CSLP-02",
    tokenSymbol: "KST",
    virtualPriceDiff: 0.006,
    coins: [{ symbol: 'tAUSD' }, { symbol: 'tCUSD' }, { symbol: 'tUSDT' }],
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
                pid: 1,
                coins: [
                    '0xcDe7Ee7D47dC62c608320793D13d079965205A3C',
                    '0x19D1d437EBC68A7C35a5F239397d452Cd6a51069',
                    '0xD29b6645bB2150789e7dC53e933f2478aCcb742C',
                ]
            }
        },
    },
    subgraphApi: "https://api.thegraph.com/subgraphs/name/0xa8c81519/my-subgraph"
};
