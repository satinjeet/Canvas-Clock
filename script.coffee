class CanvasH
    context: null
    element: null
    events:
        m: "minutePassed"
        h: "hourPassed"

    constructor: ->
        @element = document.getElementById("myCanvas")
        @context = @element.getContext("2d")

    on: (eventName, listener)=>
        @element.addEventListener eventName, listener

    trigger: (eventName)->
        if (document.createEvent)
            event = document.createEvent("HTMLEvents");
            event.initEvent(eventName, true, true);
        else
            event = document.createEventObject();
            event.eventType = eventName;
        event.eventName = eventName;
        if (document.createEvent)
            @element.dispatchEvent event
        else
            @element.fireEvent "on"+event.eventType, event

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

    drawLine: (start, end, width = 1)->
        can.context.lineWidth = width
        can.context.beginPath()
        can.context.moveTo(start.x, start.y)
        can.context.lineTo(end.x, end.y)
        can.context.stroke()

class Needles extends ClockMaths
    value: 0
    origin: null
    radius: null
    angle: 0
    width: 1

class Seconds extends Needles

    constructor: (@origin, @radius, @value = 0)->
        @angle -= @value * 6

    update: =>
        if @angle == -360
            @angle = 0
            can.trigger can.events.m
        @angle -= 6
        b = @CalculateSecondVertex @origin, @radius, @angle
        @drawLine a, b, @width

class Minutes extends Needles
    width: 3

    constructor: (@origin, @radius, @value = 0)->
        @angle -= @value * 6
        can.on can.events.m, @angleUpdate

    angleUpdate: =>
        @angle -= 6
        can.trigger can.events.h
    update: =>
        if @angle == -360
            @angle = 0
        b = @CalculateSecondVertex @origin, @radius, @angle
        @drawLine a, b, @width

class Hours extends Minutes

    width: 3

    constructor: (@origin, @radius, @hourPassed, @minutePassed)->
        @angle -= (@hourPassed * 30 + @minutePassed * 0.5)
        can.on can.events.h, @angleUpdate

    angleUpdate: =>
        @angle -= 0.5

initCanvas = ->
    window.can = new CanvasH

update = ->
    can.element.width = can.element.width;
    seconds.update()
    minutes.update()
    hours.update()

window.addEventListener 'load', ->
    initCanvas()
    window.a = new Vertex 300, 300
    d = new Date
    window.seconds = new Seconds a, 100, d.getSeconds()
    window.minutes = new Minutes a, 100, d.getMinutes()
    window.hours = new Hours a, 70, d.getHours(), d.getMinutes()
    
    update()

    setInterval(update, 1000);