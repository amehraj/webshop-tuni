const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// You can use SALT_ROUNDS when hashing the password with bcrypt.hashSync()
const SALT_ROUNDS = 10;

const SCHEMA_DEFAULTS = {
  name: {
    minLength: 1,
    maxLength: 50
  },
  email: {
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: {
    minLength: 10
  },
  role: {
    values: ['admin', 'customer'],
    defaultValue: 'customer'
  }
};

// You can use these SCHEMA_DEFAULTS when setting the validators for the User Schema. For example the default role can be accessed with SCHEMA_DEFAULTS.role.defaultValue
const validatorName = (val) => {
	return val.length >= SCHEMA_DEFAULTS.name.minLength && val.length <= SCHEMA_DEFAULTS.name.maxLength;

};
const validatorEmail = (val) => {
	const regexString = SCHEMA_DEFAULTS.email.match;
	return regexString.test(String(val).toLowerCase());
};

const validatorRole = (val) => {
	return val === 'customer' || val === 'admin';
};

const validatorPassword = (val) => {
	return val.length >= SCHEMA_DEFAULTS.password.minLength && val && val !== '';
};


const userSchema = new Schema({

  name: {
    type: String, trim: true, validate: validatorName, required: true
},
   
  email: {
    type: String, validate: validatorEmail, required: true, index: { unique: true }
},

  password: {
    type: String,
    required: true,
    validate: validatorPassword,	
    set: v => {if (v.length < 10 || !v || v === '') {
          return v;
          }
          else {
          return bcrypt.hashSync(v, bcrypt.genSaltSync(SALT_ROUNDS));
          }
    }
},

  role: {
    type: String, lowercase: true, trim: true, default: SCHEMA_DEFAULTS.role.defaultValue, validate: validatorRole
}

});

/**
 * Compare supplied password with user's own (hashed) password
 *
 * @param {string} password supplied password to be compared
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
userSchema.methods.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);

};

// Omit the version key when serialized to JSON
userSchema.set('toJSON', { virtuals: false, versionKey: false });

const User = new mongoose.model('User', userSchema);
module.exports = User;