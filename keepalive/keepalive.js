const http = require('http')
const fetch = require('node-fetch');
let server;
let stateOn = false;


module.exports.On = function () {
    server = http.createServer((req, res) => {
        console.log("=>" + new Date());
        res.end('Welcome ladies and gentlemen !')
    })
    server.listen(8080, '', () => { console.log('Server Http ready'); })
    stateOn = true;
}

module.exports.Off = function () {
    if (stateOn) {
        server.close();
    }
}

module.exports.Call = function(){
    fetch('https://jaculine-bot-public.richardbonpossi.repl.co')
    .then((rep)=>{return rep.text();})
    .then((text)=>{
        console.log("Actualisation !");
    })
}