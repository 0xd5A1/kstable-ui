import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import BigNumber from 'bignumber.js';
import { CoinsDlgComponent } from '../coins-dlg/coins-dlg.component';
import { BootService } from '../services/boot.service';
import { ethers } from 'ethers';

export enum ApproveStatus {
    None, Approved, NoApproved
}

export enum LoadStatus {
    None, Loading, Loaded
}

@Component({
    selector: 'app-payment-info',
    templateUrl: './payment-info.component.html',
    styleUrls: ['./payment-info.component.less']
})
export class PaymentInfoComponent implements OnInit {
    @Input('hidden')
    hidden = false;

    tipsShow = false;
    showDialog = true;
    titleError = '';

    left = 0;
    active = 1;
    slippageNumList: any = [
        { num: 1 },
        { num: 2 },
        { num: 5 }
    ];

    right = 1;

    balance: BigNumber;

    amt = '0';

    isOtherCurrency: boolean = false;

    rightAmt: string = '0';
    address: string = '';

    approveStatus: ApproveStatus = ApproveStatus.None;
    approveStatusRight: ApproveStatus = ApproveStatus.None;

    loadStatus: LoadStatus = LoadStatus.None;

    @Output() loading: EventEmitter<any> = new EventEmitter();
    @Output() loaded: EventEmitter<any> = new EventEmitter();
    @Output('chooseWallet') chooseWlt = new EventEmitter();
    @Output('installWallet') installWlt = new EventEmitter();

    @ViewChild('coinsDlgLeft')
    coinsDlgLeft: CoinsDlgComponent;

    @ViewChild('coinsDlgRight')
    coinsDlgRight: CoinsDlgComponent;

    receiptAmt = '-';

    gasFee = '-';

    insufficientLiquidity: boolean = false;

    constructor(public boot: BootService, private dialog: MatDialog) {
        this.boot.initContractsCompleted.subscribe(res => {
            this.boot.approvalStatusChange.subscribe(res => {
                this.updateApproveStatus();
                this.updateApproveStatusRight();
            });
        });
    }

    ngOnInit(): void {
        this.boot.approvalStatusChange.subscribe(() => {
            this.loaded.emit();
            this.updateApproveStatus();
            this.updateApproveStatusRight();
            this.loadStatus = LoadStatus.Loaded;
        });
        this.boot.balanceChange.subscribe(() => {
            this.loaded.emit();
            this.loadStatus = LoadStatus.Loaded;
            this.updateApproveStatus();
            this.updateApproveStatusRight();
        });
    }

