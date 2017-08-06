"use strict";



define('spirograph/adapters/application', ['exports', 'ember-localstorage-adapter', 'spirograph/config/environment'], function (exports, _emberLocalstorageAdapter, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberLocalstorageAdapter.default.extend({
    namespace: _environment.default.appName
  });
});
define('spirograph/adapters/ls-adapter', ['exports', 'ember-localstorage-adapter/adapters/ls-adapter'], function (exports, _lsAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _lsAdapter.default;
});
define('spirograph/app', ['exports', 'ember', 'spirograph/resolver', 'ember-load-initializers', 'spirograph/config/environment'], function (exports, _ember, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = _ember.default.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('spirograph/components/canvas-renderer/component', ['exports', 'ember-component', 'ember-metal/get', 'ember-evented/on', 'ember-metal/set'], function (exports, _emberComponent, _get, _on, _set) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberComponent.default.extend({

    tagName: 'canvas',

    canvas: null,
    animationFrameRequest: null,

    setup: (0, _on.default)('willInsertElement', function () {
      this.canvas = this.element.getContext('2d');
      this.fitElement = this.fitElement.bind(this);
      this.fitElement();
      window.addEventListener('resize', this.fitElement);
    }),

    teardown: (0, _on.default)('willDestroyElement', function () {
      window.removeEventListener('resize', this.fitElement);
      window.cancelAnimationFrame((0, _get.default)(this, 'animationFrameRequest'));
    }),

    fitElement: function fitElement() {
      var ratio = window.devicePixelRatio || 1;
      var _window = window,
          width = _window.innerWidth,
          height = _window.innerHeight;

      this.element.width = width * ratio;
      this.element.height = height * ratio;
      this.canvas.scale(ratio, ratio);
    },
    clear: function clear() {
      var _element = this.element,
          width = _element.width,
          height = _element.height;

      this.canvas.clearRect(0, 0, width, height);
    },


    requestFrame: (0, _on.default)('didInsertElement', function () {
      var _this = this;

      var request = window.requestAnimationFrame(function () {
        return _this.requestFrame();
      });
      (0, _set.default)(this, 'animationFrameRequest', request);
      var time = window.performance.now();
      this.draw(time);
    }),

    draw: function draw() {}
  });
});
define("spirograph/components/canvas-renderer/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "WysY80F6", "block": "{\"statements\":[[18,\"default\"],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "spirograph/components/canvas-renderer/template.hbs" } });
});
define('spirograph/components/graph-renderer/component', ['exports', 'ember-metal/get', 'ember-metal/observer', 'spirograph/components/canvas-renderer/component'], function (exports, _get, _observer, _component) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var PI = Math.PI;

  var TAU = PI * 2;
  var STEPS = 5000;

  function frac(x) {
    return x - Math.floor(x);
  }

  function sin(amplitude, period, phase) {
    return function (x) {
      return amplitude * Math.sin(x / period + phase);
    };
  }

  function saw(amplitude, period, phase) {
    return function (x) {
      return amplitude * frac(x / period + phase);
    };
  }

  var rotation = function rotation(time) {
    return time * TAU; // + Math.sin(time / 7) * PI / 2;
  };

  exports.default = _component.default.extend({

    counter: 0,
    counter2: 0,

    erase: (0, _observer.default)('segments.@each.{length,period}', function () {
      this.clear();
    }),

    draw: function draw() {
      this.clear();
      var _window = window,
          cx = _window.innerWidth,
          cy = _window.innerHeight;

      this.canvas.save();
      this.canvas.translate(cx / 2, cy / 2);
      this.drawDots();
      this.drawSegments();
      this.canvas.restore();
    },
    pointsFor: function pointsFor(counter) {
      return (0, _get.default)(this, 'segments').reduce(function (points, segment, index) {
        var _points = points[points.length - 1],
            x = _points.x,
            y = _points.y;

        var length = (0, _get.default)(segment, 'length');
        var period = (0, _get.default)(segment, 'period');
        var angle = (index + 1) * rotation(counter / period);
        x += length * Math.cos(angle);
        y += length * Math.sin(angle);
        points.push({ x: x, y: y });
        return points;
      }, [{ x: 0, y: 0 }]);
    },
    drawSegments: function drawSegments() {
      var _this = this;

      var points = this.pointsFor(this.incrementProperty('counter2'));
      this.canvas.beginPath();
      this.canvas.moveTo(0, 0);
      points.forEach(function (_ref) {
        var x = _ref.x,
            y = _ref.y;
        return _this.canvas.lineTo(x, y);
      });
      this.canvas.stroke();
    },
    drawDots: function drawDots() {
      this.canvas.beginPath();
      var counter = this.incrementProperty('counter', 300);
      var points = this.pointsFor(counter);
      var _points2 = points[points.length - 1],
          x = _points2.x,
          y = _points2.y;

      this.canvas.moveTo(x, y);
      for (var i = 0; i < STEPS; i++) {
        var _points3 = this.pointsFor(counter + i);
        var _points4 = _points3[_points3.length - 1],
            _x = _points4.x,
            _y = _points4.y;

        this.canvas.lineTo(_x, _y);
      }
      this.canvas.stroke();
    }
  });
});
define("spirograph/components/graph-renderer/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "WERetXKG", "block": "{\"statements\":[[18,\"default\"],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "spirograph/components/graph-renderer/template.hbs" } });
});
define('spirograph/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('spirograph/helpers/app-version', ['exports', 'ember', 'spirograph/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  var version = _environment.default.APP.version;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (hash.hideSha) {
      return version.match(_regexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_regexp.shaRegExp)[0];
    }

    return version;
  }

  exports.default = _ember.default.Helper.helper(appVersion);
});
define('spirograph/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('spirograph/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('spirograph/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'spirograph/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _config$APP = _environment.default.APP,
      name = _config$APP.name,
      version = _config$APP.version;
  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('spirograph/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('spirograph/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('spirograph/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('spirograph/initializers/export-application-global', ['exports', 'ember', 'spirograph/config/environment'], function (exports, _ember, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember.default.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('spirograph/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('spirograph/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('spirograph/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("spirograph/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('spirograph/models/segment', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-metal/get'], function (exports, _model, _attr, _get) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.load = load;
  exports.dump = dump;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function load(str, store) {
    var _str$split = str.split(':'),
        _str$split2 = _slicedToArray(_str$split, 2),
        length = _str$split2[0],
        period = _str$split2[1];

    return store.createRecord('segment', {
      length: parseFloat(length),
      period: parseFloat(period)
    });
  }

  function dump(model) {
    return (0, _get.default)(model, 'length') + ':' + (0, _get.default)(model, 'period');
  }

  exports.default = _model.default.extend({

    length: (0, _attr.default)('number', { defaultValue: 1 }),
    period: (0, _attr.default)('number', { defaultValue: 1 })

  });
});
define('spirograph/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('spirograph/router', ['exports', 'ember', 'spirograph/config/environment'], function (exports, _ember, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = _ember.default.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {});

  exports.default = Router;
});
define('spirograph/routes/application', ['exports', 'ember-route', 'ember-metal/get', 'spirograph/models/segment'], function (exports, _emberRoute, _get, _segment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var SEPARATOR = ',';
  var PARAM = 's';
  var DEFAULT = '100:150,150:150.2,50:150.1,50:5';

  exports.default = _emberRoute.default.extend({

    queryParams: _defineProperty({}, PARAM, {}),

    model: function model(params) {
      var dumps = (params[PARAM] || DEFAULT).split(SEPARATOR);
      var store = (0, _get.default)(this, 'store');
      return dumps.map(function (p) {
        return (0, _segment.load)(p, store);
      });
    },


    actions: {
      create: function create() {
        var segment = this.store.createRecord('segment');
        var segments = this.modelFor(this.routeName).addObject(segment);
        this.send('update');
      },
      update: function update() {
        var segments = this.modelFor(this.routeName);
        var dumps = segments.map(_segment.dump);
        return this.transitionTo('application', { queryParams: _defineProperty({}, PARAM, dumps.join(SEPARATOR)) });
      },
      delete: function _delete(index) {
        this.modelFor(this.routeName).removeAt(index);
        this.send('update');
      }
    }

  });
});
define('spirograph/serializers/application', ['exports', 'ember-localstorage-adapter'], function (exports, _emberLocalstorageAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberLocalstorageAdapter.LSSerializer.extend();
});
define('spirograph/serializers/ls-serializer', ['exports', 'ember-localstorage-adapter/serializers/ls-serializer'], function (exports, _lsSerializer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _lsSerializer.default;
});
define('spirograph/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define("spirograph/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "fi7a7280", "block": "{\"statements\":[[11,\"form\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[1,[33,[\"input\"],null,[[\"value\",\"key-up\"],[[28,[\"segment\",\"length\"]],\"update\"]]],false],[0,\"\\n    \"],[1,[33,[\"input\"],null,[[\"value\",\"key-up\"],[[28,[\"segment\",\"period\"]],\"update\"]]],false],[0,\"\\n    \"],[11,\"a\",[]],[15,\"href\",\"\"],[5,[\"action\"],[[28,[null]],\"delete\",[28,[\"index\"]]]],[13],[0,\"\\n      ×\\n    \"],[14],[0,\"\\n\"]],\"locals\":[\"segment\",\"index\"]},null],[0,\"  \"],[11,\"a\",[]],[15,\"href\",\"\"],[5,[\"action\"],[[28,[null]],\"create\"]],[13],[0,\"\\n    Add\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"],[1,[33,[\"graph-renderer\"],null,[[\"segments\"],[[28,[\"model\"]]]]],false],[0,\"\\n\"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "spirograph/templates/application.hbs" } });
});
define("spirograph/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "6pzkmc7P", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "spirograph/templates/index.hbs" } });
});


define('spirograph/config/environment', ['ember'], function(Ember) {
  var prefix = 'spirograph';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("spirograph/app")["default"].create({"name":"spirograph","version":"0.0.0+356ed0ad"});
}
//# sourceMappingURL=spirograph.map
