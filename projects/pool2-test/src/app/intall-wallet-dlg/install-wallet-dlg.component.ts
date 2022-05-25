import { Component, OnInit } from '@angular/core';
import { BootService } from '../services/boot.service';

@Component({
    selector: 'app-install-wallet-dlg',
    templateUrl: './install-wallet-dlg.component.html',
    styleUrls: ['./install-wallet-dlg.component.less']
})
export class InstallWalletDlgComponent implements OnInit {
    hidden = true;

    selectedIndex = 0;
    isMobile = false;
    constructor(public boot: BootService) { }

    ngOnInit(): void {
    }
    connectWC() {
        this.boot.connectWC();
    }
    onItemMouseEnter(event) {
        this.selectedIndex = event.index;
    }

    onItemMouseLeave(event) {
        this.selectedIndex = event.index;
    }

    installMetaMask() {
        window.open('https://metamask.io/','_blank');
    }

    installBinance() {
        window.open('https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp','_blank');
    }
    close() {
        setTimeout(() => {
            this.hidden = true;
        }, 200);
    }
    open() {
        this.hidden = false;
    }
}
