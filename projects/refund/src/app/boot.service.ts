import { ApplicationRef, Injectable } from '@angular/core';
import { ethers } from "ethers";
import { environment } from '../environments/environment';
import ERC20 from 'libs/abi/ERC20.json';
import PaymentFarmingProxy from 'libs/abi/PaymentFarmingProxy.json';
import KStablePool from 'libs/abi/KStablePool.json';
import KSTToken from 'libs/abi/KSTToken.json';
import KSTMinter from 'libs/abi/KSTMinter.json';
import LiquidityFarmingProxy from 'libs/abi/LiquidityFarmingProxy.json';
// import RefundJson from 'libs/abi/Refund.json';
import { Network } from '@ethersproject/providers';

@Injectable({
	providedIn: 'root'
})
export class BootService {

	public mainnetJsonRpcProvider: ethers.providers.JsonRpcProvider;
	public accounts;
	public web3Provider: ethers.providers.Web3Provider;

	public paymentFeeIncomeUsdc = ethers.BigNumber.from(0);
	public paymentFeeIncomeBusd = ethers.BigNumber.from(0);
	public paymentFeeIncomeUsdt = ethers.BigNumber.from(0);
	public adminFeeIncomeUsdc = ethers.BigNumber.from(0);
	public adminFeeIncomeBusd = ethers.BigNumber.from(0);
	public adminFeeIncomeUsdt = ethers.BigNumber.from(0);
	public paymentContract: ethers.Contract;
	public usdcContract: ethers.Contract;
	public busdContract: ethers.Contract;
	public usdtContract: ethers.Contract;
	public poolContract: ethers.Contract;
	public cstContract: ethers.Contract;
	public minterContract: ethers.Contract;
	public liquidityContract: ethers.Contract;
	tokenContract: ethers.Contract;
	// refundContract: ethers.Contract;
	userInfo: any = { fund: ethers.BigNumber.from(0) };
	network: Network;
	fundsBalance = ethers.BigNumber.from(0);

	isPoolOwner: boolean;
	isMinterOwner: boolean;
	defaultOwner = environment.owner;

	poolCusdBalance: string;
	poolUsdtBalance: string;
	poolUsdcBalance: string;
	poolVirtualPrice: string;
	cstTotalSupply: string;

