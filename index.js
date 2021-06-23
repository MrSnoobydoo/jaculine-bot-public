// Verison 1.1.2

const Discord = require('discord.js');
const bot = new Discord.Client();
const TimeDelta = require('./TimeDelta.js');
const KeepAlive = require('./keepalive.js');

KeepAlive.On();

const fetch = require('node-fetch');
var active = true;

const VCC = require('./voice_channel/vc_modules/vocal_channel');

const infos = {
	"ecolebot": process.env.ECOLE_BOT,
	"remontada": process.env.REMONTADA
}

var spam = {
	actuelUserID: '',
	lastUserID: '',
	nb: 0,
	lastDate: new Date(),
	reset: ()=>{
		spam.lastDate = new Date();
		spam.nb = 1;
	}
}

setInterval(function(){
    KeepAlive.Call();
}, 1000 * 60 * 30);

bot.once('ready', () => {
	console.log('Ready!');
	bot.user.setPresence({
	    status: 'idle',
	    activity: {
	        name: "Super Mario 63"
	    }
	});
    VCC.onReady(bot);


    //bot.guilds.cache.get(infos.remontada).channels.cache.
    bot.channels.cache.get("694084554750689370").messages.fetch({limit: 4}).then((messages)=>{
        //https://stackoverflow.com/questions/60609287/discord-js-get-a-list-of-all-users-sent-messages
        messages.forEach(m=>{
            console.log(m.content);
        });
    })

});

bot.on('voiceStateUpdate', (oldV, newV)=>{
	VCC.onVoiceState(oldV, newV, bot);
});

