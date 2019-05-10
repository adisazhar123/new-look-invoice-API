const bcrypt = require('bcrypt');

module.exports = {


  friendlyName: 'Register',

  description: 'Register a User Account.',

  inputs: {

    email: {
      type: 'string',
      description: 'The email provided for a new account.',
      unique: true
    },

    password: {
      type: 'string',
      description: 'The password provided for a new account.'
    },

    name: {
      type: 'string'
    }
  },


  exits: {
    emailAlreadyInUse: {
      description: 'The email is already associated with an account.'
    }

  },


  fn: async function (inputs, exits) {
    const email = inputs.email;
    const password = inputs.password;
    const name = inputs.name;
    const iterations = 10;    
    
    // hash password with bcrypt -- 10 iterations
    const hashedPassword = await bcrypt.hash(password, iterations);
    // create user
    const user = await User.create({
      name, email, password: hashedPassword, iterations
    }).fetch().intercept('E_UNIQUE', () => {
      return new Error('emailAlreadyInUse');
    });

    // All done.
    return exits.success({message: 'User succesfully created', userId: user.id});

  }


};

