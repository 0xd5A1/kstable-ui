import { Component, EventEmitter, Input, OnInit, Output, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BootService } from '../services/boot.service';

@Component({
    selector: 'app-coin-item',
    templateUrl: './coin-item.component.html',
    styleUrls: ['./coin-item.component.less']
})
export class CoinItemComponent implements OnInit {

    @Input('index')
    index;

    @Output('coinMouseEnter')
    coinMouseEnter = new EventEmitter();

    @Output('coinMouseLeave')
    coinMouseLeave = new EventEmitter();

    @Output('selectedCoin')
    selectedCoinEE = new EventEmitter();

    @Input('selected')
    selected = false;

    @Input('coinImg')
    coinImg;

    @Input('symbol')
    symbol;

    constructor(private sanitizer: DomSanitizer, public boot: BootService) { }

    ngOnInit(): void {
    }

    onMouseEnter() {
        this.coinMouseEnter.emit(this.index);
    }

    onMouseLeave() {
        this.coinMouseLeave.emit(this.index);
    }

    selectedCoin() {
        this.selected = true;
        this.selectedCoinEE.emit(this.index);
    }

    cancel() {
        this.selected = false;
    }

    safeImgSrc() {
        return this.sanitizer.sanitize(SecurityContext.URL, this.coinImg);
    }

}