	constructor(private applicationRef: ApplicationRef) {
		this.mainnetJsonRpcProvider = new ethers.providers.JsonRpcProvider(environment.mainnet.rpc.url);
		this.paymentContract = new ethers.Contract(environment.mainnet.payment.address, PaymentFarmingProxy.abi, this.mainnetJsonRpcProvider);
		this.usdcContract = new ethers.Contract(environment.mainnet.usdc.address, ERC20.abi, this.mainnetJsonRpcProvider);
		this.busdContract = new ethers.Contract(environment.mainnet.cusd.address, ERC20.abi, this.mainnetJsonRpcProvider);
		this.usdtContract = new ethers.Contract(environment.mainnet.usdt.address, ERC20.abi, this.mainnetJsonRpcProvider);
		this.poolContract = new ethers.Contract(KStablePool.networks[environment.mainnet.networkId].address, KStablePool.abi, this.mainnetJsonRpcProvider);
		this.cstContract = new ethers.Contract(KSTToken.networks[environment.mainnet.networkId].address, KSTToken.abi, this.mainnetJsonRpcProvider);
		this.minterContract = new ethers.Contract(KSTMinter.networks[environment.mainnet.networkId].address, KSTMinter.abi, this.mainnetJsonRpcProvider);
		this.liquidityContract = new ethers.Contract(LiquidityFarmingProxy.networks[environment.mainnet.networkId].address, LiquidityFarmingProxy.abi, this.mainnetJsonRpcProvider);

		// this.poolContract.on('RemoveLiquidity', (sender, amounts, fees, totalSupply) => {
		// 	let msg = '\nRemoveLiquidity: KStablePool \n';
		// 	msg += "sender: " + sender + '\n';
		// 	msg += 'cusd: ' + ethers.utils.formatUnits(amounts[0], environment.mainnet.cusd.decimals) + ' / ' + ethers.utils.formatUnits(fees[0], environment.mainnet.cusd.decimals) + '\n';
		// 	msg += 'usdt: ' + ethers.utils.formatUnits(amounts[1], environment.mainnet.usdt.decimals) + ' / ' + ethers.utils.formatUnits(fees[1], environment.mainnet.usdt.decimals) + '\n';
		// 	msg += 'usdc: ' + ethers.utils.formatUnits(amounts[2], environment.mainnet.usdc.decimals) + ' / ' + ethers.utils.formatUnits(fees[2], environment.mainnet.usdc.decimals) + '\n';
		// 	msg += 'TotalSupply: ' + ethers.utils.formatEther(totalSupply);
		// 	console.info(msg);
		// });
		// this.poolContract.on('RemoveLiquidityImbalance', (sender, amounts, fees, D1, totalSupply) => {
		// 	let msg = '\nRemoveLiquidityImbalance: KStablePool \n';
		// 	msg += "sender: " + sender + '\n';
		// 	msg += 'cusd: ' + ethers.utils.formatUnits(amounts[0], environment.mainnet.cusd.decimals) + ' / ' + ethers.utils.formatUnits(fees[0], environment.mainnet.cusd.decimals) + '\n';
		// 	msg += 'usdt: ' + ethers.utils.formatUnits(amounts[1], environment.mainnet.usdt.decimals) + ' / ' + ethers.utils.formatUnits(fees[1], environment.mainnet.usdt.decimals) + '\n';
		// 	msg += 'usdc: ' + ethers.utils.formatUnits(amounts[2], environment.mainnet.usdc.decimals) + ' / ' + ethers.utils.formatUnits(fees[2], environment.mainnet.usdc.decimals) + '\n';
		// 	msg += 'D1/TotalSupply: ' + ethers.utils.formatEther(D1.div(totalSupply).div(100));
		// 	console.warn(msg);
		// });
		// this.poolContract.on('RemoveLiquidityOne', (sender, _token_amount, dy) => {
		// 	let msg = '\nRemoveLiquidityOne: KStablePool \n';
		// 	msg += "sender: " + sender + '\n';
		// 	msg += 'Token Amount: ' + ethers.utils.formatEther(_token_amount) + '\n';
		// 	msg += 'Dy: ' + ethers.utils.formatEther(dy);
		// 	console.warn(msg);
		// });
		// this.poolContract.on('CommitNewAdmin', (deadline, admin) => {
		// 	let msg = '\nCommitNewAdmin:  KStablePool\n';
		// 	msg += 'deadline: ' + deadline + '\n';
		// 	msg += 'admin: ' + admin;
		// 	console.warn(msg);
		// });
		// this.poolContract.on('NewAdmin', (admin) => {
		// 	let msg = '\nNewAdmin:  KStablePool\n';
		// 	msg += 'admin: ' + admin;
		// 	console.warn(msg);
		// });
		// this.poolContract.on('CommitNewFee', (deadline, fee, admin_fee) => {
		// 	let msg = `\nCommitNewFee:  KStablePool\n${deadline}\n${fee}\n${admin_fee}\n`;
		// 	console.warn(msg);
		// });
		// this.poolContract.on('NewFee', (fee, admin_fee) => {
		// 	let msg = `\nNewFee:  KStablePool\n${fee}\n${admin_fee}\n`;
		// 	console.warn(msg);
		// });
		// this.poolContract.on('RampA', (olda, newa, i, f) => {
		// 	let msg = `\nRampA:  KStablePool\n${olda}\n${newa}\n${i}\n${f}`;
		// 	console.warn(msg);
		// });
		// this.poolContract.on('StopRampA', (a, t) => {
		// 	let msg = `\nStopRampA:  KStablePool\n${a}\n${t}`;
		// 	console.warn(msg);
		// });
		// this.poolContract.on('UnkillMe', (a, t) => {
		// 	let msg = `UnkillMe:  KStablePool`;
		// 	console.warn(msg);
		// });
		// this.poolContract.on('KillMe', (a, t) => {
		// 	let msg = `KillMe:  KStablePool`;
		// 	console.warn(msg);
		// });
		// this.poolContract.on('DonateAdminFees', (a, t) => {
		// 	let msg = `DonateAdminFees:  KStablePool`;
		// 	console.warn(msg);
		// });
		// this.poolContract.on('WithdrawAdminFees', (a, t) => {
		// 	let msg = `WithdrawAdminFees:  KStablePool`;
		// 	console.warn(msg);
		// });
		// this.poolContract.on('RevertTransferOwnership', (a, t) => {
		// 	let msg = `RevertTransferOwnership:  KStablePool`;
		// 	console.warn(msg);
		// });
		// this.poolContract.on('RevertNewParameters', (a, t) => {
		// 	let msg = `RevertNewParameters:  KStablePool`;
		// 	console.warn(msg);
		// });

		// this.minterContract.on('OwnershipTransferred', (oldOwner, newOwner) => {
		// 	let msg = '\nOwnershipTransferred: KSTMinter \n';
		// 	msg += "Old Owner: " + oldOwner + '\n';
		// 	msg += 'New Owner: ' + newOwner;
		// 	console.warn(msg);
		// });
		// this.minterContract.on('UpdateProxyInfo', (_farmingProxy, _pool, _allocPoint, _totalAllocPoint) => {
		// 	let msg = `\nUpdateProxyInfo: KSTMinter\n${_farmingProxy}\n${_pool}\n${_allocPoint}\n${_totalAllocPoint}`;
		// 	console.warn(msg);
		// });
		// this.minterContract.on('UpdateToken', (_farmingProxy) => {
		// 	let msg = `\nUpdateToken: KSTMinter\n${_farmingProxy}`;
		// 	console.warn(msg);
		// });
		// this.minterContract.on('SetHalvingPeriod', (_farmingProxy) => {
		// 	let msg = `\nSetHalvingPeriod: KSTMinter\n${_farmingProxy}`;
		// 	console.warn(msg);
		// });
		// this.minterContract.on('SetDevAddress', (args) => {
		// 	let msg = `\nSetDevAddress: KSTMinter\n${args}`;
		// 	console.warn(msg);
		// });
		// this.minterContract.on('MintKST', (args0, args1, args2, args3, args4) => {
		// 	let msg = `\nMintKST: KSTMinter:\n${args0}\n${args1}\n${args2}\n${args3}\n${args4}`;
		// 	console.warn(msg);
		// });
		// this.minterContract.on('PhaseChanged', (args0, args1, args2) => {
		// 	let msg = `\nPhaseChanged: KSTMinter\n${args0}\n${args1}\n${args2}`;
		// 	console.warn(msg);
		// });

		// this.liquidityContract.on('OwnershipTransferred', (oldOwner, newOwner) => {
		// 	let msg = '\nOwnershipTransferred: LiquidityFarmingProxy \n';
		// 	msg += "Old Owner: " + oldOwner + '\n';
		// 	msg += 'New Owner: ' + newOwner;
		// 	console.warn(msg);
		// });
		// this.liquidityContract.on('Deposit', (args0, args1, args2) => {
		// 	let msg = `\nDeposit: LiquidityFarmingProxy \n${args0}\n${args1}\n${args2}`;
		// 	console.warn(msg);
		// });
		// this.liquidityContract.on('Withdraw', (args0, args1, args2) => {
		// 	let msg = `\nWithdraw: LiquidityFarmingProxy \n${args0}\n${args1}\n${args2}`;
		// 	console.warn(msg);
		// });
		// this.liquidityContract.on('EmergencyWithdraw', (args0, args1, args2) => {
		// 	let msg = `\nEmergencyWithdraw: LiquidityFarmingProxy \n${args0}\n${args1}\n${args2}`;
		// 	console.warn(msg);
		// });
		// this.liquidityContract.on('SetMinter', (args0) => {
		// 	let msg = `\nSetMinter: LiquidityFarmingProxy \n${args0}`;
		// 	console.warn(msg);
		// });
		// this.liquidityContract.on('AddPool', (args0) => {
		// 	let msg = `\nAddPool: LiquidityFarmingProxy \n${args0}`;
		// 	console.warn(msg);
		// });
		// this.liquidityContract.on('SetPool', (args0) => {
		// 	let msg = `\nSetPool: LiquidityFarmingProxy \n${args0}`;
		// 	console.warn(msg);
		// });
		// this.liquidityContract.on('UpdatePool', (args0, args1, args2) => {
		// 	let msg = `\nUpdatePool: LiquidityFarmingProxy \n${args0}\n${args1}\n${args2}`;
		// 	console.warn(msg);
		// });
		// this.liquidityContract.on('CalculatePending', (args0, args1, args2, args3, args4) => {
		// 	let msg = `\nCalculatePending: LiquidityFarmingProxy \n${args0}\n${args1}\n${args2}\n${args3}\n${args4}`;
		// 	console.warn(msg);
		// });
		// this.liquidityContract.on('SetToken', (args0) => {
		// 	let msg = `\nSetToken: LiquidityFarmingProxy \n${args0}`;
		// 	console.warn(msg);
		// });
		// this.liquidityContract.on('ZeroLPStaking', (args0, args1, args2) => {
		// 	let msg = `\nZeroLPStaking: LiquidityFarmingProxy \n${args0}\n${args1}\n${args2}`;
		// 	console.warn(msg);
		// });

		// this.paymentContract.on('OwnershipTransferred', (oldOwner, newOwner) => {
		// 	let msg = '\nOwnershipTransferred: PaymentFarmingProxy \n';
		// 	msg += "Old Owner: " + oldOwner + '\n';
		// 	msg += 'New Owner: ' + newOwner;
		// 	console.warn(msg);
		// });
		// this.paymentContract.on('SetPaymentFee', (args0) => {
		// 	let msg = `\nSetPaymentFee: PaymentFarmingProxy \n${args0}`;
		// 	console.warn(msg);
		// });
		// this.paymentContract.on('SetMinter', (args0) => {
		// 	let msg = `\nSetMinter: PaymentFarmingProxy \n${args0}`;
		// 	console.warn(msg);
		// });
		// this.paymentContract.on('SetDev', (args0) => {
		// 	let msg = `\nSetDev: PaymentFarmingProxy \n${args0}`;
		// 	console.warn(msg);
		// });
		// this.paymentContract.on('SetToken', (args0) => {
		// 	let msg = `\nSetToken: PaymentFarmingProxy \n${args0}`;
		// 	console.warn(msg);
		// });
		// this.paymentContract.on('AddCoins', (args0, args1) => {
		// 	let msg = `\nAddCoins: PaymentFarmingProxy \n${args0}\n${args1}`;
		// 	console.warn(msg);
		// });
		// this.paymentContract.on('RemoveCoins', (args0) => {
		// 	let msg = `\nRemoveCoins: PaymentFarmingProxy \n${args0}`;
		// 	console.warn(msg);
		// });
		// this.paymentContract.on('SetPool', (args0) => {
		// 	let msg = `\nSetPool: PaymentFarmingProxy \n${args0}`;
		// 	console.warn(msg);
		// });
		// this.paymentContract.on('Pay', (args0, args1, args2, args3) => {
		// 	let msg = `\nPay: PaymentFarmingProxy \n${args0}\n${args1}\n${args2}\n${args3}`;
		// 	console.warn(msg);
		// });
		// this.paymentContract.on('WithdrawReward', (args0, args1, args2) => {
		// 	let msg = `\nWithdrawReward: PaymentFarmingProxy \n${args0}\n${args1}\n${args2}`;
		// 	console.warn(msg);
		// });

		// this.cstContract.on('OwnershipTransferred', (oldOwner, newOwner) => {
		// 	let msg = '\nOwnershipTransferred: KSTToken \n';
		// 	msg += "Old Owner: " + oldOwner + '\n';
		// 	msg += 'New Owner: ' + newOwner;
		// 	console.warn(msg);
		// });
		// let cstMintFilter = this.cstContract.filters.Transfer(ethers.constants.AddressZero, null, null);
		// this.cstContract.on(cstMintFilter, (from, to, amount) => {
		// 	let msg = '\nMint: KSTToken \n';
		// 	msg += 'to: ' + to + '\n';
		// 	msg += 'amount: ' + ethers.utils.formatEther(amount);
		// 	console.info(msg);
		// });

	}

