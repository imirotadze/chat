import {LitElement, html, css} from 'lit-element';
 class singleMessage extends LitElement {
     static get properties() {
         return {
             left: {
                 type: Boolean,
                 reflect: true,
             },
             right: {
                 type: Boolean,
                 reflect: true,
             },
             message: {
                 type: Object,
                 observer: '_messageChanged',

             }
         };
     };

     static get styles() {
         //language=CSS
         return css`
             :host {
                 display: flex;
                 flex-direction: column;

             }

             :host([right]) {
                 align-items: flex-end;
             }

             :host([right]) div {
                 margin-bottom: 5px;
                 width:70%;
                 min-height: 20px;
                 background-color:grey;
                 border-radius: 15px;
                 color:white;
                 min-height:20px;
             }
             :host([left]) {
                 align-items: flex-start;
             }

             :host([left]) div {
                 margin-bottom: 5px;
                 width:70%;
                 min-height: 30px;
                 border-radius: 15px;
                 color:white;
                 background-color: green;
             }
         `
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
             if(this.message.messages!=''){
             return html`<div>${this.message.from} : ${this.message.to} <div>${this.message.messages}</div></div>`;
         }
     }
     constructor() {
         super();
          this.message={
              from:'',
              to:'',
              messages:'',
          }
     }
     _messageChanged(event) {

         if (this.message.from === sessionStorage.getItem('name')) {
             this.left = true;
         } else {
             this.right = true;
         }
     }
};
window.customElements.define('single-message', singleMessage);