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
        url: 'https://evm.kava.io'
    },
    pool1: {
		address: '0xBaE4DD59f8B700146153479806037812742D3B4c',
	},
	liqudityFarmingProxy: {
		address: '0x143Fd1e4552E41028302e6d63855E4719707d6A3'
	},
	bstToken: {
		address: '0xb820592cBEd1663225201e313c94e13AC53A0Df4'
	},
	paymentFarmingProxy: {
		address: '0x13113F038B761D580AE431Ed189a8a6303DcE27e'
	},
	xusd: {
		address: '0xFF7115a700def81bCF928D9bBc747e3300e029af'
	},
	usdt: {
		address: '0x03621d865a9F40e093618E451b10c0360cca111B'
	},
	usdc: {
		address: '0x989E5940A0D05DEEa4ce19b03F2f02E9EAB5277C'
	}
};