    approve() {
        if (this.amt) {
            this.loadStatus = LoadStatus.Loading;
            this.loading.emit();
            let amt = new BigNumber(this.amt).toFixed(18, BigNumber.ROUND_DOWN);
            this.boot.approve(Number(this.left), amt, this.boot.paymentContract.address).then((res) => {
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

    approveRight() {
        if (this.rightAmt) {
            this.loadStatus = LoadStatus.Loading;
            this.loading.emit();
            this.boot.approve(Number(this.right), this.rightAmt, this.boot.paymentContract.address).then((res) => {
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

    pay() {
        if (this.isOtherCurrency) {
            this.paySwap();
        } else {
            this.payNoSwap();
        }
    }

    payNoSwap() {
        if (!this.address || this.address === '') {
            this.showDialog = false;
            this.titleError = 'Please enter the receiver address';
            return;
        }
        if (this.amt && this.address && this.isExchangeEnabled()) {
            this.loading.emit();
            this.loadStatus = LoadStatus.Loading;
            let amt = new BigNumber(this.amt).toFixed(18, BigNumber.ROUND_DOWN);
            this.boot.pay(Number(this.left), this.address, amt).then((res) => {
                console.log(res);
                if (!res) {
                    this.loaded.emit();
                    this.loadStatus = LoadStatus.Loaded;
                    this.updateApproveStatus();
                }
                this.isExchangeEnabled();
            }).catch(e => {
                this.loaded.emit();
                this.loadStatus = LoadStatus.Loaded;
                this.updateApproveStatus();
            });
        }
    }

    paySwap() {
        if (!this.address || this.address === '') {
            this.showDialog = false;
            this.titleError = 'Please enter the receiver address';
            return;
        }
        if (this.left === this.right) {
            this.showDialog = false;
            this.titleError = 'Select Token repeat';
            return;
        }
        if (this.rightAmt && this.address && this.isExchangeEnabledRight()) {
            this.loading.emit();
            this.loadStatus = LoadStatus.Loading;
            this.boot.payWithSwap(Number(this.right), Number(this.left), this.rightAmt, this.receiptAmt, this.address).then((res) => {
                if (!res) {
                    this.loaded.emit();
                    this.loadStatus = LoadStatus.Loaded;
                    this.updateApproveStatusRight();
                }
                this.isExchangeEnabledRight();
            }).catch(e => {
                this.loaded.emit();
                this.loadStatus = LoadStatus.Loaded;
                this.updateApproveStatusRight();
            });
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
        let oAmt = new BigNumber(this.amt);
        let arr = new Array();
        for (let i = 1; i <= 5; i++) {
            arr.push(this.boot.getExchangeOutAmt(this.right, this.left, oAmt.multipliedBy(new BigNumber(1.001).exponentiatedBy(i)).toFixed(2, BigNumber.ROUND_DOWN)));
        }
        Promise.all(arr).then(res => {
            for (let i = 0; i < res.length; i++) {
                if (new BigNumber(res[i]).comparedTo(this.amt) >= 0) {
                    this.rightAmt = new BigNumber(val).multipliedBy(new BigNumber(1.001).exponentiatedBy(i + 1)).toFixed(2, BigNumber.ROUND_DOWN);
                    break;
                }
            }
            this.updateApproveStatus();
            if (this.amt && this.amt !== '' && this.amt !== '0') {
                this.calcNum();
            } else {
                this.isOtherCurrency = false;
                this.rightAmt = '0';
            }
        }).catch(e => {
            this.rightAmt = new BigNumber(val).multipliedBy(1 + 0.004).toFixed(2, BigNumber.ROUND_DOWN);
            this.updateApproveStatus();
            if (this.amt && this.amt !== '' && this.amt !== '0') {
                this.calcNum();
            } else {
                this.isOtherCurrency = false;
                this.rightAmt = '0';
            }
        });
    }

    amtChangedRight(val) {
        this.rightAmt = val;
        this.calcNum();
        this.updateApproveStatusRight();
    }

    updateApproveStatus() {
        if (!new BigNumber(this.left).isNaN() && !new BigNumber(this.amt).isNaN() && this.boot.accounts && this.boot.accounts.length > 0) {
            this.boot.allowance(this.left, this.boot.paymentContract.address).then(amt => {
                if (amt.comparedTo(new BigNumber(this.amt)) >= 0) {
                    this.approveStatus = ApproveStatus.Approved;
                } else {
                    this.approveStatus = ApproveStatus.NoApproved;
                }
            });
        }
    }

    updateApproveStatusRight() {
        if (!new BigNumber(this.right).isNaN() && !new BigNumber(this.rightAmt).isNaN() && this.boot.accounts && this.boot.accounts.length > 0) {
            this.boot.allowance(this.right, this.boot.paymentContract.address).then(amt => {
                if (amt.comparedTo(new BigNumber(this.rightAmt)) >= 0) {
                    this.approveStatusRight = ApproveStatus.Approved;
                } else {
                    this.approveStatusRight = ApproveStatus.NoApproved;
                }
            });
        }
    }

    isApproveEnabled() {
        if (this.amt && Number(this.amt) > 0 && this.approveStatus === ApproveStatus.NoApproved && this.loadStatus !== LoadStatus.Loading && !this.insufficientLiquidity) {
            return true;
        } else {
            return false;
        }
    }

    isApproveEnabledRight() {
        if (this.rightAmt && Number(this.rightAmt) > 0 && this.approveStatusRight === ApproveStatus.NoApproved && this.loadStatus !== LoadStatus.Loading && !this.insufficientLiquidity) {
            return true;
        } else {
            return false;
        }
    }

    isExchangeEnabled() {
        if (this.amt && Number(this.amt) > 0 && this.loadStatus !== LoadStatus.Loading && this.approveStatus === ApproveStatus.Approved && !this.insufficientLiquidity) {
            return true;
        } else {
            return false;
        }
    }

    isExchangeEnabledRight() {
        if (this.rightAmt && Number(this.rightAmt) > 0 && this.loadStatus !== LoadStatus.Loading && this.approveStatusRight === ApproveStatus.Approved && !this.insufficientLiquidity) {
            return true;
        } else {
            return false;
        }
    }

    onLeftCoinSelected(selectedIndex_) {
        this.left = selectedIndex_;
        //this.chooseLeft(selectedIndex_);
        this.updateApproveStatus();
        this.calcNum();
    }

    onRightCoinSelected(selectedIndex_) {
        this.right = selectedIndex_;
        //this.chooseRight(selectedIndex_);
        this.updateApproveStatus();
        this.calcNum();
    }

    hiddenDialog(e) {
        console.log(e);
        this.showDialog = e;
    }

    openCoinLeftDlg() {
        this.coinsDlgLeft.open(this.left);
    }

    openCoinRightDlg() {
        this.coinsDlgRight.open(this.right);
    }

    otherCurrency() {
        if (new BigNumber(this.amt).comparedTo(0) > 0) {
            this.isOtherCurrency = !this.isOtherCurrency;
            this.calcNum();
            this.updateApproveStatusRight();
            if (!this.isOtherCurrency) {
                this.insufficientLiquidity = false;
            }
        }
    }

    selectNumFn(index) {
        this.active = index;
        this.calcNum();
    }

    calcNum() {
        if (this.isOtherCurrency) {
            this.boot.estimatePayWithSwapGasFee().then(_gasFee => {
                this.gasFee = (_gasFee.quote === 'USD' ? '$' : '') + _gasFee.data.toFormat(2, BigNumber.ROUND_DOWN) + ' ' + _gasFee.quote;
            });
            this.receiptAmt = '-';
            this.boot.getExchangeOutAmt(this.right, this.left, this.rightAmt).then(amt => {
                let inAmt = new BigNumber(this.amt);
                let slippage = new BigNumber(1).minus(amt.div(inAmt));
                if (slippage.comparedTo(0.1) < 0) {
                    this.insufficientLiquidity = false;
                } else {
                    this.insufficientLiquidity = true;
                }
                this.receiptAmt = amt.toFixed(2, BigNumber.ROUND_DOWN);
            }).catch(e => {
                this.receiptAmt = '-';
                this.insufficientLiquidity = true;
            });
        } else {
            this.receiptAmt = new BigNumber(this.amt).multipliedBy(1 - .003).toFormat(2, BigNumber.ROUND_DOWN);
            this.boot.estimatePayGasFee().then(_gasFee => {
                this.gasFee = (_gasFee.quote === 'USD' ? '$' : '') + _gasFee.data.toFormat(2, BigNumber.ROUND_DOWN) + ' ' + _gasFee.quote;
            }).catch(e => {
                console.log(e);
            });
        }
    }

    editAddress(v) {
        this.address = v;
    }
}
