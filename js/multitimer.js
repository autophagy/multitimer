var timers = {};
var timerCounter = 0;
var pageTitle = 'multi/timer - multiple, personalisable egg timers';

// Timer Object
var Timer = (function () {
    function Timer(newID) {
        this.timerID = newID;
        this.selector = '#' + newID;
        this.colour = $.Color().hsla(Math.floor(Math.random() * 36)*10,1,0.7,1).toHexString();
        this.seconds = 0;
        this.playing = false;
        this.alarmed = false;
        this.sound = document.createElement('audio');
        this.sound.setAttribute('loop', true);
        this.create();
    }

    Timer.prototype.create = function () {
        $("#timerspace").append('<div id="' + this.timerID + '" class="timer" style="background-color:' + this.colour +';">\
                <div class="timer-title">\
                    <input type="text" name="timer-title" maxlength="20" value="New Timer"/>\
                </div>\
                <div class="timer-time">\
                    <h3>Timer</h3>\
                    <div class="timer-time-options">\
                        <input type="text" name="hours" maxlength="2" value="00" onchange="timeInput(this);" onkeypress="timers[&quot;' + this.timerID + '&quot;].togglePlayingKey(event);"/> :\
                        <input type="text" name="minutes" maxlength="2" value="00" onchange="secondMinuteInput(this);" onkeypress="timers[&quot;' + this.timerID + '&quot;].togglePlayingKey(event);"/> :\
                        <input type="text" name="seconds" maxlength="2" value="00" onchange="secondMinuteInput(this);" onkeypress="timers[&quot;' + this.timerID + '&quot;].togglePlayingKey(event);"/>\
                    </div>\
                </div>\
                <div class="timer-type">\
                    <h3>Alarm Type</h3>\
                    <div class="timer-type-options">\
                        <select>\
                            <option value="sounds/alarm.mp3">Alarm Clock</option>\
                            <option value="sounds/old-alarm.mp3">Mechanical Alarm Clock</option>\
                            <option value="sounds/bell.mp3">Ringing Bell</option>\
                        </select>\
                        <button title="Mute the alarm sound" class="mute-button" onclick="timers[&quot;' + this.timerID + '&quot;].toggleMuted();"><img src="images/volume-on.png"/></button>\
                    </div>\
                </div>\
                <div class="timer-notes">\
                    <h3>Notes</h3>\
                    <textarea rows="4"></textarea>\
                </div>\
                <div class="timer-options">\
                    <button title="Start/Pause the timer" class="play-button" onclick="timers[&quot;' + this.timerID + '&quot;].togglePlaying();"><img src="images/play.png" /></button>\
                    <button title="Reset the timer" class="reload-button" onclick="timers[&quot;' + this.timerID + '&quot;].reset();"><img src="images/reload.png" /></button>\
                    <button title="Close the timer" class="close-button" onclick="timers[&quot;' + this.timerID + '&quot;].delete();"><img src="images/close.png" /></button>\
                </div>\
        </div>');

        $('.timer-title:last input[name=timer-title]').select();
    };

    Timer.prototype.delete = function () {
        $(this.selector).remove();
        this.sound.pause();
        delete timers[this.timerID];
        $('#title-options button:first').focus();
    };
	
	Timer.prototype.togglePlayingKey = function (event) {
		if (event.keyCode == 13) {
			this.togglePlaying();
		}
	};

    Timer.prototype.togglePlaying = function () {
        this.playing || this.alarmed ? this.pause() : this.play();
    };

    Timer.prototype.toggleMuted = function () {
        this.sound.muted = !this.sound.muted;
        $(this.selector + ' .mute-button img').attr("src", this.sound.muted ? "images/volume-off.png" : "images/volume-on.png");
    };

    Timer.prototype.play = function () {
        this.seconds =  parseInt($(this.selector + ' input[name="hours"]').val() * 3600);
        this.seconds += parseInt($(this.selector + ' input[name="minutes"]').val() * 60);
        this.seconds += parseInt($(this.selector + ' input[name="seconds"]').val());
        if (this.seconds > 0)
        {
            $(this.selector + ' .timer-time-options input').prop("readonly", true);
            $(this.selector + ' .timer-time-options input').css("border", "1px solid rgba(0,0,0,0)");
            $(this.selector + ' .timer-time-options input').css("background-color", "rgba(0,0,0,0)");
            $(this.selector+ ' .play-button img').attr("src", "images/pause.png");
            $('#title-options button:first').focus();
            this.playing = true;
        } else {
          $(this.selector + ' .timer-time-options input:first').select();
        }
    };

    Timer.prototype.pause = function () {
        $(this.selector + ' .timer-time-options input').prop("readonly", false);
        $(this.selector + ' .timer-time-options input').css("border", "1px solid rgba(0,0,0,0.3)");
        $(this.selector + ' .timer-time-options input').css("background-color", "rgba(0,0,0,0.15)");
        $(this.selector+ ' .play-button img').attr("src", "images/play.png");
        $(this.selector).css('background-color', this.colour);
        this.playing = false;
        this.sound.pause();
        this.alarmed = false;
    };

    Timer.prototype.reset = function () {
        this.pause();
        this.seconds = 0;
        this.updateDisplay();
        $(this.selector + ' .timer-title input').val('New Timer');
        $(this.selector + ' .timer-type-options select').val('sounds/alarm.mp3');
        $(this.selector + ' .timer-notes textarea').val('');
        $(this.selector + ' .timer-time-options input:first').select();
    };

    Timer.prototype.decrement = function () {
            this.seconds--;
            this.updateDisplay();
            if(this.seconds == 0)
            {
                this.toggleAlarmed();
                this.playing = false;
            }
    };

    Timer.prototype.updateDisplay = function () {
        var time = getTimeUnits(this.seconds);
        $(this.selector + ' .timer-time-options input[name="hours"]').val(formatTime(time['h']));
        $(this.selector + ' .timer-time-options input[name="minutes"]').val(formatTime(time['m']));
        $(this.selector + ' .timer-time-options input[name="seconds"]').val(formatTime(time['s']));
    };

    Timer.prototype.toggleAlarmed = function () {
        $(this.selector+ ' .play-button img').attr("src", "images/stop.png");
        this.sound.setAttribute('src', $(this.selector + ' .timer-type-options select').val());
        this.sound.play();
        this.alarmed = true;
    };

    Timer.prototype.toggleAlarmAnimation = function () {
        var currentColour = $.Color( $(this.selector).css('background-color')).toHexString();
        $(this.selector).css('background-color', currentColour != this.colour ? this.colour : 'rgba(0,0,0,0.3)');
        var title = $(document).prop('title');
    };

    return Timer;
})();

