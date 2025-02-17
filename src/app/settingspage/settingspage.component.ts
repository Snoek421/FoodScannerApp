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

  btnClearDatabase_click() {
    if (confirm("Are you sure you want to clear the database?\n\nThe application won't work correctly until you create a new profile or restart the app.")) {
      this.database.clearDB();
    }
  }
}
