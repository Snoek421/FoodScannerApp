import {Product} from "./product.model";

export class Scan {
  id: number = -1;
  userID:number = -1;
  productID:number = -1;
  triggerFound: boolean = false;
  matchedIngredients: string = "";

  constructor(userID:number, productID:number, triggerFound:boolean, matchedIngredients:string) {
    this.userID = userID;
    this.productID = productID;
    this.triggerFound = triggerFound;
    this.matchedIngredients = matchedIngredients;
  }
}
