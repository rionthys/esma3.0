import axios from 'axios';

export default class ClientsApi {
    static url = 'https://echo-cloud.store/api/clients';

    static get() {
        return axios.get(`${this.url}`);
    }

    static getById(id) {
        return axios.get(`${this.url}/${id}`);
    }

    static create(client) {
        return axios.post(`${this.url}`, client)
    }

    static update(id, client) {
        return axios.put(`${this.url}/${id}`, client);
    }

    static delete(id) {
        return axios.delete(`${this.url}/${id}`);
    }
}
