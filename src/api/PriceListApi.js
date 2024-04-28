import axios from 'axios';

export default class AffairsApi {
    static url = 'https://echo-cloud.store/api/price-list';

    static get() {
        return axios.get(`${this.url}`);
    }

    static update(id, affair) {
        return axios.put(`${this.url}/${id}`, affair);
    }

    static delete(id) {
        return axios.delete(`${this.url}/${id}`);
    }
}
