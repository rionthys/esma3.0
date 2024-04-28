import axios from 'axios';

export default class AccountsApi {
    static url = 'https://echo-cloud.store/api/accounts';

    static get() {
        return axios.get(`${this.url}`);
    }

    static getById(id) {
        return axios.get(`${this.url}/${id}`);
    }

    static create(affair) {
        return axios.post(`${this.url}`, affair)
    }

    static update(id, affair) {
        return axios.put(`${this.url}/${id}`, affair);
    }

    static close(id) {
        return axios.put(`${this.url}/${id}/close`);
    }

    static delete(id) {
        return axios.delete(`${this.url}/${id}`);
    }
}
