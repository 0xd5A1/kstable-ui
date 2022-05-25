export const environment = {
	production: true,
	poolId: 'pay',
	paymentTokenSymbol: 'CSPT',
	tokenSymbol: 'KST',
	virtualPriceDiff: 0.006,
	coins: [{ symbol: 'CUSD', decimals: 18 }, { symbol: 'USDT', decimals: 6 }, { symbol: 'USDC', decimals: 6 }],
	rpc: {
		42220: 'https://forno.celo.org'
	},
	chains: {
		42220: {
			enabled: true,
			name: 'Mainnet',
			contracts: {
				proxy: {
					address: '0x88BF45B1A80C24A409163709504fe81D37304c46'
				},
				payment: {
					address: '0x18e4e21a2c953f4095B1E20627D03dB587291e79'
				}
			}
		},
	},
	subgraphApi: 'https://api.thegraph.com/subgraphs/name/0xa8c81519/my-subgraph'
};
