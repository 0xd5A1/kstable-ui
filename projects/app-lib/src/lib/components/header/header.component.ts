import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { BigNumber } from 'bignumber.js';

@Component({
    selector: 'lib-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    loading: boolean = false;

    constructor(public lang: LanguageService) { }

    ngOnInit(): void {
    }
    onLoading() {
        this.loading = true;
    }

    onLoaded() {
        this.loading = false;
    }
}
