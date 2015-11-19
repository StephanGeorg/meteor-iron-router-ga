var IronRouterGa = function() {

  var self = this;

  this.gaSettings = [];

  this.initPreloadAnalyticsHelper = function() {
      window.ga = window.ga || function() { (ga.q = ga.q || []).push(arguments); };
      ga.l = +new Date();
  };

  this.initTracker = function(ga) {

      var createOptions = ga.create || null;

      window.ga('create', ga.id, 'auto', createOptions);
      if (ga.trackUserId) {
          Tracker.autorun(function() {
              if (Meteor.loggingIn()) { return; }
              window.ga('set', '&uid', Meteor.userId());
          });
      }
  };

  this.initFakeTracker = function() {

      console.log('faker');

      var hasRun = false;
      window.ga = function() {
          if (!hasRun) {
              hasRun = true;
              console.warn('iron-router-ga: settings not found');
          }
      };
  };

  this.applySettings = function(set) {

      if (!set) { return; }

      for (var key in set) {
          if (set.hasOwnProperty(key)) {
              window.ga('set', key, set[key]);
          }
      }
  };

  this.applyRequires = function(require) {

      var requireValue;

      if (!require) { return; }

      for (var key in require) {
          if (require.hasOwnProperty(key)) {
              requireValue = require[key];
              if (typeof requireValue === 'string') {
                  window.ga('require', key, requireValue);
              } else {
                  window.ga('require', key);
              }
          }
      }
  };

  this.add = function (options) {
    this.vars = options && options.ga || {};

    if(!_.findWhere(this.gaSettings,{'id':this.vars.id})) {
        this.gaSettings.push(this.vars);
    }
    this.init();

  };


  this.init = function() {
    var self = this;
    _.each(this.gaSettings,function(ga){
      if (ga.id) {
          self.initPreloadAnalyticsHelper();
          self.initTracker(ga);
          self.applySettings(ga.set);
          self.applyRequires(ga.require);
      } else {
          self.initFakeTracker();
      }
    });


  };

  this.getOptions = function() {
    return this.gaSettings;
  };

  return self;

};

GoogleAnalytics = new IronRouterGa();
