/*
* @Jaculine Bot - v.2.0.0
*
*/
// bot discord
const Discord = require('discord.js');
const bot = new Discord.Client();
const fetch = require('node-fetch');

/*
*   
*   Importation des modules/fonctions
*
*/
const prefix = "./functions/";
const files = [
    {name : 'roles', path : 'roleManager/roles.js'},
    {name : 'rolesBis', path : 'roleManager/rolesBis.js'},
    {name : 'interface', path : 'interface/index.js'}
];
const env = {}; // environnement, l'ensemble des modules se trouvent dedans

for(var i in files){
    // importation du module et stockage dans env
    let fullpath = prefix + files[i].path;
    env[files[i].name] = require(fullpath);

    // assignation du client Discord pour enclencher des events
    if(env[files[i].name]['Init'])
        env[files[i].name].Init(bot);
    else
        console.log('Module doesn\'t contain init function : ' + fullpath);
}

bot.once('ready', ()=>{
    console.log('BOT ready');

   /* bot.channels.cache.get(process.env.RolesChannelID).send(role_message);

bot.on('message', message=>{
    console.log(message.content)
    message.react("🌍")
    message.react("🎮")
    message.react("🇯🇵")
    message.react("<:i_see_u:831814038647472178>")
    message.react("<:bah:824377681008263218>")
    message.react("<:mdr:824385529075990538>")
    message.react("<:seal:823952125436493825>")
})*/

    bot.channels.cache.get(process.env.RolesChannelID).messages.fetch({limit: 1}).then((messages)=>{
        //https://stackoverflow.com/questions/60609287/discord-js-get-a-list-of-all-users-sent-messages
        messages.forEach(m=>{
           /* if(/^###/.test(m.content)){
                console.log(m.content);
            }else{*/
                //m.edit(role_message)
           // }
        });
    })
    
});


bot.login(process.env.DISCORD_TOKEN);


var role_message = ":wave:  Bienvenue à tous et à toutes sur le Discord **LA REMONTADA** :slight_smile: \n\nPour **ne pas être spam** dans des canaux qui ne vous intéresse pas, on a créer des salons où seul certains rôles peuvent y avoir accès.\nPour avoir les rôles des canaux qui vous intéressent cliquez sur l'émoji correspondant aux canaux que vous souhaitez :\n\n:arrow_down_small: :arrow_down_small: :arrow_down_small: :arrow_down_small: :arrow_down_small: :arrow_down_small: :arrow_down_small: :arrow_down_small: \n\n`DIVERTISSEMENT`\n> :earth_africa:   :   -- VOYAGE -- (et semestre a l'international) \n> :video_game:   :   -- JEUX --\n> :flag_jp:   :   -- WEE(BS/DS) -- \n\n`COURS & COMPAGNIE`\n> <:i_see_u:831814038647472178>    :   -- TRAVAIL --\n> <:bah:824377681008263218>    :  -- SPE --\n> <:mdr:824385529075990538>    :  -- INGE 1 --\n> <:seal:823952125436493825>    :  -- INGE 2 --\n\n@everyone *(Un mp de confirmation atteste de votre choix, si tel n'est pas le cas, cela veut dire que Manon n'accepte plus de personnes en plus en son sein)*";

setInterval(function(){
    fetch('https://la-remontada.mrsnoobydoo.repl.co')
    .then((rep)=>{return rep.text();})
    .then((text)=>{
        console.log("Actualisation !");
    })
}, Math.floor(Math.random() * 25 * 60 * 1000));