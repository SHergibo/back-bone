const {loggerInfo, loggerError} = require('./config/logger.config');

const [major, minor] = process.versions.node.split('.').map(parseFloat);

if(major < 16 || major === 16 && minor <= 12){
    loggerInfo.error('Node version is too low');
    process.exit(1);
}

const { port, env, environments } = require('./config/environment.config');

const App = require ('./config/app.config');
const Mongoose =require ('./config/mongoose.config');

Mongoose.connect();

App.listen( port, () => {
    if(env.toUpperCase() === environments.PRODUCTION){
        loggerInfo.info(`HTTP server is now running on port ${port} (${env})`);
    }else{
        console.log(`HTTP server is now running on port ${port} (${env})`);
    }
}).on('error', (err) => {
    loggerError.error(`Server connection error: ${err}`);
});

module.exports = App;