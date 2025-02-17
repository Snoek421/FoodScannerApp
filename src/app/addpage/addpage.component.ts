import {Component} from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import {User} from "../../models/user.model";
import {Scan} from "../../models/scan.model";
import {DietRestriction} from "../../models/dietRestriction.model";
import {Router} from "@angular/router";
import {Product} from "../../models/product.model";
import {scan} from "rxjs";
import {ScannerService} from "../../services/scanner.service";

@Component({
    selector: 'app-addpage',
    templateUrl: './addpage.component.html',
    styleUrls: ['./addpage.component.css']
})
export class AddpageComponent {
    errorMessage: string = "";
    userid: number = 0;
    user: User = new User("", false, false, false, false, "");
    product:Product = new Product("", "", new Scan(-1, -1, false, ""));



    constructor(private database: DatabaseService, private router: Router, private scanner:ScannerService) {
    }

    ngOnInit(){
      let userID:any = localStorage.getItem("userID");
      this.product.scan.userID = userID;
}


    btnScan_click() {
      if (localStorage.getItem("userID")){
        // @ts-ignore
        this.userid = parseInt(localStorage.getItem("userID"));
      }
      else {
        this.errorMessage = "Please select a user profile before scanning a product";
        return;
      }
      let productInsertID = -1;
      let scanInsertID = -1;
          this.database.insertProduct(this.product)
            .then((result)=>{
              productInsertID = result.insertId;
              this.product.id = result.insertId;
              this.product.scan.productID = result.insertId;
              this.scanner.scanProduct(this.product, this.userid)
                .then((data)=>{
                  this.product.scan = data;
                  let successMessage:string = "";
                  if (this.product.scan.triggerFound) {
                    successMessage = "At least one ingredient was detected that is likely to trigger your dietary restriction(s). Click 'Okay' to proceed to the results page or 'Cancel' to go back to the" +
                      " products list.";
                  }
                  else {
                    successMessage = "No problematic ingredients were detected in this product. Click 'Okay' to view the results page or 'Cancel' to go back to the products list.";
                  }
                  if(confirm(successMessage)) {

                    this.router.navigate([`result/${this.product.id}/${this.product.scan.id}`]);
                  }
                  else {
                    this.router.navigate(['show']);
                  }
                });
            })
            .catch((err)=>{
              console.error("Error in product scan insert transaction: " + err);
            });

    }
}
