
export class ContinuableListing<T> {

    /**
     * The data of this listing chunk
     */
    public content: T[];

    /**
     * The current continuation token of this listing.
     * To fetch the next page, use the NextContinuationToken property not this!
     */
    continuationToken?: string;

    /**
     * The continuation token to fetch the next part
     */
    nextContinuationToken?: string;

    /**
     * The totalSnapshot number of elements
     * Might be null if the server does not know this
     */
    total: number | undefined;

    /**
     * Size of this chunk (max page size)
     */
    chunkSize: number;

    /**
     * Is there more data to load with the NextContiunationToken?
     */
    hasMore: boolean;
}
