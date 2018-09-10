const RestApi = require('../src/RestApi');

describe('RestApi class', () => {
	it('should create a new instance of RestApi', () => {
		const api = new RestApi({});

		expect(api).toEqual(jasmine.any(RestApi));
	});

	it('should throw an error when creating an instance with invalid params', () => {
		expect(() => new RestApi({})).toThrowError();
	});

	it('should get an endpoint', () => {
		api.get('name');
	});

	
	it('should create a new endpoint', () => {
		api.addEndpoint(); 
	});

	it('should delete an endpoint', () => {
		api.deleteEndpoint('name')
	});

	it('should describe the api', () => {
		api.toJson();
	});

	it('should describe the api by .toJson()');
});

