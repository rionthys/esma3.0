import axios from 'axios';

export default class ExchangeApi {
    static exchange;
    static url = 'https://www.cbr-xml-daily.ru/daily_json.js';

    static async get() {
        this.exchange = (await axios.get(`${this.url}`)).data;
        return this.exchange;
    }

    static convertToTenge(amount, currency) {
        const targetCurrency = 'KZT';
        let resultInTenge = 0;

        if (currency === "RUB") {
            const rateTo = this.exchange.Valute[targetCurrency] ? this.exchange.Valute[targetCurrency].Value / this.exchange.Valute[targetCurrency].Nominal : 0;
            resultInTenge = amount / rateTo;
        } else {
            const rateFrom = this.exchange.Valute[currency] ? this.exchange.Valute[currency].Value / this.exchange.Valute[currency].Nominal : 0;
            const rateTo = this.exchange.Valute[targetCurrency] ? this.exchange.Valute[targetCurrency].Value / this.exchange.Valute[targetCurrency].Nominal : 0;

            const resultInRubles = amount * rateFrom;
            resultInTenge = resultInRubles / rateTo;
        }

        return resultInTenge;
    }
}
