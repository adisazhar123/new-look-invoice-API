/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view : 'pages/homepage' },
  '/api/invoices': 'InvoiceController.getAllInvoices',
  'post /api/register': [{action: 'user/register'}],
  'post /api/login': [{action: 'user/login'}],
  'get /api/account': [{action: 'user/myProfile'}],
  'post /api/invoices': [{action: 'invoice/createInvoice'}],
  'delete /api/invoices/:invoice_id': [{action: 'invoice/deleteInvoice'}],
  'put /api/invoices/:invoice_id/paid': [{action: 'invoice/markAsPaid'}],
  'put /api/invoices/:invoice_id/unpaid': [{action: 'invoice/markAsUnpaid'}],
  'post /api/invoices/:invoice_id/email/:user_id': [{action: 'mailer/emailToClient'}],
  'post /api/account': [{action: 'user/updateProfile'}],
  'get /api/clients/:user_id': [{action: "client/getClients"}],
  'get /invoice123': [{action: "invoice/oneInvoice"}],

  'get /invoice': [{action: 'invoice/createInvoice'}],
  'get /mail': [{action: 'mailer/sendMail'}],
  'get /viewInvoice': [{action: 'invoice/viewInvoice'}],



  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
