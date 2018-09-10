# rest-api
[![Build Status](https://travis-ci.org/ajorquera/RestApi.svg?branch=master)](https://travis-ci.org/ajorquera/RestApi)

Restful client that follows CRUD principle. Uses fetch underneath

`IMPORTANT:` this is work in progress, and was made in a day. Not sure if it will be continued

## Usage

```javascript
const api = new RestApi([
	{name: 'users', url: '/users/:userId'},
	{name: 'endpoints', url: 'endPoints/:endpointId', actions: {update: 'PATCH'}}
]);

// create new user
api.get('users').create({ data: { name: 'john' }); // POST /users

// get list of users
api.get('users').read(); // GET /users

// get user 5
api.get('users').read({params: {userId: 5}}); // GET /users/5

// update user 5
api.get('users').update({params: {userId: 5}); // PUT /users/5

// delete user 5
api.get('users').delete({params: {userId: 5}); // DELETE /users/5

// ----- More uses -------------------------

const endPoints = api.get('endpoints');

endPoints.update({params: {page: 2, status: 'draft'}}) // PATCH /endPoints?page=2&status=draft

endPoint.update({method: 'PUT', data: {list: 5}); // PUT /endPoints
```