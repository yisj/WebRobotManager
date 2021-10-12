'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    create:async (ctx)=>{
        const params = ctx.request.body;
        if(Object.entries(params).length != 0){
            /*console.log(params);
            const [robotTypeModel] = await strapi.query('robot-type').find({robot_type:params.robot_type})
            const [site] = await strapi.query('site-list').find({site_name:params.site})
            console.log(robotTypeModel);
            params.robot_type = robotTypeModel;
            params.site = site;*/
            const entities =  await strapi.query('robot-list').create(params);
            return entities;    
        }      
    },
    update:async (ctx)=>{
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
    },
    register:async (ctx)=>{
        const params = ctx.request.body;
        if(Object.entries(params).length != 0){
            if(params.robot_uuid){
			    const {robot_uuid} = {robot_uuid: params.robot_uuid};
                const [robotTypeModel] = await strapi.query('robot-type').find({robot_type:params.robot_type})
                const [site] = await strapi.query('site-list').find({site_name:params.site})
                
                params.robot_type = robotTypeModel;
                params.site = site;

                /* Create agent Id */
                const robotList = await strapi.query('robot-list').find();
                let agentNum = 1;
                robotList.forEach((robot,index) => {
                    if(robot.agent_id.search(robotTypeModel.nickname) >= 0){		
                            let agentIndex = robot.agent_id.substring(2);
                            agentIndex *= 1;
                            // check agentId
                            if(agentNum == agentIndex)
                        agentNum++; 
                    }		
                })
                agentNum += '';
                console.log(agentNum.length);
                switch(agentNum.length){
                    case 1:
                        agentNum = '000' + agentNum;
                        break;
                    case 2:
                        agentNum = '00' + agentNum;
                        break;
                    case 3:
                        agentNum = '0' + agentNum;
                        break;
                }
                //set agentId
                params.agent_id = robotTypeModel.nickname + agentNum;
                const entities =  await strapi.query('robot-list').update({robot_uuid}, params);
                return true;
            }
       }
       return false;
    },
    connectionRobot:async (ctx)=>{
        const params = ctx.request.body;
        if(Object.entries(params).length != 0){
        }
       return false;
    },
    disconnectionRobot:async (ctx)=>{
        const params = ctx.request.body;
        if(Object.entries(params).length != 0){
        }
       return false;
    },
    online:async (ctx)=>{
        const params = ctx.request.body;
        if(Object.entries(params).length != 0){
            //console.log(params);
            const robot = await strapi.query('robot-list').findOne({robot_uuid:params.robot_uuid});
            const id = robot.id;
            robot.robot_status = params.robot_status;
                            
            const entities =  await strapi.query('robot-list').update({id}, robot);
            setTimeout(async function(){
                const robot = await strapi.query('robot-list').findOne({robot_uuid:params.robot_uuid});
                let today = new Date();
                let ms = today - robot.updated_at;
                if(ms >= 8000){
                    const id = robot.id;
                    robot.robot_status = 'Offline';
                    const entities =  await strapi.query('robot-list').update({id}, robot);
            
                }

                
            },8000);
            return "Robot online";
        }      
    },

    findOneByUuid:async (ctx)=>{
        const params = ctx.request.body;
	    if(Object.entries(params).length != 0){
       		//console.log(params);
            if(params.robot_uuid){
			    const robot = await strapi.query('robot-list').findOne({robot_uuid:params.robot_uuid});
			    //onconsole.log(robot);
                return robot;                
	
            }    
        }
    },
    findUnregisteredRobotsUuid:async (ctx) => {
        const robotList = await strapi.query('robot-list').find();
	let response = [];
	
	robotList.forEach((robot,index) => {
		if(robot.agent_id == null || robot.agent_id == ''){		
			response.push(robot.robot_uuid);
		}		
	})
		console.log(response);
	return response;
    },
    findRegisteredRobotsUuid:async (ctx) => {
        const robotList = await strapi.query('robot-list').find();
	let response = [];
	
	robotList.forEach((robot,index) => {
		console.log(robot);
		if(robot.agent_id != null && robot.agent_id != ''){	
			//delete robot.
			response.push(robot);
		}		
	})
		console.log(response);
	return response;
    },
    findRobotInSite:async (ctx)=>{
        const params = ctx.query;
        const robotList = await strapi.query('robot-list').find();
        let response = [];
        robotList.forEach((robot,index) => {
            if(robot.site != null){
                if(robot.site.site_name == params.site){		
                    response.push(robot);
                }
            }		
        })
        console.log(response);
        return response;
    },
    findNoSite:async (ctx)=>{
       	//console.log(params);
	const robotList = await strapi.query('robot-list').find();
	let response = [];
	robotList.forEach((robot,index) => {
		if(robot.site == null && robot.agent_id != null){		
			response.push(robot);
		}		
	})
		
	return response;
                
        
    }
};
