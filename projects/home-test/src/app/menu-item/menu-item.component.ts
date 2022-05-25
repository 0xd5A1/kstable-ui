import {Component, EventEmitter, Input, OnInit, Output, SecurityContext} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {LanguageService} from '../services/language.service';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {

    @Input('empty')
    empty = true;

    @Input('itemText')
    itemText;

    mouseOn = false;

    @Input('targetUrl')
    url = '#';

    @Input('target')
    target = '_self';

    @Output() changeLanguageFn: EventEmitter<any> = new EventEmitter();

    constructor(private sanitizer: DomSanitizer, private lang: LanguageService) {
    }

    ngOnInit(): void {
    }

    onMouseEnter() {
        this.mouseOn = true;
    }

    onMouseLeave() {
        this.mouseOn = false;
    }

    safeUrl() {
        return this.sanitizer.sanitize(SecurityContext.URL, this.url);
    }

    langChangeFn(k) {
        if (k === '中文简体') {
            this.lang.changeLanguage('zh');
            this.changeLanguageFn.emit('中文简体');
        } else {
            this.lang.changeLanguage('en');
            this.changeLanguageFn.emit('English');
        }
    }

}
