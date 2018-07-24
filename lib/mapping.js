const types = require('@akayami/payment-processor-adapter-shared/lib/types');

const list = {};

types.forEach((type) => {
	let l;
	switch (type) {
		case 'visa':
			l = 'VISA';
			break;
		case 'master-card':
		case 'mastercard':
			l = 'MC';
			break;
		case 'american-express':
			l = 'AMEX';
			break;
		case 'diners-club':
			l = 'DINERS';
			break;
		case 'discover':
			l = 'DISCOVER';
			break;
		case 'jcb':
			l = 'JCB';
			break;
		default:
			l = null;
			break;
	}
	list[type] = l;
});

module.exports = list;