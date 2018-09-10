
const Endpoint = require('./Endpoint');

class RestApi {
	static create() {
		return new RestApi(...arguments)
	}

	constructor(endPoints, params) {
		this.endPoints = new Map();
		this._params = params;
		
		endPoints.forEach(endPoint => this.addEndpoint(endPoint))
	}

	add(endPoint) {
		if(Array.isArray(endPoint)) {
			endPoint.forEach(this._addEndpoint);
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
		}

		return JSON.stringify(json);
	}

	flushCache() {
		this._endPoints.forEach(endPoint => endPoint.flushCache());
	}

	_addEndpoint(endPoint) {
		const args = Object.assign({}, endPoint);

		if(this._params.urlPrefix) {
			args.url = this._params.urlPrefix + args.url;
		}

		this.endPoints.set(args.name, new Endpoint(args));s
	}
}

module.exports = RestApi;