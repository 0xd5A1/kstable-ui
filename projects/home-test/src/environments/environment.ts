// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
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
			url: 'https://docs.kstable.io,
			target: '_blank'
		}
	],
	rpc: {
		url: 'https://alfajores-forno.celo-testnet.org'
	},
	pool1: {
		address: '0x58236aFaF0E2eA107ceCe1e260fE3f0b2DD983A0',
	},
	liqudityFarmingProxy: {
		address: '0x1417b04E2Ce9cF52ca9e007749e8E2D89209F30b'
	},
	bstToken: {
		address: '0x0e944385C537730410cd5f5975dEE0f3d6A88a76'
	},
	paymentFarmingProxy: {
		address: '0x1650d61B57943f0af725cB8275c0D9147366CB27'
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
