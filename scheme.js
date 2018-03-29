module.exports = {
	apiLoginKey: {
		name: 'API Login Key'
	},
	transactionKey: {
		name: 'Transaction Key'
	},
	key: {
		name: 'Key'
	},
	endpoint: {
		name: 'Endpoint',
		default: 'https://api.authorize.net/xml/v1/request.api',
		options: ['https://apitest.authorize.net/xml/v1/request.api', 'https://api.authorize.net/xml/v1/request.api']
	}
};