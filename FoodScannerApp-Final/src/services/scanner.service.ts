import {Injectable} from '@angular/core';
import {Product} from "../models/product.model";
import {User} from "../models/user.model";
import {Scan} from "../models/scan.model";
import {DatabaseService} from "./database.service";
import {DietRestriction} from "../models/dietRestriction.model";
import {Ingredient} from "../models/ingredient.model";

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  constructor(private database: DatabaseService) {
  }

  public scanProduct(product: Product, userID: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let user = new User("", false, false, false, false, "");
      let scan: Scan = new Scan(userID, product.id, false, "");
      let productIngredients = product.ingredientsList.toLowerCase().split(",");
      for (let i = 0; i < productIngredients.length; i++) {
        productIngredients[i] = productIngredients[i].trimStart().trimEnd();
      }
      let ingredientCount: number = productIngredients.length;
      this.database.selectUser(userID)
        .then((result) => {
          user = result;
          this.scanIngredients(user, ingredientCount, productIngredients, scan)
            .then((data) => {
              scan = data;
            });
          this.database.insertScan(scan)
            .then((result) => {
              scan.id = result.insertId;
              resolve(scan);
            })
            .catch((err) => {
              console.error("Error in product scan insert transaction: " + err);
            })
        })
    });
  }


  public rescan(product: Product, scanID: number, userID: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let user = new User("", false, false, false, false, "");
      let scan: Scan = new Scan(userID, product.id, false, "");
      scan.id = scanID;
      let productIngredients = product.ingredientsList.toLowerCase().split(",");
      for (let i = 0; i < productIngredients.length; i++) {
        productIngredients[i] = productIngredients[i].trimStart().trimEnd();
      }
      let ingredientCount: number = productIngredients.length;
      this.database.selectUser(userID)
        .then((result) => {
          user = result;
          this.scanIngredients(user, ingredientCount, productIngredients, scan)
            .then((data) => {
              scan = data;
            });
          this.database.updateScan(scan)
            .then((result) => {
              resolve(scan);
            })
            .catch((err) => {
              console.error("Error in product scan insert transaction: " + err);
            })
        });
    });
  }

  private scanIngredients(user: User, ingredientCount: number, productIngredients: string[], scan: Scan): Promise<any> {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < productIngredients.length; i++) {
        productIngredients[i] = productIngredients[i].trimStart().trimEnd();
      }
      console.log("testing ingredients");
      if (user.customIngredients != "") {
        console.log("testing custom ingredients");
        let triggerIngredients: string [] = user.customIngredients.split(", ");
        for (let i = 0; i < ingredientCount; i++) {
          if (triggerIngredients.find(item => item == productIngredients[i])) {
            scan.triggerFound = true;
            scan.matchedIngredients += productIngredients[i] + ", ";
          }
        }
        //scan.matchedIngredients = scan.matchedIngredients.slice(0, -2);
      }
      // @ts-ignore
      if (user.gluten == 'true') {
        console.log("testing for gluten");
        let glutenIngredients: string = "";
        this.database.selectDiet(1)
          .then((result) => {
            glutenIngredients = (<DietRestriction>result).triggerIngredients;
            let triggers: string[] = glutenIngredients.split(", ");
            for (let i = 0; i < ingredientCount; i++) {
              if (triggers.find(item => item == productIngredients[i])) {
                scan.triggerFound = true;
                scan.matchedIngredients += productIngredients[i] + ", ";
              }
              //@ts-ignore
              if (user.dairy == 'false' && user.treanut == 'false' && user.peanut == 'false') {
                scan.matchedIngredients = scan.matchedIngredients.slice(0, -2);
              }
            }
          })
          .catch((err) => {
            //console.error(err);
          });
      }
      //@ts-ignore
      if (user.dairy == 'true') {
        console.log("testing for dairy");
        let dairyIngredients: string = "";
        this.database.selectDiet(2)
          .then((result) => {
            dairyIngredients = (<DietRestriction>result).triggerIngredients;
            let triggers: string[] = dairyIngredients.split(", ");
            for (let i = 0; i < ingredientCount; i++) {
              if (triggers.find(item => item == productIngredients[i])) {
                scan.triggerFound = true;
                scan.matchedIngredients += productIngredients[i] + ", ";
              }
              //@ts-ignore
              if (user.treanut == 'false' && user.peanut == 'false') {
                scan.matchedIngredients = scan.matchedIngredients.slice(0, -2);
              }
            }
          })
          .catch((err) => {
            //console.error(err);
          });
      }
      //@ts-ignore
      if (user.treenut == 'true') {
        console.log("testing for treenut");
        let treenutIngredients: string = "";
        this.database.selectDiet(3)
          .then((result) => {
            treenutIngredients = (<DietRestriction>result).triggerIngredients;
            let triggers: string[] = treenutIngredients.split(", ");
            for (let i = 0; i < ingredientCount; i++) {
              if (triggers.find(item => item == productIngredients[i])) {
                scan.triggerFound = true;
                scan.matchedIngredients += productIngredients[i] + ", ";
              }
            }
            //@ts-ignore
            if (user.peanut == 'false') {
              scan.matchedIngredients = scan.matchedIngredients.slice(0, -2);
            }
          })
          .catch((err) => {
            //console.error(err);
          });
      }
      //@ts-ignore
      if (user.peanut == 'true') {
        console.log("testing for peanut");
        let peanutIngredients: string = "";
        this.database.selectDiet(4)
          .then((result) => {
            peanutIngredients = (<DietRestriction>result).triggerIngredients;
            let triggers: string[] = peanutIngredients.split(", ");
            for (let i = 0; i < ingredientCount; i++) {
              if (triggers.find(item => item == productIngredients[i])) {
                scan.triggerFound = true;
                scan.matchedIngredients += productIngredients[i] + ", ";
              }
            }
            scan.matchedIngredients = scan.matchedIngredients.slice(0, -2);
          })
          .catch((err) => {
            //console.error(err);
          });
      }
      resolve(scan)
    });
  }

  public generateIngredientList(scanID: number, ingredients: string): Ingredient[] {
    let ingredientsList: Ingredient[] = [];
    let scan: Scan;
    let user: User;
    let splitProblematicIngredients: string[] = [];
    let splitIngredients = ingredients.split(",");
    for (let i = 0; i < splitIngredients.length; i++) {
      splitIngredients[i] = splitIngredients[i].trimStart().trimEnd();
      ingredientsList.push(new Ingredient((splitIngredients[i])));
    }
    this.database.selectScan(scanID)
      .then((data) => {
        scan = data;
        splitProblematicIngredients = scan.matchedIngredients.split(", ");
        return this.database.selectUser(scan.userID);
      })
      .then((data) => {
        user = data;
        for (let i = 0; i < splitIngredients.length; i++) {
          for (let p = 0; p < splitProblematicIngredients.length; p++) {
            if (ingredientsList[i].name == splitProblematicIngredients[p]) {
              ingredientsList[i].problematic = "Yes";
            }
          }
        }
        //@ts-ignore
        if (user.gluten == 'true') {
          this.database.selectDiet(1)
            .then((data) => {
              let diet: DietRestriction = data;
              let dietIngredients = diet.triggerIngredients.split(", ")
              for (let i = 0; i < ingredientsList.length; i++) {
                if (dietIngredients.find(ing => ing == ingredientsList[i].name)) {
                  ingredientsList[i].dietaryRestriction = diet.restrictionName;
                }
              }
            });
        }
        //@ts-ignore
        if (user.dairy == 'true') {
          this.database.selectDiet(2)
            .then((data) => {
              let diet: DietRestriction = data;
              let dietIngredients = diet.triggerIngredients.split(", ")
              for (let i = 0; i < ingredientsList.length; i++) {
                if (dietIngredients.find(ing => ing == ingredientsList[i].name)) {
                  ingredientsList[i].dietaryRestriction = diet.restrictionName;
                }
              }
            });
        }
        //@ts-ignore
        if (user.treenut == 'true') {
          this.database.selectDiet(3)
            .then((data) => {
              let diet: DietRestriction = data;
              let dietIngredients = diet.triggerIngredients.split(", ")
              for (let i = 0; i < ingredientsList.length; i++) {
                if (dietIngredients.find(ing => ing == ingredientsList[i].name)) {
                  ingredientsList[i].dietaryRestriction = diet.restrictionName;
                }
              }
            });
        }
        //@ts-ignore
        if (user.peanut == 'true') {
          this.database.selectDiet(4)
            .then((data) => {
              let diet: DietRestriction = data;
              let dietIngredients = diet.triggerIngredients.split(", ")
              for (let i = 0; i < ingredientsList.length; i++) {
                if (dietIngredients.find(ing => ing == ingredientsList[i].name)) {
                  ingredientsList[i].dietaryRestriction = diet.restrictionName;
                }
              }
            });
        }
        if (user.customIngredients != "") {
          let triggerIngredients: string [] = user.customIngredients.split(", ");
          for (let i = 0; i < ingredientsList.length; i++) {
            if (triggerIngredients.find(item => item == ingredientsList[i].name)) {
              ingredientsList[i].dietaryRestriction = "Custom Ingredient";
            }
          }
        }
      });

    return ingredientsList;
  }


}
