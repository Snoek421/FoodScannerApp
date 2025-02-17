import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {AddpageComponent} from "./addpage/addpage.component";
import {ShowpageComponent} from "./showpage/showpage.component";
import {SettingspageComponent} from "./settingspage/settingspage.component";
import {DetailpageComponent} from "./detailpage/detailpage.component";
import {ErrorpageComponent} from "./errorpage/errorpage.component";
import {AddProfilePageComponent} from "./add-profile-page/add-profile-page.component";
import {AboutpageComponent} from "./aboutpage/aboutpage.component";
import {ResultpageComponent} from "./resultpage/resultpage.component";
import {EditprofilepageComponent} from "./editprofilepage/editprofilepage.component";
import {DietlistpageComponent} from "./dietlistpage/dietlistpage.component";
import {AddingredientpageComponent} from "./addingredientpage/addingredientpage.component";
import {EditingredientspageComponent} from "./editingredientspage/editingredientspage.component";

const routes: Routes = [
    {path: "home", component: HomepageComponent},
    {path: "addprofile", component: AddProfilePageComponent},
    {path: "addproduct", component: AddpageComponent},
    {path: "editprofile/:userid", component: EditprofilepageComponent},
    {path: "show", component: ShowpageComponent},
    {path: "result/:prodid/:scanid", component: ResultpageComponent},
    {path:"ingredients", component: DietlistpageComponent},
    {path: "ingredients/add/:userid", component: AddingredientpageComponent},
    {path: "ingredients/edit/:userid", component: EditingredientspageComponent},
    {path: "settings", component: SettingspageComponent},
    {path: "detail/:id", component: DetailpageComponent},
    {path: "about", component: AboutpageComponent},
    {path: "", redirectTo: "/home", pathMatch: "full"},
    {path: "**", component: ErrorpageComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
