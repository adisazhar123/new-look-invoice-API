/**
 * MailerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const nodemailer = require("nodemailer");
const job = require('../jobs/MailInvoiceJob');

module.exports = {
    
    emailToClient: async(req, res) => {
        let invoice_items = await Invoice.find({id: req.param('invoice_id')}).populate('items');
        let invoice = invoice_items[0];
        let items = invoice_items[0].items;
        job.createEmailJob(invoice, items);
        res.json({message: 'invoice emailed to client'});
    },

};

