class Roles
{
    static Init(bot){
        Roles.bot = bot;
        Roles.channelID = process.env.RolesChannelID;
        Roles.messageID; // l'id du message contenant l'information

        /*
        * Bot Event assignation
        */
        bot.on('message', msg => {
            // si le message ne provient pas du bot, on supprime
            if(msg.author.id != process.env.BOT_ID && msg.channel.id == process.env.RolesChannelID)
                msg.delete();
            
            // on analyse pas les messages du bot, mais uniquement ceux des usagers pour apporter les modifs
            if(msg.author.bot)
                return;

            let BebeAdmin = msg.member.roles.cache.some(role=>role.id === process.env.BebeAdminID);

            if(/\.roles?$/i.test(msg.content) /* && BebeAdmin */){
                msg.channel.send(
                    "> `.role message` : pour récupérer le message sous forme markdown (pour copier coller)\n"
                    +"> `.role reinit` : pour réinitialiser les réactions emojis au message de rôles\n"
                    +"> `.role edit` : pour modifier le message des rôles"
                    );
            }

            if(/^\.role message$/i.test(msg.content) /* && BebeAdmin */)
                Roles.onRequestMessage((m)=>{
                    msg.channel.send("```" + m + "```");
                    msg.react("👍");
                });

            if(/^\.role edit(.+)$/ig.test(msg.content)){
                if(RegExp.$1)
                    Roles.onEditMessage(RegExp.$1);
            }

        });
    }

    /*
    *  Renvoie des messages sous leurs forme Objet présent dans le salon rôle dédié
    */
    static getRolesMessage(callback, onlyRoleMessage=false){
        Roles.bot.channels.cache.get(process.env.RolesChannelID).messages.fetch({limit: 1}).then(messages=>{
            messages.forEach(m=>{
                if(onlyRoleMessage && /^###/.test(m.content))
                    callback(m)
                else if(!onlyRoleMessage)
                    callback(m);
            });
        });
    }

    /*
    * Demande d'édition du message des choix de rôles
    * https://stackoverflow.com/questions/60609287/discord-js-get-a-list-of-all-users-sent-messages
    */
    static onEditMessage(text){
        // on recherche le message est on le modifie
        Roles.getRolesMessage((msg_role)=>{
            msg_role.edit(text);
        }, true);
    }

    /*
    * On renvoie les message des roles sous sa forme Markdown, pour copier coller facilement
    *
    */
    static onRequestMessage(callback){
        Roles.getRolesMessage((msg_role)=>{
            //console.log(msg_role.content);
            callback(msg_role.content);
        }, true);
    }

}

module.exports = Roles;