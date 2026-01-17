import Advertisement from '../models/Advertisement.js';
import Business from '../models/Business.js';

/**
 * Create a new advertisement
 * POST /api/advertisements
 */
export async function createAdvertisement(req, res, next) {
  try {
    const { business_id, title, short_text, promo_text, start_time, end_time, status } = req.validatedData;

    // Verify business exists
    const business = await Business.findById(business_id);
    if (!business) {
      return res.status(404).json({
        ok: false,
        error: 'Business not found'
      });
    }

    // Get uploaded file path if exists
    const image_path = req.file ? req.file.path : null;

    const advertisement = new Advertisement({
      business_id,
      title,
      short_text,
      promo_text,
      image_path,
      start_time,
      end_time,
      status: status || 'draft'
    });

    await advertisement.save();

    res.status(201).json({
      ok: true,
      advertisement: {
        ad_id: advertisement._id,
        business_id: advertisement.business_id,
        title: advertisement.title,
        short_text: advertisement.short_text,
        promo_text: advertisement.promo_text,
        image_path: advertisement.image_path,
        start_time: advertisement.start_time,
        end_time: advertisement.end_time,
        status: advertisement.status,
        created_at: advertisement.created_at
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all advertisements (with optional filters)
 * GET /api/advertisements
 */
export async function getAllAdvertisements(req, res, next) {
  try {
    const { business_id, status } = req.query;
    const filter = {};

    if (business_id) {
      filter.business_id = business_id;
    }

    if (status) {
      filter.status = status;
    }

    const advertisements = await Advertisement.find(filter)
      .populate('business_id', 'name business_code')
      .select('-__v')
      .sort({ created_at: -1 });

    res.json({
      ok: true,
      count: advertisements.length,
      advertisements: advertisements.map(ad => ({
        ad_id: ad._id,
        business_id: ad.business_id._id,
        business_name: ad.business_id.name,
        title: ad.title,
        short_text: ad.short_text,
        promo_text: ad.promo_text,
        image_path: ad.image_path,
        start_time: ad.start_time,
        end_time: ad.end_time,
        stop_time: ad.stop_time,
        status: ad.status,
        created_at: ad.created_at
      }))
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get active and upcoming advertisements (for NoviSign)
 * GET /api/advertisements/snapshot
 */
export async function getAdvertisementsSnapshot(req, res, next) {
  try {
    const now = new Date();

    const active = await Advertisement.find({
      status: 'active',
      start_time: { $lte: now },
      end_time: { $gt: now },
      $or: [
        { stop_time: null },
        { stop_time: { $gt: now } }
      ]
    }).populate('business_id', 'name');

    const upcoming = await Advertisement.find({
      status: 'active',
      start_time: { $gt: now }
    }).populate('business_id', 'name');

    res.json({
      ok: true,
      active: active.map(ad => ({
        ad_id: ad._id,
        business_id: ad.business_id._id,
        business_name: ad.business_id.name,
        title: ad.title,
        image_path: ad.image_path,
        start_time: ad.start_time,
        end_time: ad.end_time
      })),
      upcoming: upcoming.map(ad => ({
        ad_id: ad._id,
        business_id: ad.business_id._id,
        business_name: ad.business_id.name,
        title: ad.title,
        start_time: ad.start_time,
        end_time: ad.end_time
      }))
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Stop advertisement early
 * DELETE /api/advertisements/:id/stop
 */
export async function stopAdvertisement(req, res, next) {
  try {
    const advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        ok: false,
        error: 'Advertisement not found'
      });
    }

    advertisement.stop_time = new Date();
    advertisement.status = 'disabled';
    await advertisement.save();

    res.json({
      ok: true,
      message: 'Advertisement stopped successfully',
      advertisement: {
        ad_id: advertisement._id,
        stop_time: advertisement.stop_time,
        status: advertisement.status
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update advertisement
 * PUT /api/advertisements/:id
 */
export async function updateAdvertisement(req, res, next) {
  try {
    const advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        ok: false,
        error: 'Advertisement not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'short_text', 'promo_text', 'status', 'start_time', 'end_time'];

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        advertisement[key] = req.body[key];
      }
    });

    await advertisement.save();

    res.json({
      ok: true,
      message: 'Advertisement updated successfully',
      advertisement: {
        ad_id: advertisement._id,
        business_id: advertisement.business_id,
        title: advertisement.title,
        short_text: advertisement.short_text,
        promo_text: advertisement.promo_text,
        image_path: advertisement.image_path,
        start_time: advertisement.start_time,
        end_time: advertisement.end_time,
        status: advertisement.status,
        updated_at: advertisement.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete advertisement
 * DELETE /api/advertisements/:id
 */
export async function deleteAdvertisement(req, res, next) {
  try {
    const advertisement = await Advertisement.findByIdAndDelete(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        ok: false,
        error: 'Advertisement not found'
      });
    }

    // TODO: Delete associated image file from filesystem

    res.json({
      ok: true,
      message: 'Advertisement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
