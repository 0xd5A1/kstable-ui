export const environment = {
	production: true,
	poolId: "p1",
	liquiditySymbol: "KSLP-01",
	tokenSymbol: "KST",
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
					address: "0x143Fd1e4552E41028302e6d63855E4719707d6A3"
				},
				pid: 0,
				coins: [
					'0xFF7115a700def81bCF928D9bBc747e3300e029af',
					'0x03621d865a9F40e093618E451b10c0360cca111B',
					'0x989E5940A0D05DEEa4ce19b03F2f02E9EAB5277C',
				]
			}
		},
	},
	subgraphApi: "https://api.thegraph.com/subgraphs/name/0xa8c81519/my-subgraph"
};
