const Endpoint = require('./Endpoint');

class RestApi {
	static create(...args) {
		return new RestApi(...args);
	}

	constructor(endPoints, params) {
		this.endPoints = new Map();
		this._params = params || {};

		this.add(endPoints);
	}

	add(endPoint) {
		if (Array.isArray(endPoint)) {
			endPoint.forEach(this._addEndpoint.bind(this));
		} else {
			this._addEndpoint(endPoint);
		}
	}

	delete(name) {
		return this.endPoints.delete(name);
	}

	get(name) {
		return this.endPoints.get(name);
	}

	toJson() {
		const json = {
			endPoints: this.endPoints.values().map(endPoint => endPoint.toJson())
		};

		return JSON.stringify(json);
	}

	flushCache() {
		this._endPoints.forEach(endPoint => endPoint.flushCache());
	}

	_addEndpoint(endPoint) {
		const args = Object.assign({}, endPoint);

		if (this._params.urlPrefix) {
			args.url = this._params.urlPrefix + args.url;
		}

		this.endPoints.set(args.name, new Endpoint(args));
	}
}

module.exports = RestApi;
