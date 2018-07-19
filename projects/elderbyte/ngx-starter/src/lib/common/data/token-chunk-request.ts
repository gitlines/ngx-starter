import {Sort} from './sort';
import {Filter} from './filter';

export class TokenChunkRequest {
    constructor (
        public readonly nextContinuationToken: string | null | undefined,
        public readonly filters: Filter[],
        public readonly sorts: Sort[]
    ) {}
}
