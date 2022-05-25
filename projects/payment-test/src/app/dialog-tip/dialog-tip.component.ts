import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-dialog-tip',
    templateUrl: './dialog-tip.component.html',
    styleUrls: ['./dialog-tip.component.less']
})
export class DialogTipComponent implements OnInit {

    @Output() hiddenDialog: EventEmitter<any> = new EventEmitter();

    @Input('hidden')
    hidden;
    @Input('titleError')
    titleError;

    constructor() {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.hidden = true;
            this.hiddenDialog.emit(true);
        }, 2000);
    }

    close() {
        this.hidden = true;
        this.hiddenDialog.emit(true);
    }

}
