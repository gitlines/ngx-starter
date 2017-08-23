/**
 * Supports constructing new URLs
 */
export class UrlBuilder {

    // TODO The current implementation is far from optimal and basically just a hack to get it working

    private _rawUrl: string;


    /**
     * Parses an existing url and creates a new builder from it.
     * @param {string} url
     * @returns {UrlBuilder}
     */
    public static parse(url: string): UrlBuilder {
        const builder = new UrlBuilder();
        builder._rawUrl = url;  // TODO Actually parse the url into parts
        return builder;
    }


    private constructor() {
    }

    /**
     * Updates the given query parameter with the given new value
     * @param {string} key
     * @param {string} value
     * @returns {this}
     */
    public setParam(key: string, value: string): this {
        this.appendParam(key, value); // TODO Only append currently implemented
        return this;
    }

    /**
     * Appends another query parameter with the given key / value
     * @param {string} key
     * @param {string} value
     * @returns {this}
     */
    public appendParam(key: string, value: string): this {

        const parts = this._rawUrl.split('#');
        const part = parts[parts.length - 1]; // Get the last part

        let startDelimiter;
        if (part.includes('?')) {
            startDelimiter = '&';
        }else {
            startDelimiter = '?';
        }

        this._rawUrl = this._rawUrl + startDelimiter + key + '=' + encodeURIComponent(value);

        return this;
    }

    /**
     * Materializes the url into a string
     * @returns {string}
     */
    public build(): string {
        return this._rawUrl;
    }

}
