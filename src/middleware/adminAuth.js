import { errorResponse } from '../helpers';

const adminAuth = (req, res, next) => {
  // TODO: dodelat autorizace!!!
  //if (req.user && req.user.email && req.user.isAdmin) {
    return next();
  //}
  return errorResponse(req, res, "You don't have admin access", 401);
};

export default adminAuth;
