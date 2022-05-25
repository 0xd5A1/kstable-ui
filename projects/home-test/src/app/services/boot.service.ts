import { Injectable } from '@angular/core';
import { ethers } from "ethers";
import { environment } from '../../environments/environment';
import LiquidityFarmingProxy from 'libs/abi/LiquidityFarmingProxy.json';
import PaymentFarmingProxy from 'libs/abi/PaymentFarmingProxy.json';
import ERC20 from 'libs/abi/ERC20.json';
import KSTToken from 'libs/abi/KSTToken.json';
import KStablePool from 'libs/abi/KStablePool.json';
import BigNumber from 'bignumber.js';

@Injectable({
	providedIn: 'root'
})
export class BootService {

	provider: ethers.providers.JsonRpcProvider;
	pool1Contract: ethers.Contract;
	liquidityFarmingProxyContract: ethers.Contract;
	paymentFarmingProxyContract: ethers.Contract;
	bstTokenContract: ethers.Contract;
	cusdContract: ethers.Contract;
	usdtContract: ethers.Contract;
	usdcContract: ethers.Contract;

	coins = [{ symbol: 'CUSD', decimals: 18 }, { symbol: 'USDT', decimals: 6 }, { symbol: 'USDC', decimals: 6 }];

	constructor() {
		this.provider = new ethers.providers.JsonRpcProvider(environment.rpc.url);
		this.pool1Contract = new ethers.Contract(environment.pool1.address, KStablePool.abi, this.provider);
		this.liquidityFarmingProxyContract = new ethers.Contract(environment.liqudityFarmingProxy.address, LiquidityFarmingProxy.abi, this.provider);
		this.paymentFarmingProxyContract = new ethers.Contract(environment.paymentFarmingProxy.address, PaymentFarmingProxy.abi, this.provider);
		this.bstTokenContract = new ethers.Contract(environment.bstToken.address, KSTToken.abi, this.provider);
		this.cusdContract = new ethers.Contract(environment.cusd.address, ERC20.abi, this.provider);
		this.usdtContract = new ethers.Contract(environment.usdt.address, ERC20.abi, this.provider);
		this.usdcContract = new ethers.Contract(environment.usdc.address, ERC20.abi, this.provider);
	}
	private denominator(index: number): BigNumber {
		if (index > 0) {
			return new BigNumber(10).exponentiatedBy(this.coins[index].decimals);
		} else {
			return new BigNumber(10).exponentiatedBy(18);
		}
	}
	getTvl(): Promise<BigNumber> {
		let pArr = new Array();
		pArr.push(this.cusdContract.balanceOf(environment.pool1.address));
		pArr.push(this.usdtContract.balanceOf(environment.pool1.address));
		pArr.push(this.usdcContract.balanceOf(environment.pool1.address));
		return Promise.all(pArr).then(res => {
			let tvl = new BigNumber(0);
			res.forEach((e, i) => {
				tvl = tvl.plus(new BigNumber(e.toString()).div(this.denominator(i)));
			});
			return tvl;
		});
	}

	getKSTMinted(): Promise<BigNumber> {
		return this.bstTokenContract.totalSupply().then(res => {
			return new BigNumber(res.toString()).div(this.denominator(-1));
		});
	}

	getUnclaimedKST(): Promise<BigNumber> {
		let arr = new Array();
		arr.push(this.bstTokenContract.balanceOf(environment.liqudityFarmingProxy.address));
		arr.push(this.bstTokenContract.balanceOf(environment.paymentFarmingProxy.address));
		return Promise.all(arr).then(res => {
			let amt = new BigNumber(0);
			res.forEach(e => {
				amt = amt.plus(new BigNumber(e.toString()).div(this.denominator(-1)));
			});
			return amt;
		});
	}
}
