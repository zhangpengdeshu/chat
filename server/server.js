const net = require('net')
// 创建socket套接字
const clients = {}
let ctx = null
const server = net.createServer()
// 绑定ip和端口
server.on('connection', (socket) => {
    socket.on('data', (chunk) => {
        ctx = socket
        const msg = JSON.parse(chunk.toString().replace(/\r\n/, ''))
        console.log('===>msg', msg)
        dealMsg(msg)
    })

    socket.on('end', () => {
        console.log(`client disconnected.\n\r`)
        socket.destroy()
    })

    socket.on('error', (error) => {
        console.log(error.message)
    })
})

server.on('listening',()=>{
    console.log(`listening on 8086`);
});

server.listen(8086)

function dealMsg (msg) {
    const cmd = msg.cmd
    const funs = {
        'login': login,
        'chat': chat,
        'quit': quit,
        'exit': quit
    }
    if (typeof funs[cmd] !== 'function') return
    funs[cmd](msg)
}

function freeConn (conn) {
    conn.end()
    delete clients[conn.uuid]
}

function login (msg) {
    let uuid = getRndStr()
    ctx.write(`欢迎你，${msg.nick}：这里总共有${Object.keys(clients).length}个小伙伴在聊天.\r\n`)
    ctx.nick = msg.nick;
    ctx.uuid = uuid;
    clients[uuid] = ctx;
    broadcast(`系统：${msg.nick}进入了聊天室.`);
}

function broadcast (msg) {
    Object.keys(clients).forEach((uuid) => {
        if(clients[uuid]!= ctx){
            clients[uuid].write(msg);
        }
    })
}

function quit(nick){
    var message = `小伙伴${nick}退出了聊天室.`;
    broadcast(message);
    freeConn(client);
}

function chat(msg){
    if(msg.msg.toLowerCase()=='quit'||msg.msg.toLowerCase()=='exit'){
        quit(msg.nick);
        return ;
    }
    var message = `${msg.nick}说：${msg.msg}`;
    broadcast(message);
}

function getRndStr(){
    let randStr = Math.random().toString(36).substr(2)
    return randStr
}
