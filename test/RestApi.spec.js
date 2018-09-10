const RestApi = require('../src/RestApi');
const Endpoint = require('../src/Endpoint');
const expect     = require('chai').expect;

describe('RestApi class', () => {
	let api;

	beforeEach(() => {
		api = new RestApi([
			{name: 'name', url: '/url'}
		]);
	});

	it('should create a new instance of RestApi', () => {
		expect(api).to.be.instanceOf(RestApi);
	});

	it('should get an endpoint', () => {
		const endPoint = api.get('name');

		expect(Endpoint.name).to.be.equal('Endpoint');
	});
	
	it('should create a new endpoint', () => {
		api.add({name: 'other', url: '/more'}); 

		const endPoint = api.get('other');
		expect(Endpoint.name).to.be.equal('Endpoint');
	});

	it('should delete an endpoint', () => {
		api.delete('name')

		const endPoint = api.get('name');

		expect(endPoint).to.be.undefined;
	});
});

