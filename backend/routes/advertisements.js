import express from 'express';
import { validate } from '../middleware/validation.js';
import { upload, handleUploadError } from '../middleware/upload.js';
import { createAdvertisementSchema } from '../utils/validators.js';
import {
  createAdvertisement,
  getAllAdvertisements,
  getAdvertisementsSnapshot,
  updateAdvertisement,
  stopAdvertisement,
  deleteAdvertisement
} from '../controllers/advertisementController.js';

const router = express.Router();

// POST /api/advertisements - Create new advertisement with file upload
router.post(
  '/',
  upload.single('image'),
  handleUploadError,
  validate(createAdvertisementSchema),
  createAdvertisement
);

// GET /api/advertisements - Get all advertisements
router.get('/', getAllAdvertisements);

// GET /api/advertisements/snapshot - Get active and upcoming ads
router.get('/snapshot', getAdvertisementsSnapshot);

// PUT /api/advertisements/:id - Update advertisement
router.put('/:id', updateAdvertisement);

// DELETE /api/advertisements/:id/stop - Stop advertisement early
router.delete('/:id/stop', stopAdvertisement);

// DELETE /api/advertisements/:id - Delete advertisement
router.delete('/:id', deleteAdvertisement);

export default router;
