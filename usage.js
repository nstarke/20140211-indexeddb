$(function(){
    $('#current-usage').on('click', function(){
        logEvent({ event: 'Current usage button clicked' });
        if (window.location.hash){
            $('#fetch-data-link').removeClass('hide')
        } else {
            $('#import-data-link').removeClass('hide');
        }
        navigator.webkitTemporaryStorage.queryUsageAndQuota(function(used, remaining) {
            logEvent({event: 'Current usage reported', usage: { 
                used:  used,
                remaining: remaining
            }});
            $('#used-amount').text((used / (1024 * 1024 * 1024)) + ' GB');
            $('#available-amount').text((remaining / (1024 * 1024 * 1024)) + ' GB');
        }, function(e) {
            logEvent(e, true);
        });
    });
    logEvent({ event: 'Current usage page loaded' });
});
