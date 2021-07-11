class RolesBis
{
    static Init(bot){
        bot.on('messageReactionAdd', async (reaction_orig, user) => {
            // fetch the message if it's not cached
            const message = !reaction_orig.message.author
                ? await reaction_orig.message.fetch()
                : reaction_orig.message;

            if (message.author.id === user.id || message.id != process.env.role_message_react_id) {
                // the reaction is coming from the same user who posted the message
                return;
            }
            
            // the reaction is coming from a different user
            RolesBis.RoleReact(bot, reaction_orig, user, true);
        });

        bot.on('messageReactionRemove', async (reaction_orig, user)=>{
           const message = !reaction_orig.message.author
                ? await reaction_orig.message.fetch()
                : reaction_orig.message;

            if (message.author.id === user.id || message.id != process.env.role_message_react_id) {
                // the reaction is coming from the same user who posted the message
                return;
            }
            
            // the reaction is coming from a different user
            RolesBis.RoleReact(bot, reaction_orig, user, false);
        })
    }

    static RoleReact(bot, reaction, user, isAdd){
        let emo = reaction.emoji.name;
        let userObj = reaction.message.member.guild.member(user.id);
        return RolesBis.Assign(reaction, emo, userObj, isAdd);
    }

    static Assign(reaction, emoji, userObj, isAdd){
        if(!userObj) return;

        const role = {
            "🌍" : process.env.R_voyage,
            "🎮" : process.env.R_jeux,
            "🇯🇵" : process.env.R_weeb,
            "i_see_u" : process.env.R_travail,
            "bah" : process.env.R_spe,
            "mdr" : process.env.R_ing1,
            "seal" : process.env.R_ing2
        };
        /*voyage
        jeux
        weeb
        travail
        spe
        ing1
        ing2*/
        let emoId = role[emoji];
        let roleSelect = reaction.message.member.guild.roles.cache.find(role => role.id === emoId);
        if(role){
            try{
                if(isAdd){
                    userObj.roles.add(roleSelect);
                    userObj.send("> Tu as obtenu le rôle `"+roleSelect.name+"` sur La Remontada, sale fou va 😁");
                }else{
                    userObj.roles.remove(roleSelect);
                    userObj.send("> Tu as retiré le rôle `"+roleSelect.name+"` sur La Remontada 😑, espèce de tepu...");
                }
            }catch(err){
                console.log(err);
            }

        }
         //console.log(userObj.roles.remove)

    }

}

module.exports = RolesBis;