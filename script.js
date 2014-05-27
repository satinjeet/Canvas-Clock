// Generated by CoffeeScript 1.7.1
var CanvasH, ClockMaths, Seconds, Vertex, initCanvas, update,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CanvasH = (function() {
  CanvasH.prototype.context = null;

  CanvasH.prototype.element = null;

  function CanvasH() {
    this.element = document.getElementById("myCanvas");
    this.context = this.element.getContext("2d");
  }

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

  ClockMaths.prototype.drawLine = function(start, end) {
    can.context.beginPath();
    can.context.moveTo(start.x, start.y);
    can.context.lineTo(end.x, end.y);
    return can.context.stroke();
  };

  return ClockMaths;

})();

Seconds = (function(_super) {
  __extends(Seconds, _super);

  Seconds.prototype.value = 0;

  Seconds.prototype.origin = null;

  Seconds.prototype.radius = null;

  Seconds.prototype.angle = 0;

  function Seconds(origin, radius) {
    this.origin = origin;
    this.radius = radius;
    this.update = __bind(this.update, this);
  }

  Seconds.prototype.update = function() {
    var b;
    if (this.angle === -360) {
      this.angle = 0;
    }
    this.angle -= 6;
    b = this.CalculateSecondVertex(this.origin, this.radius, this.angle);
    return this.drawLine(a, b);
  };

  return Seconds;

})(ClockMaths);

initCanvas = function() {
  return window.can = new CanvasH;
};

update = function() {
  can.element.width = can.element.width;
  return seconds.update();
};

window.addEventListener('load', function() {
  window.radius = 100;
  window.a = new Vertex(300, 300);
  window.seconds = new Seconds(a, radius);
  initCanvas();
  seconds.update();
  return setInterval(update, 1000);
});
