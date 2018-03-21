class ResponseError extends Error {

	constructor(message, code, trx_ext_id) {
		super(message);
		this.name = 'AuthorizeNet Response Error';
		this.code = code;
		this.trx_ext_id = trx_ext_id;
		this.context;

		switch(this.code) {
		case '54':
			this.context = 'This transaction has not been settled yet, or it has exceeded the refund time limit.';
			break;
		}
	}

	toString() {
		return [`[${this.code}]`, super.toString(), this.context].join(' ');
	}
}

module.exports = ResponseError;