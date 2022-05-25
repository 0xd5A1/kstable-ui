export const environment = {
    production: true,
    poolId: "p1",
    liquiditySymbol: "BSPT",
    tokenSymbol: "KST",
    virtualPriceDiff: 0.006,
    coins: [{ symbol: 'tDAI' }, { symbol: 'tUSD' }, { symbol: 'tUSDT' }],
    rpc: {
        56: "'https://bsc-dataseed.binance.org/'",
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    },
    chains: {
        97: {
            enabled: true,
            name: 'Testnet',
            contracts: {
                proxy: {
                    address: "0xAcDe76E0175779088b8557a21b00F16D56651d25"
                },
                pid: 1
            }
        }
    },
};
