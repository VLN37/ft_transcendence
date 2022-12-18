const axios = require('axios').default;

axios.get('http://localhost:3000/users/generate/' + 20).catch(() => {});
axios.get('http://localhost:3000/channels/generate/' + 20).catch(() => {});
axios.get('http://localhost:3000/matches/generate/10').catch(() => {});
