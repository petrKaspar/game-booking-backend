import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import {
  User, Game, Tag, TagGame, Changelog
} from '../../models';
import { successResponse, errorResponse, uniqueId } from '../../helpers';

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
        note: 'Hra rezervována uživatelem',
        userName: req.body.userName,
        userEmail: req.body.userEmail,
      },
    );
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
