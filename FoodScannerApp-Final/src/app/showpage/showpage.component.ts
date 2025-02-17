import {Component} from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import {Router} from "@angular/router";
import {Scan} from "../../models/scan.model";
import {Product} from "../../models/product.model";

@Component({
  selector: 'app-showpage',
  templateUrl: './showpage.component.html',
  styleUrls: ['./showpage.component.css']
})
export class ShowpageComponent {
  products: Product[] = [];
  scans: Scan[] = [];
  userID: any = -1;

  constructor(private database: DatabaseService, private router: Router) {
  }

  ngOnInit() {
    this.userID = localStorage.getItem("userID");
    this.database.selectAllProducts()
      .then((products) => {
        this.products = products;
        return this.database.selectUserScans(this.userID);
      })
      .then((scans) => {
        this.scans = scans;
        for (let product of this.products) {
          for (let scan of this.scans) {
            if (product.id == scan.productID) {
              product.scan = scan;
            }
          }
        }
      })
      .catch((err) => {
        console.log("Error on show all: " + err.message);
      });
  }

  btnModify_click(product: Product) {
    this.router.navigate([`/detail/${product.id}`]);
  }

  btnDeleteProductAndScans_click(product: Product) {

    this.database.deleteProduct(product)
      .then((data) => {
        this.ngOnInit();
        this.router.navigate(['show']);
      })
      .catch((err) => {
        alert("Error in delete: " + err.message);
      });
  }


  btnAddProduct_click() {
    this.router.navigate(['addproduct']);
  }

  productResult_click(product: Product) {
    this.router.navigate([`result/${product.id}/${product.scan.id}`]);
  }

  btnDeleteScan_click(scan: Scan) {
    this.database.deleteScan(scan)
      .then((data) => {
        this.ngOnInit();
        this.router.navigate(['show']);
      })
      .catch((err) => {
        alert("Error in delete: " + err.message);
      });
  }

  resultCheck(scan: Scan) {
    // @ts-ignore
    if (scan.triggerFound == 'true') {
      return true;
    } else {
      return false;
    }
  }
}
