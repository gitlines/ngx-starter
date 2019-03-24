
export class PropertyPathUtil {

  /**
   * Resolve the value of the given object under the given path
   * @param object
   * @param path A dot path like: test.name
   */
  public static resolveValue(object: any, path: string): any {
    if (path && path.length > 0) {
      const subPaths = path.split('\.');
      subPaths.shift();
      let current = object;

      while (current && subPaths.length > 0) {
        const sub = subPaths.shift();
        if (sub) {
          current = current[sub as string];
        } else {
          break;
        }
      }
      return current;
    } else {
      return object;
    }
  }

}
