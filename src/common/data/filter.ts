

export class Filter {
  constructor(
    public key : string,
    public value : string){
  }
}


export class FilterUtil {
  public static addSearchParams(params : URLSearchParams, filters : Filter[]) : URLSearchParams{
    for(let filter of filters){
      params.append(filter.key, filter.value);
    }
    return params;
  }
}

