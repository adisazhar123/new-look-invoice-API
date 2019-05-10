/**
 * InvoiceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 const job = require('../jobs/MailInvoiceJob');

module.exports = {
  getAllInvoices: async (req, res) => {
      const invoices = await User.find({id: '5cb31b59b7602f3b14c43a32'}).populate('invoices');
      return res.json(invoices[0].invoices);
  },

  apiReq: async(req, res) => {
    console.log(req.body);
    return res.json(req.body);
  },

  // TODO: change user id
  createInvoice: async(req, res) => {

    // console.log(req.body);
    // return res.json('ok');
    const invoice = {
      client_name: req.body.client_name,
      client_email: req.body.client_email,
      project_name: req.body.project_name,
      project_description: req.body.project_description,
      invoice_status: (req.body.invoice_status == 1) ? 'paid' : 'unpaid',
      total_price: req.body.total_price,
      user: '5cb31b59b7602f3b14c43a32'
    };

    const items = {items: req.body.items};
    let items_to_insert = [];    
    let created_invoice;
    
    try {
      created_invoice = await Invoice.create(invoice).fetch();
      
      items.items.map((el, idx) => {
        items_to_insert.push({name: el.item_name, price: el.item_price, invoice: created_invoice.id});
      });

      const created_items = await Item.createEach(items_to_insert).fetch();
      console.log('created items ', created_items);
      // add job to queue
      job.createEmailJob(created_invoice, created_items);

    } catch (error) {
      return console.log(error);
    }
    return res.status(201).json({message: 'invoice created', resource: created_invoice});
    // return res.view('pages/invoice', {layout: 'layouts/layout.invoice'});
  },

  markAsPaid: async(req, res) => {
    let invoice;
    try {
      invoice = await Invoice.update({id: req.param('invoice_id')})
      .set({invoice_status: 'paid'})
      .fetch();
    } catch (error) {
      return console.log(error);
    }

    return res.status(200).json({message: 'invoice marked as paid', resource: invoice});

  },

  markAsUnpaid: async(req, res) => {
    let invoice;
    try {
      invoice = await Invoice.update({id: req.param('invoice_id')})
      .set({invoice_status: 'unpaid'})
      .fetch();
    } catch (error) {
      return console.log(error);
    }

    return res.status(200).json({message: 'invoice marked as unpaid', resource: invoice});
  },

  deleteInvoice: async(req, res) => {
    let invoice;
    try {
      invoice = await Invoice.destroy({id: req.param('invoice_id')}).fetch();
      // console.log('plucked ', _.pluck(invoice, 'id'));
      // await Item.destroy({invoice: _.pluck(invoice, 'id')});      
    } catch (error) {
      console.log(error);
      return;
    }
    return res.status(202).json({message: 'invoice deleted'});
  },

  viewInvoice: async(req, res) => {
    return res.view('pages/invoice', {layout: 'layouts/layout.invoice'});
  }

};

