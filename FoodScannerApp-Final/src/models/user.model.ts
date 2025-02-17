export class User {
  id: number = -1;
  name: string = "";
  gluten: boolean = false;
  dairy: boolean = false;
  treenut: boolean = false;
  peanut: boolean = false;
  customIngredients: string = "";


  constructor(name: string, gluten: boolean, dairy: boolean, treenut: boolean, peanut: boolean, customIngredients: string) {
    this.name = name;
    this.gluten = gluten;
    this.dairy = dairy;
    this.treenut = treenut;
    this.peanut = peanut;
    this.customIngredients = customIngredients;
  }
}
