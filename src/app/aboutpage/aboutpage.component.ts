import {Component} from '@angular/core';

@Component({
  selector: 'app-aboutpage',
  templateUrl: './aboutpage.component.html',
  styleUrls: ['./aboutpage.component.css']
})
export class AboutpageComponent {

  exampleIngredients: string = "Wheat, durum, bulgur, capsicum, paprika, garlic, milk, butter, casein, almonds, rocks, pecans, pine nuts, lemon juice, peanuts, peanutbutter, magic, sticks, stones," +
    " bones";


  btnCopy_click() {
    const selectionBox = document.createElement("textarea");
    selectionBox.style.position = 'fixed';
    selectionBox.style.left = '0';
    selectionBox.style.top = '0';
    selectionBox.style.opacity = '0';
    selectionBox.value = this.exampleIngredients;
    document.body.appendChild(selectionBox);
    selectionBox.focus();
    selectionBox.select();
    document.execCommand('copy');
    document.body.removeChild(selectionBox);
    alert("The example list of ingredients has been copied to the clipboard.");
  }
}
