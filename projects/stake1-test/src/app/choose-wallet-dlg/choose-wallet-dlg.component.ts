import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BootService } from '../services/boot.service';

@Component({
    selector: 'app-choose-wallet-dlg',
    templateUrl: './choose-wallet-dlg.component.html',
    styleUrls: ['./choose-wallet-dlg.component.less']
})
export class ChooseWalletDlgComponent implements OnInit {

    hidden = true;

    selectedIndex = 0;
    isMobile = false;

    constructor(public boot: BootService) { }

    ngOnInit(): void {
        let regEx = navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i);
        this.isMobile = regEx != null && regEx.length > 0;
    }

    connectWC() {
        this.boot.connectWC();
    }

    connectBinance() {
        this.boot.connectBinance();
    }

    connectMetaMask() {
        this.boot.connentMetaMask();
    }

    open() {
        this.hidden = false;
    }

    close() {
        setTimeout(() => {
            this.hidden = true;
        }, 200);
    }

    onItemMouseEnter(event) {
        this.selectedIndex = event.index;
    }

    onItemMouseLeave(event) {
        this.selectedIndex = event.index;
    }
}
