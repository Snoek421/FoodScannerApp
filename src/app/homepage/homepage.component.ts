import { Component } from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  users: User[] = [];
  constructor(private database: DatabaseService, private router: Router) {
  }

  ngOnInit() {
    this.database.selectAllUsers()
      .then((data) => {
        console.log(data);
        this.users = data;
      })
      .catch((err) => {
        console.log("Error on show all: " + err.message);
      });
  }


  btnModify_click(user: User) {
    this.router.navigate([`editprofile/${user.id}`]);
  }

  btnDelete_click(user: User) {
    if (confirm("Are you sure you want to delete this profile?\nThis will delete scans done with this profile as well.")){
      this.database.deleteUserScans(user.id)
        .then((data)=>{
          return this.database.deleteUser(user);
        })
        .then((data)=>{
          console.log(data);
        });
      this.database.selectAllUsers()
        .then((data) => {
          console.log(data);
          this.users = data;
        })
        .catch((err) => {
          console.log("Error on show all: " + err.message);
        });
    }
    else {
      return;
    }
  }

  userProfile_click(user: User) {
    localStorage.setItem("userID", user.id.toString());
    this.router.navigate(['show']);
  }

  btnAddProfile_click() {
    this.router.navigate(['addprofile']);
  }
}
