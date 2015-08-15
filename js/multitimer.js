var Timer = (function () {
    function Timer(newID) {
        this.timerID = newID;
        this.colour = $.Color().hsla(Math.floor(Math.random() * 36)*10,1,0.7,1).toHexString();
        this.seconds = 0;
        this.playing = false;

        this.create();
    }

    Timer.prototype.create = function () {
        $("#timerspace").append('<div id="' + this.timerID + '" class="timer" style="background-color:' + this.colour +';">\
                <div class="timer-title">\
                    <input type="text" name="timer-title" maxlength="20" />\
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
                            <option name="annoying">Annoying Alarm</option>\
                            <option name="soothing">Soothing Alarm</option>\
                        </select>\
                        <button><img src="images/volume-off.png"/></button>\
                    </div>\
                </div>\
                <div class="timer-notes">\
                    <h3>Notes</h3>\
                    <textarea rows="4"></textarea>\
                </div>\
                <div class="timer-options">\
                    <button class="play-button"><img src="images/play.png" /></button>\
                    <button class="reload-button"><img src="images/reload.png" /></button>\
                    <button class="close-button"><img src="images/close.png" /></button>\
                </div>\
        </div>');
    }

    Timer.prototype.togglePlaying = function () {
    
    };

    Timer.prototype.decrement = function () {
    };
    Timer.prototype.toggleAlarmed = function () {
    };
    return Timer;
})();


// Collective timer functions

function addTimer() {
    var b = new Timer("phil");
}

function removeTimers() {

}

function toggleTimers() {

}
