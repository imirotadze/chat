import {LitElement, html, css} from 'lit-element';
class appLogin extends LitElement {
    static get properties() {
        return {
            appTitle: {
                type: String,
                reflect: true
            },
            open: {
                type: Boolean,
                reflect: true,
            },
            disabled: {
                type: Boolean,
                reflect: true,
            },
            user: {
                type: String,
            },
            _page: {type: String},
        };
    }

    static get styles() {
        // language=CSS
        return css`
            
        `;
    }

    render() {
        // language=HTML
        return html`
      <input type="text"  id="name" @change=${this._registerUser}/>
    `;
    }
    _registerUser(e){
        this.user=e.target.value;
        sessionStorage.setItem('name', this.user);
        this.redirectTo('/chat');

    }
    redirectTo(route) {

        if (window.location.pathname !== route) {

            window.history.pushState(null, null, route);

            window.dispatchEvent(new PopStateEvent('popstate'));

        }

    }
    constructor() {
        super();
    }
    updated(changedProps) {

    }
}
window.customElements.define('app-login', appLogin);