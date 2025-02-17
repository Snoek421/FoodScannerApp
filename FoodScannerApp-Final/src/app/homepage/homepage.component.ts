import {Component} from '@angular/core';
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
  firstRun: boolean = false;
  firstRunDisclaimer = "A database has been created to store the records created by this app.\n\n~~!~~NOTE~~!~~\nDo NOT rely on this app's ingredient scanning results to" +
    "be fully accurate for any given diet or allergy.\nThis app is a work in progress and as a result it WILL miss some ingredients that can trigger allergies or intolerances."

  constructor(private database: DatabaseService, private router: Router) {
  }

  ngOnInit() {
    if (!this.database.appLaunchDbExistCheck()) {
      this.firstRun = true;
      this.database.initDB();
    } else {
      this.firstRun = false;
    }
    this.database.selectAllUsers()
      .then((data) => {
        console.log(data);
        this.users = data;
      })
      .catch((err) => {
        console.log("Error on show all: " + err.message);
      });
    localStorage.setItem("userID", "-1");
    // if (this.firstRun == true) {
    //   alert("A database has been created to store the records created by this app.\n\n~~!~~NOTE~~!~~\nDo NOT rely on this app's ingredient scanning results to be fully accurate for any given" +
    //     " diet or allergy.\nIt is a work in progress and as a result it WILL miss some ingredients that can trigger allergies or intolerances.\n\n");
    // }
  }


  btnModify_click(user: User) {
    this.router.navigate([`editprofile/${user.id}`]);
  }

  btnDelete_click(user: User) {
    if (confirm("Are you sure you want to delete this profile?\nThis will delete scans done with this profile as well.")) {
      this.database.deleteUserScans(user.id)
        .then((data) => {
          return this.database.deleteUser(user);
        })
        .then((data) => {
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
    } else {
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

  btnCloseNotification_click() {
    let disclaimerDialog = document.querySelector("#disclaimer");
    //@ts-ignore
    disclaimerDialog.close();
  }
}
