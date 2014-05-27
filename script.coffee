class Drag
  offX: null
  offY: null

  init: (@element) =>
    @element.addEventListener 'mousedown', @mouseDown, false
    window.addEventListener 'mouseup', @mouseUp, false

  mouseUp: =>
    window.removeEventListener 'mousemove', @move, true

  mouseDown: (e)=>
    @offY = e.clientY - parseInt @element.offsetTop
    @offX = e.clientX - parseInt @element.offsetLeft
    window.addEventListener 'mousemove', @move, true

  move: (e)=>
    @element.style.position = 'absolute'
    @element.style.top = (e.clientY - @offY) + 'px'
    @element.style.left = (e.clientX - @offX) + 'px'

class CanvasH
    context: null
    element: null
    container: null

    constructor: ->
        @container = document.getElementById("clock")
        @element = document.getElementById("myCanvas")
        @context = @element.getContext("2d")
        dragger = new Drag
        dragger.init @container

    bind: (eventName, listener)=>
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
        # can.context.shadowBlur = width+3;
        # can.context.shadowColor="black";
        can.context.lineWidth = width
        can.context.beginPath()
        can.context.moveTo(start.x, start.y)
        can.context.lineTo(end.x, end.y)
        can.context.strokeStyle = @color;
        can.context.stroke()

class Needles extends ClockMaths
    value: 0
    origin: null
    radius: null
    angle: 0
    width: 1
    color: '#000000'

    events:
        minutePassed: "minutePassed"
        hourPassed: "hourPassed"

    trigger: (eventName)=>
        can.trigger eventName

    bind: (eventName, listener)=>
        can.bind eventName, listener

class Seconds extends Needles

    constructor: (@origin, @radius, @value = 0)->
        @angle -= @value * 6

    update: =>
        if @angle == -360
            @angle = 0
            @trigger @events.minutePassed
        @angle -= 6
        b = @CalculateSecondVertex @origin, @radius, @angle
        @drawLine @origin, b, @width

class Minutes extends Needles
    width: 3
    color: '#522900'

    constructor: (@origin, @radius, @value = 0)->
        @angle -= @value * 6
        @bind @events.minutePassed, @angleUpdate

    angleUpdate: =>
        @angle -= 6
        @trigger @events.hourPassed
    update: =>
        if @angle == -360
            @angle = 0
        b = @CalculateSecondVertex @origin, @radius, @angle
        @drawLine @origin, b, @width

class Hours extends Minutes

    width: 3
    color: '#295266'

    constructor: (@origin, @radius, @hourPassed, @minutePassed)->
        @angle -= ((@hourPassed % 12) * 30 + @minutePassed * 0.5)
        @bind @events.hourPassed, @angleUpdate

    angleUpdate: =>
        @angle -= 0.5

class Clock
    backGround : null
    ready: false
    needles: {}

    constructor: ->
        window.addEventListener 'load', @init

    init: =>
        window.can = new CanvasH
        @backGround = new Image
        @backGround.onload = @readyImage
        @backGround.src = "res/roman.png"
        a = new Vertex 125, 125
        d = new Date
        @needles.seconds = new Seconds a, 100, d.getSeconds()
        @needles.minutes = new Minutes a, 100, d.getMinutes()
        @needles.hours = new Hours a, 70, d.getHours(), d.getMinutes()
        @update()
        setInterval @update, 1000

    readyImage: =>
        @ready = true

    update: =>
        if @ready
            @clear()
            can.context.drawImage @backGround, 0, 0, 250, 250
            @needles.seconds.update()
            @needles.minutes.update()
            @needles.hours.update()

    clear: =>
        can.element.width = can.element.width;

window.clock = new Clock
    