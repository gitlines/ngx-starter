/**
 * Provides common used object utils
 */
import {LoggerFactory} from '@elderbyte/ts-logger';

export class Objects {

    private static readonly logger = LoggerFactory.getLogger('Objects');

    /**
     * Checks if the given value is non null / nun undefined
     */
    public static nonNull(value: any): boolean {
        return value !== null && value !== undefined;
    }

    /**
     * Checks if the given value is null or undefined
     */
    public static isNull(value: any): boolean {
        return value === null || value === undefined;
    }

    /**
     * Creates a copy of the object data.
     */
    public static cloneData<T>(src: T): T {

        if (!src) { return src; }

        try {
            const json = JSON.stringify(src);
            return JSON.parse(json) as T;
        } catch (err) {
            throw new Error('Failed to clone object! ' + err.message);
        }

    }

    /**
     * Checks if the two given objects have the same data
     */
    public static dataEquals<T>(a: T, b: T): boolean {
        return JSON.stringify(a) !== JSON.stringify(b);
    }
}
