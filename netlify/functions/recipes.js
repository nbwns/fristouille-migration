exports.handler = async function(event, context) {
    const dotenv = require("dotenv");
    const Airtable = require("airtable");
    const { mapRecipeCompositionRecord, mapRecipeRecord } = require("./utils/recipe");

    dotenv.config();

    let params = null;
    const filter = event.queryStringParameters.filter;
    const sendCompositions = event.queryStringParameters.compositions;

    if(filter === "published"){
        params = {
            view: "Publiées"
        }
    }
    else if(!Number.isNaN(filter)){
        params = {
            filterByFormula: `{recipeId} = '${filter}'` // Correction de la syntaxe
        }
    }
    else{
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({error: "invalid parameter"})
        };
    }

    var base = new Airtable({apiKey: process.env.AIRTABLE_TOKEN}).base('appI7jFWaljyfkpVd');

    async function getRecordsFromAirtable() {
        let recordsArray = [];

        return new Promise((resolve, reject) => {
            base('Recettes').select(params)
            .eachPage(function page(records, fetchNextPage) {
                // Transform records
                let recipes = []
                
                try{
                    if(sendCompositions){
                        recipes = records.map(mapRecipeCompositionRecord);
                    }
                    else{
                        recipes = records.map(mapRecipeRecord);
                    }
                }
                catch(error){
                    console.log(error);
                    reject(error);
                    return;
                }

                recordsArray = [...recordsArray, ...recipes];
                
                // Appel conditionnel de fetchNextPage
                fetchNextPage();
                
            }, function done(err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(`Total records retrieved: ${recordsArray.length}`); // Log pour debug
                    resolve(recordsArray);
                }
            });
        });
    }

    try {
        let recipes = await getRecordsFromAirtable();
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipes)
        };
    } catch (error) {
        console.error('Error fetching records:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({error: "Failed to fetch records"})
        };
    }
}