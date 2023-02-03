const { Model } = require("@pingleware/bestbooks-core");

class Transaction {

  constructor() {

  }

  create(body, callback) {
    console.log(body);

  }

  insertMany(body, callback) {
    console.log(body);

  }

  find(body, callback) {
    if (body.date == -1) {
      var sql = `SELECT account_name as name,  txdate as date, debit  as  value FROM ledger WHERE debit>0  
      UNION
      SELECT account_name as name,  txdate as date, credit  as  value FROM ledger WHERE credit>0;`;

      const model = new Model();
      model.query(sql, function(results){
        callback(results);
      })
    }
  }
}

module.exports = Transaction;
