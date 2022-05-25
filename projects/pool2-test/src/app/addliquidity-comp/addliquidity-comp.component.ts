import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import BigNumber from 'bignumber.js';
import {environment} from '../../environments/environment';
import {ChooseWalletDlgComponent} from '../choose-wallet-dlg/choose-wallet-dlg.component';
import {PriceDiffComponent} from '../price-diff/price-diff.component';
import {BootService} from '../services/boot.service';

export enum ApproveStatus {
    None, Approved, NoApproved
}

export enum LoadStatus {
    None, Loading, Loaded
}

@Component({
    selector: 'app-addliquidity-comp',
    templateUrl: './addliquidity-comp.component.html',
    styleUrls: ['./addliquidity-comp.component.less']
})
export class AddliquidityCompComponent implements OnInit {

    @Input('hidden')
    hidden = true;

    amts: Array<number>;

    approveStatus: ApproveStatus[];

    loadStatus: LoadStatus = LoadStatus.None;

    @Output() loading: EventEmitter<any> = new EventEmitter();
    @Output() loaded: EventEmitter<any> = new EventEmitter();
    @Output('chooseWallet') chooseWallt = new EventEmitter();
    @Output('installWallet') installChooseWallt = new EventEmitter();

    constructor(public boot: BootService, private dialog: MatDialog) {
        this.amts = new Array<number>();
        this.approveStatus = new Array();
        for (let i = 0; i < this.boot.coins.length; i++) {
            this.amts.push(0);
            this.approveStatus.push(ApproveStatus.None);
        }
        this.boot.walletReady.subscribe(res => {
            this.updateApproveStatus();
        });
        this.boot.initContractsCompleted.subscribe(res => {
            this.boot.approvalStatusChange.subscribe(res => {
                this.updateApproveStatus();
            });
        });

    }

    ngOnInit(): void {
        this.boot.approvalStatusChange.subscribe(() => {
            this.updateApproveStatus();
            this.loadStatus = LoadStatus.Loaded;
            this.loaded.emit();
        });
        this.boot.balanceChange.subscribe(() => {
            this.updateApproveStatus();
            this.loadStatus = LoadStatus.Loaded;
            this.loaded.emit();
        });
    }

    // approve() {
    //     this.status = ActionStatus.Approving;
    //     let pArr = new Array();
    //     this.amts.forEach(e => {
    //         if (e) {
    //             pArr.push(this.boot.approve(0, String(e ? e : 0)));
    //         }
    //     });
    //     Promise.all(pArr).then(rArr => {
    //         this.status = ActionStatus.Approved;
    //     });
    // }
    updateApproveStatus() {
        for (let i = 0; i < this.boot.coins.length; i++) {
            if (this.boot.accounts && this.boot.accounts.length > 0) {
                this.boot.allowance(i, this.boot.poolAddress).then(amt => {
                    if (amt.comparedTo(new BigNumber(this.amts[i])) >= 0) {
                        this.approveStatus[i] = ApproveStatus.Approved;
                    } else {
                        this.approveStatus[i] = ApproveStatus.NoApproved;
                    }
                });
            }
        }
    }

    approve(i: number) {
        if (this.isApproveEnabled(i) && this.loadStatus !== 1) {
            this.loadStatus = LoadStatus.Loading;
            this.loading.emit();
            this.boot.approve(i, String(this.amts[i] ? this.amts[i] : 0), this.boot.poolAddress).then(res => {
                if (!res) {
                    this.loadStatus = LoadStatus.Loaded;
                    this.loaded.emit();
                }
            }).catch(e => {
                this.loadStatus = LoadStatus.Loaded;
                this.loaded.emit();
            });
        }
    }

    async addLiquidity() {
        if (!this.isAddLiquidityBtnEnabled() || this.loadStatus === 1) {
            return;
        }
        // await this.boot.loadData();
        this.loadStatus = LoadStatus.Loading;
        this.loading.emit();
        let amtsStr = new Array<string>();
        let totalAmt = new BigNumber(0);
        this.amts.forEach((e, i) => {
            if (e > 0 && !this.isApproveEnabled(i)) {
                amtsStr.push(String(e));
            } else { //
                amtsStr.push('0');
            }
            totalAmt = totalAmt.plus(e);
        });
        let lp;
        if (this.boot.poolInfo.totalSupply.comparedTo(0) === 0) {
            lp = totalAmt;
        } else {
            lp = await this.boot.calcTokenAmount(amtsStr, true);
        }
        let nVirtualPrice = await this.boot.calculateVirtualPrice(amtsStr, lp, true);
        console.log('New Virtual Price: ' + nVirtualPrice.toFixed(18));
        let diff = nVirtualPrice.div(this.boot.poolInfo.virtualPrice).minus(1).abs();
        console.log('Diff: ' + diff.toFixed(18));

        let totalBalance = new BigNumber(0);
        this.boot.poolInfo.coinsRealBalance.forEach(e => {
            totalBalance = totalBalance.plus(e);
        });
        // if (totalBalance.comparedTo(0) > 0 && diff.comparedTo(environment.virtualPriceDiff) > 0) {
        //     this.dialog.open(PriceDiffComponent, { width: '30em' });
        //     this.loadStatus = LoadStatus.Loaded;
        //     this.loaded.emit();
        //     return;
        // } else {
        this.boot.addLiquidity(amtsStr, lp).then(r => {

        }).catch(e => {
            this.updateApproveStatus();
            this.loadStatus = LoadStatus.Loaded;
            // this.boot.loadData();
            this.loaded.emit();
        });
        // }
    }

    isApproveEnabled(i: number) {
        if (this.boot.accounts && this.boot.accounts.length > 0 && this.approveStatus[i] === ApproveStatus.NoApproved) {
            return true;
        } else {
            return false;
        }
    }

    isAddLiquidityBtnEnabled() {
        let r = true;
        this.boot.poolInfo.coinsBalance.forEach(e => {
            r = r && (e.comparedTo(0) === 0);
        });
        // if (r) { // 池中余额全部为0
        let re = true;
        this.amts.forEach((e, i) => {
            let amt = new BigNumber(e);
            re = re && !this.isApproveEnabled(i) && amt.comparedTo(0) > 0;
        });
        return re;
        // } else {
        //     let allAmtIs0 = true;
        //     this.amts.forEach(e => {
        //         let n = new BigNumber(e);
        //         allAmtIs0 = allAmtIs0 && (n.isNaN() || n.comparedTo(0) === 0);
        //     });
        //     if (allAmtIs0) {
        //         return false;
        //     } else {
        //         let re = false;
        //         this.amts.forEach((e, i) => {
        //             let n = new BigNumber(e);
        //             if (n.isNaN() || n.comparedTo(0) === 0 || this.isApproveEnabled(i)) {

        //             } else {
        //                 re = true;
        //             }
        //         });
        //         return re;
        //     }
        // }
    }

    amtChange(i: number, val: any) {
        this.amts[i] = val;
        this.updateApproveStatus();
    }

    public async connectWallet() {
        if (!this.boot.isMetaMaskInstalled() && !this.boot.isBinanceInstalled()) {
            this.installChooseWallt.emit();
            return;
        } else {
            this.chooseWallet();
        }
    }

    chooseWallet() {
        this.chooseWallt.emit();
    }
}
