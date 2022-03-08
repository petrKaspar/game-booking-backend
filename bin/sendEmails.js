const axios = require("axios");
console.log(new Date()); // Helps in checking the proper working
axios({
        method: 'get',
        url: `${process.env.REACT_APP_GAME_BACKEND}/api/admin/cronSendEmails`,
        headers: { 
          'Content-Type': 'application/json',
          'x-token': process.env.REACT_APP_JWT_TOKEN
        },
      }).then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });