import { Component, Input, OnInit, EventEmitter, Output, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-wallet-item',
    templateUrl: './wallet-item.component.html',
    styleUrls: ['./wallet-item.component.less']
})
export class WalletItemComponent implements OnInit {

    @Input('index')
    index;

    @Input('isMobile')
    isMobile = false;

    @Output('onMouseEnter')
    mouseEnter: EventEmitter<any> = new EventEmitter();
    @Output('onMouseLeave')
    mouseLeave: EventEmitter<any> = new EventEmitter();
    mouseOn = false;

    @Input('walletImg')
    walletImg;

    @Input('walletName')
    walletName;

    @Output('onClick')
    clickEvent = new EventEmitter();

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
    }

    onLiMouseEnter() {
        this.mouseOn = true;
        this.mouseEnter.emit({ index: this.index });
    }

    onLiMouseLeave() {
        this.mouseOn = false;
        this.mouseLeave.emit({ index: this.index });
    }

    safeImgSrc() {
        return this.sanitizer.sanitize(SecurityContext.URL, this.walletImg);
    }

    onClick() {
        this.clickEvent.emit();
    }

}
