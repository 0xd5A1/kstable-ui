import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-dialog-tip',
    templateUrl: './dialog-tip.component.html',
    styleUrls: ['./dialog-tip.component.less']
})
export class DialogTipComponent implements OnInit {

    @Input('hidden')
    hidden = true;

    constructor() { }

    ngOnInit(): void {
    }

    close() {
        this.hidden = true;
    }

    open() {
        this.hidden = false;
    }

}
