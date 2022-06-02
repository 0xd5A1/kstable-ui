export const environment = {
	production: true,
	poolId: 'pay',
	paymentTokenSymbol: 'KSPT',
	tokenSymbol: 'KST',
	virtualPriceDiff: 0.006,
	coins: [{ symbol: 'XUSD', decimals: 18 }, { symbol: 'USDT', decimals: 18 }, { symbol: 'USDC', decimals: 18 }],
	rpc: {
		2222: 'https://evm.kava.io'
	},
	chains: {
		2222: {
			enabled: true,
			name: 'Mainnet',
			contracts: {
				proxy: {
					address: '0x143Fd1e4552E41028302e6d63855E4719707d6A3'
				},
				payment: {
					address: '0x13113F038B761D580AE431Ed189a8a6303DcE27e'
				}
			}
		},
	},
	subgraphApi: 'https://api.thegraph.com/subgraphs/name/0xa8c81519/my-subgraph'
};
