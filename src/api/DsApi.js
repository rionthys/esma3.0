import axios from 'axios';

export default class DsApi {
    static url = 'https://echo-cloud.store/api/ds';

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

    static delete(id) {
        return axios.delete(`${this.url}/${id}`);
    }
}
