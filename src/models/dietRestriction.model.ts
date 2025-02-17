export class DietRestriction {
  id: number = -1;
  restrictionName: string = "";
  triggerIngredients: string = "";

  constructor(restrictionName: string, triggerIngredients: string) {
    this.restrictionName = restrictionName;
    this.triggerIngredients = triggerIngredients;
  }
}
