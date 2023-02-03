const router = require("express").Router();
const Transaction = require("../models/transaction.js");

router.post("/api/transaction", ({body}, res) => {
  console.log(`line 5: ${body}`);
  var transaction = new Transaction();
  transaction.create(body, function(dbTransaction){
    res.json(dbTransaction);
  });
});

router.post("/api/transaction/bulk", ({body}, res) => {
  console.log(`line 17: ${JSON.stringify(body)}`);
  var transaction = new Transaction();
  transaction.insertMany(body, function(dbTransaction){
    res.json(dbTransaction);
  });
});

router.get("/api/transaction", (req, res) => {
  var transaction = new Transaction();
  transaction.find({date: -1}, function(dbTransaction){
    res.json(dbTransaction);
  });
});

module.exports = router;