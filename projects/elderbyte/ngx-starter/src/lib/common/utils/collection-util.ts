import {LoggerFactory} from '@elderbyte/ts-logger';

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

}


