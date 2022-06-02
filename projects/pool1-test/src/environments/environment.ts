import { common } from 'libs/common/com.evn';
export const environment = {
	production: false,
	poolId: "p1",
	liquiditySymbol: "KSLP-01",
	tokenSymbol: "KST",
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
					address: "0xe864964E9A4A7a82da3a9FF1A6e112B03DFeebE8"
				},
				pid: 0,
				coins: [
					'0x08682488BfFCb5976a8d36D69d31004e202c592A',
					'0x26bC7B757E9fCB63dC7Dad302aE61415e5c3A0BB',
					'0xd31Fc6B4840Eb2b8fe0cf148395E798b9D9Eb343',
				]
			}
		},
	},
	subgraphApi: "https://api.thegraph.com/subgraphs/name/0xa8c81519/my-subgraph"
};
