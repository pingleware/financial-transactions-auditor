const { Model } = require("@pingleware/bestbooks-core");
const { addTransaction } = require("@pingleware/bestbooks-helpers");

class Transaction {

  constructor() {

  }

  create(body, callback) {
    console.log(body);

    let debit = 0;
    let credit = 0;

    if (Number(body.value) > 0) {
      debit = Number(body.value);
    } else {
      credit = Number(body.value);
    }

    addTransaction(body.name,body.name,body.date,body.name,debit,credit,
      function(results){
        callback(results);
      },
      0,0);

  }

  insertMany(body, callback) {
    console.log(body);
    var results = [];
    body.forEach(function(transaction){
      this.create(transaction, function(result){
        results.push(result);
      })      
    });
    callback(results);
  }

  find(body, callback) {
    if (body.date == -1) {
      var sql = `SELECT account_name as name,  txdate as date, debit  as  value FROM ledger WHERE debit>0  
      UNION
      SELECT account_name as name,  txdate as date, credit  as  value FROM ledger WHERE credit>0 ORDER BY txdate ASC;`;

      const model = new Model();
      model.query(sql, function(results){
        callback(results);
      })
    }
  }
}

module.exports = Transaction;
