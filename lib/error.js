const codes = require('@akayami/payment-processor-adapter-shared/lib/constants');

class ResponseError extends Error {

	constructor(message, code, trx_ext_id) {
		super(String(message).trim());
		this.name = 'AuthorizeNet Response Error';
		this.upstream = 'authorize';
		this.upstream_code = code;
		//this.code = code;
		this.trx_ext_id = trx_ext_id;
		this.context;

		switch(String(code)) {
		case '6':
			this.code = codes.INVALID;
			//this.context = 'Invalid credit card number.';
			break;
		case '54':
			this.code = codes.OTHER;
			this.context = 'This transaction has not been settled yet, or it has exceeded the refund time limit.';
			break;
		default:
			this.code = codes.OTHER;
			this.context = 'Unknown error occured.';
			break;
		}
		this.message =  [`[${this.code}]`, super.toString(), this.context, `[${this.upstream_code}]`].join(' ');
	}

	// toString() {
	// 	return [`[${this.code}]`, super.toString(), this.context].join(' ');
	// }
}

module.exports = ResponseError;