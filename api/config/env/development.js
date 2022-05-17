var host = "localhost";
var tokenSecret = "NOC-dhamodar-77";
var port = 3017;
var options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    useUnifiedTopology: true,
    // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    // reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 500000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 900000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};
var db = {
    adobe: {
        url: "mongodb://root:adapptroot@adobe.adapptonline.com/occupancy?authSource=admin",
        options: options
    },
    barclays: {
        url: "mongodb://adapptadmin:adappt-barclays-admin@barclays.adapptonline.com/occupancy?authSource=admin",
        options: options
    },
    localhost: {
        url: "mongodb://root:adapptroot@noc.adapptonline.com/pcsdata?authSource=admin",
        options: options
    },
    "adappt-kores": {
        url: "mongodb://root:adapptroot@kores.adapptonline.com/adappt-kores?authSource=admin",
        options: options
    },
    "adappt-jll": {
        url: "mongodb://root:adapptroot@jll.adapptonline.com/adappt-jll?authSource=admin",
        options: options
    },
    "adappt-lnt": {
        url: "mongodb://root:adapptroot@lnt.adapptonline.com/adappt-lnt?authSource=admin",
        options: options
    },
    "adappt-mmoser": {
        url: "mongodb://root:adapptroot@mmoser.adapptonline.com/adappt-mmoser?authSource=admin",
        options: options
    },
    "adappt-bosch": {
        url: "mongodb://root:adapptroot@bosch.adapptonline.com/lmsDemo?authSource=admin",
        options: options
    },
    "adappt-lenovo": {
        url: "mongodb://adapptadmin:adappt-lenovo-admin@lenovo-us.adapptonline.com/adappt-lenovo-us?authSource=admin",
        options: options
    }
};

var domainlist = [
    "adobe",
    "barclays",
    "adappt-kores",
    "adappt-jll",
    "adappt-lnt",
    "adappt-mmoser",
    "adappt-bosch",
    "adappt-lenovo",
    "localhost"
];
global.domainData = [
    "adobe",
    "barclays",
    "adappt-kores",
    "adappt-jll",
    "adappt-lnt",
    "adappt-mmoser",
    "adappt-bosch",
    "adappt-lenovo",
];


module.exports = {
    port: port,
    db: db,
    sessiondb: "mongodb://root:adapptroot@noc.adapptonline.com/sessions?authSource=admin",
    host: host,
    tokenSecret: tokenSecret,
    sessiontimeout: 15 * 60,
    master_database_uri: "mongodb://root:adapptroot@noc.adapptonline.com/master?authSource=admin",
    master_database_name: "adappt_noc",
    auth_service_jwt_url: "http://localhost:4014/jwt/auth",
    auth_service_oauth_url: "http://localhost:4014/oauth/auth",
    domainlist: domainlist
};