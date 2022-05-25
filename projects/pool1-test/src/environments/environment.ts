import { common } from 'libs/common/com.evn';
export const environment = {
	production: false,
	poolId: "p1",
	liquiditySymbol: "CSLP-01",
	tokenSymbol: "KST",
	virtualPriceDiff: 0.006,
	coins: [{ symbol: 'CUSD', decimals: 18 }, { symbol: 'USDT', decimals: 6 }, { symbol: 'USDC', decimals: 6 }],
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
				pid: 0,
				coins: [
					'0x765DE816845861e75A25fCA122bb6898B8B1282a',
					'0x88eeC49252c8cbc039DCdB394c0c2BA2f1637EA0',
					'0xef4229c8c3250C675F21BCefa42f58EfbfF6002a',
				]
			}
		},
	},
	subgraphApi: "https://api.thegraph.com/subgraphs/name/0xa8c81519/my-subgraph"
};
