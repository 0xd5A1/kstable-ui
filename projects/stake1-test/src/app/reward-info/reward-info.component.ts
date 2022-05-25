import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { BootService } from '../services/boot.service';

@Component({
    selector: 'app-reward-info',
    templateUrl: './reward-info.component.html',
    styleUrls: ['./reward-info.component.less']
})
export class RewardInfoComponent implements OnInit {

    rewardAPY: BigNumber = new BigNumber(0);

    constructor(public boot: BootService) { }

    ngOnInit(): void {
        this.boot.initContractsCompleted.subscribe(() => {
            this.getRewardAPY().then(rApy => {
                this.rewardAPY = rApy.multipliedBy(100);
            });
        });
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

    getRewardAPY(): Promise<BigNumber> {
        let KSTPrice = 0.2;// 0.2 usd / bst
        let denominator = new BigNumber(10).exponentiatedBy(18);
        return this.boot.proxyContract.poolInfo(this.boot.chainConfig.contracts.pid).then(pooInfo => {
            let accTokenPerShare = new BigNumber(pooInfo.accTokenPerShare.toString()).div(new BigNumber(10).exponentiatedBy(12));
            return accTokenPerShare;
        }).then(accTokenPerShare => {
            let apy = accTokenPerShare.multipliedBy(KSTPrice).div(365).plus(1).exponentiatedBy(365).minus(1);
            return apy.comparedTo(30) > 0 ? new BigNumber(0) : apy;
        });
    }
}
