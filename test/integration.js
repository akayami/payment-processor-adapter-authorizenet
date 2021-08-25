'use strict';
const processorClass = require('../index');
const codes = require('@akayami/payment-processor-adapter-shared/lib/constants');

const config = {
	name: 'Authorize.net',
	conf: {
		apiLoginKey: '56YWuq4E',
		transactionKey: '67r4k3BSkVS2993S',
		key: 'Simon',
		endpoint: 'https://apitest.authorize.net/xml/v1/request.api'
	},
	skipTestGroup: ['Refund'],
	cards: {
		'visa': [
			{
				name: 'Approved',
				number: '4111111111111111'
			},
			{
				name: 'Declined - Invalid Number',
				number: '4111111111111112',
				amount: 70.02,
				error: true,
				code: codes.INVALID
			},
			// 			{
			// 				name: 'Test Case 3 - Voice Authorization required.',
			// 				number: '4000130000001724',
			// //				amount: 70.03,
			// 				error: true,
			// 				code: '102'
			// 			},
			// 			{
			// 				name: 'Test Case 4',
			// 				number: '4000160000004147',
			// 				error: true,
			// 				code: '103'
			// 			},
			// 			{
			// 				name: 'Test Case 5',
			// 				number: '4009830000001985',
			// 				error: true,
			// 				code: '200'
			// 			}
		],
		'mastercard': [
			{
				name: 'Approved',
				number: '5424000000000015'
			},
			{
				name: 'Decline - Invalid Number',
				number: '5424000000000016',
				error: true,
				code: codes.INVALID
			},
			// {
			// 	name: 'Test Case 3',
			// 	number: '5114630000009791',
			// 	error: true,
			// 	code: '102'
			// },
			// {
			// 	name: 'Test Case 4',
			// 	number: '5121220000006921',
			// 	error: true,
			// 	code: '103'
			// },
			// {
			// 	name: 'Test Case 5',
			// 	number: '5135020000005871',
			// 	error: true,
			// 	code: '200'
			// }
		],
		'american-express': [
			{
				name: 'Approved',
				number: '370000000000002',
				csc: 4
			},
			{
				name: 'Declined - Invalid Number',
				number: '370000000000003',
				error: true,
				csc: 4,
				code: codes.INVALID
			},
			// {
			// 	name: 'Test Case 3',
			// 	number: '375425000000907',
			// 	error: true,
			// 	csc: 4,
			// 	code: '102'
			// },
			// {
			// 	name: 'Test Case 4',
			// 	number: '343452000000306',
			// 	error: true,
			// 	csc: 4,
			// 	code: '103'
			// },
			// {
			// 	name: 'Test Case 5',
			// 	number: '372349000000852',
			// 	error: true,
			// 	csc: 4,
			// 	code: '200'
			// }
		],
		// Authorize seems to not support dinters-club very well.
		// 'diners-club': [
		// 	{
		// 		name: 'Approved',
		// 		number: '38000000000006'
		// 	},
		// 	{
		// 		name: 'Declined - Invalid Number',
		// 		number: '36462462742009',
		// 		error: true,
		// 		code: codes.INVALID
		// 	},
		// 	// {
		// 	// 	name: 'Test Case 3',
		// 	// 	number: '36256000000634',
		// 	// 	error: true,
		// 	// 	code: '102'
		// 	// },
		// 	// {
		// 	// 	name: 'Test Case 4',
		// 	// 	number: '38865000000705',
		// 	// 	error: true,
		// 	// 	code: '103'
		// 	// },
		// 	// {
		// 	// 	name: 'Test Case 5',
		// 	// 	number: '30450000000985',
		// 	// 	error: true,
		// 	// 	code: '200'
		// 	// }
		// ],
		'discover': [
			{
				name: 'Approved',
				number: '6510000000000182'
			},
			{
				name: 'Declined - Invalid Number',
				number: '6510000000000183',
				error: true,
				code: codes.INVALID
			},
			// {
			// 	name: 'Test Case 3',
			// 	number: '6011000000001028',
			// 	error: true,
			// 	code: '102'
			// },
			// {
			// 	name: 'Test Case 4',
			// 	number: '6011000000001036',
			// 	error: true,
			// 	code: '103'
			// },
			// {
			// 	name: 'Test Case 5',
			// 	number: '6011000000002000',
			// 	error: true,
			// 	code: '200'
			// }
		],
		'jcb': [
			{
				name: 'Approved',
				number: '3088000000000017'
			},
			{
				name: 'Declined - Invalid Number',
				number: '3088000000000018',
				error: true,
				code: codes.INVALID
			},
			// {
			// 	name: 'Test Case 3',
			// 	number: '3566000000001024',
			// 	error: true,
			// 	code: '102'
			// },
			// {
			// 	name: 'Test Case 4',
			// 	number: '3566000000001032',
			// 	error: true,
			// 	code: '103'
			// },
			// {
			// 	name: 'Test Case 5',
			// 	number: '3566000000002006',
			// 	error: true,
			// 	code: '200'
			// }
		]
	}
};

describe('Authorize.net Integration tests', () => {
	require('@akayami/payment-processor-adapter-shared/test/shared')(processorClass, config);
});
