const kue = require('kue')
 , queue = kue.createQueue();

 const emailService = require('../services/SendEmail');

console.log("Starting queue listener");

queue.process('email', function(job, done){
  console.log(job.data.user);
  emailService.SendEmail(job.data.invoice_data, job.data.item_data, job.data.user);
  done();
});

queue.on( 'error', function( err ) {
console.log( 'Oops... ', err );
});
