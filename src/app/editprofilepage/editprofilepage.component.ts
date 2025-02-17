import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {DatabaseService} from "../../services/database.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-editprofilepage',
  templateUrl: './editprofilepage.component.html',
  styleUrls: ['./editprofilepage.component.css']
})
export class EditprofilepageComponent {

  user: User = new User("", false, false, false, false, "");

  checkBoxes: {
    gluten: boolean,
    dairy:boolean,
    treenut:boolean,
    peanut:boolean
  } = {
    gluten: false,
    dairy: false,
    treenut: false,
    peanut: false
  };
  constructor(private database:DatabaseService, private router:Router, private activeRoute:ActivatedRoute) {
  }

  ngOnInit(){
    let userID:any =  this.activeRoute.snapshot.paramMap.get("userid");
    this.database.selectUser(userID)
      .then((result)=>{
        this.user = result;
          this.checkBoxes.gluten = this.stringBoolCheck(this.user.gluten);
          this.checkBoxes.dairy = this.stringBoolCheck(this.user.dairy);
          this.checkBoxes.treenut = this.stringBoolCheck(this.user.treenut);
          this.checkBoxes.peanut = this.stringBoolCheck(this.user.peanut);
      })
  }

  checkboxValidator() {
    if (!this.checkBoxes.gluten && !this.checkBoxes.dairy && !this.checkBoxes.treenut && !this.checkBoxes.peanut) {
      return false;
    } else {
      return true;
    }
  }

  btnUpdate_click() {
    this.user.gluten = this.checkBoxes.gluten;
    this.user.dairy = this.checkBoxes.dairy;
    this.user.treenut = this.checkBoxes.treenut;
    this.user.peanut = this.checkBoxes.peanut;
    this.database.updateUser(this.user)
      .then((data)=>{
        //process resolved data
        // console.log(data);
        alert("User profile updated successfully.\nIf you changed your dietary restrictions then previously created scans will not be accurate until you re-scan the product.");
      })
      .catch((err)=>{
        //process rejected data
        alert("Error in insert " + err.message);
      });
    this.router.navigate(['home'])
  }


  stringBoolCheck(bool:any):boolean {
    // @ts-ignore
    if (bool == 'true') {
      return true;
    }
    else {
      return false;
    }
  }
}
