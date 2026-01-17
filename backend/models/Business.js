import { readData, writeData } from '../config/fileStorage.js';
import crypto from 'crypto';

const FILENAME = 'businesses.json';

class BusinessModel {
  constructor(data) {
    this._id = data._id || crypto.randomUUID();
    this.business_code = data.business_code;
    this.name = data.name;
    this.contact_info = data.contact_info;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  async save() {
    // Validation
    if (!this.business_code) {
      throw new Error('business_code is required');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('name is required');
    }
    if (!this.contact_info) {
      throw new Error('contact_info is required');
    }

    this.updated_at = new Date();

    const businesses = readData(FILENAME);

    // Check for duplicate business_code
    const existingIndex = businesses.findIndex(b =>
      b.business_code === this.business_code && b._id !== this._id
    );
    if (existingIndex !== -1) {
      const error = new Error('Duplicate key error');
      error.code = 11000;
      error.keyPattern = { business_code: 1 };
      throw error;
    }

    const index = businesses.findIndex(b => b._id === this._id);
    const businessData = {
      _id: this._id,
      business_code: this.business_code,
      name: this.name,
      contact_info: this.contact_info,
      created_at: this.created_at,
      updated_at: this.updated_at
    };

    if (index !== -1) {
      businesses[index] = businessData;
    } else {
      businesses.push(businessData);
    }

    writeData(FILENAME, businesses);
    return this;
  }

  static find(filter = {}) {
    const businesses = readData(FILENAME);
    let results = businesses;

    // Apply filter
    if (Object.keys(filter).length > 0) {
      results = businesses.filter(business => {
        return Object.entries(filter).every(([key, value]) => {
          return business[key] === value;
        });
      });
    }

    // Return query builder for chaining
    return {
      data: results,
      select() { return this; },
      sort(options) {
        if (options) {
          const sortKeys = Object.entries(options);
          this.data.sort((a, b) => {
            for (const [key, order] of sortKeys) {
              const aVal = new Date(a[key]);
              const bVal = new Date(b[key]);
              if (aVal < bVal) return order === -1 ? 1 : -1;
              if (aVal > bVal) return order === -1 ? -1 : 1;
            }
            return 0;
          });
        }
        return this;
      },
      then(resolve) {
        const results = this.data.map(b => new BusinessModel(b));
        return resolve ? resolve(results) : Promise.resolve(results);
      }
    };
  }

  static findOne(filter) {
    const businesses = readData(FILENAME);
    const business = businesses.find(b => {
      return Object.entries(filter).every(([key, value]) => {
        return b[key] === value;
      });
    });

    return business ? new BusinessModel(business) : null;
  }

  static findById(id) {
    const businesses = readData(FILENAME);
    const business = businesses.find(b => b._id === id);
    return business ? new BusinessModel(business) : null;
  }

  static findByIdAndUpdate(id, update, options = {}) {
    const businesses = readData(FILENAME);
    const index = businesses.findIndex(b => b._id === id);

    if (index === -1) {
      return null;
    }

    const updated = {
      ...businesses[index],
      ...update,
      updated_at: new Date()
    };

    // Validation if runValidators is true
    if (options.runValidators) {
      if (!updated.name || updated.name.trim().length === 0) {
        throw new Error('name is required');
      }
      if (!updated.contact_info) {
        throw new Error('contact_info is required');
      }
    }

    businesses[index] = updated;
    writeData(FILENAME, businesses);

    return options.new ? new BusinessModel(updated) : new BusinessModel(businesses[index]);
  }

  static findByIdAndDelete(id) {
    const businesses = readData(FILENAME);
    const index = businesses.findIndex(b => b._id === id);

    if (index === -1) {
      return null;
    }

    const deleted = businesses[index];
    businesses.splice(index, 1);
    writeData(FILENAME, businesses);

    return new BusinessModel(deleted);
  }

  static countDocuments(filter = {}) {
    const businesses = readData(FILENAME);

    if (Object.keys(filter).length === 0) {
      return businesses.length;
    }

    return businesses.filter(b => {
      return Object.entries(filter).every(([key, value]) => {
        return b[key] === value;
      });
    }).length;
  }
}

export default BusinessModel;
