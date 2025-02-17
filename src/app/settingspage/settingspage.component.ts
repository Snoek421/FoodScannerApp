import {Component} from '@angular/core';
import {DatabaseService} from "../../services/database.service";

@Component({
    selector: 'app-settingspage',
    templateUrl: './settingspage.component.html',
    styleUrls: ['./settingspage.component.css']
})
export class SettingspageComponent {


    constructor(private database: DatabaseService) {
    }

    btnCreateDatabase_click() {
        this.database.initDB();
    }

    btnClearDatabase_click() {
        this.database.clearDB();
    }
}
