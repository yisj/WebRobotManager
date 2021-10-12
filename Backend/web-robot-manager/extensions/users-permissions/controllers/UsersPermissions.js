'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
	resetJwt:async (ctx) => {
		const params = ctx.request.body;
		const username = params.username;
		return await strapi.query('user','users-permissions').update({username},{jwt:params.jwt});
		
	},
	checkJwt:async (ctx) => {
		const params = ctx.request.body;
		console.log(params);

		return await strapi.query('user','users-permissions').findOne(params);
	}
};
