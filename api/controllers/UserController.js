/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    register: async(req, res) => {        
        let user;
        try {
          user = await sails.helpers.register.with({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
          });
        } catch (error) {
          return res.status(400).json(error.message);
        }    
        return res.status(201).json(user);
      },

    login: async (req, res) => {
        let user;
        try {
            user = await sails.helpers
            .login.with({email: req.body.email,password: req.body.password})
            .intercept('wrongCredentials', () => { 
                return new Error('wrongCredentials');
            });
        } catch (error) {
            switch (error.message) {
            case 'wrongCredentials':
                return res.status(404).json({message: 'Account not found.'});                                
            default:
                return res.json(error.message);
            }
        }

        
            res.cookie('sailsjwt', 'okok', {
                signed: true,
                domain: 'http://localhost:3000', // always use this in production to whitelist your domain
                maxAge: 999999999
            });

        return res.status(200).json(user);

    },

    myProfile: (req, res) => {
        return res.json({data: req.user.data});
    }

};

