document.querySelector('body').addEventListener('contextmenu', function (e) {
    e.preventDefault()
});
var playerContainer = document.querySelector('.player-container');
var video = document.querySelector('video');
var playerTools = document.querySelector('.player-tools');
var btnFullscreen = document.querySelector('.tool-fullscreen');
var btnPlay = document.querySelector('.tool-play-pause');
var btnSettings = document.querySelector('.tool-settings');
var settingsContainer = document.querySelector('.settings-container');
var videoTime = document.querySelector('.video-time');
var timeLine = document.querySelector('.player-timeline');
var timeLineSeeker = document.querySelector('.player-timeline-seeker');
var timeLineBufferd = document.querySelector('.player-timeline-buffered');
var sliderVolumeGuide = document.querySelector('.slider-volume-guide');
var sliderVolume = document.querySelector('.slider-volume');
var sliderVolumeContainer = document.querySelector('.slider-volume-container');
var speedies = document.querySelectorAll('.speedies li');
var playerInterval = null;
var isFullscreen = false;

sliderVolume.addEventListener('input', setVolume);
timeLineSeeker.addEventListener('click', goTo);
btnPlay.addEventListener('click', play);
btnFullscreen.addEventListener('click', fullScreen);

for (const item of speedies) {
    item.addEventListener('click', setSpeed);
}

video.addEventListener('mouseover', function () {
    playerTools.style.cssText = 'opacity:1';
})
playerTools.addEventListener('mouseover', function () {
    playerTools.style.cssText = 'opacity:1';
})
video.addEventListener('mouseleave', function () {
    playerTools.style.cssText = 'opacity:0';
})
document.querySelector('.tool-volume').addEventListener('click', function () {
    sliderVolumeContainer.style.cssText = 'opacity:1;display:block';
})
document.querySelector('.tool-volume').addEventListener('mouseleave', function () {
    sliderVolumeContainer.style.cssText = 'opacity:0;display:none';
})
btnSettings.addEventListener('click', function () {
    settingsContainer.style.cssText = 'opacity:1;display:block';
})
btnSettings.addEventListener('mouseleave', function () {
    settingsContainer.style.cssText = 'opacity:0;display:none';
})

document.body.addEventListener('keypress', keyBoardHandler)

function keyBoardHandler(e) {
    switch (e.key) {
        case 'f':
            fullScreen();
            break;
        case ' ':
            play();
            break;
        case 'k':
            play();
            break;
        case 'r':
            replay();
            break;
        case 'l':
            forward();
            break;
        case 'j':
            back();
            break;
        default:
            console.log(e.key);
            return false;
    }
}

function play() {
    if (playerInterval == null) {
        playerInterval = setInterval(function () {
            setCurrentTime()
        }, 100);
        btnPlay.style.cssText = 'background: url(img/icons.png) -73px 140px;';
        video.play();
    } else {
        clearInterval(playerInterval);
        playerInterval = null;
        btnPlay.style.cssText = 'background: url(img/icons.png) 110px 140px;';
        video.pause();
    }
}

function replay() {
    clearInterval(playerInterval);
    playerInterval = null;
    video.currentTime = 0;
    play();
}

function forward() {
    video.currentTime += 10;
}

function back() {
    video.currentTime -= 10;
}

function setSpeed() {
    for (const item of speedies) {
        item.style.cssText = 'font-weight: 500;text-decoration: none;';
    }
    this.style.cssText = 'font-weight: 700;text-decoration: underline;';
    video.playbackRate = this.dataset.speed;
}

function fullScreen() {
    if (isFullscreen) {
        document.exitFullscreen();
        playerContainer.style.cssText = 'width:800px;height:500px';
        isFullscreen = false;
    }
    else {
        var width = document.body.clientWidth;
        document.body.requestFullscreen();
        playerContainer.style.cssText = `width: ${width}px;height:100%;`;
        isFullscreen = true;
    }
}

function setCurrentTime() {
    timeLineBufferd.style.cssText = 'width:' + (video.buffered.end(video.buffered.length - 1) / video.duration) * 100 + '%';
    timeLine.style.cssText = 'width:' + (video.currentTime / video.duration) * 100 + '%';
    var hourDuration = Math.floor(video.duration / 3600);
    var minDuration = Math.floor(video.duration / 60);
    var secDuration = Math.floor((video.duration / 60) % 1 * 60);

    var hourCurrent = Math.floor(video.currentTime / 3600);
    var minCurrent = Math.floor(video.currentTime / 60);
    var secCurrent = Math.floor((video.currentTime / 60) % 1 * 60);
    videoTime.innerText = converTime(hourDuration, minCurrent, secCurrent) + ' / ' + converTime(hourDuration, minDuration, secDuration);

    if (video.currentTime === video.duration) {
        playerTools.style.cssText = 'opacity:1';
        btnPlay.style.cssText = 'background: url(img/icons.png) 76px 140px;transform:rotateY(180deg)';
        clearInterval(playerInterval);
        playerInterval = null;
    }
}

function goTo(event) {
    var seek = (event.clientX / timeLineSeeker.clientWidth) * 100;
    video.currentTime = (video.duration * seek) / 100;
}

function setVolume() {
    var currValue = sliderVolume.value / 100;
    video.volume = currValue;
    sliderVolumeGuide.style.cssText = 'width:calc(' + String(currValue * 100) + '% - 5px)';
}

function converTime(hour, min, sec) {
    if (hour == 0) hour = ''
    if (hour > 0 && hour < 10)
        hour = '0' + String(hour) + ':';
    if (hour > 10)
        hour = String(hour) + ':';
    if (min < 10)
        min = '0' + String(min) + ':';
    if (min > 10 && min < 60)
        min = String(min) + ':';
    if (sec < 10)
        sec = '0' + String(sec);
    if (sec > 10 && sec < 60)
        sec = String(sec);

    return hour + min + sec;
}