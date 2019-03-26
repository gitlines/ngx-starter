/**
 * Immutable representation of the state of an search input
 */
export class SearchInputState {
  constructor(

    /**
     * attribute The attribute name
     */
    public readonly attribute: string,

    /**
     * queryValue The query value
     */
    public readonly queryValue: string | null,

    /**
     * queryKey The query key
     */
    public readonly queryKey: string,

    /**
     * pristine Has the user touched this?
     */
    public readonly pristine: boolean
  ) { }

  public get hasValue(): boolean { return !!this.queryValue; }

  public withQueryValue(value: string | null, pristine?: boolean): SearchInputState {

    let pristineNow = value == null;
    if (!pristineNow) {
      if (pristine !== undefined && pristine !== null) {
        pristineNow = pristine;
      }
    }

    return new SearchInputState(
      this.attribute,
      value,
      this.queryKey,
      pristineNow
    );
  }

}
