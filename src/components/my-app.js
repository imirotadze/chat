
import {Router} from '@vaadin/router';
import './app-message-box'
import './app-login.js'
const router = new Router(document.getElementById('outlet'), {
  baseUrl: '/'
});
router.setRoutes([
  {path:'/', redirect:'/login'},
  {path: '/chat', component: 'app-message-box'},
  {path: '/login', component: 'app-login'},
]);


