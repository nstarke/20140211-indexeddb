$(function(){
    var databaseVersion = 1; //database versions are used in upgrading / migrating database installations.
    
    //This will create the initial database for us.
    var request = indexedDB.open('20140211-indexeddb-presentation', databaseVersion);
    
    //fires whenever database connection is opened up successfully.
    request.onsuccess = function(e) {
        var db = e.target.result;
    }

    //fires whenever an error occurs when opening a database connection.
    request.onerror = function(e) {
        logEvent(e, true);
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
        db.createObjectStore('log', { keyPath: 'id', autoIncrement: true });
    }
});
