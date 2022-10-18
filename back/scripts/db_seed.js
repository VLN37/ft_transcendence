const axios = require('axios').default;

axios.get('http://localhost:3000/users/generate/' + 20).catch(() => {});
