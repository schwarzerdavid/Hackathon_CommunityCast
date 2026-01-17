import Business from '../models/Business.js';
import { generateBusinessCode } from '../utils/businessCodeGenerator.js';

/**
 * Create a new business
 * POST /api/businesses
 */
export async function createBusiness(req, res, next) {
  try {
    const { name, contact_info } = req.validatedData;

    // Generate unique business code
    const business_code = await generateBusinessCode();

    const business = new Business({
      business_code,
      name,
      contact_info
    });

    await business.save();

    res.status(201).json({
      ok: true,
      business: {
        business_id: business._id,
        business_code: business.business_code,
        name: business.name,
        contact_info: business.contact_info,
        created_at: business.created_at
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all businesses
 * GET /api/businesses
 */
export async function getAllBusinesses(req, res, next) {
  try {
    const businesses = await Business.find()
      .select('-__v')
      .sort({ created_at: -1 });

    res.json({
      ok: true,
      count: businesses.length,
      businesses: businesses.map(b => ({
        business_id: b._id,
        business_code: b.business_code,
        name: b.name,
        contact_info: b.contact_info,
        created_at: b.created_at
      }))
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get business by ID
 * GET /api/businesses/:id
 */
export async function getBusinessById(req, res, next) {
  try {
    const business = await Business.findById(req.params.id).select('-__v');

    if (!business) {
      return res.status(404).json({
        ok: false,
        error: 'Business not found'
      });
    }

    res.json({
      ok: true,
      business: {
        business_id: business._id,
        business_code: business.business_code,
        name: business.name,
        contact_info: business.contact_info,
        created_at: business.created_at,
        updated_at: business.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update business
 * PUT /api/businesses/:id
 */
export async function updateBusiness(req, res, next) {
  try {
    const { name, contact_info } = req.validatedData;

    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { name, contact_info },
      { new: true, runValidators: true }
    );

    if (!business) {
      return res.status(404).json({
        ok: false,
        error: 'Business not found'
      });
    }

    res.json({
      ok: true,
      business: {
        business_id: business._id,
        name: business.name,
        contact_info: business.contact_info,
        updated_at: business.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete business
 * DELETE /api/businesses/:id
 */
export async function deleteBusiness(req, res, next) {
  try {
    const Advertisement = (await import('../models/Advertisement.js')).default;

    // Check if business has advertisements
    const adCount = await Advertisement.countDocuments({ business_id: req.params.id });

    if (adCount > 0) {
      return res.status(400).json({
        ok: false,
        error: `Cannot delete business. It has ${adCount} advertisement(s). Please delete advertisements first.`
      });
    }

    const business = await Business.findByIdAndDelete(req.params.id);

    if (!business) {
      return res.status(404).json({
        ok: false,
        error: 'Business not found'
      });
    }

    res.json({
      ok: true,
      message: 'Business deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
