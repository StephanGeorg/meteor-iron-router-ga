IronRouterGa = function(options) {
  this.options = options;

  this.gaSettings = options && options.ga || {};

  if (this.gaSettings.id) {
      this.initPreloadAnalyticsHelper();
      this.initTracker();
      this.applySettings();
      this.applyRequires();
  } else {
      this.initFakeTracker();
  }
};

IronRouterGa.prototype.initPreloadAnalyticsHelper = function() {
    window.ga = window.ga || function() { (ga.q = ga.q || []).push(arguments); };
    ga.l = +new Date();
};

IronRouterGa.prototype.initTracker = function() {
    var createOptions = this.gaSettings.create || 'auto';
    window.ga('create', this.gaSettings.id, createOptions);
    console.log(this.gaSettings.id);
    if (this.gaSettings.trackUserId) {
        Tracker.autorun(function() {
            if (Meteor.loggingIn()) { return; }
            window.ga('set', '&uid', Meteor.userId());
        });
    }
};

IronRouterGa.prototype.initFakeTracker = function() {
    var hasRun = false;
    window.ga = function() {
        if (!hasRun) {
            hasRun = true;
            console.warn('iron-router-ga: settings not found');
        }
    };
};

IronRouterGa.prototype.applySettings = function() {
    if (!this.gaSettings.set) { return; }

    for (var key in this.gaSettings.set) {
        if (this.gaSettings.set.hasOwnProperty(key)) {
            window.ga('set', key, this.gaSettings.set[key]);
        }
    }
};

IronRouterGa.prototype.applyRequires = function() {
    var requireValue;

    if (!this.gaSettings.require) { return; }

    for (var key in this.gaSettings.require) {
        if (this.gaSettings.require.hasOwnProperty(key)) {
            requireValue = this.gaSettings.require[key];
            if (typeof requireValue === 'string') {
                window.ga('require', key, requireValue);
            } else {
                window.ga('require', key);
            }
        }
    }
};
