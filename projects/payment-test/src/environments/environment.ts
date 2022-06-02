import { common } from 'libs/common/com.evn';
export const environment = {
	production: false,
	poolId: 'pay',
	paymentTokenSymbol: 'KSPT',
	tokenSymbol: 'KST',
	virtualPriceDiff: 0.006,
	coins: [{ symbol: 'XUSD', decimals: 18 }, { symbol: 'USDT', decimals: 18 }, { symbol: 'USDC', decimals: 18 }],
	rpc: {
		2221: 'https://evm.evm-alpha.kava.io'
	},
	chains: {
		2221: {
			enabled: true,
			name: 'Mainnet',
			contracts: {
				proxy: {
					address: '0xe864964E9A4A7a82da3a9FF1A6e112B03DFeebE8'
				},
				payment: {
					address: '0x8fDab72B930bc06F17b9C605137E9E079b2b4EBb'
				}
			}
		},
	},
	subgraphApi: 'https://api.thegraph.com/subgraphs/name/0xa8c81519/my-subgraph'
};
