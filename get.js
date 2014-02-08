$(function(){
    $('#fetch-location').on('click', function(){
        var seconds = 0;
        var $seconds = $('#seconds');
        var interval = setInterval(function(){
            seconds++;
            $seconds.text(seconds);
        }, 1000);
        var ipOctal = $('#public-ip-address').val();
        var ipInteger = ipToInteger(ipOctal);
        fetch(ipInteger, function(result){
            clearInterval(interval);
            $('#ip-octal').text(ipOctal);
            $('#ip-integer').text(ipInteger);
            $('#ip-block-range-begin-integer').text(result.begin_num);
            $('#ip-block-range-end-integer').text(result.end_num);
            $('#ip-sub-block-integer').text(result.sub_block);
            $('#ip-block-range-begin-octal').text(result.begin_octet);
            $('#ip-block-range-end-octal').text(result.end_octet);
            $('#country').text(result.country);
            $('#city').text(result.city);
            $('#state').text(result.state);
            $('#zip').text(result.zip);
            $('#latitude').text(result.latitude);
            $('#longitude').text(result.longitude);
            $('#go-to-clear').removeClass('hide');
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
            logError(e);
         }
    }
    
    var ipToInteger = function(ip) {
        var octets = ip.split('.');
    return (16777216 * parseInt(octets[0])) +
        (65536 * parseInt(octets[1])) +
        (256 * parseInt(octets[2])) +
         parseInt(octets[3])
    }

    //this is used to fill a table with data.
    var fetch = function(ipAddress,  callback, transaction) {
        var collection = 'ip-address';
        function _fetch(transaction){
            var resultOp = transaction.objectStore(collection)
                            .index('end_num')
                            .get(IDBKeyRange.lowerBound(ipAddress), "prev");
            resultOp.onsuccess = function(e){
                callback(e.target.result);
            }
        }
        if (transaction) {
            _fetch(transaction)
        } else {
            open(function(db){
                var transaction = db.transaction([collection], 'readwrite');
                _fetch(transaction);
            })
        }
    }
    logEvent({ event: 'Get page loaded' });
});
