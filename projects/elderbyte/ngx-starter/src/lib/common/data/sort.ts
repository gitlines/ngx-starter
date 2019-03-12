
export enum SortDirection {
  Unspecified = '',
  Asc = 'asc',
  Desc = 'desc'
}

export class Sort {

    public static NONE = new Sort(undefined, SortDirection.Unspecified);

    constructor (
        public readonly prop: string | undefined,
        public readonly dir: SortDirection
    ) { }

    public equals(other: Sort): boolean {
        return other && this.prop === other.prop && this.dir === other.dir;
    }
}
