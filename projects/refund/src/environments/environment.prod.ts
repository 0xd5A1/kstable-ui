export const environment = {
	production: true,
	mainnet: {
		networkId: 42220,
		rpc: {
			url: "https://forno.celo.org/",
		},
		payment: {
			address: '0x18e4e21a2c953f4095B1E20627D03dB587291e79',
		},
		pool: {
			address: '0xBE3fd02D1b64c776BEAFB1438970757dCde63AAa',
		},
		cusd: {
			address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
			decimals: 18,
		},
		usdt: {
			address: '0x88eeC49252c8cbc039DCdB394c0c2BA2f1637EA0',
			decimals: 6,
		},
		usdc: {
			address: '0xef4229c8c3250C675F21BCefa42f58EfbfF6002a',
			decimals: 6,
		}
	},
	deployer: {
		address: '0xb0d88027f5ded975ff6df7a62952033d67df277f',
	},
	dev: {
		address: '0xb0d88027f5ded975ff6df7a62952033d67df277f',
	},
	owner: {
		address: '0xb0d88027f5ded975ff6df7a62952033d67df277f',
	}
};
