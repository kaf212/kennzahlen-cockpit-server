const axios = require("axios");

async function getTokens() {

    const adminResponse = await axios.post(`${process.env.URL}api/auth/login`, {
        role: "Admin",
        password: process.env.ADMIN_PASSWORD
    });

    const standardResponse = await axios.post(`${process.env.URL}api/auth/login`, {
        role: "Standard",
        password: process.env.STANDARD_PASSWORD
    });

    return {
        admin: adminResponse.data.token,
        standard: standardResponse.data.token
    };
}

function isValidJson(json, requiredValues, isList) {
    let dataset;
    if (typeof json === "string") {
        try {
            dataset = JSON.parse(json)
        } catch (err) {
            return false;
        }
    } else {
        dataset = json
    }
    if (typeof dataset !== "object" || typeof dataset == null){
        return false;
    } else {
        if (isList){
            for (let val in requiredValues){
                for (let data in dataset){
                    if (!(requiredValues[val] in dataset[data])) return false;
                    if (requiredValues[val] in dataset[data] && requiredValues[val] == null) return false;
                }
            }
        }else{
          for (let val in requiredValues){
                if (!(requiredValues[val] in dataset)) return false;
                if (requiredValues[val] in dataset && requiredValues[val] == null) return false;
            }
        }
        return true;
    }
}

module.exports = {getTokens, isValidJson};