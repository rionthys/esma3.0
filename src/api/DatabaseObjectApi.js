import axios from 'axios';

export default class DatabaseObjectApi  {
    static url = 'https://echo-cloud.store/api/database';

    static get() {
        return axios.get(`${this.url}`);
    }

    static getById(id) {
        return axios.get(`${this.url}/${id}`);
    }

    static addAffairs(id, affair) {
        return axios.put(`${this.url}/${id}/affairs`, affair);
    }

    static create(object) {
        return axios.post(`${this.url}`, object)
    }

    static update(id, object) {
        return axios.put(`${this.url}/${id}`, object);
    }

    static delete(id) {
        return axios.delete(`${this.url}/${id}`);
    }
}
