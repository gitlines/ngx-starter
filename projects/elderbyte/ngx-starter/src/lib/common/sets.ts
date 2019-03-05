
export class Sets {

  /**
   * Compares the content of two sets for equality in O(n).
   * @param as
   * @param bs
   */
  public static equals<T>(as: Set<T>, bs: Set<T>) {
    if (as.size !== bs.size) {
      return false;
    }
    if (as !== bs) { // Same reference?
      // Nope we have to check the contents
      for (const a of Array.from(as.values())) {
        if (!bs.has(a)) { return false; }
      }
    }
    return true;
  }

}
