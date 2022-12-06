http = require('http');
fs = require('fs');

const ACCNodeWrapper = require('acc-node-wrapper');
const wrapper = new ACCNodeWrapper()


api_host = '0.0.0.0';
api_port = 8792;

udp_host = '0.0.0.0'
udp_port = 9000;

var appState = {
    BROADCASTING_EVENT: {},
    TRACK_DATA: {},
    REALTIME_CAR_UPDATE: { },
    REALTIME_UPDATE: {}
}

wrapper.on("BROADCASTING_EVENT", result => {
    // appState.BROADCASTING_EVENT = result;
    appState.BROADCASTING_EVENT[result.CarId] = result;
    console.log(JSON.stringify(result, null, 3));
});

wrapper.on("TRACK_DATA", result => {
    appState.TRACK_DATA = result;
});

wrapper.on("REALTIME_CAR_UPDATE", result => {
    appState.REALTIME_CAR_UPDATE[result.CarIndex] = result;
});

wrapper.on("REALTIME_UPDATE", result => {
    appState.REALTIME_UPDATE = result;
});

wrapper.initBroadcastSDK("rogan", "127.0.0.1", 9000, "asd", "", 2500, false)
console.log('Listening at http://' + udp_host + ':' + udp_port);


server = http.createServer(function (req, res) {
    if (req.method == 'GET') {
        console.log("Handling GET request...");
        console.log("DEBUG in GET:", JSON.stringify(appState, null, 3));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(appState));
    }
    else {
        console.log("Not expecting other request types...");
        res.writeHead(200, { 'Content-Type': 'text/html' });
        var html = '<html><body>HTTP Server at http://' + api_host + ':' + api_port + '</body></html>';
        res.end(html);
    }
});

server.listen(api_port, api_host);
console.log('Listening at http://' + api_host + ':' + api_port);