import express from 'express';
import { validate } from '../middleware/validation.js';
import { createBusinessSchema } from '../utils/validators.js';
import {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness
} from '../controllers/businessController.js';

const router = express.Router();

// POST /api/businesses - Create new business
router.post('/', validate(createBusinessSchema), createBusiness);

// GET /api/businesses - Get all businesses
router.get('/', getAllBusinesses);

// GET /api/businesses/:id - Get business by ID
router.get('/:id', getBusinessById);

// PUT /api/businesses/:id - Update business
router.put('/:id', validate(createBusinessSchema), updateBusiness);

// DELETE /api/businesses/:id - Delete business
router.delete('/:id', deleteBusiness);

export default router;
