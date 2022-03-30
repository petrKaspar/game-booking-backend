const axios = require("axios");
console.log(new Date()); // Helps in checking the proper working

if (new Date().getDay() === 3) {
axios({
        method: 'get',
        url: `${process.env.REACT_APP_GAME_BACKEND}/api/admin/cronSendEmails`,
        headers: { 
          'Content-Type': 'application/json',
          'x-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiZGV2QWRtaW5AZW1haWwuY3oiLCJuYW1lIjoiYWRtaW5pc3RyYXRvciJ9fQ.4cK-HYQJHvTiA8u1ciGw9rIeodpCizAjQz1P3gQZI-I'
        },
      }).then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
}