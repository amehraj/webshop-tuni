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
function validatorName (val) {
	if (val.length < SCHEMA_DEFAULTS.name.minLength || val.length > SCHEMA_DEFAULTS.name.maxLength) {
		return false;
	}
	else if (val.substring(0, 1) === ' ' || val.substring(val.length-1, val.length) === ' '){
		return false;
	}
	else {
		return true;
	}
}
function validatorEmail(val) {
	const re = SCHEMA_DEFAULTS.email.match;
	return re.test(String(val).toLowerCase());
}
function validatorRole (val) {
	if (val !== 'customer' && val !== 'admin') {
		return false;
	}
	else {
		return true;
	}
}
function validatorPassword (val) {
	if (val.length < SCHEMA_DEFAULTS.password.minLength || !val || val === '') {
		return false;
	}
	else {
		return true;
	}
}

// TODO: 9.5 Implement the userSchema
const userSchema = new Schema({
  // for 'name' 
  // set type
  // and the following validators:
  // required, trim, minlength, maxlength 
  name: {
    type: String, trim: true, validate: validatorName, required: true
},
  // for 'email'
  // set type
  // and the following validators:
  // required, unique, trim, match
  // NOTE: unique is not a validator (see mongoose documentation)
  // TIP: with match validator default value for email can be used and
  // for checking the email you can use the match() from SCHEMA_DEFAULTS

  //       
  email: {
    type: String, validate: validatorEmail, required: true, index: { unique: true }
},
  // for 'password'
  // set type
  // and the following validators:
  // required, minlength
  // for inspiration for the setter function, see the following comment lines
  // set: password => {
  //   if (ENTER CONDITIONS WHERE THE PASSWORD IS NOT VALID) return password;
  //   return bcrypt.hashSync(ENTER PARAMETERS);
  // }
  // 
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
  // for 'role'
  // set type
  // and the following validators:
  //  required, trim, lowercase, enum,    default
  role: {
    type: String, lowercase: true, trim: true, default: SCHEMA_DEFAULTS.role.defaultValue, validate: validatorRole
}

});

/**
 * Compare supplied password with user's own (hashed) password
 *
 * @param {string} password
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
userSchema.methods.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
 

};

// Omit the version key when serialized to JSON
userSchema.set('toJSON', { virtuals: false, versionKey: false });

const User = new mongoose.model('User', userSchema);
module.exports = User;