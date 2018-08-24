import {LoggerFactory} from '@elderbyte/ts-logger';

// @dynamic
export class CollectionUtil {

  private static readonly logger = LoggerFactory.getLogger('CollectionUtil');

  /**
   * Moves the given item down in the given array - if not already at the bottom
   * @param items
   * @param toMove
   */
  public static moveDown<T>(items: T[], toMove: T): boolean {

    if (items.length < 2) { return false; }

    const position = items.indexOf(toMove);

    if (position >= 0) {

      const targetIndex = position + 1;
      const bottom = items.length - 1;
      if (!(bottom < targetIndex)) {
        items[position] = items[targetIndex];
        items[targetIndex] = toMove;
        return true;
      } else {
        this.logger.debug('Can not move item down since target index ' + targetIndex + ' is already at the bottom: ' + bottom);
      }
    }
    return false;
  }

  /**
   * Moves the given item down in the given array - if not already at the bottom
   * @param items
   * @param toMove
   */
  public static moveUp<T>(items: T[], toMove: T): boolean {

    if (items.length < 2) { return false; }

    const position = items.indexOf(toMove);

    if (position >= 0) {

      const targetIndex = position - 1;

      if (targetIndex >= 0) {
        items[position] = items[targetIndex];
        items[targetIndex] = toMove;
        return true;
      }
    }
    return false;
  }

  /**
   * Groups the given items by the given field into a Map
   */
  // @dynamic
  public static groupByField<G, T>(items: T[], field: string): Map<G, T[]> {
    return CollectionUtil.groupByKey(items, it => (it as any)[field] as G);
  }

  /**
   * Groups the given items, using the group key getter, into a Map
   * @dynamic
   */
  // @dynamic
  public static groupByKey<G, T>(items: T[], keyGetter: ((item: T) => G)): Map<G, T[]> {

    return items.reduce((map, p) => {

      let subset: T[];

      const key = keyGetter(p);

      if (map.has(key)) {
        subset = map.get(key);
      } else {
        subset = [];
        map.set(key, subset);
      }
      subset.push(p);
      return map;
    }, new Map());
  }

}


