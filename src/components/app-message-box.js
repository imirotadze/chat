import {LitElement, html, css} from 'lit-element';
import './single-message';
import './app-login';
class AppMessageBox extends LitElement {
    static get properties() {
        return {
            info:{
                type: Object,
                reflect:true,
            },
            usersList:{
                type:Array,
            },
            user:{
              type: Object,
                observer: '_register',
            },
            userChosen:{
                type:Object,
            },
            messageForSend:{
              type:Object,
            },
            messages:{
              type:Array,
            },
            message: {
                type: Object,
            },
            status:{
                type: String,
            },
        };
    }

    static get styles() {
        // language=CSS
        return css`
            .container{
                display:flex;
                width:960px;
            }
            .chat-window{
                margin:10px;
                width: 70%;
                height: 600px;
                background-color: rgb(79 82 136);
                border-radius: 20px;
            }
            #users{
                width:300px;
            }
            #users-list{
                height: 100%;
                width:100%;
                overflow-y: auto;
            }
            .user{
                padding-top:5px;
                margin:5px;
                display:block;
                background-color: gray;
                border-radius: 15px;
                padding: 10px;
                cursor:pointer;
            }
            .chat-head{
                height:20%;
                width: 100%;
                display:flex;
                justify-content: space-between;
            }
            .chat-icon{
                width: 70px;
                height: 70px;
                box-sizing: border-box;
                margin:10px;
                border-radius: 50%;
                background-color: white;
            }
            .chat-name{
                margin: auto;
                font-family: Georgia;
                font-size: 20px;
            }
            #chat{
                margin-top: 5px;
                height:60%;
                width:100%;
                overflow-y: auto;
            }
            .message-graph{
                width:100%;
                height: 15%;
                display: flex;
            }
            #message1{
                width:90%;
                height:90%;
                border-radius: 15px;
                color:white;
                margin:10px;
                background-color: rgba(0, 0, 0, 0.5);
            }
            .sender{
                width:auto;
                height:20px;
                color:white;
                font-weight: bold;
            }
            .reciever{
                width:auto;
                heigh:20px;
                color:white;
                font-weight: bold;
                margin-right: 10px;
            }
            .messageBar{
                margin-bottom: 5px;
                padding:10px;
                width:70%;
                background-color:green;
                border-radius: 15px;
            }
            #name{
                margin:auto;
            }
            @media only screen and (max-width: 960px){
                .container{
                    width: 100%;
                }
            }
            @media only screen and (max-width: 560px){
                #users{
                    width:25px;
                }
                .user{
                    border-radius: 0;
                    overflow:hidden ;
                }
                #users :hover {
                    border-radius: 0;
                    width:120px;
                }
            }
        `;
    }

    update(props) { // handle property change
        const properties = this.constructor.properties;
        props.forEach((oldValue, name) => {
            if (this[properties[name].observer]) {
                this[properties[name].observer].apply(this, [this[name], oldValue]);
            }
        });
        super.update(props);
    }
    render() {
        // language=HTML
        if(this.user){
            return html`
            <div class="container">
                <div id="users" class="chat-window">
                    <div id="users-list">
                    <h2>${this.usersList.length} users online</h2>
                        ${this.usersList.map(i =>html`<div class="user" @click="${this._userChose}">${i}</div>`)}
                    </div>
                </div>
                <div id = \'chat-window\' class="chat-window">
                    <div class="chat-head">
                        <div class="chat-icon"></div>
                        <div class="chat-name">You are ${this.status} as ${this.user}</div>
                    </div>
                    <div id="chat">
                        ${this.messages.map(i => html`<single-message .message='${i}'></single-message>`)}
                    </div>
                    <div class="message-graph">
                        <input id="message1" type="text" name="message" placeholder="Message" @change=${this._getMessage}>
                    </div>
                </div>
            </div>`;
    }}

    constructor() {
        super();
        this.socket = new WebSocket('ws://localhost:3001');
        this.message={
            type:'',
            from:'',
            to:'',
            messages:'',
        }
        this.usersList=[];
        this.messages=[];
        this.socket.onopen = ()=> {
            this.status= "connected"
            this.user = sessionStorage.getItem('name');
        }
        this.socket.onclose =() =>{
            this.status="disconnected"
        }
        this.socket.onmessage=(e)=>{
            this.messageForSend=JSON.parse(e.data);
            if(this.messageForSend.type==='message') {
                this.messages.push(this.messageForSend);
            }
            else if(this.messageForSend.type==='user'){
                this.usersList.push(this.messageForSend.from);
            }
            else if(this.messageForSend.type ==='removeUser'){
                this.usersList= this.usersList.filter(user => user!== this.messageForSend.user);
            }
        }
    }
    _userChose(event){
        let userTo=event.target.innerText;
        if(this.message.to==='') {
            this.message.to = userTo;
            event.target.style.backgroundColor='green';
            this.userChosen=event.target;
        }
        else if(this.message.to===userTo){
            this.message.to='';
            event.target.style.backgroundColor='grey';
        }
        else{
            this.userChosen.style.backgroundColor='grey';
            this.userChosen=event.target;
            this.message.to=userTo;
            event.target.style.backgroundColor='green';
        }
}
    _getMessage(event){
        this.message.type='message';
        this.message['messages'] = event.target.value;
        event.target.value='';
        if(this.socket.readyState === this.socket.OPEN){
            this.socket.send(JSON.stringify(this.message));
        }
        else console.log('Socket unavailable');
         event.stopPropagation();
    }
    _register(){
        this.message['from']=this.user;
        this.message.type='user';
        let onlyUser=JSON.stringify(this.message);
        this.socket.send(onlyUser);

    }

}

window.customElements.define('app-message-box', AppMessageBox);
