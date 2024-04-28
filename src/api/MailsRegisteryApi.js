import axios from 'axios';

export default class MailsRegisteryApi {
    static url = 'https://echo-cloud.store/api/mails-registery';

    static get() {
        return axios.get(`${this.url}`);
    }

    static getById(id) {
        return axios.get(`${this.url}/${id}`)
    }

    static create(mail) {
        return axios.post(`${this.url}`, mail)
    }

    static createLogs(id, mail) {
        return axios.post(`${this.url}/${id}`, mail)
    }

    static update(id, mail) {
        return axios.put(`${this.url}/${id}`, mail);
    }

    static delete(id) {
        return axios.delete(`${this.url}/${id}`);
    }
}