bot.on('message', message => {

	VCC.onMessage(message);

	var server;
	try{
		server = message.guild.id;
	}catch(err){
		console.log(err);
		server = infos.remontada;
	}
	var salon = message.channel.id;

    if(salon == "689520044786450453"){
        console.log(message.author.id);
        console.log("MSG(" + message.author.username + ") : " + message.content);
        //message.delete();
    }


    /*
        SUPRESSION DE MESSAGE
    */
    if(/^!supprimer ([0-9]{1,}) (.+)$/ig.test(message.content)){
        let nb = parseInt(RegExp.$1);
        

        if(!message.mentions.users.first() || nb > 100){
            message.react("⛔");
            return;
        }
        message.react("👌");

        let userID = message.mentions.users.first().id;
        
        bot.channels.cache.get(salon).messages.fetch({limit: nb}).then((messages)=>{
            //https://stackoverflow.com/questions/60609287/discord-js-get-a-list-of-all-users-sent-messages
            messages.forEach(m=>{
                if(m.author.id === userID){
                    m.delete();
                    console.log(m.content);
                }
                    
            });
        })
    }else if(/^!supprimer/.test(message.content)){
        message.react("⛔");
    }

	if(/^!a(.+)$/igs.test(message.content)){
		message.delete();
		let txt = message.content.substr(2, message.content.length);
		message.channel.send(/*"Anonyme 🥴 : " +*/ txt);
		return;
	}

	let rgBotId = new RegExp("<@!?"+process.env.BOT_ID+">");
	let rgBotIdOnly = new RegExp("^<@!?"+process.env.BOT_ID+">$");

	if(rgBotId.test(message.content) && !message.author.bot){
		if(message.author.id == process.env.MY_ID){
			
			if(/off/.test(message.content)){
				message.react('🥱');
				message.react('😴');
				active = false
				bot.user.setStatus('dnd');
				bot.user.setPresence({
				    status: 'dnd',
				    activity: {
				        name: 'Occupé ⛔'
				    }
				});
			}
			else if(/on/.test(message.content)){
				message.react('👌');
				message.react('🥴');
				active = true
				bot.user.setPresence({
				    status: 'online',
				    activity: {
				        name: 'Mange du 🍖'
				    }
				});
			}
			else if(rgBotIdOnly.test(message.content))
				message.reply("Oh le big boss m'a appelé ?!");

			return;
		}
		else if(active == true)
			message.reply("Oui :smiling_face_with_3_hearts: ?");

		if(active == false)
			message.reply("Je suis en train de dormir, ta gueule homme de cro magnon :sleeping:")

		return;
	}

	if(active == false)
		return;


	let spamTxt = ["Ordeeeerrr !", "Stooooop !", "Please no hell !", 
	"Unbelievable :tired_face:", "Hey hey calm down", "Love you just speak normal please", 
	"Oh then f*** you !", "You have been detected of spamming", ":regional_indicator_s: :regional_indicator_p: :regional_indicator_a: :regional_indicator_m:"
	+" :red_circle: :regional_indicator_a: :regional_indicator_l: :regional_indicator_e: :regional_indicator_r: :regional_indicator_t: :exclamation:"];
	// Spam warning

	spam.actuelUserID = message.author.id;

	if(spam.actuelUserID == spam.lastUserID){
		spam.nb++;
	}
	else{
		spam.lastUserID = spam.actuelUserID;
		spam.reset();
	}

	if(new Date() - spam.lastDate <= 8*1000 && spam.nb >= 6 && (server == infos.ecolebot || server == infos.remontada)){ // 8s et 6 message ou plus
		//message.channel.send("**BAH BRAVO ON SPAMMM LE SERVEUR !!!**");
		message.react("⛔");
		message.react("❌");
		message.react("📛");
		message.react("🔇");
		message.react("🔕");
		message.react("❔");
		message.react("☣");
		message.author.send(spamTxt[Math.floor(Math.random() * spamTxt.length)]); 
		spam.reset();
	}else if(new Date() - spam.lastDate > 8*1000){
		spam.reset();
	}

	// Filter channel Discord

	if((server == infos.ecolebot || server == infos.remontada) && !message.author.bot) interact(message)

	if (message.content === 'ping') {
		message.reply('pong !')
		message.reply("```json\n"+JSON.stringify(message)+"\n```");
	}

	if(/!gif ?([a-z0-9 .-]+)?$/i.test(message.content) && !message.author.bot){
		console.log("\x1b[33m GIF REQUEST : ", RegExp.$1, " - ", new Date(), "\x1b[0m");
		RandomGIF(message, RegExp.$1);
		return;
	}

	let visioTxt = "";
	let visioTout = false;

	function addReturn(txt){
		if(txt != "")
			return "\n";
		return "";
	}
	function emoji(name){
		if(name == "bah")
			return process.env.EMO1;
		if(name == "gogole")
			return process.env.EMO2;
		if(name == "yo")
			return process.env.EMO3;
		if(name == "god")
			return process.env.EMO4;
		if(name == "wut")
			return process.env.EMO5;
		if(name == "haha")
			return process.env.EMO6;
	}

	if(/^(visio|partiel)$/ig.test(message.content)){
		message.reply(emoji("bah") + " "+process.env.UE0);
	}
	if(/^visio (tout|all|<:gogole:([0-9]+)>)$/ig.test(message.content)){
		visioTout = true;
		visioTxt += emoji("gogole") + " Toutes les visios Ingé 1 semestre 2 : "+process.env.UE1+"\n";
	}
	if(/^visio (ue6|<:yo:([0-9]+)>)$/ig.test(message.content) || visioTout == true){
		visioTxt += addReturn(visioTxt);
		visioTxt += emoji("yo") + " Automatique Linéraires : "+process.env.UE2
			+"\n" + emoji("yo") + " Traitement Stats du Signal : "+process.env.UE3
			+"\n" + emoji("yo") + " Transmissions Numérique : "+process.env.UE4+"\n";
	}
	if(/^visio (ue7|<:god:([0-9]+)>)$/ig.test(message.content) || visioTout == true){
		visioTxt += addReturn(visioTxt);
		visioTxt += emoji("god") + " Machines Tournantes : "+process.env.UE5
			+"\n" + emoji("god") + " Microsystèmes : "+process.env.UE6
			+"\n" + emoji("god") + " Réseaux : "+process.env.UE7+"\n";
	}
	if(/^visio (ue8|<:wut:([0-9]+)>|<:haha:([0-9]+)>)$/ig.test(message.content) || visioTout == true){
		visioTxt += addReturn(visioTxt);
		visioTxt += emoji("haha") + " " + emoji("wut") + " Développement Durable : "+process.env.UE8
			+"\n" + emoji("haha") + " " + emoji("wut") + " Design Thinking(Lean Mana) : "+process.env.UE9+"\n";
	}

	if(visioTxt != ""){
		if(message.author.bot == true)
			message.channel.send("   ---   Tada :nerd: !   ---\n" + visioTxt);
		else
			message.reply("   ---   Tada :nerd: !   ---\n" + visioTxt);
	}

	var grosmot = ["encule", "connard", "fils de ", "pute", "salop", "t'?e?s? con", "tg", "ta guele", "guele", "es(t)? con([ .])", "petasse", "cochonne"];
	for(var i = 0; i < grosmot.length; i++){
		var rg = new RegExp(grosmot[i], 'i');
		let messageVal = message.content.replace(/é|è|ë|ê/ig, 'e');
		if(rg.exec(messageVal) != null && !message.author.bot && /<@!?691950683355742218>/.test(message.content)){
			let mDebut = ["Mais ooooh c'est toi", "Quoi ? Moi ch'uis", "Tu parles à qui comme ça ? C'est toi", "Fais le malin mais c'est toi qui reste ",
			"Hein ? Pas d'insulte ", "Tu veux fight ? Viens Châtelet 18h octogone et tu diras", "Bouffon c'est toi", "Oh le batard il a dit",
			"Merde"];
			let emoFin = [":face_with_symbols_over_mouth:", ":eyes:", ":middle_finger:", ":clap:", ":triumph:", ":dizzy_face:", ":exploding_head:", ":scream:"];
			let mFin = ["tu verras je t'écrase", "je vais appeler ta daronne",
			"sale fou va", "les jeunes de nos jours waaa", "tu hors de ma vue", "je vais te défoncer", "la politesse tu connais ?", "moi IA je te surpasse infame humain",
			"より良いろくでなしを話す", "私はあなたをファック", "Ich bin dein Vater", "私はあなたの父です", "ég er faðir þinn", "我是你奶奶", "sous-fifre"];

			message.channel.send(RndMssg(mDebut)+" "+grosmot[i]+" "+RndMssg(emoFin) + " " + RndMssg(mFin, Math.floor(Math.random() * 2)+1));
		}
	}

	if(/dsl|d[eé]sol[eé]|excuse/.test(message.content) && !message.author.bot){
		//message.channel.send("\:goooood:")
		let emo = message.guild.emojis.cache.find(emoji => emoji.name === 'goooood');
		message.react(emo);
	}

	if(message.content == "heure") FuseauHoraire(message);

})

