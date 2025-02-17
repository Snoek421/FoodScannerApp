import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomepageComponent} from './homepage/homepage.component';
import {AddpageComponent} from './addpage/addpage.component';
import {ShowpageComponent} from './showpage/showpage.component';
import {DetailpageComponent} from './detailpage/detailpage.component';
import {SettingspageComponent} from './settingspage/settingspage.component';
import {ErrorpageComponent} from './errorpage/errorpage.component';
import {NavComponent} from './nav/nav.component';
import {FormsModule} from "@angular/forms";
import { AddProfilePageComponent } from './add-profile-page/add-profile-page.component';
import { EditprofilepageComponent } from './editprofilepage/editprofilepage.component';
import { AboutpageComponent } from './aboutpage/aboutpage.component';
import { ResultpageComponent } from './resultpage/resultpage.component';
import { DietlistpageComponent } from './dietlistpage/dietlistpage.component';
import { AddingredientpageComponent } from './addingredientpage/addingredientpage.component';
import { EditingredientspageComponent } from './editingredientspage/editingredientspage.component';

@NgModule({
    declarations: [
        AppComponent,
        HomepageComponent,
        AddpageComponent,
        ShowpageComponent,
        DetailpageComponent,
        SettingspageComponent,
        ErrorpageComponent,
        NavComponent,
        AddProfilePageComponent,
        EditprofilepageComponent,
        AboutpageComponent,
        ResultpageComponent,
        DietlistpageComponent,
        AddingredientpageComponent,
        EditingredientspageComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
