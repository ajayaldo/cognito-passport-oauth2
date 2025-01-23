import { CognitoStrategy } from '../cognitoStrategy';

import * as exported from '../index';

describe('index test', () => {
	it('should export CognitoStrategy', () => {
		expect(exported).toBe(CognitoStrategy);
	});

	it('should be a valid passport strategy', () => {
		expect(typeof exported).toBe('function');
	});
});