bot.login(process.env.DISCORD_TOKEN);

function RndMssg(tab, nb=1){
	let liste = "";
	if(nb >= tab.length-1) nb = 1;

	for(var i = 0; i < nb; i++){
		let v = Math.floor(Math.random() * tab.length);
		if(i == 0)
			liste += tab[v];
		else
			liste += " "+tab[v];
	}
	
	return liste;
}

function interact(message){
	/*if(message.content == "@garlic" || /(https:\/\/garticphone.com\/fr\/?\?c=([0-9a-zA-Z]*))/.test(message.content)){
		console.log("\x1b[36m GARLIC REQUEST : ", RegExp.$1, " - ", new Date(), "\x1b[0m");
		message.content = message.content.replace("@garlic", "https://garticphone.com/fr");
		message.channel.send("VENEZ JOUER @everyone " + message.content);
		/*for(var i = 0; i < 3; i++){
			message.channel.send("VIENS ENCUL" + "é".repeat(i*i) + "E " + ":middle_finger:".repeat(i*i) + "@here");
		}
		message.channel.send("https://media.giphy.com/media/6qdKZFhT0VBm0/giphy.gif");*/
	//}
}

function RandomGIF(message, reg){
	const tag = ['fail', 'cute', 'dog', 'cat', 'sex', 'pusheen', 'foodporn'];

	if(reg == "")
		reg = tag[Math.floor(Math.random() * tag.length)]

	const giphy = {
		baseURL: "https://api.giphy.com/v1/gifs/random",
		apiKey: process.env.GIPHY_TOKEN,
		tag: reg,
		type: "random",
		rating: "pg-13"
	};
	let texte = "?";
	for(var v in giphy){
		texte += v + "=" + giphy[v] + "&";
	}
	texte = texte.substr(0, texte.length-1);

	fetch(giphy.baseURL+texte)
    .then(res => res.json())
    .then(json => {
    	message.channel.send(json.data.image_original_url);
    });
}

function FuseauHoraire(message){
	let eu;
	let canada;
	let usa;
	let japan;

	eu = new TimeDelta();

	const texteH = new Discord.MessageEmbed()
	.setColor('#42b983')
	.setTitle('Fuseau horaire - International 🌍')
	.setURL('https://www.google.com/search?q=quel+est+mon+fuseau+horaire&oq=quel+est+mon+fuseau+horaire')
	.setAuthor('Robot Pute', 'https://cdn.discordapp.com/avatars/691950683355742218/365205606f66ef6e60003e0b9f98068a.png?size=128', 'https://www.deviantart.com/amongfanart/art/Kobe-Among-US-Tribute-872085860')
	.setThumbnail('https://cdn.discordapp.com/avatars/691950683355742218/365205606f66ef6e60003e0b9f98068a.png?size=128')
	.addFields(
		{ name: ':flag_eu: Europe (+0)', value: eu.Process(0, ''), inline:true },
		{ name: ':flag_ca: Canada (-5)', value: eu.Process(-5, ''), inline:true },
		{ name: '\u200B', value: '\u200B' },
		{ name: ':flag_us: USA West (-8)', value: eu.Process(-8, ''), inline:true },
		{ name: ':flag_jp: Japan/Corée (+9)', value: eu.Process(9, ''), inline:true },
	)
	.setTimestamp();


	message.channel.send(texteH);
}
