export const environment = {
    production: true,
    poolId: "p2",
    liquiditySymbol: "KSLP-02",
    tokenSymbol: "KST",
    virtualPriceDiff: 0.006,
    coins: [{ symbol: 'AUSD' }, { symbol: 'XUSD' }, { symbol: 'USDT' }],
    rpc: {
        56: "https://bsc-dataseed.binance.org/",
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    },
    chains: {
        56: {
            enabled: true,
            name: 'Mainnet',
            contracts: {
                proxy: {
                    address: "0x931B226EBb7134a19B970cBF74f18E40a4239178"
                },
                pid: 1,
                coins: [
                    '0xb8c540d00dd0bf76ea12e4b4b95efc90804f924e',
                    '0xe9e7cea3dedca5984780bafc599bd69add087d56',
                    '0x55d398326f99059ff775485246999027b3197955',
                ]
            }
        },
    },
    subgraphApi: "https://api.thegraph.com/subgraphs/name/0xa8c81519/my-subgraph"
};
