/**
 * InvoiceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const job = require('../jobs/MailInvoiceJob');

function IsJsonString(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}


module.exports = {
  getAllInvoices: async (req, res) => {
      let user_id = req.headers['user-id']
      console.log('getting invoices with user id ', user_id);
      const invoices = await User.find({id: user_id}).populate('invoices');
      return res.json(invoices[0].invoices);
  },

  apiReq: async(req, res) => {
    console.log(req.body);
    return res.json(req.body);
  },

  createInvoice: async (req, res) => {
    let _invoice;
    if(IsJsonString(req.body.invoice)) {
      _invoice = JSON.parse(req.body.invoice);    
    } else {
      _invoice = req.body.invoice;
    }

    console.log(_invoice);


    var reqFile = req.file('image');
    if(reqFile._files.length) {
      reqFile.upload({
        dirname: require('path').resolve(sails.config.appPath, 'assets/images/invoice-attachments')
      }, async function (err, files) {
        if (err)
          return res.serverError(err);
        console.log(files);
        let image_dir = files[0].fd.replace(BASE_DIR + '/assets', BASE_URL);

        const invoice = {
          client_name: _invoice.client_name,
          client_email: _invoice.client_email,
          project_name: _invoice.project_name,
          project_description: _invoice.project_description,
          invoice_status: (_invoice.invoice_status == 1) ? 'paid' : 'unpaid',
          total_price: _invoice.total_price,
          attachment: image_dir,
          user: _invoice.user_id,
          due_date: (_invoice.invoice_status == 1) ? '' : _invoice.due_date,
          theme: _invoice.theme
        };
    
        const items = {items: _invoice.items};
        let items_to_insert = [];    
        let created_invoice;
        
        try {
          created_invoice = await Invoice.create(invoice).fetch();

          let user = await User.find({id: _invoice.user_id});
          
          items.items.map((el, idx) => {
            items_to_insert.push({name: el.item_name, price: el.item_price, invoice: created_invoice.id});
          });
    
          const created_items = await Item.createEach(items_to_insert).fetch();
          console.log('created items ', created_items);
          // add job to queue
          job.createEmailJob(created_invoice, created_items, user);
    
        } catch (error) {
          return console.log(error);
        }
        return res.status(201).json({message: 'invoice created', resource: created_invoice});
      });
    } else {
      reqFile.upload(function() {});
      const invoice = {
        client_name: _invoice.client_name,
        client_email: _invoice.client_email,
        project_name: _invoice.project_name,
        project_description: _invoice.project_description,
        invoice_status: (_invoice.invoice_status == 1) ? 'paid' : 'unpaid',
        total_price: _invoice.total_price,
        user: _invoice.user_id,
        due_date: (_invoice.invoice_status == 1) ? '' : _invoice.due_date,
        theme: _invoice.theme
      };
  
      const items = {items: _invoice.items};
      let items_to_insert = [];    
      let created_invoice;
      
      try {
        created_invoice = await Invoice.create(invoice).fetch();
        let user = await User.find({id: _invoice.user_id});

        items.items.map((el, idx) => {
          items_to_insert.push({name: el.item_name, price: el.item_price, invoice: created_invoice.id});
        });
  
        const created_items = await Item.createEach(items_to_insert).fetch();
        console.log('created items ', created_items);
        // add job to queue
        job.createEmailJob(created_invoice, created_items, user);
  
      } catch (error) {
        return console.log(error);
      }
      return res.status(201).json({message: 'invoice created', resource: created_invoice});
    }
   

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
    } catch (error) {
      console.log(error);
      return;
    }
    return res.status(202).json({message: 'invoice deleted'});
  },

  viewInvoice: async(req, res) => {
    let invoice = {
      id: '5cdd7fea5af6c95075365c44',
      client_name: 'Ghifaroza Rahmadiana',
      client_email: 'ghifarozarahmadiana@gmail.com',
      total_price: '500000',
      project_name: 'Web Config',
      project_description: 'configuration for small web server',
      due_date: '16/09/2019',
      created_at: 1558020074876.0,
      attachment: 'http://127.0.0.1:1337/images/users/688849cd-d729-46da-926c-715cd1b1b197.jpg'
    };

    let user = {
      "_id" : "5cd83bb8cab29a25d2464b56",
      "name" : "ADIS pic",
      "email" : "hadis@gmail.com",
      "password" : "$2b$10$TuH3tmZjw.oGgB47Zclk1eC7S3EsF.gMgY6trd5joYn3zfpBM4jkm",
      "iterations" : 10,
      "created_at" : 1557674936803.0,
      "updated_at" : 1558020738641.0,
      "company" : "Pt Ades",
      "phone" : "0000003333",
      "image" : "http://127.0.0.1:1337/images/users/688849cd-d729-46da-926c-715cd1b1b197.jpg",
      "address" : "Ykp"
    };

    let items = [
      {name: 'Web Server', price: '200000'},
      {name: 'Apache Server', price: '300000'},
    ];
    return res.view('layouts/teal/layout.unpaid-invoice.ejs', {invoice, items, user, formatRupiah: (angka) => {
        var rupiah = '';
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
        return rupiah.split('',rupiah.length-1).reverse().join('');
      }
    });
  },

  oneInvoice: async(req, res) => {
    let inv = await Invoice.find().limit(1);
    return res.json(new Date(inv[0].created_at).toLocaleDateString('en-GB'));
  }

};

