const kue = require('kue')
 , queue = kue.createQueue();

 const emailService = require('../services/SendEmail');

queue.process('email', function(job, done){
  console.log(job.data.invoice_data);
  emailService.SendEmail(job.data.invoice_data, job.data.item_data);
  done();
});

queue.on( 'error', function( err ) {
console.log( 'Oops... ', err );
});