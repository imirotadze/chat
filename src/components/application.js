
let socket =new WebSocket('ws://localhost:3001');
let info=
    {name:"" , message:"", to:""}
;

let usersName;
let usersList=[];
function startChat() {
    socket.onmessage = (event) => {
        let recieved = JSON.parse(event.data);
        let toWho =recieved.to;
        const row = document.createElement('span');
        const messageBar = document.createElement('div');
        messageBar.classList.add("messageBar");
        row.innerHTML = recieved.message;
        let from= recieved.from;
        if(recieved.message==""){
            usersName = document.createElement('div');
            usersName.innerText=from;
            usersName.classList.add('user');
            document.getElementById("users-list").appendChild(usersName)
            usersName.addEventListener('click', () => {
                usersName.style.backgroundColor = 'green';
                info.to = usersName.innerText;
            })
        }
        else if (sessionStorage.getItem('name') == from) {
            const sender = document.createElement('div');
            sender.classList.add('sender');
            sender.innerText = from + ":";
            if(toWho!=""){
                sender.innerText=from + "=>"+ toWho;
            }
            messageBar.appendChild(sender);
            messageBar.appendChild(row);
            document.getElementById('chat').appendChild(messageBar);

        } else {
            const reciever = document.createElement('div');
            reciever.classList.add('reciever');
            reciever.innerText = from + ":";
            if(toWho!=""){
                reciever.innerText=from + "=>"+ toWho;
            }
            messageBar.style.backgroundColor = "grey";
            messageBar.style.marginLeft = '20%';
            messageBar.appendChild(reciever);
            messageBar.appendChild(row);
            document.getElementById('chat').appendChild(messageBar);
        }
    };
}

document.getElementById('name').addEventListener("change", (e)=>{
    info["name"]=e.target.value;
    let onlyUser=JSON.stringify(info);
    socket.send(onlyUser);
    sessionStorage.setItem('name', info['name']);
    startChat();
    document.getElementById("name").remove();
    document.getElementById('full-chat').style.display='flex';
})
document.getElementById('message1').addEventListener('change', (event) => {
    info["message"]=event.target.value;
    if (socket.readyState === socket.OPEN) {
        let myJSON = JSON.stringify(info);
        socket.send(myJSON);
        event.target.value = '';
    } else {
        console.log('Socket unavailable');
    }
    event.stopPropagation();
});