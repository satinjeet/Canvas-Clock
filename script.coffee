class CanvasH
    context: null
    element: null

    constructor: ->
        @element = document.getElementById("myCanvas")
        @context = @element.getContext("2d")

class Vertex
    x: 0
    y: 0
    constructor: (@x = 0, @y = 0)->

class ClockMaths

    CalculateSecondVertex: (start, hypotanuse, theta)->
        t = new Vertex
        dx = hypotanuse * Math.sin (theta*Math.PI)/180
        dy = hypotanuse * Math.cos (theta*Math.PI)/180
        t.x = start.x - dx
        t.y = start.y - dy
        return t

    drawLine: (start, end)->
        can.context.beginPath();
        can.context.moveTo(start.x, start.y);
        can.context.lineTo(end.x, end.y);
        can.context.stroke();

class Seconds extends ClockMaths
    value: 0
    origin: null
    radius: null
    angle: 0

    constructor: (@origin, @radius)->

    update: =>
        if @angle == -360
            @angle = 0
        @angle -= 6
        b = @CalculateSecondVertex @origin, @radius, @angle
        @drawLine a, b


initCanvas = ->
    window.can = new CanvasH

update = ->
    can.element.width = can.element.width;
    seconds.update()



window.addEventListener 'load', ->
    window.radius = 100;
    window.a = new Vertex 300, 300
    window.seconds = new Seconds a, radius

    initCanvas()
    seconds.update()

    setInterval(update, 1000);