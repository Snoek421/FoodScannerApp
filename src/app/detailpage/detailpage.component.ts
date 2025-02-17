import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import {DatabaseService} from "../../services/database.service";
import {Scan} from "../../models/scan.model";
import {Product} from "../../models/product.model";

@Component({
  selector: 'app-detailpage',
  templateUrl: './detailpage.component.html',
  styleUrls: ['./detailpage.component.css']
})
export class DetailpageComponent {
  product: Product = new Product("", "", new Scan(0, 0, false, ""));
  imageURI: string = "";
  iconURI: string = "assets/camera.svg"

  constructor(private activatedRoute: ActivatedRoute,
              private database: DatabaseService, private router: Router) {
  }

  ngOnInit() {
    const id: any = this.activatedRoute.snapshot.paramMap.get("id");
    this.imageURI = this.iconURI;
    this.database.selectProduct(id)
      .then((data) => {
        this.product = data;
        this.getImageURI(data.imageURI);
      })
      .catch((err) => {
        console.log("Error in select: " + err);
      });
  }


  btnUpdate_click() {
    this.product.ingredientsList = this.product.ingredientsList.toLowerCase();
    this.database.updateProduct(this.product)
      .then((data) => {
        alert("Product updated successfully\n\nIf a previous scan for this product exists then you must re-scan the product to see accurate results!");
        this.router.navigate(['show']);
      })
      .catch((err) => {
        alert("Error in update : " + err);
      })
  }

  btnDelete_click() {
    if (confirm("Are you sure you want to delete this product?\nAny scans of this product will also be deleted.")) {
      this.database.deleteProductScans(this.product.id)
        .then((data) => {
          return this.database.deleteProduct(this.product)
        })
        .then((data) => {
          alert("Product deleted successfully");
          this.router.navigate(['show']);
        })
        .catch((err) => {
          alert("Error in delete: " + err);
        });
    } else {
      return;
    }
  }

  btnBack_click() {
    this.router.navigate(['show']);
  }

  getImageURI(imageURI: string) {
    if (imageURI == "") {
      return;
    } else {
      //@ts-ignore
      window.resolveLocalFileSystemURL(imageURI, (fileEntry) => {
        const fileEntryURL = fileEntry.toURL();
        this.imageURI = fileEntryURL;
        let imageElement = document.getElementById("productImage");
        //@ts-ignore
        imageElement.height = "335";
        //@ts-ignore
        imageElement.width = "250";
        //@ts-ignore
        imageElement.src = fileEntryURL;
      }, (err: any) => {
        console.error("Error: " + err.message)
      });

    }
  }

  imgCapture_click() {
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
        let imageElement = document.getElementById("productImage");
        //@ts-ignore
        imageElement.height = "250";
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
