let db;
// create a new db request for a "budget" database.
const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  // create object store called "pending" and set autoIncrement to true
  db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = event =>
  // log error here
  console.log("Database connection error: " + event.target.errorCode);


function saveRecord(record) {
  const db = request.result;
  // create a transaction on the pending db with readwrite access
  const pendingTransaction = db.transaction(["pending"], "readwrite");
  // access your pending object store
  const pendingObjStore = pendingTransaction.objectStore("pending")
  // add record to your store with add method.
  pendingObjStore.add(record);
};

function checkDatabase() {
  // open a transaction on your pending db
  const pendingTransaction = db.transaction(["pending"], "readwrite");
  // access your pending object store
  const pendingObjStore = pendingTransaction.objectStore("pending")
  // get all records from store and set to a variable
  const getAllRecords = pendingObjStore.getAll();

  getAllRecords.onsuccess = () => {
    if (getAllRecords.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAllRecords.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          // if successful, open a transaction on your pending db
          const pendingTransaction = db.transaction(["pending"], "readwrite");
          // access your pending object store
          const pendingObjStore = pendingTransaction.objectStore("pending")
          // clear all items in your store
          pendingObjStore.clear();
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);
