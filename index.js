const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;
const merge = require('merge');
const AuthorizeResponseError = require('./lib/error');
const Response = require('@akayami/payment-processor-adapter-shared/response');
const ResponseError = require('@akayami/payment-processor-adapter-shared/abstract/responseError');

class AuthorizeNet extends require('@akayami/payment-processor-adapter-shared/abstract') {

	constructor(config) {
		super();
		this.config = {
			apiLoginKey: 'loginkey',
			transactionKey: 'trxkey',
			key: 'Simon',
			endpoint: 'https://apitest.authorize.net/xml/v1/request.api'
		};
		this.config = merge(this.config, config);
		this.duplicateWindow = new ApiContracts.SettingType();
		this.duplicateWindow.setSettingName('duplicateWindow');
		this.duplicateWindow.setSettingValue('0');
	}

	auth(cc, amount, options, cb) {

		const constants = this.config;

		const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
		merchantAuthenticationType.setName(constants.apiLoginKey);
		merchantAuthenticationType.setTransactionKey(constants.transactionKey);

		const creditCard = new ApiContracts.CreditCardType();
		creditCard.setCardNumber(cc.number);
		creditCard.setExpirationDate(cc.month + String(cc.year).substring(2));
		creditCard.setCardCode(cc.cvv);

		const paymentType = new ApiContracts.PaymentType();
		paymentType.setCreditCard(creditCard);

		const transactionSettings = new ApiContracts.ArrayOfSetting();
		transactionSettings.setSetting([
			this.duplicateWindow
		]);

		const transactionRequestType = new ApiContracts.TransactionRequestType();
		transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHONLYTRANSACTION);
		transactionRequestType.setPayment(paymentType);
		transactionRequestType.setAmount(amount);
		transactionRequestType.setTransactionSettings(transactionSettings);

		const createRequest = new ApiContracts.CreateTransactionRequest();
		createRequest.setMerchantAuthentication(merchantAuthenticationType);
		createRequest.setTransactionRequest(transactionRequestType);

		this.execute(createRequest, String(cc.number).substr(cc.number.length - 4), (err, result) => {
			if(err) {
				cb(new this.error.auth(err));
			} else {
				cb(null, result);
			}
		});
	}

	settle(compositeId, amount, options, cb) {

		const [transactionId] = compositeId.split('|');

		const constants = this.config;

		const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
		merchantAuthenticationType.setName(constants.apiLoginKey);
		merchantAuthenticationType.setTransactionKey(constants.transactionKey);

		const transactionSettings = new ApiContracts.ArrayOfSetting();
		transactionSettings.setSetting([
			this.duplicateWindow
		]);

		const transactionRequestType = new ApiContracts.TransactionRequestType();
		transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.PRIORAUTHCAPTURETRANSACTION);
		transactionRequestType.setRefTransId(transactionId);
		transactionRequestType.setAmount(amount);
		transactionRequestType.setTransactionSettings(transactionSettings);

		const createRequest = new ApiContracts.CreateTransactionRequest();
		createRequest.setMerchantAuthentication(merchantAuthenticationType);
		createRequest.setTransactionRequest(transactionRequestType);

		this.execute(createRequest, null, cb);
	}

	void(compositeId, options, cb) {

		const [transactionId] = compositeId.split('|');

		const constants = this.config;

		const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
		merchantAuthenticationType.setName(constants.apiLoginKey);
		merchantAuthenticationType.setTransactionKey(constants.transactionKey);

		const transactionSettings = new ApiContracts.ArrayOfSetting();
		transactionSettings.setSetting([
			this.duplicateWindow
		]);

		const transactionRequestType = new ApiContracts.TransactionRequestType();
		transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.VOIDTRANSACTION);
		transactionRequestType.setRefTransId(transactionId);
		transactionRequestType.setTransactionSettings(transactionSettings);

		const createRequest = new ApiContracts.CreateTransactionRequest();
		createRequest.setMerchantAuthentication(merchantAuthenticationType);
		createRequest.setTransactionRequest(transactionRequestType);

		this.execute(createRequest, null, cb);
	}

	refund(compositeId, amount, options, cb) {

		const [transactionId, extra] = compositeId.split('|');

		const constants = this.config;

		const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
		merchantAuthenticationType.setName(constants.apiLoginKey);
		merchantAuthenticationType.setTransactionKey(constants.transactionKey);

		const creditCard = new ApiContracts.CreditCardType();
		creditCard.setCardNumber(extra);
		creditCard.setExpirationDate('XXXX');

		const paymentType = new ApiContracts.PaymentType();
		paymentType.setCreditCard(creditCard);

		const transactionSettings = new ApiContracts.ArrayOfSetting();
		transactionSettings.setSetting([
			this.duplicateWindow
		]);

		const transactionRequestType = new ApiContracts.TransactionRequestType();
		transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.REFUNDTRANSACTION);
		transactionRequestType.setPayment(paymentType);
		transactionRequestType.setRefTransId(transactionId);
		transactionRequestType.setAmount(amount);
		transactionRequestType.setTransactionSettings(transactionSettings);

		const createRequest = new ApiContracts.CreateTransactionRequest();
		createRequest.setMerchantAuthentication(merchantAuthenticationType);
		createRequest.setTransactionRequest(transactionRequestType);

		this.execute(createRequest, null, cb);
	}


	execute(createRequest, extra, cb) {

		const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
		ctrl.setEnvironment(this.config.endpoint);

		ctrl.execute(() => {
			const apiResponse = ctrl.getResponse();

			const response = new ApiContracts.CreateTransactionResponse(apiResponse);

			//pretty print response
			//console.log(JSON.stringify(response, null, 2));

			if (response != null) {
				if (response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
					if (response.getTransactionResponse().getMessages() != null) {
						return cb(null, new Response([response.getTransactionResponse().getTransId(), extra].join('|'), response.getTransactionResponse().getAuthCode()));
					} else {
						return cb(new AuthorizeResponseError(
							response.getTransactionResponse().getErrors().getError()[0].getErrorText(),
							response.getTransactionResponse().getErrors().getError()[0].getErrorCode()
						));
					}
				} else {
					if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {
						return cb(new AuthorizeResponseError(
							response.getTransactionResponse().getErrors().getError()[0].getErrorText(),
							response.getTransactionResponse().getErrors().getError()[0].getErrorCode()
						));
					}
					else {
						return cb(new AuthorizeResponseError(
							response.getMessages().getMessage()[0].getText(),
							response.getMessages().getMessage()[0].getCode()
						));
					}
				}
			} else {
				return cb(new ResponseError(new AuthorizeResponseError('Unknown Error Occured'), 0));
			}
		});
	}
}

module.exports = AuthorizeNet;