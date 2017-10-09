
export class Label {

  public static fromName(name: string) {
    return new Label(name, 'none');
  }

  constructor(
    public readonly name: string,
    public readonly color: string
  ) { }
}
