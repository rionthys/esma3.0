import axios from 'axios';

export default class ContractsApi  {
    static url = 'https://echo-cloud.store/api/contracts';

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
    
    static getLogs(id) {
        return axios.get(`${this.url}/${id}/logs`);
    }

    static createLogs(id, log) {
        return axios.post(`${this.url}/${id}`, log)
    }

    static updateLog(id, log) {
        return axios.put(`${this.url}/${id}`, log)
    }

    static delete(id) {
        return axios.delete(`${this.url}/${id}`);
    }
}
