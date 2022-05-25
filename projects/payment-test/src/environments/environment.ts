import { common } from 'libs/common/com.evn';
export const environment = {
	production: false,
	poolId: 'pay',
	paymentTokenSymbol: 'CSPT',
	tokenSymbol: 'KST',
	virtualPriceDiff: 0.006,
	coins: [{ symbol: 'CUSD', decimals: 18 }, { symbol: 'USDT', decimals: 6 }, { symbol: 'USDC', decimals: 6 }],
	rpc: {
		56: 'https://bsc-dataseed.binance.org/',
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
				payment: {
					address: common.payment.address
				}
			}
		},
	},
	subgraphApi: 'https://api.thegraph.com/subgraphs/name/0xa8c81519/my-subgraph'
};
