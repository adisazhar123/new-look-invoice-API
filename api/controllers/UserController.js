/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

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
        console.log('login ', req.body);
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

    myProfile: async(req, res) => {
        let user;
        console.log('disini myprofile ', req.headers['user-id']);
        let user_id = req.headers['user-id']
        try {
            user = await User.find({id: user_id}).populate('invoices');
        } catch (error) {
            console.log(error);
            return;
        }

        let revenue = 0;
        user[0].invoices.map((inv, idx) => {
          if (inv.invoice_status == 'paid') {
            revenue += parseInt(inv.total_price);
          }
        });
        console.log(user);
        return res.status(200).json({user, revenue, projects: user[0].invoices.length});
    },
    

    updateProfile: async(req, res) => {
        let _profile;
        if(IsJsonString(req.body.profile)) {
            _profile = JSON.parse(req.body.profile);

        } else {
            _profile = req.body.profile;
        }
        console.log(_profile.address);

        var reqFile = req.file('image');
        if(reqFile._files.length) {
            reqFile.upload({
                dirname: require('path').resolve(sails.config.appPath, 'assets/images/users')
              }, async function (err, files) {
                if (err)
                    return res.serverError(err);
                console.log(files[0]);
                let image_dir = files[0].fd.replace(BASE_DIR + '/assets', BASE_URL);
                try {
                    await User.updateOne({id: _profile.id})
                        .set({
                            name:  _profile.name,
                            company: _profile.company,
                            phone: _profile.phone,
                            image: image_dir,
                            address: _profile.address
                        });
                } catch (error) {
                    console.log(error)
                    return res.status(500).json('error');
                }             
                return res.json('ok');
            });
            
        } else {
            console.log('none')
            // clear the buffer
            reqFile.upload(function() {});
            try {
                await User.updateOne({id: _profile.id})
                    .set({
                       name:  _profile.name,
                       company: _profile.company,
                       phone: _profile.phone,
                       address: _profile.address
                    });
            } catch (error) {
                console.log(error)
                return res.status(500).json('error');
            }  

            return res.json('ok');

        }

    }

};

