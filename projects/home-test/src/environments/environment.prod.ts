export const environment = {
    production: true,
    menu: [
        {
            text: 'Pay',
            active: false,
            url: '/payment',
            target: '_self'
        },
        {
            text: 'Pool  CUSD / USDT / USDC',
            active: false,
            url: '/pool1',
            target: '_self'
        },
        {
            text: 'Stake LP CUSD / USDT / USDC',
            active: false,
            url: '/stake1',
            target: '_self'
        },
        {
            text: 'Docs',
            active: false,
            url: 'https://docs.kstable.io',
            target: '_blank'
        }
    ],
    rpc: {
        url: 'https://forno.celo.org'
    },
    pool1: {
		address: '0xBE3fd02D1b64c776BEAFB1438970757dCde63AAa',
	},
	liqudityFarmingProxy: {
		address: '0x88BF45B1A80C24A409163709504fe81D37304c46'
	},
	bstToken: {
		address: '0x3a0f2216C28F5f5c486aB09DCc2CA72A3dFADD88'
	},
	paymentFarmingProxy: {
		address: '0x18e4e21a2c953f4095B1E20627D03dB587291e79'
	},
	cusd: {
		address: '0x765DE816845861e75A25fCA122bb6898B8B1282a'
	},
	usdt: {
		address: '0x88eeC49252c8cbc039DCdB394c0c2BA2f1637EA0'
	},
	usdc: {
		address: '0xef4229c8c3250C675F21BCefa42f58EfbfF6002a'
	}
};
