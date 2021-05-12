const vc_channel = {};
const {crypt, decrypt, getDate} = require('./_static');
const fetch = require('node-fetch');

let present = false;
let ban_list = [];

vc_channel.onMessage = (message)=>{

    if(/^log(s)?(.+)?$/i.test(message.content)){
        if(message.member.roles.cache.some(r => r.name === "Bébé Admin")){

            if(RegExp.$1 == ""){
                message.channel.send(process.env.ES_VISUAL+"\nOu taper **`logs`**");
                return;
            }

            fetch(process.env.ES_DATA)
            .then((rep)=>{return rep.text()})
            .then((result)=>{
                let liste = result.split("\n");
                let str_liste = [''];
                let str_cursor = 0;
                for(let i = 0; i < liste.length-1; i++){
                    
                    let info;
                    try{
                        info = JSON.parse(decrypt(liste[i]));
                        let name = info.user.substr(0, 12);
                        name = "`" + name + " ".repeat(12-name.length) + "`";
    
                        str_liste[str_cursor] += getDate(info.date);
                        if(info["co"])
                            str_liste[str_cursor] += " :green_circle: **"+ name + "** a rejoint      :  __`" + info.co+"`__"
                        else if(info['deco'])
                            str_liste[str_cursor] += " :red_circle: **"+ name + "** a quitté       :  __`" + info.deco+"`__"
                        else if(info['move'])
                            str_liste[str_cursor] += " :yellow_circle: **"+ name + "** a bougé de :  __`" + info.move.old + "`__ à __`" + info.move.new+"`__";
                    }catch(err){
                        info = decrypt(liste[i]);
                        str_liste[str_cursor] = info;
                    }
                    

                    str_liste[str_cursor] += "\n"

                    if(str_liste[str_cursor].length >= 1500){
                        // on envoit pas plus de 1500 caractères par log
                        str_cursor++;
                        str_liste.push('');
                    }

                }
                str_cursor = 0;
                var interval = setInterval(()=>{

                    let url;
                    if(RegExp.$2 == " admin"){
                        url = process.env.ADMIN_HOOK;
                    }else{
                        url = process.env.CAPTAIN_HOOK;
                    }

                    fetch(url,
                    {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            content: "`PARTIE " + (str_cursor+1 + "/") + str_liste.length + "`\n" +str_liste[str_cursor]
                        })
                    }
                    )
                    .then((rep)=>{
                        console.log(rep.ok);
                    })

                    str_cursor++;
                    if(str_cursor >= str_liste.length){
                        clearInterval(interval);
                        return;
                    }

                }, 1000);


                
            })
        }
    }
    else if(/^(viens|come|bot)/.test(message.content)){
        try{
            let voiceChannel = message.member.voice.channel.id;
            message.member.voice.channel.join();
            present = true;
        }catch(err){}
    }
    else if(/^(quitte|casse\-toi|part|espion)/.test(message.content)){
        console.log("OKOK")
        try{
            let voiceChannel = message.member.voice.channel.id;
            message.member.voice.channel.leave();
            present = false;
        }catch(err){}
    }
    else if(/^lit http(.+)$/i.test(message.content)){
        //bot.playRawStream();
    }
    else if(/^ban vocal <@!?([0-9]{1,})>$/i.test(message.content)){
        let id = RegExp.$1;
        if(ban_list.includes(id)){
            message.react("👎");
        }else{
            ban_list.push(id);
            message.react("👍");
            /*message.guild.members.fetch(id)
            .then((user)=>{
                console.log(user);
                user.setChannel(null);
            })*/
            message.guild.member(id).voice.setChannel(null);
        }
    }
    else if(/^unban vocal <@!?([0-9]{1,})>$/i.test(message.content)){
        let pos = ban_list.indexOf(RegExp.$1);
        if(pos == -1 || message.member.id == RegExp.$1){
            message.react("👎");
            return
        }
        ban_list.splice(pos, 1);
        message.react("👍");
    }

}

vc_channel.onVoiceState = (oldState, newState)=>{
    console.log(oldState, newState);
    let info = {
        user : oldState.member.user.username,
    }

    if(newState.channelID === null){
        info.deco = oldState.channel.name;
    }
    else if(oldState.channelID === null){

        if(ban_list.includes(newState.member.user.id)){
            newState.guild.member(newState.member.user.id).voice.setChannel(null);
            info.co = newState.channel.name + ' (ban)';
        }else{
            info.co = newState.channel.name;
        }
    }
    else if(oldState.channel.id != newState.channel.id){
        info.move = {old: oldState.channel.name, new: newState.channel.name};
    }
    info.date = new Date().getTime();
    //queueUpdate.push(info);

    var val = crypt(JSON.stringify(info));
    
    fetch(process.env.ES_LOG, 
        {
            method : 'post',
            headers : {'Content-Type': 'application/x-www-form-urlencoded'},
            body : "save=" + encodeURIComponent(val.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '::'))
        }
    )
    .then((rep)=>{
        if(rep.ok) console.log("PARFAIT !")
        return rep.text();
    })
    .then((texte)=>{
        console.log(texte);
    })
}

module.exports = vc_channel;