import { BigNumber } from 'bignumber.js'
export class Balance {
    coinsBalance: BigNumber[];
    lp: BigNumber = new BigNumber(0);
    tokenBalance: BigNumber = new BigNumber(0);
    stakingLP: BigNumber = new BigNumber(0);
    volume: BigNumber = new BigNumber(0);
    rewardDebt: BigNumber = new BigNumber(0);
    pendingToken: BigNumber = new BigNumber(0);

    volReward: BigNumber = new BigNumber(0);
    farmingReward: BigNumber = new BigNumber(0);

    constructor(coinsLength: number) {
        this.coinsBalance = new Array(coinsLength);
        this.coinsBalance.forEach(e => {
            e = new BigNumber(0);
        });
    }

    clear() {
        this.coinsBalance.forEach((e) => {
            e = new BigNumber(0);
        });
        this.lp = new BigNumber(0);
    }
}