import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { BootService } from '../services/boot.service';

@Component({
    selector: 'app-reward-info',
    templateUrl: './reward-info.component.html',
    styleUrls: ['./reward-info.component.less']
})
export class RewardInfoComponent implements OnInit {

    constructor(public boot: BootService) { }

    ngOnInit(): void {
    }

    allocationPercent() {
        return this.boot.poolInfo.allocPoint.div(this.boot.poolInfo.totalAllocPoint).multipliedBy(100);
    }

    farmingRewardPercent() {
        return this.boot.poolInfo.shareRewardRate.multipliedBy(100);
    }

    farmingRewardAmt() {
        return this.boot.poolInfo.shareRewardRate.multipliedBy(this.boot.poolInfo.tokenBalance.multipliedBy(this.allocationPercent().div(100))).toFormat(2, BigNumber.ROUND_DOWN) + " " + this.boot.tokenSymbol;
    }

    volRewardPercent() {
        return this.boot.poolInfo.swapRewardRate.multipliedBy(100);
    }

    volRewardAmt() {
        return this.boot.poolInfo.swapRewardRate.multipliedBy(this.boot.poolInfo.tokenBalance.multipliedBy(this.allocationPercent().div(100))).toFormat(2, BigNumber.ROUND_DOWN) + " " + this.boot.tokenSymbol;
    }

    tokenBalance() {
        return this.boot.poolInfo.tokenBalance.multipliedBy(this.allocationPercent()).div(100);
    }

    getAPY() {
        let interestRate;
        if (this.boot.poolInfo.totalSupply.comparedTo(0) === 0) {
            interestRate = new BigNumber(0);
        } else {
            interestRate = this.boot.poolInfo.volume.multipliedBy(this.boot.poolInfo.fee).multipliedBy(new BigNumber(1).minus(this.boot.poolInfo.adminFee)).div(this.boot.poolInfo.totalSupply);
        }
        return new BigNumber(1).plus(interestRate.div(365)).exponentiatedBy(356).minus(1).multipliedBy(100).toFormat(4, 1);
    }
}
