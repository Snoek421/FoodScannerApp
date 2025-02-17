import {Component, NgZone} from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import {User} from "../../models/user.model";
import {Scan} from "../../models/scan.model";
import {Router} from "@angular/router";
import {Product} from "../../models/product.model";
import {ScannerService} from "../../services/scanner.service";

@Component({
  selector: 'app-addpage',
  templateUrl: './addpage.component.html',
  styleUrls: ['./addpage.component.css']
})
export class AddpageComponent {
  errorMessage: string = "";
  userID: any = -1;
  user: User = new User("", false, false, false, false, "");
  product: Product = new Product("", "", new Scan(-1, -1, false, ""));
  imageURI: string = "";
  iconURI: string = "assets/camera.svg"

  constructor(private database: DatabaseService, private router: Router, private scanner: ScannerService, private zone: NgZone) {
  }

  ngOnInit() {
    this.userID = localStorage.getItem("userID");
    this.product.scan.userID = this.userID;
    this.imageURI = this.iconURI;
  }


  btnScan_click() {
    if (this.userID == -1) {
      alert("You must create or select a profile becore scanning a product!");
      return;
    }
    this.product.ingredientsList = this.product.ingredientsList.toLowerCase();
    let productInsertID = -1;
    this.database.insertProduct(this.product)
      .then((result) => {
        productInsertID = result.insertId;
        this.product.id = result.insertId;
        this.product.scan.productID = result.insertId;
        this.scanner.scanProduct(this.product, this.userID)
          .then((data) => {
            this.product.scan = data;
            let successMessage: string = "";
            if (this.product.scan.triggerFound) {
              successMessage = "At least one ingredient was detected that is likely to trigger your dietary restriction(s). Click 'Okay' to proceed to the results page or 'Cancel' to go back to the" +
                " products list.";
            } else {
              successMessage = "No problematic ingredients were detected in this product. Click 'Okay' to view the results page or 'Cancel' to go back to the products list.";
            }
            if (confirm(successMessage)) {

              this.router.navigate([`result/${this.product.id}/${this.product.scan.id}`]);
            } else {
              this.router.navigate(['show']);
            }
          });
      })
      .catch((err) => {
        console.error("Error in product scan insert transaction: " + err);
      });

  }

  btnAdd_click() {
    this.product.ingredientsList = this.product.ingredientsList.toLowerCase();
    this.database.insertProduct(this.product)
      .then((result) => {
        this.router.navigate(['show']);
      })
      .catch(((err) => {
        console.error("Error in product insert transaction: " + err);
      }));
  }

  imgCapture_click() {
    //testing
    let options = {
      quality: 50,
      //@ts-ignore
      sourceType: Camera.PictureSourceType.CAMERA,
      //@ts-ignore
      destinationType: Camera.DestinationType.FILE_URI,
      //@ts-ignore
      cameraDirection: Camera.Direction.BACK,
      correctOrientation: true,
      //@ts-ignore
      encodingType: Camera.EncodingType.JPEG,
      saveToPhotoAlbum: false
    }


    function onFail(err: any) {
      console.log("An error occurred in camera function or the user exited the camera mode without taking a picture");
    }

    // @ts-ignore
    navigator.camera.getPicture((image) => {
      this.product.imageURI = image;
      //@ts-ignore
      window.resolveLocalFileSystemURL(image, (fileEntry) => {
        const fileEntryURL = fileEntry.toURL();
        this.imageURI = fileEntryURL;
        //@ts-ignore
        let imageElement = document.getElementById("productImage");
        //@ts-ignore
        imageElement.height = "335";
        //@ts-ignore
        imageElement.width = "250";
        //@ts-ignore
        imageElement.src = fileEntryURL;
      }, (err: any) => {
        console.error(err)
      })
    }, onFail, options);
  }


}
