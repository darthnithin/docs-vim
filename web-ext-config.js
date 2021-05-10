require('dotenv').config();
var API_KEY = process.env.AMO_JWT_ISSUER;
var API_SECRET = process.env.AMO_JWT_SECRET;
module.exports = {

    sourceDir: "src/",
    artifactsDir: "build/",
    sign: {
        apiKey: process.env.AMO_JWT_ISSUER,
        apiSecret: process.env.AMO_JWT_SECRET
    }
};
