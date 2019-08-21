
import axios from 'axios';

class Api {
  constructor(baseUrl) {
    this.axios = axios.create({ baseURL: baseUrl, headers: {'Accept': 'application/json'}})
  }

  getPendingCallsList() {
    return this.axios.get('support/rooms/active')
      .then(response => response.data.rooms);
  }
}

const api = new Api('https://private-1363b0-hellopackageapi.apiary-mock.com/v1');
export default api;
