exports.handler = async function(event, context) {
	const dotenv = require("dotenv");
	const axios = require("axios");
    const { getAlgoliaObject } = require("./utils/algolia");


	dotenv.config();

	const QUERY_FUNCTION = process.env.QUERY_FUNCTION;

	console.log("Fetching recipes from query function...");
	
	//get recipes 
	return axios({
		url: `${QUERY_FUNCTION}?filter=published`,
		method: "get"
	}).then((result) => {
		console.log("Numbers of results", result.data.length)
		
		let recettes = result.data.map(getAlgoliaObject);      

		return recettes;

	}).then((recettes) => {
		console.log("# recettes",recettes.length);
	
	
		//TODO: remove CORS
		return {
			statusCode: 200,
			headers:  {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(recettes)
		};
	})
	.catch(error => {
		return {
			statusCode: 500,
			body: JSON.stringify({
			  error: error.message
			})
		  }
	});	
}