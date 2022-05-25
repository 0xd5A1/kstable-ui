import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import BigNumber from 'bignumber.js';
import { CoinsDlgComponent } from '../coins-dlg/coins-dlg.component';
import { BootService } from '../services/boot.service';
import { SlippageSettingDlgComponent } from '../slippage-setting-dlg/slippage-setting-dlg.component';

export enum ApproveStatus {
    None, Approved, NoApproved
}

export enum LoadStatus {
    None, Loading, Loaded
}

@Component({
    selector: 'app-swap-comp',
    templateUrl: './swap-comp.component.html',
    styleUrls: ['./swap-comp.component.less']
})
export class SwapCompComponent implements OnInit {
    @Input('hidden')
    hidden = false;

    left = 0;
    slippageNum = 1;

    right = 1;

    balance: BigNumber;

    amt = '0';

    minAmt: string = '0';

    approveStatus: ApproveStatus = ApproveStatus.None;

    loadStatus: LoadStatus = LoadStatus.None;

    @Output() loading: EventEmitter<any> = new EventEmitter();
    @Output() loaded: EventEmitter<any> = new EventEmitter();
    @Output('chooseWallet') chooseWlt = new EventEmitter();
    @Output('installWallet') installWlt = new EventEmitter();

    @ViewChild('settingDlg')
    settingDlg: SlippageSettingDlgComponent;

    @ViewChild('coinsDlgLeft')
    coinsDlgLeft: CoinsDlgComponent;

    @ViewChild('coinsDlgRight')
    coinsDlgRight: CoinsDlgComponent;

    constructor(public boot: BootService, private dialog: MatDialog) {
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
            this.loaded.emit();
            this.updateApproveStatus();
            this.loadStatus = LoadStatus.Loaded;
        });
        this.boot.balanceChange.subscribe(() => {
            this.loaded.emit();
            this.loadStatus = LoadStatus.Loaded;
            this.updateApproveStatus();
        });
    }

    chooseLeft(val) {
        this.left = val;
        if (this.left === this.right) {
            if (this.right !== 2) {
                this.right = this.right + 1;
            } else {
                this.right = 0;
            }
        }
        this.boot.getExchangeOutAmt(Number(this.left), Number(this.right), this.amt).then(res => {
            this.minAmt = res.toFixed(4, BigNumber.ROUND_UP);
        });
    }

    chooseRight(val) {
        this.right = val;
        if (this.left === this.right) {
            if (this.left !== 2) {
                this.left = this.right + 1;
            } else {
                this.left = 0;
            }
        }
        this.boot.getExchangeOutAmt(Number(this.left), Number(this.right), this.amt).then(res => {
            this.minAmt = res.toFixed(4, BigNumber.ROUND_UP);
        });
    }

    maxAmt() {
        this.amt = this.boot.balance.coinsBalance[this.left].toFixed(4, 1);
        this.boot.getExchangeOutAmt(Number(this.left), Number(this.right), this.amt).then(res => {
            this.minAmt = res.toFixed(4, BigNumber.ROUND_UP);
        });
        this.updateApproveStatus();
    }

    approve() {
        if (this.amt) {
            this.loadStatus = LoadStatus.Loading;
            this.loading.emit();
            this.boot.approve(Number(this.left), this.amt, this.boot.poolAddress).then((res) => {
                if (!res) {
                    this.loadStatus = LoadStatus.Loaded;
                    this.loaded.emit();
                }
            }).catch(e => {
                console.log(e);
                this.loadStatus = LoadStatus.Loaded;
                this.loaded.emit();
            });
        }
    }

    async exchange() {
        if (this.amt && this.isExchangeEnabled()) {
            this.loading.emit();
            this.loadStatus = LoadStatus.Loading;
            let amtsStr = new Array();
            for (let i = 0; i < this.boot.coins.length; i++) {
                amtsStr[i] = '0';
            }
            amtsStr[Number(this.left)] = this.amt;
            amtsStr[Number(this.right)] = String(0 - Number(this.minAmt));
            let nVirtualPrice = await this.boot.calculateVirtualPrice(amtsStr, null, false);
            console.log('New Virtual Price: ' + nVirtualPrice.toFixed(18));
            let diff = nVirtualPrice.div(this.boot.poolInfo.virtualPrice).minus(1).abs();
            console.log('Diff: ' + diff.toFixed(18));
            // if (diff.comparedTo(environment.virtualPriceDiff) > 0) {
            //     this.dialog.open(PriceDiffComponent, { width: '30em' });
            //     this.loadStatus = LoadStatus.Loaded;
            //     this.loaded.emit();
            //     return;
            // } else {
            let minAmt = new BigNumber(this.minAmt).multipliedBy(new BigNumber(100).minus(this.slippageNum).div(100));
            this.boot.exchange(Number(this.left), Number(this.right), this.amt, minAmt.toFixed(18, BigNumber.ROUND_DOWN)).then(res => {
                console.log(res);
                // this.boot.loadData();
                if (!res) {
                    this.loaded.emit();
                    this.loadStatus = LoadStatus.Loaded;
                    this.updateApproveStatus();
                }
            }).catch(e => {
                this.loaded.emit();
                this.loadStatus = LoadStatus.Loaded;
                this.updateApproveStatus();
            });
            // }
        }
    }

    // leftClick(i) {
    //     this.left = i;
    // }

    // rightClick(i) {
    //     this.right = i;
    // }

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

    amtChanged(val) {
        this.amt = val;
        if (!new BigNumber(this.left).isNaN() && !new BigNumber(this.right).isNaN() && !new BigNumber(this.amt).isNaN()) {
            this.boot.getExchangeOutAmt(Number(this.left), Number(this.right), this.amt).then(res => {
                this.minAmt = res.toFixed(4, BigNumber.ROUND_DOWN);
            });
        }
        this.updateApproveStatus();
    }

    updateApproveStatus() {
        if (!new BigNumber(this.left).isNaN() && !new BigNumber(this.amt).isNaN() && this.boot.accounts && this.boot.accounts.length > 0) {
            this.boot.allowance(this.left, this.boot.poolAddress).then(amt => {
                if (amt.comparedTo(new BigNumber(this.amt)) >= 0) {
                    this.approveStatus = ApproveStatus.Approved;
                } else {
                    this.approveStatus = ApproveStatus.NoApproved;
                }
            });
        }
    }

    isApproveEnabled() {
        if (this.amt && Number(this.amt) > 0 && this.approveStatus === ApproveStatus.NoApproved && this.loadStatus !== LoadStatus.Loading) {
            return true;
        } else {
            false;
        }
    }

    isExchangeEnabled() {
        if (this.amt && Number(this.amt) > 0 && this.loadStatus !== LoadStatus.Loading && this.approveStatus === ApproveStatus.Approved) {
            return true;
        } else {
            return false;
        }
    }

    getFee() {
        return this.boot.poolInfo.fee.multipliedBy(100).toFixed(1, 1);
    }

    openCoinLeftDlg() {
        this.coinsDlgLeft.open(this.left);
    }

    openCoinRightDlg() {
        this.coinsDlgRight.open(this.right);
    }

    onLeftCoinSelected(selectedIndex_) {
        this.left = selectedIndex_;
        this.chooseLeft(selectedIndex_);
        this.updateApproveStatus();
    }

    onRightCoinSelected(selectedIndex_) {
        this.right = selectedIndex_;
        this.chooseRight(selectedIndex_);
    }

    slippageFn() {
        setTimeout(() => {
            this.settingDlg.open();
        }, 0);
    }

    onTaskData(e) {
        console.log(e);
        this.slippageNum = e;
    }
}
