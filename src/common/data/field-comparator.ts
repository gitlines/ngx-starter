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
export class ComparatorBuilder {

  /**
   * Dynamically builds a comparator function, using the given fields for sorting.
   *
   * @param fields One or more field name to sort.
   * @returns {(obj1:any, obj2:any)=>number}
   */
  public static fieldSort(...fields: string[]): (a: any, b: any) => number {
    let props = fields;
    return function (obj1, obj2) {
      let i = 0, result = 0, numberOfProperties = props.length;
      /* try getting a different result from 0 (equal)
       * as long as we have extra properties to compare
       */
      while (result === 0 && i < numberOfProperties) {
        result = ComparatorBuilder.dynamicSort(props[i])(obj1, obj2);
        i++;
      }
      return result;
    };
  }


  private static dynamicSort(property: string): (a: any, b: any) => number {
    let sortOrder = 1;
    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }

    return (a, b) => {
      let aValue = ComparatorBuilder.resolveProperty(a, property);
      let bValue = ComparatorBuilder.resolveProperty(b, property);
      let result = (aValue < bValue) ? -1 : (aValue > bValue) ? 1 : 0;
      return result * sortOrder;
    };
  }


  private static resolveProperty(obj: any, property: string): any {
    let parts = property.split('.');
    let resolved: any = obj;

    for (let part of parts) {
      resolved = resolved[part];
    }
    return resolved;
  }

}
