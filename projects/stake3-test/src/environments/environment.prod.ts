export const environment = {
    production: true,
    poolId: "p2",
    liquiditySymbol: "KSLP-03",
    tokenSymbol: "KST",
    virtualPriceDiff: 0.006,
    coins: [{ symbol: 'tUSDC' }, { symbol: 'tXUSD' }, { symbol: 'tUSDT' }],
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
                pid: 1
            }
        }
    },
};