	public connentMetaMask() {
		// @ts-ignore
		if (window && window.ethereum) {
			let loadData = (_network) => {
				this.network = _network;
				console.log(this.network);
				// this.refundContract = new ethers.Contract(RefundJson.networks[_network.chainId].address, RefundJson.abi, this.web3Provider);
				// return this.refundContract.userInfo(this.accounts[0]).then(_userInfo => {
				// 	this.userInfo = _userInfo;
				// 	return this.refundContract.token().then(_token => {
				// 		this.tokenContract = new ethers.Contract(_token, ERC20.abi, this.web3Provider);
				// 		let tokenTranferFilter = this.tokenContract.filters.Transfer(null, this.accounts[0], null);
				// 		this.tokenContract.on(tokenTranferFilter, (from, to, amt) => {
				// 			this.refundContract.userInfo(this.accounts[0]).then(_userInfo => {
				// 				this.userInfo = _userInfo;
				// 			});
				// 			this.tokenContract.balanceOf(this.refundContract.address).then(bal => {
				// 				this.fundsBalance = bal;
				// 			});
				// 		});
				// 		return this.tokenContract.balanceOf(this.refundContract.address).then(bal => {
				// 			this.fundsBalance = bal;
				// 			this.applicationRef.tick();
				// 		});
				// 	});
				// });
				this.assemble();
			};
			//@ts-ignore
			window.ethereum.request({ method: 'eth_requestAccounts', param: [] }).then(() => {
				// @ts-ignore
				this.web3Provider = new ethers.providers.Web3Provider(window.ethereum);
				this.web3Provider.getNetwork().then(_network => {
					loadData(_network);
				});
				// @ts-ignore
				window.ethereum.request({ method: 'eth_accounts', parma: [] }).then(accounts => {
					this.accounts = accounts;
					this.applicationRef.tick();
				});
			});
			//@ts-ignore
			window.ethereum.on("chainChanged", async (chainId: string) => {
				// @ts-ignore
				this.web3Provider = new ethers.providers.Web3Provider(window.ethereum);
				this.web3Provider.getNetwork().then(_network => {
					loadData(_network);
				});
				// @ts-ignore
				window.ethereum.request({ method: 'eth_accounts', parma: [] }).then(accounts => {
					this.accounts = accounts;
					this.applicationRef.tick();
				});
			});
			//@ts-ignore
			window.ethereum.on("accountsChanged", async (accounts) => {
				this.accounts = accounts;
				this.web3Provider.getNetwork().then(_network => {
					loadData(_network);
				});
			});
		}
	}

