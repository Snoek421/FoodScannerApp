import {Scan} from "./scan.model";

export class Product {
  id: number = -1;
  productName: string = "";
  ingredientsList: string = "";
  scan: Scan = new Scan(-1,-1, false, "");


  constructor(productName:string, ingredientsList:string, scan:Scan) {
    this.productName = productName;
    this.ingredientsList = ingredientsList;
    this.scan = scan;
  }
}
