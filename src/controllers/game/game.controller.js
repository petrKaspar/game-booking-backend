import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import {
  User, Game, Tag, TagGame, Changelog
} from '../../models';
import { successResponse, errorResponse, uniqueId } from '../../helpers';
import { newReservationEmailTemplate, gameItemsArray, gameItemTemplate, gameItemTemplate2, newReservationEmailTemplate2 } from '../../templates/email-newResrevation';
// import * as nodemailer from 'nodemailer';
const env = process.env.NODE_ENV || 'development';
import * as c from '../../config/config.js';
const config = c['development'];

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const getGames = async (req, res) => {
  try {
    const gtu = await Game.findAll({
      where: {
        purchasePrice: null,
      },
      order: [['createdAt', 'DESC']],
    }
    );

    gtu.forEach(async asdf => {
      if (asdf.dataValues.price != null && asdf.dataValues.price > 0) {
        if (asdf.publisher == 'MINDOK' || asdf.publisher == 'Blackfire') {
          await Game.update(
            {
              purchasePrice: Math.round(asdf.price * 60 / 100)
            },
            {
              where: {
                id: asdf.id,
              }
            }
          );
        }

        else {
          await Game.update(
            {
              purchasePrice: Math.round(asdf.price * 70 / 100)
            },
            {
              where: {
                id: asdf.id,
              }
            }
          );
        }
      }
    });


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
    return successResponse(req, res, game);
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
          statusNew: req.body['status'] !== null && req.body['status'] !== undefined ? req.body['status'] : game.status,
          note: `Hra změněna adminem. ${req.body['noteChangelog'] || ''}`,
          userName: req.body['userName'] !== null && req.body['userName'] !== undefined ? req.body['userName'] : game.userName,
          userEmail: req.body['userEmail'] !== null && req.body['userEmail'] !== undefined ? req.body['userEmail'] : game.userEmail,
        },
      );
    }

    // pokud se status zmeni na "vypujceno", poslat email
    if (req.body.status !== game.status && Number(req.body.status) === 2) {
      const subtitle = 'Hry jsou dostupne v Carbonu.........';
      const message = `Doporučená výše dobrovolného daru za toto vypůjčení bude ${game.price} Kč. Děkujeme :-)`;
      const htmlPage = newReservationEmailTemplate2('Dostupne k vyzvednuti!', subtitle, message, req.body.userName, req.body.userEmail, req.body.userMessage, 'Carbon café', gameItemTemplate2(game.name));
      console.log('SENDING EMAIL @@@@@@@@@@@@@@@@@@@@@@@@ Dostupne k vyzvednuti! @@@@@@@@@@@@@@@@@@@@@@@@');
      await sendEmailEmailLabs('dlouhanfrankie2@seznam.cz-nepouzito', req.body.userName, 'pujcovna@udkh.cz', 'Nová Dostupne k vyzvednuti!', htmlPage); // 'pkaspar1@seznam.cz' config.emailOptions.to
      if (emailRegexp.test(req.body.userEmail)) {
        await sendEmailEmailLabs('dlouhanfrankie2@seznam.cz-nepouzito', req.body.userName, req.body.userEmail, 'Dostupne k vyzvednuti!', htmlPage); // 'pkaspar1@seznam.cz' req.body.userEmail
      }
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
    let priceTotal = 0;
    let newStatus = req.body.status;
    let gameForEmail = undefined;
    const ids = req.params.ids.split(',');
    for (const gameId of ids) {
      const game = await Game.findOne({
        where: {
          id: gameId,
        },
      });
      gameForEmail = game;
      if (!game) {
        throw new Error('Game not found! id=' + gameId);
      }

      if (newStatus === 1) {
        switch (game.inventoryNumber) {
          case 'k':
          case 'n':
          case 'c':
          case 'a':
            newStatus = 5;
        }
      }
      await Game.update(
        {
          userName: req.body.userName,
          userEmail: req.body.userEmail,
          status: newStatus,
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
          statusNew: newStatus,
          note: `Stav hry změněn adminem. ${req.body.message}`,
          userName: req.body.userName,
          userEmail: req.body.userEmail,
        },
      );

      if (game.price && !req.body.purchase) {
        priceTotal = priceTotal + Math.ceil(game.price * 6 / 100);
      }
      if (!!req.body.purchase) {
        priceTotal = priceTotal + game.sellingPrice;
      }
      gameItemsArray.push(gameItemTemplate2(game.name));
    }

    if (!!req.body.purchase) {
      // pokud se status zmeni na "vypujceno", poslat email
      // pro nakup bazarovych her
      if (Number(newStatus) === 2 && gameForEmail.location === 'Carbon café') {
        const subtitle = 'Hry jsou připravené v Carbonu. Budou zde čekat na vyzvednutí po dobu jednoho týdne.';
        const message = `Cena za tuto objednávku bazarových her bude ${priceTotal} Kč. Děkujeme :-)`;
        const htmlPage = newReservationEmailTemplate2('Dostupne k vyzvednuti!', subtitle, message, gameForEmail.userName ? gameForEmail.userName : '', gameForEmail.userEmail ? gameForEmail.userEmail : '', gameForEmail.userMessage ? gameForEmail.userMessage : '', 'Carbon café', gameItemsArray.join(''));
        console.log('SENDING EMAIL @@@@@@@@@@@@@@@@@@@@@@@@ Dostupne k vyzvednuti! @@@@@@@@@@@@@@@@@@@@@@@@');
        await sendEmailEmailLabs('dlouhanfrankie2@seznam.cz-nepouzito', req.body.userName, 'pujcovna@udkh.cz', 'Nová Dostupne k vyzvednuti!', htmlPage); // 'pkaspar1@seznam.cz' config.emailOptions.to
        if (emailRegexp.test(req.body.userEmail)) {
          await sendEmailEmailLabs('dlouhanfrankie2@seznam.cz-nepouzito', req.body.userName, req.body.userEmail, 'Dostupne k vyzvednuti!', htmlPage); // 'pkaspar1@seznam.cz' req.body.userEmail
        }
      }

    } else {
      // pokud se status zmeni na "vypujceno", poslat email
      if (Number(newStatus) === 2 && gameForEmail.location === 'Carbon café') {
        const subtitle = 'Hry jsou připravené v Carbonu. Budou zde čekat na vyzvednutí po dobu jednoho týdne.';
        const message = `Doporučená výše dobrovolného daru za toto vypůjčení bude ${priceTotal} Kč. Děkujeme :-)`;
        const htmlPage = newReservationEmailTemplate2('Dostupne k vyzvednuti!', subtitle, message, gameForEmail.userName ? gameForEmail.userName : '', gameForEmail.userEmail ? gameForEmail.userEmail : '', gameForEmail.userMessage ? gameForEmail.userMessage : '', 'Carbon café', gameItemsArray.join(''));
        console.log('SENDING EMAIL @@@@@@@@@@@@@@@@@@@@@@@@ Dostupne k vyzvednuti! @@@@@@@@@@@@@@@@@@@@@@@@');
        await sendEmailEmailLabs('dlouhanfrankie2@seznam.cz-nepouzito', req.body.userName, 'pujcovna@udkh.cz', 'Nová Dostupne k vyzvednuti!', htmlPage); // 'pkaspar1@seznam.cz' config.emailOptions.to
        if (emailRegexp.test(req.body.userEmail)) {
          await sendEmailEmailLabs('dlouhanfrankie2@seznam.cz-nepouzito', req.body.userName, req.body.userEmail, 'Dostupne k vyzvednuti!', htmlPage); // 'pkaspar1@seznam.cz' req.body.userEmail
        }
      }

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
      
      // Zamezit rezervaci/poptávku již poptaných (7) nebo prodaných (8) her
      if (game.status === 7 || game.status === 8) {
        throw new Error(`Hra "${game.name}" již není k dispozici (status: ${game.status === 7 ? 'poptáno' : 'prodáno'}).`);
      }
      
      // Povolit pouze dostupné hry (1, 5, 6)
      if (game.status !== 1 && game.status !== 5 && game.status !== 6 || !game.public) {
        throw new Error('Game is not available now!');
      }
      
      if (!req.body.userName || !req.body.userEmail) {
        console.error(req.params.id, req.body);
        throw new Error('Invalid request');
      }
      const newStatus = !!req.body.purchase ? 7 : 3;
      await Game.update(
        {
          userName: req.body.userName,
          userEmail: req.body.userEmail,
          location: req.body.location,
          message: req.body.userMessage,
          status: newStatus,
        },
        {
          where: {
            id: gameId,
          },
          returning: true,
        },
      );
      const changelogNote = !!req.body.purchase 
        ? `Hra poptána uživatelem. ${req.body.userMessage}`
        : `Hra rezervována uživatelem. ${req.body.userMessage}`;
      await Changelog.create(
        {
          GameId: gameId,
          statusOld: game.status,
          statusNew: newStatus,
          note: changelogNote,
          userName: req.body.userName,
          userEmail: req.body.userEmail,
          location: req.body.location,
          message: req.body.userMessage,
        },
      );

      // obsolite sending emails using Gooooooogle
      // await sendEmail(req.body.userName, config.emailOptions.to, `nová rezervace - ${game.name}`, `Byl vystaven požadevek na rezrvaci hry ${game.name}`, htmlBody);

      if (game.price && !req.body.purchase) {
        priceTotal = priceTotal + Math.ceil(game.price * 6 / 100);
      }
      if (!!req.body.purchase) {
        priceTotal = priceTotal + game.sellingPrice;
      }
      // gameItemsArray.push(gameItemTemplate(
      //   game.image ? game.image : 'https://udkh.cz/static/media/logo.29f0ed59.png', 
      //   game.sourceLink ? game.sourceLink : '',
      //   game.name,
      //   game.note,
      //   `https://udkh.cz/#/games/${game.id}`,
      //   game.price ? Math.ceil(game.price * 6 / 100) + ' Kč' : ''
      //   ));

      gameItemsArray.push(gameItemTemplate2(game.name));

    }

    if (!!req.body.purchase) {
      // pro poptavku bazarovych her
       const subtitle = 'Potvrzujeme Vaši poptávku vybraných bazarových her k nákupu. Správce o ní bude informován a bude Vás kontaktovat ohledně dostupnosti a vyzvednutí her v Alexandrii (Cafe Prostoru_, Národní technická knihovna) během čtvrtečních deskoherních seminářů (17:00-23:00).';
      const message = `Předpokládaná výše objednávky činí ${priceTotal} Kč. Děkujeme :-)`;
      const htmlPage = newReservationEmailTemplate2('Nová poptávka!', subtitle, message, req.body.userName, req.body.userEmail, req.body.userMessage, req.body.location, gameItemsArray.join(''));
      console.log('SENDING EMAIL KKKKKKKKKKKKKKKKKKK Nova poptavka! KKKKKKKKKKKKKKKKKKKKKKKKKKKK ');
      await sendEmailEmailLabs('dlouhanfrankie2@seznam.cz-nepouzito', req.body.userName, 'info@udkh.cz', 'Nová poptávka', htmlPage); // 'pkaspar1@seznam.cz' config.emailOptions.to
      if (emailRegexp.test(req.body.userEmail)) {
        await sendEmailEmailLabs('dlouhanfrankie2@seznam.cz-nepouzito', req.body.userName, req.body.userEmail, 'Nová poptávka', htmlPage); // 'pkaspar1@seznam.cz' req.body.userEmail
      }
      return successResponse(req, res);

    } else {
      const subtitle = 'Potvrzujeme rezervaci Vámi vybraných her. Správce o ní bude informován. Vyzvednutí her bude možné v Alexandrii (Cafe Prostoru_, Národní technická knihovna) během čtvrtečních deskoherních seminářů (17:00-23:00).';
      const message = `Doporučená výše dobrovolného daru za toto vypůjčení činí ${priceTotal} Kč. Děkujeme :-)`;
      const htmlPage = newReservationEmailTemplate2('Nová rezervace!', subtitle, message, req.body.userName, req.body.userEmail, req.body.userMessage, req.body.location, gameItemsArray.join(''));
      console.log('SENDING EMAIL @@@@@@@@@@@@@@@@@@@@@@@@ Nová rezervace! @@@@@@@@@@@@@@@@@@@@@@@@ ');
      await sendEmailEmailLabs('dlouhanfrankie2@seznam.cz-nepouzito', req.body.userName, 'pujcovna@udkh.cz', 'Nová rezervace', htmlPage); // 'pkaspar1@seznam.cz' config.emailOptions.to
      if (emailRegexp.test(req.body.userEmail)) {
        await sendEmailEmailLabs('dlouhanfrankie2@seznam.cz-nepouzito', req.body.userName, req.body.userEmail, 'Nová rezervace', htmlPage); // 'pkaspar1@seznam.cz' req.body.userEmail
      }
      return successResponse(req, res);

    }
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
      price: req.body.price,
      purchasePrice: req.body.purchasePrice,
      sellingPrice: req.body.sellingPrice,
    });

    if (Array.isArray(req.body.tags)) {
      req.body.tags.forEach((tag) => {
        // console.log(tag);
        const tagGame = TagGame.create({
          GameId: game.id,
          TagId: tag.id,
        });
        // console.log(tagGame);
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
        statusCount[game.status] = !statusCount[game.status] ? 1 : statusCount[game.status] + 1;
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
    };
    return successResponse(req, res, result);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getTotalBorrowsAdmin = async (req, res) => {
  try {
    const games = await Game.findAndCountAll({
      include: [Tag, Changelog],
      order: [['updatedAt', 'DESC'], ['name', 'ASC']],
    });

    let result = [];
    //let allBorrows = [];
    let statusCount = [];
    let borrowedGames = [];

    if (Array.isArray(games.rows)) {
      games.rows.forEach((game) => {

        let allBorrows = game.Changelogs.filter((item) =>
          item.statusNew === 2 && item.statusOld !== item.statusNew
        );

        result.push({ ...game.dataValues, allBorrows: allBorrows })

      });
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
          image: game.image,
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
        image: game.image,
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
      image: game.image,
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
        statusCount[game.status] = !statusCount[game.status] ? 1 : statusCount[game.status] + 1;
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
          priceTotal = priceTotal + Math.ceil(game.price * 6 / 100);
        }
        // gameItemsArray.push(gameItemTemplate(
        //   game.image ? game.image : 'https://udkh.cz/static/media/logo.29f0ed59.png', 
        //   game.sourceLink ? game.sourceLink : '',
        //   game.name,
        //   game.note,
        //   `https://udkh.cz/#/games/${game.id}`,
        //   game.price ? Math.ceil(game.price * 6 / 100) + ' Kč' : ''
        //   ));
        gameItemsArray.push(gameItemTemplate2(game.name));
      });

      // let htmlPage = newReservationEmailTemplate('Výpůjční doba je u konce!', 'Dovolujeme si Vás upozornit, že výpůjční doba her uvedených níže již dosáhla dvoutýdenní lhůty. Prosíme Vás tedy o jejich navrácení v následujících dnech během provozní doby půjčovny. Případně napište na udkh.vscht@gmail.com žádost o prodloužení výpůjční doby (žádosti nemusí být kvůli potřebám ÚDKH vyhověno).', borrowedGamesByEmail[0].userName, borrowedGamesByEmail[0].userEmail, '', gameItemsArray.join(''), `Doporučená výše dobrovolného daru za toto vypůjčení činí ${priceTotal} Kč. Děkujeme :-)`);
      const htmlPage = newReservationEmailTemplate2('Výpůjční doba je u konce!', 'Dovolujeme si Vás upozornit, že výpůjční doba her uvedených níže již dosáhla dvoutýdenní lhůty. Prosíme Vás tedy o jejich navrácení v následujících dnech během provozní doby půjčovny. Případně napište na udkh.vscht@gmail.com žádost o prodloužení výpůjční doby (žádosti nemusí být kvůli potřebám ÚDKH vyhověno).', `Doporučená výše dobrovolného daru za toto vypůjčení činí ${priceTotal} Kč. Děkujeme :-)`, borrowedGamesByEmail[0].userName, borrowedGamesByEmail[0].userEmail, '', gameItemsArray.join(''));
      sendEmailEmailLabs('', '', borrowedGamesByEmail[0].userEmail, `Upomínka`, htmlPage);
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
  const Mailjet = require('node-mailjet');
  const mailjet = Mailjet.apiConnect(
    'b281c100f86adcae4fbed6feb76597a5',
    '50e246f448e0cd9e2bf02e7393f20f83'
  );
  const request = mailjet
    .post("send", { 'version': 'v3.1' })
    .request({
      "Messages": [
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

export const sendEmailEmailLabs = async (fromEmail, fromName, toEmail, subject, htmlBody) => {
  const request = require('request');
  const smtp = c.production.emailOptions.emailLabsSmtp;
  const appkey = c.production.emailOptions.emailLabsAppkey;
  const secret = c.production.emailOptions.emailLabsSecret;
  const options = {
    method: 'POST',
    url: 'https://api.emaillabs.net.pl/api/new_sendmail',
    form: {
      smtp_account: smtp,
      to: {
        [toEmail]: toEmail,
      },
      subject: subject,
      html: htmlBody,
      from: 'udkh.vscht@gmail.com',
      from_name: 'Ústav deskovýh a karetních her'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + new Buffer.from(appkey + ":" + secret).toString("base64")
    }
  }

  request.post(options, function (error, response, body) {
    console.log(body)
  });
}

// game.status ENUM
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
    case 6:
      return 'alexandria';
    case 7:
      return 'poptano';
    case 8:
      return 'prodano';
    default:
      return 'dostupne';
  }
}
