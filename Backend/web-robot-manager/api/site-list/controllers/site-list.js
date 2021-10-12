'use strict';
const { parseMultipartData,sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    create:async (ctx)=>{
        const params = ctx.request.body;
			
        const robotIdList = params.robot_list;
	//create site
        const robots = await strapi.query('robot-list').find({robot_id_in:robotIdList});
        params.robot_list = robots;
        await strapi.query('site-list').create(params);

        return 0;	    
    },
    update:async (ctx)=>{

        /*
        const params = ctx.request.body;
        if(Object.entries(params).length != 0){
            console.log(params);
            const {id} = ctx.params;
            const [robotTypeModel] = await strapi.query('robot-type').find({robot_type:params.robot_type})
            const [site] = await strapi.query('site-list').find({site_name:params.site})
            console.log(robotTypeModel);
            params.robot_type = robotTypeModel;
            params.site = site;
            const entities =  await strapi.query('robot-list').update({id}, params);
            return entities;    
        }      
        */
        const params = ctx.request.body;
		if(Object.entries(params).length != 0){
            console.log(params);
            const {id} = ctx.params;

            const robotIdList = params.robot_list;
	        //create site
            const robots = await strapi.query('robot-list').find({robot_id_in:robotIdList});
            params.robot_list = robots;
            await strapi.query('site-list').update({id}, params);
            return 0;
        }
        
    },
    deleteSite:async (ctx) => {
	const params = ctx.params;
	const [site] = await strapi.query('site-list').find({id:params.id});
	//delete upload file
	const imageFile = await strapi.plugins['upload'].services.upload.fetch({ id:site.site_image_file.id });	
	await strapi.plugins['upload'].services.upload.remove(imageFile);	
	await strapi.query('site-list').delete({id:params.id});
	return 0;
	
    }
};
