import { readData, writeData } from '../config/fileStorage.js';
import Business from './Business.js';
import crypto from 'crypto';

const FILENAME = 'advertisements.json';

class AdvertisementModel {
  constructor(data) {
    this._id = data._id || crypto.randomUUID();
    this.business_id = data.business_id;
    this.title = data.title;
    this.short_text = data.short_text;
    this.promo_text = data.promo_text;
    this.image_path = data.image_path || null;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.stop_time = data.stop_time || null;
    this.status = data.status || 'draft';
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  async save() {
    // Validation
    if (!this.business_id) {
      throw new Error('business_id is required');
    }
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('title is required');
    }

    if (!this.start_time) {
      throw new Error('start_time is required');
    }
    if (!this.end_time) {
      throw new Error('end_time is required');
    }

    // Date validation
    const startDate = new Date(this.start_time);
    const endDate = new Date(this.end_time);
    if (endDate <= startDate) {
      throw new Error('end_time must be after start_time');
    }

    // Status validation
    if (!['draft', 'active', 'disabled'].includes(this.status)) {
      throw new Error('status must be draft, active, or disabled');
    }

    this.updated_at = new Date();

    const advertisements = readData(FILENAME);
    const index = advertisements.findIndex(a => a._id === this._id);

    const adData = {
      _id: this._id,
      business_id: this.business_id,
      title: this.title,
      short_text: this.short_text,
      promo_text: this.promo_text,
      image_path: this.image_path,
      start_time: this.start_time,
      end_time: this.end_time,
      stop_time: this.stop_time,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at
    };

    if (index !== -1) {
      advertisements[index] = adData;
    } else {
      advertisements.push(adData);
    }

    writeData(FILENAME, advertisements);
    return this;
  }

  static find(filter = {}) {
    const advertisements = readData(FILENAME);
    let results = advertisements;

    // Apply filters
    results = this._applyFilter(results, filter);

    return new QueryBuilder(results);
  }

  static findOne(filter) {
    const advertisements = readData(FILENAME);
    let results = this._applyFilter(advertisements, filter);

    if (results.length === 0) {
      return new QueryBuilder([], true);
    }

    return new QueryBuilder([results[0]], true);
  }

  static findById(id) {
    const advertisements = readData(FILENAME);
    const ad = advertisements.find(a => a._id === id);
    return ad ? new AdvertisementModel(ad) : null;
  }

  static findByIdAndDelete(id) {
    const advertisements = readData(FILENAME);
    const index = advertisements.findIndex(a => a._id === id);

    if (index === -1) {
      return null;
    }

    const deleted = advertisements[index];
    advertisements.splice(index, 1);
    writeData(FILENAME, advertisements);

    return new AdvertisementModel(deleted);
  }

  static countDocuments(filter = {}) {
    const advertisements = readData(FILENAME);
    const results = this._applyFilter(advertisements, filter);
    return results.length;
  }

  static _applyFilter(data, filter) {
    return data.filter(item => {
      return Object.entries(filter).every(([key, value]) => {
        // Handle special MongoDB operators
        if (key === '$or') {
          return value.some(condition => {
            return Object.entries(condition).every(([k, v]) => {
              return this._compareValue(item[k], v);
            });
          });
        }

        return this._compareValue(item[key], value);
      });
    });
  }

  static _compareValue(itemValue, filterValue) {
    // Handle MongoDB query operators
    if (typeof filterValue === 'object' && filterValue !== null && !Array.isArray(filterValue) && !(filterValue instanceof Date)) {
      // Check for $lte, $lt, $gte, $gt
      if ('$lte' in filterValue) {
        return new Date(itemValue) <= new Date(filterValue.$lte);
      }
      if ('$lt' in filterValue) {
        return new Date(itemValue) < new Date(filterValue.$lt);
      }
      if ('$gte' in filterValue) {
        return new Date(itemValue) >= new Date(filterValue.$gte);
      }
      if ('$gt' in filterValue) {
        return new Date(itemValue) > new Date(filterValue.$gt);
      }
    }

    return itemValue === filterValue;
  }
}

// Query builder to support populate, select, sort
class QueryBuilder {
  constructor(data, isSingle = false) {
    this.data = data;
    this.isSingle = isSingle;
    this.populateFields = [];
    this.selectedFields = null;
    this.sortField = null;
  }

  populate(field, select) {
    this.populateFields.push({ field, select });
    return this;
  }

  select(fields) {
    this.selectedFields = fields;
    return this;
  }

  sort(sortOptions) {
    this.sortField = sortOptions;
    return this;
  }

  async exec() {
    return this.then();
  }

  async then(resolve) {
    let results = this.data;

    // Handle population
    for (const { field, select } of this.populateFields) {
      if (field === 'business_id') {
        results = await Promise.all(results.map(async (item) => {
          const business = await Business.findById(item.business_id);
          if (business) {
            const businessData = { ...business };
            if (select) {
              const selectFields = select.split(' ');
              const filteredBusiness = {};
              selectFields.forEach(f => {
                if (businessData[f] !== undefined) {
                  filteredBusiness[f] = businessData[f];
                }
              });
              return { ...item, business_id: filteredBusiness };
            }
            return { ...item, business_id: businessData };
          }
          return item;
        }));
      }
    }

    // Handle sort
    if (this.sortField) {
      const sortKeys = Object.entries(this.sortField);
      results.sort((a, b) => {
        for (const [key, order] of sortKeys) {
          const aVal = new Date(a[key]);
          const bVal = new Date(b[key]);
          if (aVal < bVal) return order === -1 ? 1 : -1;
          if (aVal > bVal) return order === -1 ? -1 : 1;
        }
        return 0;
      });
    }

    // Convert to model instances
    if (this.isSingle) {
      const result = results[0] ? new AdvertisementModel(results[0]) : null;
      return resolve ? resolve(result) : result;
    }

    const modelResults = results.map(r => new AdvertisementModel(r));
    return resolve ? resolve(modelResults) : modelResults;
  }
}

export default AdvertisementModel;
