/**
 * Created by isnull on 22.03.17.
 */
/**
 * Provides the ability to build a sorting comparator dynamically using
 * a given array of fields / additional syntax.
 *
 * - Supports ASC / DESC
 * - Supports multiple fields
 * - Supports nested fields
 *
 * Example:
 *
 * ComparatorBuilder.fieldSort('simple', '-reveresed', 'some.very.deep.nested.path')
 *
 */
export declare class ComparatorBuilder {
    /**
     * Dynamically builds a comparator function, using the given fields for sorting.
     *
     * @param fields One or more field name to sort.
     * @returns {(obj1:any, obj2:any)=>number}
     */
    static fieldSort(...fields: string[]): (a: any, b: any) => number;
    private static dynamicSort(property);
    private static resolveProperty(obj, property);
}