	public formatEther(b: ethers.BigNumber, symbol: string) {
		return ethers.utils.formatUnits(b, environment.mainnet[symbol].decimals);
	}

	public withdrawAdminFee(): Promise<any> {
		console.log(this.web3Provider.getSigner().getAddress());
		console.log(this.accounts[0]);
		this.poolContract.owner().then(owner => {
			console.log(owner);
		});
		return this.poolContract.connect(this.web3Provider.getSigner()).withdraw_admin_fees({ from: this.accounts[0] });
	}

	public assemble() {
		this.paymentContract.devAddress().then(dev => {
			this.usdcContract.balanceOf(dev).then(bal => {
				this.paymentFeeIncomeUsdc = bal;
			});
			this.busdContract.balanceOf(dev).then(bal => {
				this.paymentFeeIncomeBusd = bal;
			});
			this.usdtContract.balanceOf(dev).then(bal => {
				this.paymentFeeIncomeUsdt = bal;
			});
		});
		this.poolContract.admin_balances(0).then(fee => {
			this.adminFeeIncomeBusd = fee;
		});
		this.poolContract.admin_balances(1).then(fee => {
			this.adminFeeIncomeUsdt = fee;
		});
		this.poolContract.admin_balances(2).then(fee => {
			this.adminFeeIncomeUsdc = fee;
		});
		this.poolContract.owner().then(ownerAddress => {
			this.isPoolOwner = ownerAddress.toLowerCase() == this.accounts[0].toLowerCase();
		});
		this.minterContract.owner().then(ownerAddress => {
			this.isMinterOwner = ownerAddress.toLowerCase() == this.accounts[0].toLowerCase();
		});
		this.busdContract.balanceOf(environment.mainnet.pool.address).then(bal => {
			this.poolCusdBalance = ethers.utils.formatUnits(bal, environment.mainnet.cusd.decimals);
		});
		this.usdtContract.balanceOf(environment.mainnet.pool.address).then(bal => {
			this.poolUsdtBalance = ethers.utils.formatUnits(bal, environment.mainnet.usdt.decimals);
		});
		this.usdcContract.balanceOf(environment.mainnet.pool.address).then(bal => {
			this.poolUsdcBalance = ethers.utils.formatUnits(bal, environment.mainnet.usdc.decimals);
		});
		this.poolContract.get_virtual_price().then(price => {
			this.poolVirtualPrice = ethers.utils.formatEther(price);
		});
		this.cstContract.totalSupply().then(supply => {
			this.cstTotalSupply = ethers.utils.formatEther(supply);
		});
	}

