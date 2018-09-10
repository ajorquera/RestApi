require('isomorphic-fetch')

const Endpoint   = require('../src/Endpoint');
const fetchMock  = require('fetch-mock');
const expect     = require('chai').expect;


describe('Endpoint class', () => {
	let endPoint;
	const url = 'https://example.com/users';
	const options = {
		response: {},
		overwriteRoutes: true
	}

	beforeEach(() => {
		endPoint = new Endpoint({
			url: `${url}/:userId`
		});
	});

	it('should return a promise', () => {
		const promise = endPoint.read();
		expect(promise).to.be.an.instanceOf(Promise);
	});

	it('should return the right object in a resolve promise', async () => {
		fetchMock.get(url, {});

		const {response, request, data} = await  endPoint.read();

		// TODO looks for a way to check a response type of object
		//expect(response).to.have.keys('body', 'ok', 'status', 'url');
		expect(request).to.be.an.instanceOf(Request);
		expect(data).to.be.an.instanceOf(Object);
	});

	it('should return the right object in a reject promise', async () => {
		options.response = {
			status: 500,
			body: {}
		};

		fetchMock.get(url, {}, options);

		try{
			await endPoint.read();
		} catch({request, response}) {
			expect(request).to.be.an.instanceOf(Request);
			
			//expect(response).to.be.an.instanceOf(Response);
		}

	});
	
	it('should do a CREATE request', async () => {
		fetchMock.post(url, {});

		const {response, data} = await  endPoint.create();

		expect(data).to.deep.equal({});
		expect(response.status).to.equal(200);
	});

	it('should do a CREATE request with body params', async () => {
		options.response = {};

		fetchMock.post(url, '{}', options);


		const data = {
			id: '2',
			another: 'whatever'
		};

		const {response, request} = await endPoint.create({data});

		const body = JSON.parse(request.body);
		expect(body).to.be.deep.equal(data);
		expect(response.status).to.equal(200);
	});
	
	it('should do a READ request', async () => {
		fetchMock.get(url, {}, options);

		const {response, request} = await endPoint.read();

		expect(request.method).to.be.equal('GET');
	});
	
	it.skip('should do a a READ request with multiple url and query params', async () => {
		const params = {
			userId: 5,
			options: 10,
			page: 2
		};

		options.query = params;
		options.overwriteRoutes = false;
		fetchMock.get('https://example.com/users/5?options=10&page=2', {}, options);

		const {request} = await endPoint.read({params});

		expect(request.url).to.contain(`/${params.userId}`);
		expect(request.url).to.contain(`options=${params.options}`);
		expect(request.url).to.contain(`page=${params.page}`);
	});
	
	it('should do a UPDATE request', async () => {
		fetchMock.put(url, {}, options);

		const {response, request} = await endPoint.update();

		expect(request.method).to.be.equal('PUT');
	});
	
	it('should do a DELETE request', async () => {
		fetchMock.delete(url, {}, options);

		const {response, request} = await endPoint.delete();

		expect(request.method).to.be.equal('DELETE');
	});
	
	it('should send a request with headers', async () => {
		fetchMock.get(url, {}, options);

		const headers = {
			'X-Requested-With': 'XMLHttpRequest'
		}

		const {request, response} = await endPoint.read({headers});

		expect(request.headers.get('Content-Type')).to.equal('application/json; charset=utf-8');
		expect(request.headers.get('X-Requested-With')).to.equal('XMLHttpRequest');
	});
	
	it.skip('should cache safe requests', async () => {
		const fake = fetchMock.sandbox();
		
		fake.get(url, {});

		await endPoint.read();
		await endPoint.read();

		const calls = fake.calls(url, 'get')

		expect(calls).to.have.lengthOf(1);
	});
});
