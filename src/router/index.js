import UsersApi from "@/api/UsersApi";
import AffairsContractsPage from "@/Pages/AffairsContractsPage.vue";
import AffairsDetailsPage from '@/Pages/AffairsDetailsPage.vue'
import AffairsDocumentsPage from "@/Pages/AffairsDocumentsPage.vue";
import AffairsObjectPage from "@/Pages/AffairsObjectPage.vue";
import AffairsPage from '@/Pages/AffairsPage.vue'

import AuthPage from '@/Pages/AuthPage.vue'
import CategoryPage from '@/Pages/CategoryPage.vue'
import ContractsDetailsPage from "@/Pages/ContractsDetailsPage.vue";
import ContractsPage from '@/Pages/ContractsPage.vue'
import EditPage from "@/Pages/EditPage.vue";
import DatabasePage from '@/Pages/DatabasePage.vue'
import DeadlinesPage from '@/Pages/DeadlinesPage.vue'
import DocumentsDetailsPage from "@/Pages/DocumentsDetailsPage.vue";
import DocumentsPage from '@/Pages/DocumentsPage.vue'
import MailPage from "@/Pages/MailPage.vue";
import MailRegistryPage from "@/Pages/MailRegistryPage.vue";
import ManagerRights from '@/Pages/ManagerRights.vue';
import RegistrationPage from "@/Pages/RegistrationPage.vue";
import {createRouter, createWebHashHistory} from 'vue-router'
import AccountsPage from "@/Pages/AccountsPage.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'auth-page',
            component: AuthPage,
        },
        {
            path: '/register/',
            name: 'registration-page',
            component: RegistrationPage,
        },
        {
            path: '/rights-manager/',
            name: 'rights-manager',
            component: ManagerRights,
        },
        {
            path: '/category/',
            name: 'category-page',
            component: CategoryPage,
            meta: {requiresAuth: true}
        },
        {
            path: '/database/',
            name: 'database-page',
            component: DatabasePage,
            meta: {requiresAuth: true, rightsKey: 'database'}
        },
        {
            path: '/edit/:type/:id',
            name: 'edit-details',
            component: EditPage,
        },
        {
            path: '/affairs',
            name: 'affairs-page',
            component: AffairsPage,
            meta: {requiresAuth: true, rightsKey: 'affairs'}
        },
        {
            path: '/affairs/details/:id',
            name: 'affairs-details',
            component: AffairsDetailsPage,
            meta: {requiresAuth: true, rightsKey: 'affairs'}
        },
        {
            path: '/affairs/object/:id',
            name: 'affairs-object',
            component: AffairsObjectPage,
            meta: {requiresAuth: true, rightsKey: 'affairs'}
        },
        {
            path: '/affairs/contracts/:id',
            name: 'affairs-contract',
            component: AffairsContractsPage,
            meta: {requiresAuth: true, rightsKey: 'affairs'}
        },
        {
            path: '/affairs/documents/:id',
            name: 'affairs-document',
            component: AffairsDocumentsPage,
            meta: {requiresAuth: true, rightsKey: 'affairs'}
        },
        {
            path: '/mails-registry/',
            name: 'mail-registry',
            component: MailRegistryPage,
            meta: {requiresAuth: true, rightsKey: 'mailsRegistery'}
        },
        {
            path: '/mail/',
            name: 'mail-page',
            component: MailPage,
            meta: {requiresAuth: true, rightsKey: 'mail'}
        },
        {
            path: '/deadlines/',
            name: 'deadlines-page',
            component: DeadlinesPage,
            meta: {requiresAuth: true, rightsKey: 'deadlines'}
        },
        {
            path: '/contracts/',
            name: 'contracts-page',
            component: ContractsPage,
            meta: {requiresAuth: true, rightsKey: 'contracts'}
        },
        {
            path: '/contracts/details/:id',
            name: 'contracts-details',
            component: ContractsDetailsPage,
            meta: {requiresAuth: true, rightsKey: 'contracts'}
        },
        {
            path: '/documents/',
            name: 'documents-page',
            component: DocumentsPage,
            meta: {requiresAuth: true, rightsKey: 'documents'}
        },
        {
            path: '/documents/details/:id',
            name: 'documents-details',
            component: DocumentsDetailsPage,
            meta: {requiresAuth: true, rightsKey: 'documents'}
        },
        {
            path: '/accounts/',
            name: 'accounts-page',
            component: AccountsPage,
            meta: {requiresAuth: true, rightsKey: 'accounts'}
        },
        {
            path: '/:catchAll(.*)',
            redirect: '/',
        },
    ],
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const rightsKey = to.matched.some(record => record.meta.rightsKey) ? to.matched.find(record => record.meta.rightsKey).meta.rightsKey : null;

    if (requiresAuth && !UsersApi.isAuth) {
        next('/');
    }

    if (requiresAuth && rightsKey && !UsersApi.rights[rightsKey]) {
        next('/category');
        return;
    }

    next()

});

export default router
