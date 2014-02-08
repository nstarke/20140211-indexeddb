$(function(){
    $('#import-data').on('click', function(){
        logEvent({ event: 'Import data clicked' });
        var last = 376;
        var seconds = 0;
        var interval = setInterval(function(){
            seconds++;
            $('#seconds').text(seconds);
        }, 1000);
        function fetch(){
            if (last){
                $.ajax({
                    url: 'data/ip_addresses-' + zeroFill(last) + '.tsv',
                    success: function(response) {
                        write('ip-address', response.split('\n'), function(){
                            last--;
                            $('#parts-left').text(last);
                            fetch();
                        });
                    }
                });
            } else {
                clearInterval(interval);
                logEvent({ event: 'Data successfully imported', seconds: seconds });
                $('#back-to-usage').removeClass('hide');
            }
        }
        fetch();
    });

    function zeroFill(number){
        var sNumber = '' + number;
        while (sNumber.length < 3) sNumber = '0' + sNumber;
        return sNumber;
    }
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
    var write = function(collection, data, callback, transaction) {
        function _write(current_data, transaction, callback){
            var op = transaction.objectStore(collection)
                        .put(_map(current_data));
             op.onsuccess = function(){
                if (callback) callback(transaction);
            };
            op.onerror = function(e) {
                logEvent(e, true);   
            }
        }

        function _map(raw) {
            var data = raw.split('\t');
            var fields = [
                'begin_num',
                'end_num',
                'sub_block',
                'begin_octet',
                'end_octet',
                'county',
                'state',
                'city',
                'zip',
                'latitude',
                'longitude'
            ];
            var value = {};
            for (var i = 0; i < fields.length; i++) {
                var fieldValue = data.shift();
                if (fieldValue) {
                    if (!isNaN(fieldValue)) {
                        value[fields[i]] = fieldValue.indexOf('.') === -1 ? parseInt(fieldValue) : parseFloat(fieldValue);
                    } else {
                        value[fields[i]] = fieldValue.replace(/"/g, "");
                    }
                }
            }
            return value;
        }
        function _parse(transaction){
            if (data.length){
                _write(data.shift(), transaction, _parse);
            }else{
                if (callback) callback(transaction);
            }
        }
        if (transaction){
            _parse(transaction);
        }else{
            open(function(db){
                var transaction = db.transaction([collection], "readwrite");
                _parse(transaction);
            });
        }
    }
    logEvent({ event: 'Create page loaded' });
});
