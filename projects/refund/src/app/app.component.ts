import { Component } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from '../environments/environment';
import { BootService } from './boot.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
export class AppComponent {
	title = 'Management';

	poolOwner: string;
	minterOwner: string;
	paymentOwner: string;
	liquidityOwner: string;
	cstOwner: string;

	minterDev: string;
	paymentDev: string;
	liquidityDev: string;

	startBlock: number = 11858504;


	constructor(public boot: BootService) {
		this.boot.poolContract.owner().then(owner => {
			this.poolOwner = owner;
		});
		this.boot.minterContract.owner().then(owner => {
			this.minterOwner = owner;
		});
		this.boot.paymentContract.owner().then(owner => {
			this.paymentOwner = owner;
		});
		this.boot.liquidityContract.owner().then(owner => {
			this.liquidityOwner = owner;
		});
		this.boot.cstContract.owner().then(owner => {
			this.cstOwner = owner;
		});

		this.boot.minterContract.owner().then(owner => {
			this.minterOwner = owner;
		});
		this.boot.minterContract.devaddr().then(dev => {
			this.minterDev = dev;
		});
		this.boot.paymentContract.devAddress().then(dev => {
			this.paymentDev = dev;
		});

	}

	withdrawAdminFee() {
		this.boot.withdrawAdminFee().then(res => {

		}).catch(e => {
			console.log(e);
		});
	}

	transferPoolOwnerTo() {
		this.boot.transferPoolOwnerToDefault().then().catch(e => {
			console.log(e);
		});
	}
	transferMinterOwnerTo() {
		this.boot.transferMinterOwnerToDefault().then().catch(e => {
			console.log(e);
		});
	}

	getExplorerAddressURL(address: string) {
		return environment.mainnet.explorer.url + '/address/' + address;
	}

	printLog() {
		this.boot.getLog(this.startBlock);
	}
}
