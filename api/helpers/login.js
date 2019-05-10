const bcrypt = require('bcrypt');

module.exports = {


  friendlyName: 'Login',


  description: 'Login something.',


  inputs: {
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    }
  },


  exits: {
    wrongCredentials: {
      description: 'The credentials given does not belong to an account.'
    }
  },


  fn: async function (inputs, exits) {
    // find account with email given
    const email = inputs.email;
    const user = await User.findOne({email});
    
    // no user with the email
    if (!user) {
      throw 'wrongCredentials';
    }

    const match = await bcrypt.compare(
      inputs.password, user.password
    );

    if (!match) {
      throw 'wrongCredentials';
    }

    const loggedInUser = {
      id: user.id, message: 'Succesfully authenticated.',
      token: jwtoken.sign({
        id: user.id, name:user.name, email:user.email        
      })
    };    
    
    // All done.
    return exits.success(loggedInUser);

  }


};