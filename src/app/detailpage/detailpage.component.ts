import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import {DatabaseService} from "../../services/database.service";
import {Scan} from "../../models/scan.model";
import {Product} from "../../models/product.model";
import {ScannerService} from "../../services/scanner.service";

@Component({
    selector: 'app-detailpage',
    templateUrl: './detailpage.component.html',
    styleUrls: ['./detailpage.component.css']
})
export class DetailpageComponent {
  product: Product = new Product("", "", new Scan(0, 0, false, ""))

    constructor(private activatedRoute: ActivatedRoute,
                private database: DatabaseService, private router:Router, private scanner:ScannerService) {
    }

    ngOnInit(){
        const id: any = this.activatedRoute.snapshot.paramMap.get("id");

        this.database.selectProduct(id)
            .then((data)=>{
                this.product = data;
            })
            .catch((err)=>{
                console.log("Error in select: " + err);
            });
    }


    btnUpdate_click() {
        this.database.updateProduct(this.product)
            .then((data)=>{
                alert("Record updated successfully");
              this.router.navigate(['show']);
            })
            .catch((err)=>{
                alert ("Error in update : "+ err);
            })
    }

  btnDelete_click() {
    if (confirm("Are you sure you want to delete this product?\nAny scans of this product will also be deleted.")){
      this.database.deleteProductScans(this.product.id)
        .then((data)=>{
          return this.database.deleteProduct(this.product)
        })
        .then((data)=>{
          alert("Product deleted successfully");
          this.router.navigate(['show']);
        })
        .catch((err)=>{
          alert("Error in delete: " + err);
        });
    }
    else {
      return;
    }
  }

  btnBack_click() {
    this.router.navigate(['show']);
  }
}
