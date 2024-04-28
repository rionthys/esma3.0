import axios from 'axios';

export default class DatabaseObjectApi {
    static url = 'https://echo-cloud.store/api/users';

    static auth(data) {
        return axios.get(`${this.url}/auth`, data);
    }

    static registration(object) {
        return axios.post(`${this.url}/register`, object)
    }

    static role(id) {
        return axios.get(`${this.url}/role/${id}`)
    }
}
