import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import BigNumber from 'bignumber.js';
import { BootService } from '../services/boot.service';

export enum ActionStatus {
    None, Transfering, TrasactionEnd
}

export enum LoadStatus {
    None, Loading, Loaded
}

@Component({
    selector: 'app-stake-comp',
    templateUrl: './stake-comp.component.html',
    styleUrls: ['./stake-comp.component.less']
})
export class StakeCompComponent implements OnInit {

    @Input('hidden')
    hidden = true;
    amts: Array<number>;

    redeemPercent: number = 0;

    redeemToIndex: string = '4';

    depositPercent: number = 0;

    depositLPAmt: BigNumber = new BigNumber(0);

    needApproveLP: boolean = false;

    withdrawLPPercent: number = 0;

    withdrawLPAmt: BigNumber = new BigNumber(0);

    status: ActionStatus = ActionStatus.None;

    loadStatus: LoadStatus = LoadStatus.None;

    @Output() loading: EventEmitter<any> = new EventEmitter();
    @Output() loaded: EventEmitter<any> = new EventEmitter();
    @Output('chooseWallet') chooseWlt = new EventEmitter();
    @Output('installWallet') installWlt = new EventEmitter();

    isDisabled: boolean = false;

    isFarmingStart = false;

    constructor(public boot: BootService, private dialog: MatDialog) {
        this.amts = new Array();
        this.boot.coins.forEach((e, i, arr) => {
            this.amts.push(0);
        });
        this.boot.walletReady.subscribe(() => {
            this.updateLPApproveStatus();
        });
        this.boot.lpApprovalStatusChange.subscribe(() => {
            this.updateLPApproveStatus();
        });
        this.boot.initContractsCompleted.subscribe(r => {
            this.boot.isFarmingStart().then(isStart => {
                this.isFarmingStart = isStart;
                this.isDisabled = !isStart;
            });
        });
        this.boot.balanceChange.subscribe(res => {
            this.isDisabled = false;
        });
    }

    ngOnInit(): void {
        this.boot.lpApprovalStatusChange.subscribe(() => {
            // this.boot.loadData();
            this.loaded.emit();
            this.loadStatus = LoadStatus.Loaded;
        });
        this.boot.balanceChange.subscribe(() => {
            // this.boot.loadData();
            this.loaded.emit();
            this.loadStatus = LoadStatus.Loaded;
            this.depositPercentChange(0);
        });
    }

    public async connectWallet() {
        if (!this.boot.isMetaMaskInstalled() && !this.boot.isBinanceInstalled()) {
            this.installWlt.emit();
            return;
        } else {
            this.chooseWallet();
        }
    }

    chooseWallet() {
        this.chooseWlt.emit();
    }

    updateLPApproveStatus() {
        this.boot.allowanceLP(this.boot.chainConfig.contracts.proxy.address).then(amt => {
            if (this.depositLPAmt.comparedTo(amt) > 0) {
                this.needApproveLP = true;
            } else {
                this.needApproveLP = false;
            }
        });
    }

    depositPercentChange(val) {
        this.depositPercent = val;
        if (this.depositPercent && this.depositPercent !== 0) {
            this.depositLPAmt = this.boot.balance.lp.multipliedBy(this.depositPercent).dividedBy(100);
            this.depositLPAmt = new BigNumber(this.depositLPAmt.toFixed(9, BigNumber.ROUND_DOWN));
        }
        this.updateLPApproveStatus();
    }

    approveLP() {
        if (!this.needApproveLP || (this.loadStatus !== 0 && this.loadStatus !== 2)) {
            return;
        }
        this.loading.emit();
        this.loadStatus = LoadStatus.Loading;
        this.boot.approveLP(this.depositLPAmt.toFixed(9, BigNumber.ROUND_DOWN), this.boot.chainConfig.contracts.proxy.address).then((res) => {
            if (!res) {
                this.loaded.emit();
                this.loadStatus = LoadStatus.Loaded;
            }
        }).catch(e => {
            // this.boot.loadData();
            this.loaded.emit();
            this.loadStatus = LoadStatus.Loaded;
        });
    }

    depositLP() {
        if (this.needApproveLP || (this.loadStatus !== 0 && this.loadStatus !== 2) || this.depositLPAmt.comparedTo(0) == 0) {
            return;
        }
        this.loading.emit();
        this.loadStatus = LoadStatus.Loading;
        this.boot.depositLP(this.depositLPAmt.toFixed(18, BigNumber.ROUND_DOWN)).then(() => {

        }).catch(e => {
            // this.boot.loadData();
            this.loaded.emit();
            this.loadStatus = LoadStatus.Loaded;
            this.depositPercentChange(0);
        });
    }

    withdrawLPPercentChange(val) {
        this.withdrawLPPercent = val;
        if (this.withdrawLPPercent && this.withdrawLPPercent !== 0) {
            this.withdrawLPAmt = this.boot.balance.stakingLP.multipliedBy(this.withdrawLPPercent).dividedBy(100);
        }
    }

    withdrawLP() {
        if ((this.loadStatus !== 0 && this.loadStatus !== 2) || this.withdrawLPAmt.comparedTo(0) === 0) {
            return;
        }
        this.loading.emit();
        this.loadStatus = LoadStatus.Loading;
        this.boot.withdrawLP(this.withdrawLPAmt.toFixed(18, BigNumber.ROUND_DOWN)).then(() => {

        }).catch(e => {
            // this.boot.loadData();
            this.loaded.emit();
            this.loadStatus = LoadStatus.Loaded;
            this.withdrawLPPercentChange(0);
        });
    }

    withdrawAllLP() {
        this.loading.emit();
        this.loadStatus = LoadStatus.Loading;
        this.boot.emergencyWithdraw().then(() => {
        }).catch(e => {
            // this.boot.loadData();
            this.loaded.emit();
            this.loadStatus = LoadStatus.Loaded;
        });
    }

    getPending() {
        this.loading.emit();
        this.isDisabled = true;
        this.loadStatus = LoadStatus.Loading;
        this.boot.withdrawLP('0').then(() => {
        }).catch(e => {
            this.isDisabled = false;
            // this.boot.loadData();
            this.loaded.emit();
            this.loadStatus = LoadStatus.Loaded;
        });
    }

    keypressFn(e) {
        const invalidChars = ['-', '+', 'e', 'E'];
        if (invalidChars.indexOf(e.key) !== -1) {
            e.preventDefault();
            return;
        } else {
            const reg = /^\d*(?:[.,]\d{1,3})?$/;
            if (!reg.test(e.target.value)) {
                e.preventDefault();
                return;
            }
        }
    }
}
