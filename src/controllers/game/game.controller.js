import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import {
  User, Game, Tag, TagGame, Changelog
} from '../../models';
import { successResponse, errorResponse, uniqueId } from '../../helpers';
import { newReservationEmailTemplate, gameItemsArray, gameItemTemplate } from '../../templates/email-newResrevation';
// import * as nodemailer from 'nodemailer';
const env = process.env.NODE_ENV || 'development';
import * as c from '../../config/config.js';
const config = c['development'];

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const getGames = async (req, res) => {
  try {
    const games = await Game.findAndCountAll({
      include: Tag,
      where: {
        public: true,
      },
      order: [['name', 'ASC'], ['createdAt', 'DESC']],
    });
    return successResponse(req, res, { games });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getGamesAdmin = async (req, res) => {
  try {
    const games = await Game.findAndCountAll({
      include: Tag,
      order: [['updatedAt', 'DESC'], ['name', 'ASC']],
    });
    return successResponse(req, res, { games });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getGameAdmin = async (req, res) => {
  try {
    const game = await Game.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        Tag, Changelog
      ],
      order: [['createdAt', 'DESC'], ['name', 'ASC']],
    });
    return successResponse(req, res, game );
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const deleteGame = async (req, res) => {
  try {
    await Game.destroy({
      where: {
        id: req.params.id,
      },
      force: true,
    });
    return successResponse(req, res);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const updateGame = async (req, res) => {
  try {

    
    delete req.body['id'];
    delete req.body['createdAt'];
    delete req.body['updatedAt'];
    delete req.body['rating'];
    for (let k in req.body) {
        if (req.body[k] === '') {
            req.body[k] = null;
        }
    }
    const game = await Game.findOne({
      where: {
          id: req.params.id,
      },
    });

    if (game) {
      if (Array.isArray(req.body.tags)) {
        await TagGame.destroy({
          where: {
            GameId: game.id,
          },
          force: true,
        });
        req.body.tags.forEach((tag) => {
          //console.log(tag);
          const tagGame = TagGame.create({
            GameId: game.id,
            TagId: tag.id,
          });
        });
      }
      delete req.body['Tags'];
      delete req.body['tags'];
    }

    await Game.update(
      req.body,
      {
        where: {
          id: req.params.id,
        },
        returning: true,
      },
    );

    if (!req.body.statusNew) req.body.statusNew = null;
    if (!req.body.userName) req.body.userName = null;
    if (!req.body.userEmail) req.body.userEmail = null;
    if (!game.status) game.status = null;
    if (!game.userName) game.userName = null;
    if (!game.userEmail) game.userEmail = null;

    if (
      req.body.status !== game.status ||
      req.body.userName !== game.userName ||
      req.body.userEmail !== game.userEmail ||
      req.body.noteChangelog
    ) { 
      await Changelog.create(
        {
            GameId: req.params.id,
            statusOld: game.status,
            statusNew: req.body['status'] !== null && req.body['status'] !== undefined ?  req.body['status'] : game.status,
            note: `Hra změněna adminem. ${req.body['noteChangelog'] || ''}`,
            userName: req.body['userName'] !== null && req.body['userName'] !== undefined ?  req.body['userName'] : game.userName,
            userEmail: req.body['userEmail'] !== null && req.body['userEmail'] !== undefined ?  req.body['userEmail'] :  game.userEmail,
        },
      );
    }
    return successResponse(req, res);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// function for admin usage (get array of games and update status, users,...)
export const bulkUpdateGames = async (req, res) => {
  try {
      let gameItemsArray = [];
      const ids = req.params.id.split(',');
        for (const gameId of ids) {
        const game = await Game.findOne({
        where: {
            id: gameId,
        },
        });
        if (!game) {
        throw new Error('Game not found!');
        }
        
        await Game.update(
        {
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            status: req.body.status,
        },
        {
            where: {
            id: gameId,
            },
            returning: true,
        },
        );
        await Changelog.create(
        {
            GameId: gameId,
            statusOld: game.status,
            statusNew: req.body.status,
            note: `Stav hry změněn adminem. ${req.body.message}`,
            userName: req.body.userName,
            userEmail: req.body.userEmail,
        },
        );

      }
    return successResponse(req, res);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// function for public usage
export const reserveGame = async (req, res) => {
  try {
      let gameItemsArray = [];
      const ids = req.params.id.split(',');
      let priceTotal = 0;
        for (const gameId of ids) {
        const game = await Game.findOne({
        where: {
            id: gameId,
        },
        });
        if (!game) {
        throw new Error('Game not found!');
        }
        if (game.status !== 1 && game.status !== 5 || !game.public) {
        throw new Error('Game is not available now!');
        }
        if (!req.body.userName || !req.body.userEmail) {
        console.error(req.params.id, req.body);  
        throw new Error('Invalid request');
        }
        await Game.update(
        {
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            status: 3,
        },
        {
            where: {
            id: gameId,
            },
            returning: true,
        },
        );
        await Changelog.create(
        {
            GameId: gameId,
            statusOld: game.status,
            statusNew: 3,
            note: `Hra rezervována uživatelem. ${req.body.message}`,
            userName: req.body.userName,
            userEmail: req.body.userEmail,
        },
        );
    
    // obsolite sending emails using Gooooooogle
    // await sendEmail(req.body.userName, config.emailOptions.to, `nová rezervace - ${game.name}`, `Byl vystaven požadevek na rezrvaci hry ${game.name}`, htmlBody);
    
    
    if (game.price) {
      priceTotal = priceTotal + Math.ceil(game.price * 2 / 100);
    }
    gameItemsArray.push(gameItemTemplate(
      game.image ? game.image : 'https://udkh.cz/static/media/logo.29f0ed59.png', 
      game.sourceLink ? game.sourceLink : '',
      game.name,
      game.note,
      `https://udkh.cz/#/games/${game.id}`,
      game.price ? Math.ceil(game.price * 2 / 100) + ' Kč' : ''
      ));
}
    let htmlPage = newReservationEmailTemplate('Nová rezervace!', '', req.body.userName, req.body.userEmail, req.body.message, gameItemsArray.join(''), `Doporučená výše dobrovolného daru za toto vypůjčení činí ${priceTotal} Kč. Děkujeme :-)`);

    await sendEmailMailjet('pkaspar1@seznam.cz', req.body.userName, config.emailOptions.to, `Nová rezervace`, htmlPage);
    if (emailRegexp.test(req.body.userEmail)) {
      await sendEmailMailjet('pkaspar1@seznam.cz', req.body.userName, req.body.userEmail, `Nová rezervace`, htmlPage);
    }
    return successResponse(req, res);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const createGame = async (req, res) => {
  try {
    const game = await Game.create({
      name: req.body.name,
      status: req.body.status,
      inventoryNumber: req.body.inventoryNumber,
      count: req.body.count,
      lendingCount: req.body.lendingCount,
      language: req.body.language,
      minPlayers: req.body.minPlayers,
      maxPlayers: req.body.maxPlayers,
      age: req.body.age,
      gameTime: req.body.gameTime,
      description: req.body.description,
      sourceLink: req.body.sourceLink,
      image: req.body.image,
      public: req.body.public,
      note: req.body.note,
      description: req.body.description,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      publisher: req.body.publisher,
      extension: req.body.extension,
      price: req.body.price
    });

    if (Array.isArray(req.body.tags)) {
      req.body.tags.forEach((tag) => {
        console.log(tag);
        const tagGame = TagGame.create({
          GameId: game.id,
          TagId: tag.id,
        });
        console.log(tagGame);
      });
    }

    const createdGame = await Game.findOne({
      where: {
        id: game.id,
      },
      include: Tag,
    });
    return successResponse(req, res, { createdGame });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getStatisticsAdmin = async (req, res) => {
  try {
    const games = await Game.findAndCountAll({
      include: [Tag, Changelog],
      order: [['updatedAt', 'DESC'], ['name', 'ASC']],
    });

    let statusCount = [] 
    let borrowedGames = []
    const borrowThreshold = 14; // hodnota pro oddeleni hrisniku od kratkych vypujcek
    let d = new Date();
    d.setDate(d.getDate() - borrowThreshold);

    if (Array.isArray(games.rows)) {
      games.rows.forEach((game) => {
        statusCount[game.status] = !statusCount[game.status] ? 1 : statusCount[game.status]+1;
        if (game.status === 2) {
          const oldBorrow = returnOldBorrow(game);
          if (oldBorrow) {
            borrowedGames.push(oldBorrow);
          }
        }
      });
    }
// TODO: vypujcky delsi nez 2 tydny
    const result = {
      gamesTotalCount: games.rows.length,
      gamesStatusCount: statusCount,
      borrowedGamesThreshold: borrowThreshold,
      borrowedGames: borrowedGames,
    }
    return successResponse(req, res, result);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const returnOldBorrow = (game) => {
  const borrowThreshold = 14; // hodnota pro oddeleni hrisniku od kratkych vypujcek
  let d = new Date();
  d.setDate(d.getDate() - borrowThreshold);
  // pokud je zaznam v changelogu o te vypujcce
  if (game.Changelogs && Array.isArray(game.Changelogs) && game.Changelogs.length > 0) {
    // filtrovani zmeny stavy na status==2
    let allBorrow = game.Changelogs.filter((item) =>
       item.statusNew === 2 && item.statusOld !== item.statusNew
    );

    // pokud se nasly zmeny stavu, vybere se ta nejnovejsi
    if (allBorrow.length) {
      let mostRecentChangelog = allBorrow.reduce((mostRecent, item) =>
         new Date(item.createdAt) > new Date(mostRecent.createdAt)
         ? item
         : mostRecent
      );

    // kontola data nejnovejsi zmeny stavu na status 2
    if (new Date(mostRecentChangelog.createdAt) < d) {
      return {
        id: game.id,
        name: game.name,
        status: game.status,
        borrowedAt: mostRecentChangelog.createdAt,
        userName: game.userName,
        userEmail: game.userEmail,
        note: mostRecentChangelog.note,
      };              
    }

    // pokud neni v changelogu zmena stavu na 2, ale je stav old a new stejny, tak se vybere posledni
    } else {
      let mostRecentChangelog = game.Changelogs.reduce((mostRecent, item) =>
         new Date(item.createdAt) > new Date(mostRecent.createdAt) && item.statusNew === 2
         ? item
         : mostRecent
      );
      return {
        id: game.id,
        name: game.name,
        status: game.status,
        borrowedAt: mostRecentChangelog.createdAt,
        userName: game.userName,
        userEmail: game.userEmail,
        note: mostRecentChangelog.note,
      };
    }

  // muze se stat, ze neni zaznam v changelogu, ale presto ma status 2 a posledni updaty byl pred thresholdem
  } else if (new Date(game.createdAt) < d) {
    return {
      id: game.id,
      name: game.name,
      status: game.status,
      borrowedAt: game.updatedAt,
      userName: game.userName,
      userEmail: game.userEmail,
      note: game.note,
    };
  }
  return null;
}

export const sendEmailCronAdmin = async (req, res) => {
  try {
    const games = await Game.findAndCountAll({
      include: [Tag, Changelog],
      order: [['updatedAt', 'DESC'], ['name', 'ASC']],
    });

    let statusCount = [] 
    let borrowedGames = []

    if (Array.isArray(games.rows)) {
      games.rows.forEach((game) => {
        statusCount[game.status] = !statusCount[game.status] ? 1 : statusCount[game.status]+1;
        if (game.status === 2 && emailRegexp.test(game.userEmail)) {
          const oldBorrow = returnOldBorrow(game);
          if (oldBorrow) {
            borrowedGames.push(oldBorrow);
          }
        }
      });
    }

    let uniqueEmails = borrowedGames.map(item => item.userEmail).filter((value, index, self) => self.indexOf(value) === index);
    //uniqueEmails = ['p.kovar92@gmail.com'];
    uniqueEmails.forEach((uniqueEmail) => {
      const borrowedGamesByEmail = borrowedGames.filter((self) => self.userEmail === uniqueEmail);
      let gameItemsArray = [];
      let priceTotal = 0;
      borrowedGamesByEmail.forEach((game) => {
      if (game.price) {
        priceTotal = priceTotal + Math.ceil(game.price * 2 / 100);
      }
      gameItemsArray.push(gameItemTemplate(
        game.image ? game.image : 'https://udkh.cz/static/media/logo.29f0ed59.png', 
        game.sourceLink ? game.sourceLink : '',
        game.name,
        game.note,
        `https://udkh.cz/#/games/${game.id}`,
        game.price ? Math.ceil(game.price * 2 / 100) + ' Kč' : ''
        ));
      });

    let htmlPage = newReservationEmailTemplate('Výpůjční doba je u konce!', 'Dovolujeme si Vás upozornit, že výpůjční doba her uvedených níže již dosáhla dvoutýdenní lhůty. Prosíme Vás tedy o jejich navrácení v následujících dnech během provozní doby půjčovny. Případně napište na udkh.vscht@gmail.com žádost o prodloužení výpůjční doby (žádosti nemusí být kvůli potřebám ÚDKH vyhověno).', borrowedGamesByEmail[0].userName, borrowedGamesByEmail[0].userEmail, '', gameItemsArray.join(''), `Doporučená výše dobrovolného daru za toto vypůjčení činí ${priceTotal} Kč. Děkujeme :-)`);
      sendEmailMailjet('pkaspar1@seznam.cz', 'ÚDKH', borrowedGamesByEmail[0].userEmail, `Upomínka`, htmlPage);
    });

    return successResponse(req, res, uniqueEmails);
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, error.message);
  }
};


// export const allUsers = async (req, res) => {
//   try {
//     const page = req.params.page || 1;
//     const limit = 2;
//     const users = await User.findAndCountAll({
//       order: [['createdAt', 'DESC'], ['firstName', 'ASC']],
//       offset: (page - 1) * limit,
//       limit,
//     });
//     return successResponse(req, res, { users });
//   } catch (error) {
//     return errorResponse(req, res, error.message);
//   }
// };
//
// export const register = async (req, res) => {
//   try {
//     const {
//       email, password, firstName, lastName,
//     } = req.body;
//     if (process.env.IS_GOOGLE_AUTH_ENABLE === 'true') {
//       if (!req.body.code) {
//         throw new Error('code must be defined');
//       }
//       const { code } = req.body;
//       const customUrl = `${process.env.GOOGLE_CAPTCHA_URL}?secret=${
//         process.env.GOOGLE_CAPTCHA_SECRET_SERVER
//       }&response=${code}`;
//       const response = await axios({
//         method: 'post',
//         url: customUrl,
//         data: {
//           secret: process.env.GOOGLE_CAPTCHA_SECRET_SERVER,
//           response: code,
//         },
//         config: { headers: { 'Content-Type': 'multipart/form-data' } },
//       });
//       if (!(response && response.data && response.data.success === true)) {
//         throw new Error('Google captcha is not valid');
//       }
//     }
//
//     const user = await User.scope('withSecretColumns').findOne({
//       where: { email },
//     });
//     if (user) {
//       throw new Error('User already exists with same email');
//     }
//     const reqPass = crypto
//       .createHash('md5')
//       .update(password)
//       .digest('hex');
//     const payload = {
//       email,
//       firstName,
//       lastName,
//       password: reqPass,
//       isVerified: false,
//       verifyToken: uniqueId(),
//     };
//
//     const newUser = await User.create(payload);
//     return successResponse(req, res, {});
//   } catch (error) {
//     return errorResponse(req, res, error.message);
//   }
// };
//
// export const login = async (req, res) => {
//   try {
//     const user = await User.scope('withSecretColumns').findOne({
//       where: { email: req.body.email },
//     });
//     if (!user) {
//       throw new Error('Incorrect Email Id/Password');
//     }
//     const reqPass = crypto
//       .createHash('md5')
//       .update(req.body.password || '')
//       .digest('hex');
//     if (reqPass !== user.password) {
//       throw new Error('Incorrect Email Id/Password');
//     }
//     const token = jwt.sign(
//       {
//         user: {
//           userId: user.id,
//           email: user.email,
//           createdAt: new Date(),
//         },
//       },
//       process.env.SECRET,
//     );
//     delete user.dataValues.password;
//     return successResponse(req, res, { user, token });
//   } catch (error) {
//     return errorResponse(req, res, error.message);
//   }
// };
//
// export const profile = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const user = await User.findOne({ where: { id: userId } });
//     return successResponse(req, res, { user });
//   } catch (error) {
//     return errorResponse(req, res, error.message);
//   }
// };
//
// export const changePassword = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const user = await User.scope('withSecretColumns').findOne({
//       where: { id: userId },
//     });
//
//     const reqPass = crypto
//       .createHash('md5')
//       .update(req.body.oldPassword)
//       .digest('hex');
//     if (reqPass !== user.password) {
//       throw new Error('Old password is incorrect');
//     }
//
//     const newPass = crypto
//       .createHash('md5')
//       .update(req.body.newPassword)
//       .digest('hex');
//
//     await User.update({ password: newPass }, { where: { id: user.id } });
//     return successResponse(req, res, {});
//   } catch (error) {
//     return errorResponse(req, res, error.message);
//   }
// };

// obsolite sending emails using Gooooooogle
/*
export const sendEmail = async (from, to, subject, message, htmlBody) => {
  console.log(config.emailOptions.user);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailOptions.user,
      pass: config.emailOptions.pass
    }
  });

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: message,
    html: htmlBody
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email send!`);
    }
  })
}
*/
export const sendEmailMailjet = async (fromEmail, fromName, toEmail, subject, htmlBody) => {
  const mailjet = require ('node-mailjet')
  .connect('0400db937b8809b126932f1afc5620a3', '44d069825c14441636611927ce3c42fc')
  const request = mailjet
  .post("send", {'version': 'v3.1'})
  .request({
    "Messages":[
      {
        "From": {
          "Email": fromEmail,
          "Name": fromName
        },
        "To": [
          {
            "Email": toEmail,
            "Name": toEmail
          }
        ],
        "Subject": subject,
        "HTMLPart": htmlBody,
        "CustomID": "AppGettingStartedTest"
      }
    ]
  })
  request
    .then((result) => {
      console.log(result.body)
    })
    .catch((err) => {
      console.log(err.statusCode)
  })
}

export const getStatusName = (statusNumber) => {
  switch (statusNumber) {
       case 1:
         return 'dostupne';
       case 2:
         return 'vypujceno';
       case 3:
         return 'rezervovano';
       case 4:
         return 'ztraceno';
       case 5:
         return 'naDotaz';
       default:
         return 'dostupne';
     }
}
