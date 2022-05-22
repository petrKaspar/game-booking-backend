import express from 'express';
import * as userController from '../controllers/user/user.controller';
import * as gameController from '../controllers/game/game.controller';
import * as borrowController from '../controllers/borrow/borrow.controller';
import * as changelogController from '../controllers/changelog/changelog.controller';

const router = express.Router();

//= ===============================
// Admin routes
//= ===============================
router.get('/allUsers', userController.allUsers);

router.get('/games', gameController.getGamesAdmin);

router.get('/games/:id', gameController.getGameAdmin);

router.patch('/games/:id', gameController.updateGame);

router.patch('/games/bulk/:id', gameController.bulkUpdateGames);

router.delete('/games/:id', gameController.deleteGame);

router.post('/games', gameController.createGame);

// Admin routes for statistics
router.get('/statistics/overview', gameController.getStatisticsAdmin);

router.get('/statistics/totalBorrows', gameController.getTotalBorrowsAdmin);

router.get('/cronSendEmails', gameController.sendEmailCronAdmin);

// Admin routes for borrowing 
router.get('/games/:gameId/borrows', borrowController.getBorrows);

//router.get('/games/:gameId/borrows/:borrowId', borrowController.getBorrow);

//router.patch('/games/:gameId/borrows/:borrowId', borrowController.updateBorrow);

router.post('/games/:gameId/borrows', borrowController.createBorrow);


// Admin routes for games changelogs 
router.get('/games/:gameId/changelogs', changelogController.getChangelogs);

router.get('/games/:gameId/changelogs/:changelogId', changelogController.getChangelog);

router.post('/games/:gameId/changelogs', changelogController.createChangelog);

module.exports = router;
