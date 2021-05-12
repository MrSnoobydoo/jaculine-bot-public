const http = require('http')
let server;
let stateOn = false;

module.exports.On = function(){
   server = http.createServer((req, res)=>{
        console.log("=>" + new Date());
        res.end('Welcome ladies and gentlemen !')
    })
    server.listen(8080, '', ()=>{console.log('Server Http ready');})
    stateOn = true;
}

module.exports.Off = function(){
    if(stateOn){
        server.close();
    }
}