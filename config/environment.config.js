const Dotenv = require('dotenv');

const environments = {DEVELOPMENT : "DEVELOPMENT", STAGING : "STAGING", PRODUCTION : "PRODUCTION", TEST: "TEST"};
const environment = process.argv[2] && typeof(process.argv[2]) !== 'undefined' && process.env.NODE_ENV !== 'test' ? process.argv[2].split('-')[1] : 'test';

Dotenv.config({path : `${process.cwd()}/${environment}.env`});

module.exports = {
    env : process.env.NODE_ENV,
    environments : environments,
    port : process.env.PORT,
    jwtSecret : process.env.JWT_SECRET,
    jwtExpirationInterval : process.env.JWT_EXPIRATION_MINUTES,
    mongo : {
        uri : process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI
    },
    api : process.env.API_VERSION,
    logs : process.env.NODE_ENV === 'production' ? 'combined' : 'development',
    HTTPLogs : process.env.NODE_ENV === 'production' ? 'production' : 'dev',
    CorsOrigin : process.env.CORS_ORIGIN
}