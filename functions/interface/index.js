const http = require('http');
const fs = require('fs');
const fetch = require('node-fetch');


var ct = 0;
class Interface{

    static Init(bot){
        Interface.bot = bot;

        bot.on('message', msg => {
            Interface.OnMessage(msg);
        });

        Interface.server = http.createServer((req, res)=>{
            
            if(req.url == "/"){
                ct ++;
                console.log(ct)
                Interface.HTML_MAIN(res);
            }

        });
        Interface.server.listen(8080, '', '', console.log('Interface ready'));
    }

    static HTML_MAIN(res){
        fs.readFile(__dirname+'/page/index.htm', (err, data)=>{
            if(err) return res.end(__dirname);
            res.end(data.toString());
        });
    }

    /*
        INTERFACE BOT
    */

    static OnMessage(msg){
        if(msg.content == '.admin' && !msg.author.bot){
            msg.reply("https://jaculine-bot-public.mrsnoobydoo.repl.co");
        }
    }

}


module.exports = Interface;