// Collective timer functions

function addTimer() {
    var s = 'timer-'+timerCounter;
    var timer = new Timer(s);
    timers[s] = timer;
    timerCounter++;
    resizeTimerspace();
};

function removeTimers() {
    for (var key in timers) timers[key].delete();
    timers = {};
};

function playTimers() {
    for (var key in timers) timers[key].play();
};

function pauseTimers() {
    for (var key in timers) timers[key].pause();
};

// Misc functions

function formatTime(time) {
    if (time.toString().length < 2) return '0' + time.toString();
    return time;
};

function getTimeUnits(bareSeconds) {
    var hours = Math.floor(bareSeconds/3600);
    var minutes = Math.floor((bareSeconds - hours*3600)/60);
    var seconds = bareSeconds - (hours*3600) - (minutes*60);
    return {'h': hours, 'm': minutes, 's': seconds};
};

function resizeTimerspace() {
    var size = $(".timer").outerWidth(true);
    if (size != null) {
        var screenSize = $('body').width();
        $('#timerspace').css("margin-left", Math.floor((screenSize - (size * (Math.floor(screenSize/size))))/2) +"px");
    }
};

$( window ).resize(function() {
  resizeTimerspace();
});

function secondMinuteInput(input) {
    timeInput(input);
    if (input.value > 59) input.value = 59;
};

function timeInput(input) {
    if (input.value < 0) input.value = 0;
};

function getPageTime(lowestTime) {
    if(lowestTime != null) {
        var time = getTimeUnits(lowestTime);
        return '[' + formatTime(time['h']) + ':' + formatTime(time['m']) + ':' + formatTime(time['s']) + '] ';
    } else {
        return '';
    }
};

function getPageAlarmed(alarmed) {
    var title = $(document).prop('title');
    if (alarmed && (title.indexOf('/!\\ ') == -1)) {
        return '/!\\ ';
    } else {
        return '';
    }
};

function updatePageTitle(lowestTime, alarmed) {
    var titlePrepend = getPageAlarmed(alarmed) + getPageTime(lowestTime);
    $(document).prop('title', titlePrepend + pageTitle);
};

setInterval(function(){
    var lowestTime = null;
    var alarmed = false;
    for (var key in timers) {
        if (timers[key].playing) timers[key].decrement();
        if (timers[key].alarmed) timers[key].toggleAlarmAnimation();
        if (lowestTime == null && timers[key].seconds > 0) lowestTime = timers[key].seconds;
        if (timers[key].seconds < lowestTime && timers[key].seconds > 0) lowestTime = timers[key].seconds;
        alarmed = alarmed || timers[key].alarmed;
    }
    updatePageTitle(lowestTime, alarmed);
}, 1000);
