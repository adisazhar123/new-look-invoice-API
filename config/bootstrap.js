/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
  // client_name: { type: 'string', required: true },
  // client_email: { type: 'string', required: false },
  // project_name: { type: 'string', required: true },
  // project_description:

  const users = await User.createEach([
    {name: 'Adis Azhar Muhammad', email: 'adisazhar123@gmail.com', password: '123'}
  ]).fetch();
  

  const invoices = await Invoice.createEach([
    {client_name: 'Ghifaroza Rahmadiana', client_email: 'ghifarozarahmadiana@gmail.com', project_name: 'Web Design PBKK', project_description: 'Laravel made Integra like application.', invoice_status: 'paid', user: users[0].id},
    {client_name: 'Mamadu Ba', client_email: 'mamadu@gmail.com', project_name: 'English Translation', project_description: 'English application.', invoice_status: 'unpaid', user: users[0].id, due_date: '25-05-2019'},
    {client_name: 'Yuaata', client_email: 'yuata31@gmail.com', project_name: 'Chinese Translation', project_description: 'Brochure Chinese Translation.', invoice_status: 'unpaid', user: users[0].id, due_date: '19-04-2019'},
  ]).fetch();

  console.log(invoices);

  await Item.createEach([
    {name: 'server', price: 650000, invoice: invoices[0].id},
    {name: 'request 1', price: 3500000, invoice: invoices[0].id},
    {name: 'request 2', price: 1500000, invoice: invoices[0].id},

    {name: 'server digital ocean', price: 750000, invoice: invoices[1].id},
    {name: 'request 1 do', price: 3500000, invoice: invoices[1].id},
    {name: 'request 2 do', price: 1500000, invoice: invoices[1].id},
  ]);

};
