import axios from 'axios';
import UsersApi from "@/api/UsersApi";

export default class AffairsApi {
    static url = 'https://echo-cloud.store/api/affairs';

    static get() {
        return axios.get(`${this.url}`);
    }

    static getById(id) {
        return axios.get(`${this.url}/${id}`);
    }

    static getByObjectId(id) {
        return axios.get(`${this.url}/object/${id}`);
    }

    static getByContractId(id) {
        return axios.get(`${this.url}/contract/${id}`);
    }

    static getByDocumentId(id) {
        return axios.get(`${this.url}/document/${id}`);
    }

    static create(affair) {
        return axios.post(`${this.url}`, {...affair, user: UsersApi.id})
    }

    static update(id, affair) {
        return axios.put(`${this.url}/${id}`, {...affair, user: UsersApi.id});
    }

    static close(id, affair) {
        return axios.put(`${this.url}/${id}/close`, {...affair, user: UsersApi.id});
    }

    static getLogs(id) {
        return axios.get(`${this.url}/${id}/logs`);
    }

    static createLogs(id, log) {
        return axios.post(`${this.url}/${id}`, {...log, responsible: UsersApi.id})
    }

    static updateLog(id, log) {
        return axios.put(`${this.url}/${id}`, {...log, responsible: UsersApi.id})
    }

    static delete(id) {
        return axios.delete(`${this.url}/${id}`);
    }
}
