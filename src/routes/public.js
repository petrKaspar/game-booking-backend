import express from 'express';
import validate from 'express-validation';

import * as gameController from '../controllers/game/game.controller';
import * as userController from '../controllers/user/user.controller';
import * as userValidator from '../controllers/user/user.validator';
import * as tagController from '../controllers/tag/tag.controller';
import * as imageController from '../controllers/image/image.controller';

const router = express.Router();

//= ===============================
// Public routes
//= ===============================

router.post(
  '/login',
  validate(userValidator.login),
  userController.login,
);
router.post(
  '/register',
  validate(userValidator.register),
  userController.register,
);
router.get(
  '/games',
  gameController.getGames,
);
router.get(
  '/tags',
  tagController.getTags,
);
router.patch(
  '/games/:id',
  gameController.reserveGame,
);
router.get(
  '/images/:name',
  imageController.getImage,
);
// todo: move to private
router.post(
  '/tags',
  tagController.createTag,
);
module.exports = router;
