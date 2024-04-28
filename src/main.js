import {createApp} from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import VCalendar from 'v-calendar';

import LogoPage from './components/LogoPage.vue';
import ExitUser from './components/ExitUser.vue';
import CategoriesNav from './components/CategoriesNav.vue';
import BasicWrapper from './components/BasicWrapper.vue';
import NavItems from './components/NavItems.vue';
import Toggle from './components/ToggleButton.vue';
import FilterText from './components/FilterText.vue';
import Table from './components/TableBasic.vue';
import Modal from './components/Modal.vue';
import SubModal from './components/SubModal.vue';
import 'v-calendar/dist/style.css';
import "core-js/stable";
import "regenerator-runtime/runtime";

const categories = require('./config/category').categories;
const icons = require('./config/icons').Icons;
const edit = require('./config/edit.config').Edit;

const app = createApp(App);

app.use(VCalendar);

app.config.globalProperties.$http = axios;

app.config.globalProperties.$categories = categories;
app.config.globalProperties.$icons = icons;
app.config.globalProperties.$edit = edit;

app.component('LogoPage', LogoPage)
    .component('ExitUser', ExitUser)
    .component('CategoriesNav', CategoriesNav)
    .component('BasicWrapper', BasicWrapper)
    .component('NavItems', NavItems)
    .component('Toggle', Toggle)
    .component('FilterText', FilterText)
    .component('Modal', Modal)
    .component('SubModal', SubModal)
    .component('Table', Table);

app.use(router);

app.mount('#app');
