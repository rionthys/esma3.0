import axios from 'axios';

export default class UsersApi {
    static url = 'https://echo-cloud.store/api/users';
    static isAuth = false;
    static id = 0;
    static name = '';
    static rights = {};

    static get() {
        return axios.get(`${this.url}`);
    }

    static auth(data) {
        return axios.post(`${this.url}/authentication/`, data);
    }

    static registration(object) {
        return axios.post(`${this.url}/registration`, object)
    }

    static setRights(id, object) {
        return axios.post(`${this.url}/rights/${id}`, object)
    }

    static delete(id) {
        return axios.delete(`${this.url}/${id}`)
    }
}
