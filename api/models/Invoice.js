/**
 * Invoice.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    client_name: { type: 'string', required: true },
    client_email: { type: 'string', required: false },
    project_name: { type: 'string', required: true },
    project_description: { type: 'string', required: false },
    invoice_status: { type: 'string', defaultsTo: 'unpaid' },
    due_date: { type: 'string', required: false },
    total_price: { type: 'number', required: true },
    attachment: { type: 'string', required: false },
    theme: { type: 'string', required: false },
    items: {
      collection: 'item',
      via: 'invoice'
    },
    user: {
      model: 'user'
    }

  },

  schema: true,

  async beforeDestroy(criteria, proceed) {
    try {
      await Item.destroy({invoice: criteria.where.id});      
    } catch (error) {
      return proceed(error);
    }
    return proceed();
  }

};

