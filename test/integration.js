'use strict';
const processorClass = require('../index');

const config = {
	name: 'Authorize.net'
};

describe('Authorize.net Integration tests', () => {
	const tests = require('@akayami/payment-processor-adapter-shared/test/shared')(processorClass, config);
});
