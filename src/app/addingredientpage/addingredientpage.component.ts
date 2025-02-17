import { Component } from '@angular/core';
import {Ingredient} from "../../models/ingredient.model";
import {User} from "../../models/user.model";
import {DatabaseService} from "../../services/database.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-addingredientpage',
  templateUrl: './addingredientpage.component.html',
  styleUrls: ['./addingredientpage.component.css']
})
export class AddingredientpageComponent {
  ingredient:Ingredient = new Ingredient("");
  user:User = new User("", false, false, false, false, "");
  userIngredients:string[] = [];

  constructor(private database:DatabaseService, private router:Router) {
  }

  ngOnInit(){
    let userID:any = localStorage.getItem("userID");
    this.database.selectUser(userID)
      .then((data)=>{
        this.user = data;
        this.user.id = userID;
        this.userIngredients = this.user.customIngredients.split(", ");
      });
  }

  btnAdd_click() {
    if (this.userIngredients.length == 1 && this.userIngredients[0].length < 1) {
      this.userIngredients[0] = this.ingredient.name.toLowerCase();
    }
    else {
      this.userIngredients.push(this.ingredient.name.toLowerCase());
    }
    this.ingredient.name = "";
  }

  btnSave_click() {
    let ingredientsString = "";
    for (let i = 0; i < this.userIngredients.length; i++) {
      ingredientsString += this.userIngredients[i] + ", ";
    }
    ingredientsString = ingredientsString.slice(0,-2);
    this.user.customIngredients = ingredientsString;
    this.database.updateUserIngredients(this.user)
      .then((data)=>{
        console.log(data);
        this.router.navigate(['ingredients']);
      })
      .catch((err)=>{
        console.log(err);
      });
  }
}
