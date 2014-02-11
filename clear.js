$(function(){
    $('#clear-all').on('click', function(){
        logEvent({ event: 'Clear all clicked', collection: 'ip-address'});
        var seconds = 0;
        var $seconds = $('#seconds');
        var interval = setInterval(function(){
            seconds++;
            $seconds.text(seconds);
        }, 1000);
        clear('ip-address', function(){
            logEvent({event: 'All records removed', collection: 'ip-address'});
            clearInterval(interval);
            $('#cleared').removeClass('hide');
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
    var clear = function(collection, callback, transaction) {
        function _clear(transaction){
            var op = transaction.objectStore(collection)
                        .clear();
             op.onsuccess = function(e){
                if (callback) callback();
            };
            op.onerror = function(e) {
                logEvent(e, true);
            }
        }
        if (transaction) {
            _clear(transaction)
        } else {
            open(function(db){
                var transaction = db.transaction([collection], 'readwrite');
                _clear(transaction);
            })
        }
    }
    logEvent({ event: 'Clear page loaded'});
});
