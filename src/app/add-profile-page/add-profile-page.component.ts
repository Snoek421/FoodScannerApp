import { Component } from '@angular/core';
import {User} from "../../models/user.model";
import {Router} from "@angular/router";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-add-profile-page',
  templateUrl: './add-profile-page.component.html',
  styleUrls: ['./add-profile-page.component.css']
})
export class AddProfilePageComponent {

  user: User = new User("", false, false, false, false, "");


  constructor(private database: DatabaseService, private router: Router) {
  }


  btnAdd_click() {
    this.database.insertUser(this.user)
      .then((data)=>{
        //process resolved data
        // console.log(data);
        alert("Record added successfully");
      })
      .catch((err)=>{
        //process rejected data
        alert("Error in insert " + err.message);
      });
    this.router.navigate(['home'])
  }

  checkboxValidator() {
    if (!this.user.gluten && !this.user.dairy && !this.user.treenut && !this.user.peanut){
      return false;
    }
    else {
      return true;
    }

  }
}
