require("dotenv").config()
const D = require("discord.js")
const config = require("./config.json")
const client = new D.Client()
const prefix = process.env.PREFIX || config.prefix
const mineflayer = require('mineflayer');

client.on("ready", ()=>{
    console.log("bot ready")
})
client.on("message", async (msg) => {
    if (!msg.content.startsWith(prefix)) return;
    const args = msg.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()
    if (command === "join") {
        if (!args || args.length <= 2){
             return msg.reply(`Use this command like \`${prefix}join IP Version Nickname(0-20)\``);
        }
        makebot(args[0], args[1], args[2],msg)
    }else if(command === "ping"){
        msg.reply("pong")
    }else if(command === "leave" || command === "logoff"){
        logout(msg)
    }else if(command === "sudo"){
        sudo(args.join(" "),msg)
    }
})

let botatt = []
let bot
let botexist = false
function makebot(ip, ver, nick,msg) {
    if(botexist === true) return msg.channel.send("Bot is already running")
    const chatbot = 0
    const bots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    bot = mineflayer.createBot({
        host: ip,
        version: ver,
        username: `${nick}${chatbot}`
    })
    
    bots.forEach(i => {
        let bottopush = mineflayer.createBot({
            host: ip,
            version: ver,
            username: `${nick}${i}`
        })
        botatt.push(bottopush)
        bottopush.on('login', async () => {
            msg.channel.send(`${bottopush.username} Has Logged into ${ip}`)
        })
        bottopush.on("kicked",(reason,menu)=>{
            if(menu === false){
                msg.channel.send(`${bottopush.username} Failed to login Cause ${reason.substr(0,900)}`)
            }else{
                msg.channel.send(`${bottopush.username} Has been kicked Cause ${reason.substr(0,900)} `)
            }
        })
    })
    bot.on('login', async () => {
        msg.channel.send(`${bot.username} Has Logged into ${ip}`)
    })
    bot.on("kicked",(reason,menu)=>{
        if(menu === false){
            msg.channel.send(`${bot.username} Failed to login Cause ${reason.substr(0,900)}\n no retry`)
        }else{
            msg.channel.send(`${bot.username} Has been kicked Cause ${reason.substr(0,900)} `)
        }
    })
    bot.on("message",(message)=>{
        msg.channel.send(`Server Chat From Bot0 => \`${message}\``)
    })

    botexist = true
}

function logout(msg){
    if(botexist !== true) return msg.channel.send("you didnt even have the bot running dumbhead")
    botatt.forEach(bot =>{
        let username = bot.username
        bot.end()
        bot.on("end", ()=>{
          msg.channel.send(`${username} Sucessfully Leaved`)
        })
    })
    let username = bot.username
    bot.end()
    bot.on("end",()=>{
        msg.channel.send(`${username} Sucessfully Leaved`)
    })

    botatt = []
    bot = null
    botexist = false
}
function sudo(tosend,msg){
    if(botexist !== true) return msg.channel.send("No Bot Exist")
    botatt.forEach(bot=>{
        bot.chat(tosend)
        msg.channel.send(`${bot.username} Just Say \`${tosend}\``)
    })
    bot.chat(tosend)
    msg.channel.send(`${bot.username} Just Say \`${tosend}\``)
}
client.login(process.env.TOKEN || config.token)