require('isomorphic-fetch');
/* global fetch, Request */
class Endpoint {
	static isSafeMethod(method) {
		return Endpoint.safeMethods.indexOf(method) !== -1;
	}


	static hasMethodBodyData(method) {
		return Endpoint.bodyDataMethods.indexOf(method) !== -1;
	}

	static create(...args) {
		return new Endpoint(...args);
	}

	constructor({ url, headers }) {
		this.url = url;
		this._headers = headers || {};
		this._cache = new Map();
	}

	create(params = {}) {
		return this._request({ method: 'POST', data: params.data, headers: params.headers });
	}

	read(params = {}) {
		return this._request({ method: 'GET', headers: params.headers });
	}

	update(params = {}) {
		return this._request({ method: 'PUT', data: params.data, headers: params.headers });
	}

	delete(params = {}) {
		return this._request({ method: 'DELETE', headers: params.headers });
	}

	setHeaders(headers) {
		this._headers = headers;
	}

	flushCache() {
		this._cache.clear();
	}

	/** Private methods ---------------------------------------------------------- */

	_request({ method, params, data, headers, cache }) {
		const requestParams = {
			method
		};

		requestParams.headers = Object.assign(Endpoint.defaultHeaders, this.headers, headers);

		if (Endpoint.hasMethodBodyData(method) && data) {
			requestParams.body = JSON.stringify(data);
		}

		const url = this._buildUrl(params);

		const isCache = Endpoint.isSafeMethod(method) && (cache !== undefined ? cache : this.cache);

		let promise;
		if (isCache) {
			promise = this._cache.get(url);
		}

		if (!promise) {
			const request = new Request(url, requestParams);
			promise = fetch(url, requestParams)
				.then(Endpoint.transformResponse.bind(null, request))
				.then(this._cacheResponse.bind(this))
				.catch(Endpoint.handleError);
		}

		return promise;
	}

	_buildUrl(params) {
		let { url } = this;
		const copyParams = Object.assign({}, params);
		const urlParams = url.match(/\/:.+/);

		if (urlParams) {
			urlParams.forEach((urlParam) => {
				const paramName = urlParam.replace('/:', '');
				if (copyParams[paramName]) {
					url = url.replace(urlParam, `/${params[paramName]}`);
					delete copyParams[paramName];
				} else {
					url = url.replace(`${urlParam}`, '');
				}
			});
		}

		url = Endpoint.addQueryParamsToUrl(url, copyParams);

		return url;
	}

	_cacheResponse(changeResponse) {
		const [response, request, data] = changeResponse;

		const promise = Promise.resolve({ data, response, request });

		if (Endpoint.isSafeMethod(request.method)) {
			this._cache.set(request.url, promise);
		} else {
			this._cache.delete(request.url);
		}

		return promise;
	}
}

Endpoint.handleError = (error) => {
	throw error;
};

Endpoint.transformResponse = (request, response) => {
	const responseCopy = response.clone();

	if (response.status >= 400) {
		const error = { request, response: responseCopy };
		throw error;
	}

	return Promise.all([
		Promise.resolve(responseCopy),
		Promise.resolve(request),
		response.json()
	]);
};

Endpoint.addQueryParamsToUrl = (urlToChange, params) => {
	let url = urlToChange;

	if (url.indexOf('?') === -1) {
		url += '?';
	} else {
		url += '&';
	}

	Object.entries(params).forEach(([key, value]) => {
		url += `${key}=${value}&`;
	});

	// remove last character
	url = url.slice(0, -1);

	return url;
};

Endpoint.defaultHeaders = {
	'Content-Type': 'application/json; charset=utf-8'
};

Endpoint.safeMethods = [
	'OPTIONS',
	'GET',
	'HEAD'
];

Endpoint.bodyDataMethods = [
	'POST',
	'PUT',
	'PATCH'
];

module.exports = Endpoint;
