$(function(){
    $('#count-all').on('click', function(){
        logEvent({ event: 'Count all clicked' });
        var seconds = 0;
        var $seconds = $('#seconds');
        var interval = setInterval(function(){
            seconds++;
            $seconds.text(seconds);
        }, 1000);
        count('ip-address', function(numberOfRecords){
            clearInterval(interval);
            $('#count').text(numberOfRecords + ' total records');
            logEvent({ event: 'Count all reported', collection: 'ip-address', count: numberOfRecords });
        });
    });

    var databaseVersion = 1; //database versions are used in upgrading / migrating database installations.

    //This is a generic function used to open database connections.
    var open = function (callback) {
         var request = indexedDB.open('20140211-indexeddb-presentation', databaseVersion);
         request.onsuccess = function (e) {
            if(callback) callback(e.target.result);
         }
         request.onerror = function (e) {
            logEvent(e, true);
         }
    }

    //this is used to fill a table with data.
    var count = function(collection, callback, transaction) {
        function _count(transaction){
            var op = transaction.objectStore(collection)
                        .count();
             op.onsuccess = function(e){
                if (callback) callback(e.target.result);
            };
            op.onerror = function(e) {
                logEvent(e, true);
            }
        }
        if (transaction) {
            _count(transaction)
        } else {
            open(function(db){
                var transaction = db.transaction([collection], 'readwrite');
                _count(transaction);
            })
        }
    }
    logEvent({ event: 'Count page loaded' });
});
