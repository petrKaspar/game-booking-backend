import {
  Tag,
} from '../../models';
import { successResponse, errorResponse } from '../../helpers';

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.findAndCountAll({
      order: [['createdAt', 'DESC'], ['name', 'ASC']],
    });
    return successResponse(req, res, { tags });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const createTag = async (req, res) => {
  try {
    const tag = await Tag.create({
      name: req.body.name,
      description: req.body.description,
    });

    return successResponse(req, res, { tag });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