	public transferPoolOwnerToDefault(): Promise<any> {
		return this.poolContract.connect(this.web3Provider.getSigner()).transferOwnership(this.defaultOwner.address);
	}
	public transferMinterOwnerToDefault(): Promise<any> {
		return this.minterContract.connect(this.web3Provider.getSigner()).transferOwnership(this.defaultOwner.address);
	}


	public async queryKStableTokenExchange(_startBlock, _endBlock) {
		let tokenExchangeFilter = this.poolContract.filters.TokenExchange(null, null, null, null, null);
		let res = await this.poolContract.queryFilter(tokenExchangeFilter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = 'TokenExchange: KStablePool \n';
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				msg += "sender: " + e.args.buyer + '\n';
				let inToken = '';
				switch (e.args.sold_id.toString()) {
					case '0':
						inToken = 'cusd';
						break;
					case '1':
						inToken = 'usdt';
						break;
					case '2':
						inToken = 'usdc'
						break;
					default:
				}
				let outToken = '';
				switch (e.args.bought_id.toString()) {
					case '0':
						outToken = 'cusd';
						break;
					case '1':
						outToken = 'usdt';
						break;
					case '2':
						outToken = 'usdc'
						break;
					default:
				}
				let inAmt = ethers.utils.formatUnits(e.args.tokens_sold, environment.mainnet[inToken].decimals);
				let outAmt = ethers.utils.formatUnits(e.args.tokens_bought, environment.mainnet[outToken].decimals);
				msg += inToken + '->' + outToken + ' ' + inAmt + '->' + outAmt + '\n';
				console.info(msg);
			});
		}
	}

	public async queryKStableAddLiquidity(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.AddLiquidity(null, null, null, null, null);
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = 'AddLiquidity: KStablePool \n';
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				msg += "sender: " + e.args[0] + '\n';
				msg += 'cusd: ' + ethers.utils.formatUnits(e.args[1][0], environment.mainnet.cusd.decimals) + ' / ' + ethers.utils.formatUnits(e.args[2][0], environment.mainnet.cusd.decimals) + '\n';
				msg += 'usdt: ' + ethers.utils.formatUnits(e.args[1][1], environment.mainnet.usdt.decimals) + ' / ' + ethers.utils.formatUnits(e.args[2][1], environment.mainnet.usdt.decimals) + '\n';
				msg += 'usdc: ' + ethers.utils.formatUnits(e.args[1][2], environment.mainnet.usdc.decimals) + ' / ' + ethers.utils.formatUnits(e.args[2][2], environment.mainnet.usdc.decimals) + '\n';
				let percent = e.args[3].mul(ethers.BigNumber.from('1000000000000000000')).div(e.args[4]);
				let percentStr = ethers.utils.formatUnits(percent, 16);
				msg += 'D1/TotalSupply: ' + ethers.utils.formatEther(e.args[3]) + '/' + ethers.utils.formatEther(e.args[4]) + ' ' + percentStr + '%' + '\n';
				if (Math.abs(Number(percentStr) - 100) > 5) {
					console.warn(msg);
				} else {
					console.info(msg);
				}
			});
		}
	}

	public async queryKStableRemoveLiquidity(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.RemoveLiquidity(null, null, null, null);
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = 'RemoveLiquidity: KStablePool \n';
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				msg += "sender: " + e.args[0] + '\n';
				msg += 'cusd: ' + ethers.utils.formatUnits(e.args[1][0], environment.mainnet.cusd.decimals) + ' / ' + ethers.utils.formatUnits(e.args[2][0], environment.mainnet.cusd.decimals) + '\n';
				msg += 'usdt: ' + ethers.utils.formatUnits(e.args[1][1], environment.mainnet.usdt.decimals) + ' / ' + ethers.utils.formatUnits(e.args[2][1], environment.mainnet.usdt.decimals) + '\n';
				msg += 'usdc: ' + ethers.utils.formatUnits(e.args[1][2], environment.mainnet.usdc.decimals) + ' / ' + ethers.utils.formatUnits(e.args[2][2], environment.mainnet.usdc.decimals) + '\n';
				msg += 'TotalSupply: ' + ethers.utils.formatEther(e.args[3]) + '\n';
				console.warn(msg);
			});
		}
	}

	public async queryKStableRemoveLiquidityImbalance(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.RemoveLiquidityImbalance(null, null, null, null, null);
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = '\nRemoveLiquidityImbalance: KStablePool \n';
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				msg += "sender: " + e.args[0] + '\n';
				msg += 'cusd: ' + ethers.utils.formatUnits(e.args[1][0], environment.mainnet.cusd.decimals) + ' / ' + ethers.utils.formatUnits(e.args[2][0], environment.mainnet.cusd.decimals) + '\n';
				msg += 'usdt: ' + ethers.utils.formatUnits(e.args[1][1], environment.mainnet.usdt.decimals) + ' / ' + ethers.utils.formatUnits(e.args[2][1], environment.mainnet.usdt.decimals) + '\n';
				msg += 'usdc: ' + ethers.utils.formatUnits(e.args[1][2], environment.mainnet.usdc.decimals) + ' / ' + ethers.utils.formatUnits(e.args[2][2], environment.mainnet.usdc.decimals) + '\n';
				msg += 'D1/TotalSupply: ' + ethers.utils.formatEther(e.args[3].div(e.args[4]).div(100)) + '\n';
				console.warn(msg);
			});
		}
	}

	public async queryKStableRemoveLiquidityOne(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.RemoveLiquidityOne(null, null, null);
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = '\nRemoveLiquidityOne: KStablePool \n';
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				msg += "sender: " + e.args[0] + '\n';
				msg += 'Token Amount: ' + ethers.utils.formatEther(e.args[1]) + '\n';
				msg += 'Dy: ' + ethers.utils.formatEther(e.args[2]);
				console.warn(msg);
			});
		}
	}

	public async queryKStableCommitNewAdmin(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.CommitNewAdmin(null, null);
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = 'CommitNewAdmin:  KStablePool\n';
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				msg += 'deadline: ' + e.args.deadline + '\n';
				msg += 'admin: ' + e.args.admin;
				console.warn(msg);
			});
		}
	}

	public async queryKStableNewAdmin(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.NewAdmin(null);
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = 'NewAdmin:  KStablePool\n';
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				msg += 'admin: ' + e.args.admin + '\n';
				console.warn(msg);
			});
		}
	}
	public async queryKStableCommitNewFee(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.CommitNewFee(null, null, null);
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `CommitNewFee:  KStablePool\n${e.args[0]}\n${e.args[1]}\n${e.args[2]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async queryKStableNewFee(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.NewFee(null, null);
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `NewFee:  KStablePool\n${e.args.fee}\n${e.args.admin_fee}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async queryKStableRampA(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.RampA(null, null, null, null);
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `RampA:  KStablePool\n${e.args[0]}\n${e.args[1]}\n${e.args[2]}\n${e.args[3]}`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async queryKStableStopRampA(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.StopRampA(null, null);
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `StopRampA:  KStablePool\n${e.args[0]}\n${e.args[1]}`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async queryKStableUnkillMe(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.UnkillMe();
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `UnkillMe:  KStablePool`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async queryKStableKillMe(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.KillMe();
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `KillMe:  KStablePool`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async queryKStableDonateAdminFees(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.DonateAdminFees();
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `DonateAdminFees:  KStablePool`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async queryKStableWithdrawAdminFees(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.WithdrawAdminFees();
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `WithdrawAdminFees:  KStablePool`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async queryKStableRevertTransferOwnership(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.RevertTransferOwnership();
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `RevertTransferOwnership:  KStablePool`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async queryKStableRevertNewParameters(_startBlock, _endBlock) {
		let filter = this.poolContract.filters.RevertNewParameters();
		let res = await this.poolContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `RevertNewParameters:  KStablePool`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_Minter_OwnershipTransferred(_startBlock, _endBlock) {
		let filter = this.minterContract.filters.OwnershipTransferred(null, null);
		let res = await this.minterContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `OwnershipTransferred:  KSTMinter`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				msg += "Old Owner: " + e.args[0] + '\n';
				msg += 'New Owner: ' + e.args[1] + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_Minter_UpdateProxyInfo(_startBlock, _endBlock) {
		let filter = this.minterContract.filters.UpdateProxyInfo(null, null, null, null);
		let res = await this.minterContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `UpdateProxyInfo: KSTMinter\n${e.args[0]}\n${e.args[1]}\n${e.args[2]}\n${e.args[3]}`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_Minter_SetHalvingPeriod(_startBlock, _endBlock) {
		let filter = this.minterContract.filters.SetHalvingPeriod(null);
		let res = await this.minterContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `SetHalvingPeriod: KSTMinter\n${e.args[0]}`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_Minter_SetDevAddress(_startBlock, _endBlock) {
		let filter = this.minterContract.filters.SetDevAddress(null);
		let res = await this.minterContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `SetDevAddress: KSTMinter\n${e.args[0]}\n${e.args[1]}\n${e.args[2]}\n${e.args[3]}`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_Minter_UpdateToken(_startBlock, _endBlock) {
		let filter = this.minterContract.filters.UpdateProxyInfo(null);
		let res = await this.minterContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `UpdateToken: KSTMinter\n${e.args[0]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_Minter_MintKST(_startBlock, _endBlock) {
		let filter = this.minterContract.filters.MintKST(null, null, null, null);
		let res = await this.minterContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `MintKST: KSTMinter:\n${e.args[0]}\n${e.args[1]}\n${e.args[2]}\n${e.args[3]}\n${e.args[4]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_Minter_PhaseChanged(_startBlock, _endBlock) {
		let filter = this.minterContract.filters.PhaseChanged(null, null, null);
		let res = await this.minterContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `PhaseChanged: KSTMinter\n${e.args[0]}\n${e.args[1]}\n${e.args[2]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_liquidity_OwnershipTransferred(_startBlock, _endBlock) {
		let filter = this.liquidityContract.filters.OwnershipTransferred(null, null);
		let res = await this.liquidityContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `OwnershipTransferred: LiquidityFarmingProxy\n${e.args[0]}\n${e.args[1]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_liquidity_Deposit(_startBlock, _endBlock) {
		let filter = this.liquidityContract.filters.Deposit(null, null, null);
		let res = await this.liquidityContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `Deposit: LiquidityFarmingProxy\n${e.args[0]}\n${e.args[1]}\n${e.args[2]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_liquidity_Withdraw(_startBlock, _endBlock) {
		let filter = this.liquidityContract.filters.Withdraw(null, null, null);
		let res = await this.liquidityContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `Withdraw: LiquidityFarmingProxy\n${e.args[0]}\n${e.args[1]}\n${e.args[2]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_liquidity_EmergencyWithdraw(_startBlock, _endBlock) {
		let filter = this.liquidityContract.filters.EmergencyWithdraw(null, null, null);
		let res = await this.liquidityContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `EmergencyWithdraw: LiquidityFarmingProxy\n${e.args[0]}\n${e.args[1]}\n${e.args[2]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_liquidity_SetMinter(_startBlock, _endBlock) {
		let filter = this.liquidityContract.filters.SetMinter(null);
		let res = await this.liquidityContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `SetMinter: LiquidityFarmingProxy\n${e.args[0]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_liquidity_AddPool(_startBlock, _endBlock) {
		let filter = this.liquidityContract.filters.AddPool(null);
		let res = await this.liquidityContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `AddPool: LiquidityFarmingProxy\n${e.args[0]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_liquidity_SetPool(_startBlock, _endBlock) {
		let filter = this.liquidityContract.filters.SetPool(null);
		let res = await this.liquidityContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `SetPool: LiquidityFarmingProxy\n${e.args[0]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_liquidity_UpdatePool(_startBlock, _endBlock) {
		let filter = this.liquidityContract.filters.UpdatePool(null, null, null);
		let res = await this.liquidityContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `UpdatePool: LiquidityFarmingProxy\n${e.args[0]}\n${e.args[1]}\n${e.args[2]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_liquidity_CalculatePending(_startBlock, _endBlock) {
		let filter = this.liquidityContract.filters.CalculatePending(null, null, null, null, null);
		let res = await this.liquidityContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `CalculatePending: LiquidityFarmingProxy\n${e.args[0]}\n${e.args[1]}\n${e.args[2]}\n${e.args[3]}\n${e.args[4]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_liquidity_SetToken(_startBlock, _endBlock) {
		let filter = this.liquidityContract.filters.SetToken(null);
		let res = await this.liquidityContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `SetToken: LiquidityFarmingProxy\n${e.args[0]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_liquidity_ZeroLPStaking(_startBlock, _endBlock) {
		let filter = this.liquidityContract.filters.ZeroLPStaking(null, null, null);
		let res = await this.liquidityContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `ZeroLPStaking: LiquidityFarmingProxy\n${e.args[0]}\n${e.args[1]}\n${e.args[2]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}

	public async query_payment_OwnershipTransferred(_startBlock, _endBlock) {
		let filter = this.paymentContract.filters.OwnershipTransferred(null, null);
		let res = await this.paymentContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `OwnershipTransferred: PaymentFarmingProxy\n${e.args[0]}\n${e.args[1]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_payment_SetPaymentFee(_startBlock, _endBlock) {
		let filter = this.paymentContract.filters.SetPaymentFee(null);
		let res = await this.paymentContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `SetPaymentFee: PaymentFarmingProxy\n${e.args[0]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_payment_SetMinter(_startBlock, _endBlock) {
		let filter = this.paymentContract.filters.SetMinter(null);
		let res = await this.paymentContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `SetMinter: PaymentFarmingProxy\n${e.args[0]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_payment_SetDev(_startBlock, _endBlock) {
		let filter = this.paymentContract.filters.SetDev(null);
		let res = await this.paymentContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `SetDev: PaymentFarmingProxy\n${e.args[0]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_payment_SetToken(_startBlock, _endBlock) {
		let filter = this.paymentContract.filters.SetToken(null);
		let res = await this.paymentContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `SetToken: PaymentFarmingProxy\n${e.args[0]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_payment_AddCoins(_startBlock, _endBlock) {
		let filter = this.paymentContract.filters.AddCoins(null, null);
		let res = await this.paymentContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `AddCoins: PaymentFarmingProxy\n${e.args[0]}\n${e.args[1]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_payment_RemoveCoins(_startBlock, _endBlock) {
		let filter = this.paymentContract.filters.RemoveCoins(null);
		let res = await this.paymentContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `RemoveCoins: PaymentFarmingProxy\n${e.args[0]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_payment_SetPool(_startBlock, _endBlock) {
		let filter = this.paymentContract.filters.SetPool(null);
		let res = await this.paymentContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `SetPool: PaymentFarmingProxy\n${e.args[0]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_payment_Pay(_startBlock, _endBlock) {
		let filter = this.paymentContract.filters.Pay(null, null, null, null);
		let res = await this.paymentContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `Pay: PaymentFarmingProxy\n${e.args[0]}\n${e.args[1]}\n${e.args[2]}\n${e.args[3]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_payment_WithdrawReward(_startBlock, _endBlock) {
		let filter = this.paymentContract.filters.WithdrawReward(null, null, null);
		let res = await this.paymentContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `WithdrawReward: PaymentFarmingProxy\n${e.args[0]}\n${e.args[1]}\n${e.args[2]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}

	public async query_cst_OwnershipTransferred(_startBlock, _endBlock) {
		let filter = this.cstContract.filters.OwnershipTransferred(null, null);
		let res = await this.cstContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `OwnershipTransferred: KSTToken\n${e.args[0]}\n${e.args[1]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async query_cst_Mint(_startBlock, _endBlock) {
		let filter = this.cstContract.filters.Transfer(ethers.constants.AddressZero, null, null);
		let res = await this.cstContract.queryFilter(filter, _startBlock, _endBlock);
		if (res && res.length > 0) {
			res.forEach((e, i) => {
				let msg = `Mint: KSTToken\n${e.args[2]}\n${e.args[1]}\n`;
				msg += "block hash: " + e.blockHash + '\n';
				msg += "block number: " + e.blockNumber + '\n';
				msg += "address: " + e.address + '\n';
				msg += "txHash: " + e.transactionHash + '\n';
				console.warn(msg);
			});
		}
	}
	public async getLog(startBlock: number) {
		let _endBlock = await this.mainnetJsonRpcProvider.getBlockNumber();
		startBlock = Number(startBlock);
		await this.queryKStableTokenExchange(startBlock, _endBlock);
		await this.queryKStableAddLiquidity(startBlock, _endBlock);
		await this.queryKStableRemoveLiquidity(startBlock, _endBlock);
		await this.queryKStableRemoveLiquidityImbalance(startBlock, _endBlock);
		await this.queryKStableRemoveLiquidityOne(startBlock, _endBlock);
		await this.queryKStableCommitNewAdmin(startBlock, _endBlock);
		await this.queryKStableNewAdmin(startBlock, _endBlock);
		await this.queryKStableCommitNewFee(startBlock, _endBlock);
		await this.queryKStableNewFee(startBlock, _endBlock);
		await this.queryKStableRampA(startBlock, _endBlock);
		await this.queryKStableStopRampA(startBlock, _endBlock);
		await this.queryKStableUnkillMe(startBlock, _endBlock);
		await this.queryKStableKillMe(startBlock, _endBlock);
		await this.queryKStableDonateAdminFees(startBlock, _endBlock);
		await this.queryKStableWithdrawAdminFees(startBlock, _endBlock);
		await this.queryKStableRevertTransferOwnership(startBlock, _endBlock);
		await this.queryKStableRevertNewParameters(startBlock, _endBlock);

		await this.query_Minter_OwnershipTransferred(startBlock, _endBlock);
		await this.query_Minter_UpdateProxyInfo(startBlock, _endBlock);
		await this.query_Minter_UpdateToken(startBlock, _endBlock);
		await this.query_Minter_SetHalvingPeriod(startBlock, _endBlock);
		await this.query_Minter_SetDevAddress(startBlock, _endBlock);
		await this.query_Minter_MintKST(startBlock, _endBlock);
		await this.query_Minter_PhaseChanged(startBlock, _endBlock);

		await this.query_liquidity_OwnershipTransferred(startBlock, _endBlock);
		await this.query_liquidity_Deposit(startBlock, _endBlock);
		await this.query_liquidity_Withdraw(startBlock, _endBlock);
		await this.query_liquidity_EmergencyWithdraw(startBlock, _endBlock);
		await this.query_liquidity_SetMinter(startBlock, _endBlock);
		await this.query_liquidity_AddPool(startBlock, _endBlock);
		await this.query_liquidity_UpdatePool(startBlock, _endBlock);
		await this.query_liquidity_CalculatePending(startBlock, _endBlock);
		await this.query_liquidity_SetToken(startBlock, _endBlock);
		await this.query_liquidity_ZeroLPStaking(startBlock, _endBlock);


		await this.query_payment_OwnershipTransferred(startBlock, _endBlock);
		await this.query_payment_SetPaymentFee(startBlock, _endBlock);
		await this.query_payment_SetMinter(startBlock, _endBlock);
		await this.query_payment_SetDev(startBlock, _endBlock);
		await this.query_payment_SetToken(startBlock, _endBlock);
		await this.query_payment_AddCoins(startBlock, _endBlock);
		await this.query_payment_RemoveCoins(startBlock, _endBlock);
		await this.query_payment_Pay(startBlock, _endBlock);
		await this.query_payment_WithdrawReward(startBlock, _endBlock);

		await this.query_cst_OwnershipTransferred(startBlock, _endBlock);
		await this.query_cst_Mint(startBlock, _endBlock);

		console.log('end at: ' + _endBlock);
	}
}
