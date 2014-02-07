requirejs.config({
    baseUrl: 'http://tmux.alephvoid.com/20140211-indexeddb',
    urlArgs: 'v=' + (new Date).getTime(),
});
define([
    'bower_components/jquery/jquery',
    'bower_components/handlebars/handlebars',
    'bower_components/ember/ember',
    'bower_components/indexeddbshim/dist/IndexedDBShim.js'
], function(
    $,
    handleBars, 
    Ember
){
    var app = window.Ember.Application.create();
    app.Router.map(function(){
        this.route('introduction', { path: '/introduction' });
        this.route('availability', { path: '/availability' });
        this.route('limits', { path: '/limits' });
        this.route('create', { path: '/create' });
        this.route('get', { path: '/get' });
        this.route('update', { path: '/update' });
        this.route('remove', { path: '/remove' });
        this.route('conclusion', { path: '/conclusion' });
    }); 
    app.IntroductionRoute = window.Ember.Route.extend();
    app.AvailabilityRoute = window.Ember.Route.extend();
    app.LimitsRoute = window.Ember.Route.extend();
    app.CreateController = window.Ember.ObjectController.extend({
        actions: {
            importData: function() {
            
            }
        }
    });
    app.CreateRoute = windows.Ember.Route.extend();
});
