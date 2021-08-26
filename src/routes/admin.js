import express from 'express';
import * as userController from '../controllers/user/user.controller';
import * as gameController from '../controllers/game/game.controller';

const router = express.Router();

//= ===============================
// Admin routes
//= ===============================
router.get('/allUsers', userController.allUsers);

router.get('/games', gameController.getGamesAdmin);

router.get('/games/:id', gameController.getGameAdmin);

router.patch('/games/:id', gameController.updateGame);

router.delete('/games/:id', gameController.deleteGame);

router.post('/games', gameController.createGame);

module.exports = router;
