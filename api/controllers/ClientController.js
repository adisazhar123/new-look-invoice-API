/**
 * ClientController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getClients: async(req, res) => {
    let clients;
    let userId = req.param('user_id');
    clients = await Invoice.find({
        where:{user: userId},
        select: ['client_name', 'client_email']
      }
      );
    return res.json(clients);
  }

};

