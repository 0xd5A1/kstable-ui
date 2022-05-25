import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {BootService} from './services/boot.service';
import {HeaderComponent, LanguageService} from 'app-lib';
import {MatDialog} from '@angular/material/dialog';
import {ChooseWalletDlgComponent} from './choose-wallet-dlg/choose-wallet-dlg.component';
import {LocalStorageService} from 'angular-web-storage';
import {ConstVal} from './model/const-val';
import {InstallWalletDlgComponent} from './intall-wallet-dlg/install-wallet-dlg.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    title = 'sssp-app';
    isAndroid;

    curTab = 0;

    isMobile = false;

    menuOpen = true;

    private static MAX_CLIENT_WIDTH = 1200;

    biggerThanMax = false;

    @ViewChild('header')
    header: HeaderComponent;

    @ViewChild('cwDlg')
    cwDlg: ChooseWalletDlgComponent;

    @ViewChild('installWltDlg')
    installWltDlg: InstallWalletDlgComponent;

    @ViewChild('tabsUl')
    tabsUl: ElementRef;

    @ViewChild('tabsBg')
    tabsBg: ElementRef;

    constructor(public boot: BootService, public lang: LanguageService, private localStorage: LocalStorageService, private renderer: Renderer2) {

    }

    ngOnInit(): void {
        let clientWidth = document.body.clientWidth;
        this.biggerThanMax = clientWidth > AppComponent.MAX_CLIENT_WIDTH ? true : false;
        let regEx = navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i);
        this.isMobile = regEx != null && regEx.length > 0;
        if (this.boot.isMetaMaskInstalled() || this.boot.isBinanceInstalled()) {
            let wallet = this.localStorage.get(ConstVal.KEY_WEB3_TYPE);
            if (wallet && wallet === 'walletconnect') {
                this.boot.connectWC();
            } else if (wallet && wallet === 'metamask') {
                this.boot.connentMetaMask();
            } else if (wallet === 'binance') {
                setTimeout(() => {
                    this.boot.connectBinance();
                }, 1000);
            } else {
                this.chooseWallet();
            }
        }
        const u = navigator.userAgent;
        this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        if (this.biggerThanMax || !this.isMobile) {
            this.menuOpen = true;
        }
    }


    changeTab(tab) {
        console.log(tab);
        this.curTab = tab;
        if (!this.isMobile) {
            switch (tab) {
                case 0:
                    this.renderer.setAttribute(this.tabsBg.nativeElement, 'style', 'transform:translateX(22px);');
                    return;
                case 1:
                    this.renderer.setAttribute(this.tabsBg.nativeElement, 'style', 'transform:translateX(250px);');
                    return;
                case 2:
                    this.renderer.setAttribute(this.tabsBg.nativeElement, 'style', 'transform:translateX(520px);');
                    return;
                case 3:
                    this.renderer.setAttribute(this.tabsBg.nativeElement, 'style', 'transform:translateX(773px);');
                    return;
            }
        } else {
            switch (tab) {
                case 0:
                    this.tabsUl.nativeElement.scrollLeft -= 0;
                    return;
                case 1:
                    this.tabsUl.nativeElement.scrollLeft -= 0;
                    return;
                case 2:
                    this.tabsUl.nativeElement.scrollLeft -= 100;
                    return;
                case 3:
                    this.tabsUl.nativeElement.scrollLeft -= 150;
                    return;
            }
        }
    }

    chooseWallet() {
        // let dlgRef = this.dialog.open(ChooseWalletDlgComponent, { width: '30em' });
        // dlgRef.afterClosed().toPromise().then(res => {
        //     this.header.onLoaded();
        // });
        setTimeout(() => {
            this.cwDlg.open();
        }, 0);
    }

    public async connectWallet() {
        if (!this.boot.isMetaMaskInstalled() && !this.boot.isBinanceInstalled()) {
            // this.dialog.open(IntallWalletDlgComponent, { width: '30em' });
            return;
        } else {
            this.chooseWallet();
        }
    }

    public openMenu() {
        this.menuOpen = !this.menuOpen;
    }

    toggleLang() {
        this.lang.changeLanguage(this.lang.curLanguage === 'zh' ? 'en' : 'zh');
    }

    onLoading() {
        this.header.onLoading();
    }

    onLoaded() {
        this.header.onLoaded();
    }

    addressLinkFn(v) {
        const str: any = v.slice(0, 6) + '...' + v.substring(v.length - 4);
        return str;
    }

    menuOpenFn(e) {
        console.log(e);
        this.menuOpen = e;
    }
}
