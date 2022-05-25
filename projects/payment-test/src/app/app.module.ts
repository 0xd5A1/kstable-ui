import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppLibModule} from 'app-lib';
import {AppComponent} from './app.component';
import {ChooseWalletDlgComponent} from './choose-wallet-dlg/choose-wallet-dlg.component';
import {InstallWalletDlgComponent} from './intall-wallet-dlg/install-wallet-dlg.component';
import {UnsupportedNetworkComponent} from './unsupported-network/unsupported-network.component';
import {PriceDiffComponent} from './price-diff/price-diff.component';
import {ApproveDlgComponent} from './approve-dlg/approve-dlg.component';
import {WalletExceptionDlgComponent} from './wallet-exception-dlg/wallet-exception-dlg.component';
import {MatIconModule} from '@angular/material/icon';
import {WalletItemComponent} from './wallet-item/wallet-item.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import {CoinsDlgComponent} from './coins-dlg/coins-dlg.component';
import {CoinItemComponent} from './coin-item/coin-item.component';
import { DialogTipComponent } from './dialog-tip/dialog-tip.component';
import { GetPaidToPayComponent } from './get-paid-to-pay/get-paid-to-pay.component';

@NgModule({
    declarations: [
        AppComponent,
        InstallWalletDlgComponent,
        UnsupportedNetworkComponent,
        ChooseWalletDlgComponent,
        PriceDiffComponent,
        ApproveDlgComponent,
        WalletExceptionDlgComponent,
        WalletItemComponent,
        PaymentInfoComponent,
        CoinsDlgComponent,
        CoinItemComponent,
        DialogTipComponent,
        GetPaidToPayComponent,
    ],
    imports: [
        BrowserModule,
        AppLibModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        FormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateModule,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
