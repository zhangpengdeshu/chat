const net = require('net')
const cin = process.stdin
const cout = process.stdout
let ctx = null
let nick = ''
cout.write(`请输入昵称：`)
cin.on('data', (chunk) => {
    console.log('===>chunk', chunk.toString())
    if (chunk.toString()!== '\r\n') {
        if (ctx === null) {
            nick = chunk.toString().replace(/[\r\n]/, '')
            createClient()
        } else {
            let input = chunk.toString().replace(/\r\n/, '')
            ctx.write(JSON.stringify({
                cmd: 'chat',
                msg: input,
                nick: nick
            }));
            if (input.toLocaleLowerCase() === 'quit' || input.toLocaleLowerCase() === 'exit') {
                ctx.end()
                cin.end()
                return
            }
            cout.write(`你说：${input}\r\n`)
        }
    } else {
        cout.write(`请输入昵称：`)
    }
});

function createClient () {
    console.log('\033[2J');
    cout.write(`输入'EXIT OR QUIT'退出聊天室.\r\n`);
    ctx = new net.Socket()
    ctx.connect({
        port: 8086
    })
    watch(ctx)
}

function watch (client) {
    client.on('connect', () => {
        cout.write(`已连接到服务器\r\n`)
        client.write(JSON.stringify({
            cmd: 'login',
            msg: 'hello server',
            nick: nick
        }))
    });

    client.on('data', (chunk) => {
        if (chunk.toString() === '::') {
            client.write(JSON.stringify({
                cmd: 'keep',
                msg: '',
                nick: nick
            }))
            return;
        }
        console.log('===>client', chunk.toString())
        cout.write(`${chunk}\n\r`);
    });

    client.on('end', () => {
        cout.write(`与服务器断开链接.\r\n`)
    });

    client.on('error', (error) => {
        cout.write(`error.\r\n${error}`)
    })

}
