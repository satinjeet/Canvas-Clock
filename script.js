// Generated by CoffeeScript 1.7.1
(function() {
  var CanvasH, ClockMaths, Drag, Hours, Minutes, Needles, Seconds, Vertex,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Drag = (function() {
    function Drag() {
      this.move = __bind(this.move, this);
      this.mouseDown = __bind(this.mouseDown, this);
      this.mouseUp = __bind(this.mouseUp, this);
      this.init = __bind(this.init, this);
    }

    Drag.prototype.offX = null;

    Drag.prototype.offY = null;

    Drag.prototype.init = function(element) {
      this.element = element;
      this.element.addEventListener('mousedown', this.mouseDown, false);
      return window.addEventListener('mouseup', this.mouseUp, false);
    };

    Drag.prototype.mouseUp = function() {
      return window.removeEventListener('mousemove', this.move, true);
    };

    Drag.prototype.mouseDown = function(e) {
      this.offY = e.clientY - parseInt(this.element.offsetTop);
      this.offX = e.clientX - parseInt(this.element.offsetLeft);
      return window.addEventListener('mousemove', this.move, true);
    };

    Drag.prototype.move = function(e) {
      this.element.style.position = 'relative';
      this.element.style.top = (e.clientY - this.offY) + 'px';
      return this.element.style.left = (e.clientX - this.offX) + 'px';
    };

    return Drag;

  })();

  CanvasH = (function() {
    CanvasH.prototype.context = null;

    CanvasH.prototype.element = null;

    CanvasH.prototype.container = null;

    function CanvasH(dimensions) {
      var dragger;
      this.dimensions = dimensions;
      this.bind = __bind(this.bind, this);
      this.createClock = __bind(this.createClock, this);
      this.container = document.getElementById("clock");
      this.container.style.width = "" + this.dimensions.width + "px";
      this.container.style.height = "" + this.dimensions.height + "px";
      dragger = new Drag;
      dragger.init(this.container);
    }

    CanvasH.prototype.createClock = function() {
      this.element = document.createElement("canvas");
      this.element.width = this.dimensions.width;
      this.element.height = this.dimensions.height;
      this.context = this.element.getContext("2d");
      return this.container.appendChild(this.element);
    };

    CanvasH.prototype.bind = function(eventName, listener) {
      return this.element.addEventListener(eventName, listener);
    };

    CanvasH.prototype.trigger = function(eventName) {
      var event;
      if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent(eventName, true, true);
      } else {
        event = document.createEventObject();
        event.eventType = eventName;
      }
      event.eventName = eventName;
      if (document.createEvent) {
        return this.element.dispatchEvent(event);
      } else {
        return this.element.fireEvent("on" + event.eventType, event);
      }
    };

    return CanvasH;

  })();

  Vertex = (function() {
    Vertex.prototype.x = 0;

    Vertex.prototype.y = 0;

    function Vertex(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
    }

    return Vertex;

  })();

  ClockMaths = (function() {
    function ClockMaths() {}

    ClockMaths.prototype.CalculateSecondVertex = function(start, hypotanuse, theta) {
      var dx, dy, t;
      t = new Vertex;
      dx = hypotanuse * Math.sin((theta * Math.PI) / 180);
      dy = hypotanuse * Math.cos((theta * Math.PI) / 180);
      t.x = start.x - dx;
      t.y = start.y - dy;
      return t;
    };

    ClockMaths.prototype.drawLine = function(start, end, width) {
      if (width == null) {
        width = 1;
      }
      can.context.lineWidth = width;
      can.context.beginPath();
      can.context.moveTo(start.x, start.y);
      can.context.lineTo(end.x, end.y);
      can.context.strokeStyle = this.color;
      return can.context.stroke();
    };

    return ClockMaths;

  })();

  Needles = (function(_super) {
    __extends(Needles, _super);

    function Needles() {
      this.bind = __bind(this.bind, this);
      this.trigger = __bind(this.trigger, this);
      return Needles.__super__.constructor.apply(this, arguments);
    }

    Needles.prototype.value = 0;

    Needles.prototype.origin = null;

    Needles.prototype.radius = null;

    Needles.prototype.angle = 0;

    Needles.prototype.width = 1;

    Needles.prototype.color = '#000000';

    Needles.prototype.events = {
      minutePassed: "minutePassed",
      hourPassed: "hourPassed"
    };

    Needles.prototype.trigger = function(eventName) {
      return can.trigger(eventName);
    };

    Needles.prototype.bind = function(eventName, listener) {
      return can.bind(eventName, listener);
    };

    return Needles;

  })(ClockMaths);

  Seconds = (function(_super) {
    __extends(Seconds, _super);

    function Seconds(origin, radius, value) {
      this.origin = origin;
      this.radius = radius;
      this.value = value != null ? value : 0;
      this.update = __bind(this.update, this);
      this.angle -= this.value * 6;
    }

    Seconds.prototype.update = function() {
      var b;
      if (this.angle === -360) {
        this.angle = 0;
        this.trigger(this.events.minutePassed);
      }
      this.angle -= 6;
      b = this.CalculateSecondVertex(this.origin, this.radius, this.angle);
      return this.drawLine(this.origin, b, this.width);
    };

    return Seconds;

  })(Needles);

  Minutes = (function(_super) {
    __extends(Minutes, _super);

    Minutes.prototype.width = 3;

    Minutes.prototype.color = '#522900';

    function Minutes(origin, radius, value) {
      this.origin = origin;
      this.radius = radius;
      this.value = value != null ? value : 0;
      this.update = __bind(this.update, this);
      this.angleUpdate = __bind(this.angleUpdate, this);
      this.angle -= this.value * 6;
      this.bind(this.events.minutePassed, this.angleUpdate);
    }

    Minutes.prototype.angleUpdate = function() {
      this.angle -= 6;
      return this.trigger(this.events.hourPassed);
    };

    Minutes.prototype.update = function() {
      var b;
      if (this.angle === -360) {
        this.angle = 0;
      }
      b = this.CalculateSecondVertex(this.origin, this.radius, this.angle);
      return this.drawLine(this.origin, b, this.width);
    };

    return Minutes;

  })(Needles);

  Hours = (function(_super) {
    __extends(Hours, _super);

    Hours.prototype.width = 3;

    Hours.prototype.color = '#295266';

    function Hours(origin, radius, hourPassed, minutePassed) {
      this.origin = origin;
      this.radius = radius;
      this.hourPassed = hourPassed;
      this.minutePassed = minutePassed;
      this.angleUpdate = __bind(this.angleUpdate, this);
      this.angle -= (this.hourPassed % 12) * 30 + this.minutePassed * 0.5;
      this.bind(this.events.hourPassed, this.angleUpdate);
    }

    Hours.prototype.angleUpdate = function() {
      return this.angle -= 0.5;
    };

    return Hours;

  })(Minutes);

  window.Clock = (function() {
    Clock.prototype.backGround = null;

    Clock.prototype.ready = false;

    Clock.prototype.needles = {};

    function Clock(options) {
      this.options = options != null ? options : {};
      this.clear = __bind(this.clear, this);
      this.update = __bind(this.update, this);
      this.readyImage = __bind(this.readyImage, this);
      this.getImage = __bind(this.getImage, this);
      this.init = __bind(this.init, this);
      if (typeof this.options.dimensions === "undefined") {
        this.options.dimensions = {
          height: 250,
          width: 250
        };
      } else {
        this.options.dimensions = {
          height: this.options.dimensions,
          width: this.options.dimensions
        };
      }
      if (typeof this.options.needles === "undefined") {
        this.options.needles = {
          minutes: 90,
          hour: 70,
          seconds: 100
        };
      }
      if (typeof this.options.img === "undefined") {
        this.options.img = "roman";
      }
      this.init();
    }

    Clock.prototype.init = function() {
      var a, d;
      window.can = new CanvasH(this.options.dimensions);
      can.createClock();
      this.backGround = new Image;
      this.backGround.onload = this.readyImage;
      this.backGround.src = this.getImage();
      a = new Vertex(this.options.dimensions.height / 2, this.options.dimensions.width / 2);
      d = new Date;
      this.needles.seconds = new Seconds(a, this.options.needles.seconds, d.getSeconds());
      this.needles.minutes = new Minutes(a, this.options.needles.minutes, d.getMinutes());
      this.needles.hours = new Hours(a, this.options.needles.hour, d.getHours(), d.getMinutes());
      this.update();
      return setInterval(this.update, 1000);
    };

    Clock.prototype.getImage = function() {
      switch (this.options.img) {
        case "numbers":
          return "res/numbers.jpg";
        case "numbers_b":
          return "res/number_bound.jpg";
        default:
          return "res/roman_small.png";
      }
    };

    Clock.prototype.readyImage = function() {
      return this.ready = true;
    };

    Clock.prototype.update = function() {
      if (this.ready) {
        this.clear();
        can.context.drawImage(this.backGround, 0, 0, this.options.dimensions.height, this.options.dimensions.width);
        this.needles.seconds.update();
        this.needles.minutes.update();
        return this.needles.hours.update();
      }
    };

    Clock.prototype.clear = function() {
      return can.element.width = can.element.width;
    };

    return Clock;

  })();

}).call(this);
