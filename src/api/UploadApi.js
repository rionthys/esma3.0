import axios from 'axios';

export default class UploadApi {
    static url = 'https://echo-cloud.store/api/upload';

    static upload(file) {
        const formData = new FormData();
        formData.append('file', file);
        const newFileName = `${new Date().getTime()}${file.name}`;
        formData.append('filename', newFileName);
        return axios.post(`${this.url}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    }

    static uploadExcel(fileName) {
        return axios.post(`${this.url}/price-list`, fileName)
    }
}
