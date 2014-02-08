function logEvent(event, isError){
    var databaseVersion = 1;
    var open = function(callback) {
        var request = indexedDB.open('20140211-indexeddb-presentation', databaseVersion);
        request.onsuccess = function(e) {
            if (callback) callback(e.target.result);
        }
        request.onerror = function(e) {
            //an error occured trying to log the error.  
            //this has no where to go, so it goes into the console output.
            console.log(e);
        }
    }
    function write(data, transaction, callback){
        var op = transaction.objectStore('log')
                    .put({ data: data, date: new Date(), isError: isError || false });
        op.onsuccess = function(){
              if (callback) callback(transaction);
         };
         op.onerror = function(e) {
              console.log(e)
         }
    }
    open(function(db){
        var transaction = db.transaction(['log'], 'readwrite');
        write(event, transaction);
    });
}
