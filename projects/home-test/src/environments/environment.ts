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
			text: 'Pool  XUSD / USDT / USDC',
			active: false,
			url: '/pool1',
			target: '_self'
		},
		{
			text: 'Stake LP XUSD / USDT / USDC',
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
        url: 'https://evm.evm-alpha.kava.io'
    },
    pool1: {
		address: '0xa8c1B794103019588Ee5770a07a71D5973eCC805',
	},
	liqudityFarmingProxy: {
		address: '0xe864964E9A4A7a82da3a9FF1A6e112B03DFeebE8'
	},
	bstToken: {
		address: '0x2BF3416B1920948DEeed86262420798DfB1c7dd8'
	},
	paymentFarmingProxy: {
		address: '0x8fDab72B930bc06F17b9C605137E9E079b2b4EBb'
	},
	xusd: {
		address: '0x08682488BfFCb5976a8d36D69d31004e202c592A'
	},
	usdt: {
		address: '0x26bC7B757E9fCB63dC7Dad302aE61415e5c3A0BB'
	},
	usdc: {
		address: '0xd31Fc6B4840Eb2b8fe0cf148395E798b9D9Eb343'
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
