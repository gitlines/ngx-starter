
export class Sort {

    public static NONE = new Sort(undefined, '');

    constructor (
        public readonly prop: string | undefined,
        public readonly dir: string
    ) { }

    public equals(other: Sort): boolean {
        return other && this.prop === other.prop && this.dir === other.dir;
    }
}
