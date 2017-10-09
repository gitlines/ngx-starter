
export class Label {

  public static fromName(name: string){
    return new Label(name, null);
  }

  constructor(
    readonly name: string,
  readonly color: string
  ){ }
}
