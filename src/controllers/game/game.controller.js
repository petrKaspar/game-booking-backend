import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import {
  User, Game, Tag, TagGame, Changelog
} from '../../models';
import { successResponse, errorResponse, uniqueId } from '../../helpers';
import * as nodemailer from 'nodemailer';
const env = process.env.NODE_ENV || 'development';
import * as c from '../../config/config.js';
const config = c['development'];


export const getGames = async (req, res) => {
  try {
    const games = await Game.findAndCountAll({
      include: Tag,
      where: {
        public: true,
      },
      order: [['createdAt', 'DESC'], ['name', 'ASC']],
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
      order: [['createdAt', 'DESC'], ['name', 'ASC']],
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
    delete req.body['Tags'];
    delete req.body['createdAt'];
    delete req.body['updatedAt'];
    delete req.body['rating'];
    delete req.body['tags'];
    for (let k in req.body) {
        if (req.body[k] === '') {
            req.body[k] = null;
        }
    }
    console.log(req.body);
    await Game.update(
      req.body,
      {
        where: {
          id: req.params.id,
        },
        returning: true,
      },
    );
    return successResponse(req, res);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// function for public usage
export const reserveGame = async (req, res) => {
  try {
    const game = await Game.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!game) {
      throw new Error('Game not found!');
    }
    if (game.status !== 1 || !game.public) {
      throw new Error('Game is not available now!');
    }
    if (!req.body.userName || !req.body.userEmail) {
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
          id: req.params.id,
        },
        returning: true,
      },
    );
    await Changelog.create(
      {
        GameId: req.params.id,
        statusNew: 3,
        note: `Hra rezervována uživatelem. ${req.body.message}`,
        userName: req.body.userName,
        userEmail: req.body.userEmail,
      },
    );
    const htmlBody = `<body><h2>Nová rezervace hry: ${game.name}</h2>
    <h2>Hráč: ${req.body.userName}</h2>
    <h2>E-mail: ${req.body.userEmail}</h2>
    <h2>Zpráva pro zprávce: ${req.body.message}</h2>

    <h3><b>Podrobnosti ke hře</b></h3></br>

                              <table cellpadding="5" cellspacing="0" width="400" align="left" border="1">
                              <tr>
                                <td >Databázové ID</td>
                                <td>${game.id}</td>
                              </tr>
                              <tr>
                                <td>Jméno</td>
                                <td>${game.name}</td>
</tr>
                              <tr>
                                <td>Inventární číslo</td>
                                <td>${game.inventaryNumber}</td>
</tr>
                              <tr>
                                <td>Počet</td>
                                <td>${game.count}</td>
</tr>
                              <tr>
                                <td>Počet dostupných kusů</td>
                                <td>${game.lendingCount}</td>
</tr>
                              <tr>
                                <td>Status</td>
                                <td>${game.status + ' ' + getStatusName(game.status)}</td>
</tr>
                              <tr>
                                <td>Link obrázku</td>
                                <td>${game.image}</td>
</tr>
                              <tr>
                                <td>Odkaz na hru</td>
                                <td>${game.sourceLink}</td>
</tr>
                              <tr>
                                <td>Jméno aktuálního uživatele</td>
                                <td>${game.userName}</td>
</tr>
                              <tr>
                                <td>Email aktuálního uživatele</td>
                                <td>${game.userEmail}</td>
</tr>
                              <tr>
                                <td>Poznámka administrátora</td>
                                <td>${game.note}</td>
</tr>
                              <tr>
                                <td>Poslední aktualizace</td>
                                <td>${game.updatedAt}</td>
</tr>
                              </table>

                              </body>`
    await sendEmail(req.body.userName, config.emailOptions.to, `nová rezervace - ${game.name}`, `Byl vystaven požadevek na rezrvaci hry ${game.name}`, htmlBody);

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
      userEmail: req.body.userEmail
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

//
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
       default:
         return 'dostupne';
     }
}