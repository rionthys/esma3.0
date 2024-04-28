import axios from 'axios';

export default class DeadlinesApi  {
    static url = 'https://echo-cloud.store/api/deadlines';

    static get() {
        return axios.get(`${this.url}`);
    }
}
