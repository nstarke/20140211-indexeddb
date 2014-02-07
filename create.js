$(function(){
    $('#import-data').on('click', function(){
        var last = 376;
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
            console.log(e);
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
                console.log(e)
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
    //This will create the initial database for us.
    var request = indexedDB.open('20140211-indexeddb-presentation', databaseVersion);
    
    //fires whenever database connection is opened up successfully.
    request.onsuccess = function(e) {
        var db = e.target.result;
    }

    //fires whenever an error occurs when opening a database connection.
    request.onerror = function(e) {
        console.log(e);
    }

    //fires whenever the version number for the database is higher than the current database version number.
    //NOTE: if the version number passed to the database is LESS than the current, an exception will be thrown.
    request.onupgradeneeded = function(e){
        //this is where database "migrations" are handled.
        var db = e.target.result;
        var ip = db.createObjectStore('ip-address', { keyPath: 'id', autoIncrement: true });
        ip.createIndex('begin_num', 'begin_num');
        ip.createIndex('end_num', 'end_num');
        ip.createIndex('country', 'country');
        ip.createIndex('state', 'state');
    }
});
