$(function(){
    $('#current-usage').on('click', function(){
        $('#import-data-link').removeClass('hide');
        navigator.webkitTemporaryStorage.queryUsageAndQuota(function(used, remaining) {
            $('#used-amount').text((used / (1024 * 1024 * 1024)) + ' GB');
            $('#available-amount').text((remaining / (1024 * 1024 * 1024)) + ' GB');
        }, function(e) {
            console.log('Error', e); 
        });
    });
});
