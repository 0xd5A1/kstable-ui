import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLibModule } from 'app-lib';
import { MenuItemComponent } from './menu-item/menu-item.component';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    declarations: [
        AppComponent,
        MenuItemComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        AppLibModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateModule,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
