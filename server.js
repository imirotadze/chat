const WebSocket = require('ws');
const MongoClient=require('mongodb').MongoClient;

mongoUrl= 'mongodb://127.0.0.1:27017/chat';
let clientsList=[];
let allSocket=[];
MongoClient.connect(mongoUrl, {
    poolSize:20,
    userNewUrlParser:true,
}, (error, client) =>{
    if(error) return console.log(error);
    db=client.db('chat');
    db.createCollection('users', function(err, res) {
        if (err) throw err;
        // client.close();
    });
    db.createCollection('messages', function(err, res) {
        if (err) throw err;
        // client.close();
    });

    let userCollection=db.collection('users');
    let messageCollection =db.collection('messages');
    const ws = new WebSocket.Server({
        port: 3001
    });
    ws.on('connection', (socket) => {
        socket.on('pong', ()=>{
            clientsList.map((target)=>{
                if(target.socket ===socket){
                    target.connected=true;
                }
            })
        })
        socket.on('message', (message) => {
            let clientInfo = JSON.parse(message);
            let messageForSend = clientInfo.messages;
            let clientName = clientInfo.from;
            let toWho = clientInfo.to;
            let type = clientInfo.type;
            if(type !='user'){
                messageCollection.insertOne(clientInfo);
            }
            let send = JSON.stringify(clientInfo);
            if (type ==='user') {
                allSocket.push(socket);
                let clientsSocket={
                    connected:true,
                    name: clientName,
                    socket: socket
                };
                clientsList.push(clientsSocket);
                messageCollection.find({}).toArray(function(err, result) {
                    if (result !== null) {
                        result.map((messages)=>{
                        if (messages.from === clientName || messages.to === clientName || messages.to == '') {
                            socket.send(JSON.stringify(messages));
                        }
                    });
                    };
                });
                for (let i = 0; i < clientsList.length; i++) {
                    let obj = clientsList[i];
                    if (obj.name!=clientName) {
                        obj.socket.send(send);
                        let oldUser={from:obj.name,type:'user', message:""};
                        socket.send(JSON.stringify(oldUser));
                    }
                }

            }
            else if (toWho == "") {
                for(let i=0; i<allSocket.length; i++) {
                    allSocket[i].send(send);
                }
            }
            else {
                for(let i=0; i<clientsList.length; i++){
                    let reciever = clientsList[i];
                    if(reciever.name==toWho){
                        reciever.socket.send(send);
                        socket.send(send);
                    }
                }
            }
        });
    });
} )
setInterval(()=>{
    clientsList.map((target) => {
        let socket=target.socket;
        let targetName= target.name;
        if(target.connected && socket.readyState=== socket.OPEN){
                target.connected = false;
                socket.ping();
        }
        else{
            console.log(typeof(targetName));
            clientsList = clientsList.filter(cl => cl!==target);
            allSocket = allSocket.filter(sc => sc!=socket);

            let removeCommand ={
                user: targetName,
                type:'removeUser',
            };
            allSocket.map((client)=> {
                if (client !== socket) {
                    client.send(JSON.stringify(removeCommand));
                }
            })
        }
    })
}, 10000);