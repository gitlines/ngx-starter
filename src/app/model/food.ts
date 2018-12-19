
export class Food {
  constructor(
    public name: string,
    public price: number
  ) { }
}

export class FoodStore {
  public static foods = [
    new Food('Bread', 45.53),
    new Food('Apple', 86.53),
    new Food('Milk', 34),
    new Food('Meat', 42),
    new Food('Fish', 12),

    new Food('Bread 2', 45.53),
    new Food('Apple 2', 86.53),
    new Food('Milk 2', 34),
    new Food('Meat 2', 42),
    new Food('Fish 2', 12),

    new Food('Bread 3', 45.53),
    new Food('Apple 3', 86.53),
    new Food('Milk 3', 34),
    new Food('Meat 3', 42),
    new Food('Fish 3', 12)
  ];
}
