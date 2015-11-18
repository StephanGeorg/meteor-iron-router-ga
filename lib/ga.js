IronRouterGa = function() {
  this.gaSettings = [];
};

IronRouterGa.prototype.initPreloadAnalyticsHelper = function() {
    window.ga = window.ga || function() { (ga.q = ga.q || []).push(arguments); };
    ga.l = +new Date();
};

IronRouterGa.prototype.initTracker = function(ga) {

    var createOptions = ga.create || null;

    window.ga('create', ga.id, 'auto', createOptions);
    if (ga.trackUserId) {
        Tracker.autorun(function() {
            if (Meteor.loggingIn()) { return; }
            window.ga('set', '&uid', Meteor.userId());
        });
    }
};

IronRouterGa.prototype.initFakeTracker = function() {

    console.log('faker');

    var hasRun = false;
    window.ga = function() {
        if (!hasRun) {
            hasRun = true;
            console.warn('iron-router-ga: settings not found');
        }
    };
};

IronRouterGa.prototype.applySettings = function(set) {

    if (!set) { return; }

    for (var key in set) {
        if (set.hasOwnProperty(key)) {
            window.ga('set', key, set[key]);
        }
    }
};

IronRouterGa.prototype.applyRequires = function(require) {

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

IronRouterGa.prototype.add = function (options) {
  this.vars = options && options.ga || {};

  if(!_.findWhere(this.gaSettings,{'id':this.vars.id})) {
      this.gaSettings.push(this.vars);
  }
  this.init();

};


IronRouterGa.prototype.init = function() {
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

IronRouterGa.prototype.getOptions = function() {
  return this.gaSettings;
};
