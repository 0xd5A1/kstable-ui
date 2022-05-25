import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BootService } from '../services/boot.service';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.less']
})
export class UserInfoComponent implements OnInit {
    @Output() loading: EventEmitter<any> = new EventEmitter();
    @Output() loaded: EventEmitter<any> = new EventEmitter();
    constructor(public boot: BootService) { }

    ngOnInit(): void {
    }

    claim(i) {
        this.loading.emit();
        this.boot.claimTestCoin(i).then(() => {
            this.loaded.emit();
            // this.boot.loadData();
        });
    }
}
