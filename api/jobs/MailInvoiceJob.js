const kue = require('kue'), 
    queue = kue.createQueue();

module.exports = {
    createEmailJob(invoice, items) {
        const job = queue.create('email', {
                invoice_data: invoice, item_data: items
            }).priority('high')
            .attempts(5)
            .save(function(err) {
                if (!err) console.log(job.id);
            });
    }
};