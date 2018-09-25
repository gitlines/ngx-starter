/**
 * Utility to generate a Universally unique identifier (UUID).
 *
 * @see This code bases on https://stackoverflow.com/questions/26501688/a-typescript-guid-class
 * @see https://en.wikipedia.org/wiki/Universally_unique_identifier
 */
export class Uuid {
  /**
   * Generates a pseudo random UUID
   */
  public static generate(): string {
    const uuidTemplate = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return uuidTemplate.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
