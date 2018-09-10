const {RestApi} = require('./src');

const endpoints = [
	{ name: 'users', url: '/users/:userId', cache: true }
];

const params = {
	urlPrefix: 'https://domain.com'
}

const api = new RestApi(endpoints, params);

api.get('users').read({params: {userId: '5'}});

api.add({ name: 'tours', url: '/tours/:userId', cache: true });
api.delete('tours');

