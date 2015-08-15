var timers = {};
var timerCounter = 0;


// Timer Object
var Timer = (function () {
    function Timer(newID) {
        this.timerID = newID;
        this.colour = $.Color().hsla(Math.floor(Math.random() * 36)*10,1,0.7,1).toHexString();
        this.seconds = 0;
        this.playing = false;
        this.sound = null;
        this.muted = false;

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
                        <input type="text" name="hours" maxlength="2" value="00"/> :\
                        <input type="text" name="minutes" maxlength="2" value="00"/> :\
                        <input type="text" name="seconds" maxlength="2" value="00"/>\
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
                        <button><img src="images/volume-off.png"/></button>\
                    </div>\
                </div>\
                <div class="timer-notes">\
                    <h3>Notes</h3>\
                    <textarea rows="4"></textarea>\
                </div>\
                <div class="timer-options">\
                    <button class="play-button" onclick="timers[&quot;' + this.timerID + '&quot;].togglePlaying();"><img src="images/play.png" /></button>\
                    <button class="reload-button" onclick="timers[&quot;' + this.timerID + '&quot;].decrement();"><img src="images/reload.png" /></button>\
                    <button class="close-button" onclick="timers[&quot;' + this.timerID + '&quot;].delete();"><img src="images/close.png" /></button>\
                </div>\
        </div>');
    }

    Timer.prototype.delete = function () {
        $('#' + this.timerID).remove();
        if (this.sound != null) {
            this.sound.pause();
        }
        delete timers[this.timerID];
    }

    Timer.prototype.sampleSound = function () {
        var src = $('#' + this.timerID + ' .timer-type-options select').val();
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', src);
        audioElement.play();
    }

    Timer.prototype.togglePlaying = function () {
        if (this.playing)
        {
            this.pause();
        } else {
            this.play();
        }

    };

    Timer.prototype.play = function () {
        // Get the seconds
        this.seconds =  parseInt($('#' + this.timerID + ' input[name="hours"]').val() * 3600);
        this.seconds += parseInt($('#' + this.timerID + ' input[name="minutes"]').val() * 60);
        this.seconds += parseInt($('#' + this.timerID + ' input[name="seconds"]').val());

        if (this.seconds > 0)
        {
            $('#' + this.timerID + ' .timer-time-options input').prop("readonly", true);
            $('#' + this.timerID + ' .timer-time-options input').css("border", "1px solid rgba(0,0,0,0)");
            $('#' + this.timerID + ' .timer-time-options input').css("background-color", "rgba(0,0,0,0)");
            $('#' + this.timerID+ ' .play-button img').attr("src", "images/pause.png");
            this.playing = true;
        }

    }

    Timer.prototype.pause = function () {
        $('#' + this.timerID + ' .timer-time-options input').prop("readonly", false);
        $('#' + this.timerID + ' .timer-time-options input').css("border", "1px solid rgba(0,0,0,0.3)");
        $('#' + this.timerID + ' .timer-time-options input').css("background-color", "rgba(0,0,0,0.15)");

        $('#' + this.timerID+ ' .play-button img').attr("src", "images/play.png");

        this.playing = false;
        this.sound.pause();
    }

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
        var hours = Math.floor(this.seconds/3600);
        var minutes = Math.floor((this.seconds - hours*3600)/60);

        $('#' + this.timerID + ' .timer-time-options input[name="hours"]').val(formatTime(hours));
        $('#' + this.timerID + ' .timer-time-options input[name="minutes"]').val(formatTime(minutes));
        $('#' + this.timerID + ' .timer-time-options input[name="seconds"]').val(formatTime(this.seconds - (hours*3600) - (minutes*60)));
    }

    Timer.prototype.toggleAlarmed = function () {
        var src = $('#' + this.timerID + ' .timer-type-options select').val();
        this.sound = document.createElement('audio');
        this.sound.setAttribute('src', src);
        this.sound.setAttribute('loop', true);
        this.sound.play();
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

}

function removeTimers() {
    for (var key in timers) {
            timers[key].pause();
    }

    timers = {};
    $('.timer').remove();
}

function playTimers() {
    for (var key in timers) {
            timers[key].play();
    }
}

function pauseTimers() {
    for (var key in timers) {
            timers[key].pause();
    }
}


// Misc functions

function formatTime(time) {
    var s = time.toString();
    if (s.length < 2)
    {
        return '0' + s;
    }
    return s;
}

function resizeTimerspace() {
    var size = $(".timer").outerWidth(true);
    if (size != null) {
        var screenSize = $(window).width();
        $('#timerspace').css("margin-left", Math.floor((screenSize - (size * (Math.floor(screenSize/size))))/2) +"px");
    }
}

$( window ).resize(function() {
  resizeTimerspace();
});

setInterval(function(){
    for (var key in timers) {

        if (timers[key].playing)
        {
            timers[key].decrement();
        }
    }
}, 1000);
