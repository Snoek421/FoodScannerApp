import { Component } from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import {DietRestriction} from "../../models/dietRestriction.model";
import {User} from "../../models/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dietlistpage',
  templateUrl: './dietlistpage.component.html',
  styleUrls: ['./dietlistpage.component.css']
})
export class DietlistpageComponent {

  constructor(private database:DatabaseService, private router:Router) {
  }
  userID:any;
  glutenIngredients:string[] = [];
  dairyIngredients:string[] = [];
  treenutIngredients:string[] = [];
  peanutIngredients:string[] = [];
  customIngredients:string[] = [];


  ngOnInit(){
    this.database.selectDiet(1)
      .then((data)=>{
        this.glutenIngredients = (<DietRestriction>data).triggerIngredients.split(", ");
      });
    this.database.selectDiet(2)
      .then((data)=>{
        this.dairyIngredients = (<DietRestriction>data).triggerIngredients.split(", ");
      });
    this.database.selectDiet(3)
      .then((data)=>{
        this.treenutIngredients = (<DietRestriction>data).triggerIngredients.split(", ");
      });
    this.database.selectDiet(4)
      .then((data)=>{
        this.peanutIngredients = (<DietRestriction>data).triggerIngredients.split(", ");
      });
    this.userID = localStorage.getItem("userID");
    this.database.selectUser(this.userID)
      .then((data)=>{
        this.customIngredients = (<User>data).customIngredients.split(", ");
        if (this.customIngredients[0].length < 1) {
          this.customIngredients[0] = "No custom ingredients added yet";
        }
      });
  }

  btnAddCustomIngredient_click() {
    this.router.navigate([`ingredients/add/${this.userID}`])
  }

  btnEditCustomIngredients_click() {
    this.router.navigate([`ingredients/edit/${this.userID}`])
  }
}
