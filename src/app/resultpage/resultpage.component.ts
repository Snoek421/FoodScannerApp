import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import {Scan} from "../../models/scan.model";
import {DatabaseService} from "../../services/database.service";
import {Product} from "../../models/product.model";
import {Ingredient} from "../../models/ingredient.model";
import {ScannerService} from "../../services/scanner.service";

@Component({
  selector: 'app-resultpage',
  templateUrl: './resultpage.component.html',
  styleUrls: ['./resultpage.component.css']
})
export class ResultpageComponent {
product:Product = new Product("", "", new Scan(0, 0, false, ""));
  scan:Scan = new Scan(0, 0, false, "");
  ingredients:Ingredient[] = [];
  scannedProduct:boolean = false;
  userID:any = -1;
  constructor(private activatedRoute: ActivatedRoute,private database: DatabaseService, private router: Router, private scanner:ScannerService) {
  }

  ngOnInit() {
    this.userID = localStorage.getItem("userID");
    const productID:any = this.activatedRoute.snapshot.paramMap.get("prodid");
    const scanID:any = this.activatedRoute.snapshot.paramMap.get("scanid")
    if (scanID == -1){
      this.scannedProduct = false;
    }
    else {
      this.scannedProduct = true;
      this.database.selectScan(scanID)
        .then((data)=>{
          this.scan = data;
        })
    }
    this.database.selectProduct(productID)
      .then((product) => {
        this.product = product;
        this.ingredients = this.scanner.generateIngredientList(scanID, this.product.ingredientsList);
        })

      }


  btnBackToList_click() {
    this.router.navigate(['show']);
  }

  btnScanProduct_click() {
    if (this.scan.id != -1) {
      this.scanner.rescan(this.product, this.scan.id, this.userID)
        .then((data)=>{
          this.scan = data;
          this.router.navigate([`show`]);
        });
    }
    else {
      this.scanner.scanProduct(this.product, this.userID)
        .then((data)=>{
          this.scan = data;
          this.router.navigate([`show`]);
        });
    }
  }

  resultCheck(scan: Scan) {
    // @ts-ignore
    if (scan.triggerFound == 'true') {
      return true;
    }
    else {
      return false;
    }
  }
}
