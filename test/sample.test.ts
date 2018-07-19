import {} from 'jest'
import {DataContextBuilder} from '../src/common/data/data-context/data-context-builder';

/**
 * Tests
 */
describe('Sample Test', () => {

    beforeAll(() => {
        // Config for all
    });

    it('Object test', () => {
        expect(DataContextBuilder.start()).toBeInstanceOf(DataContextBuilder);
    });
});
