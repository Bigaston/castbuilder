playbutton = document.getElementById("play");
playbutton.addEventListener('click', playAudio);

bar = document.getElementById("progressbar")
bar.addEventListener("click", changeTime);

player = document.getElementById("audiosound");

duration = document.getElementById("audio-duration");
durationObj = convertHMS(player.duration)
duration.innerHTML = durationObj.heure + ":" + durationObj.minute + ":" + durationObj.seconde;

document.getElementsByClassName("timeJump")[0].addEventListener("click", jumpTime)
document.getElementsByClassName("timeJump")[1].addEventListener("click", jumpTime)

setInterval(updateTime, 1000);

function playAudio() {
    if (playbutton.classList.contains("fa-play-circle")) {
      player.play()
      playbutton.className = "fas fa-pause-circle"
    } else {
      player.pause()
      playbutton.className = "fas fa-play-circle"
    }
  
    playbutton.addEventListener('click', playAudio);
}

function updateTime() {
    timeText = document.getElementById("audio-time");
    currentTime = convertHMS(player.currentTime)
    timeText.innerHTML = currentTime.heure + ":" + currentTime.minute + ":" + currentTime.seconde;
  
  
    duration = document.getElementById("audio-duration");
    durationObj = convertHMS(player.duration)
    duration.innerHTML = durationObj.heure + ":" + durationObj.minute + ":" + durationObj.seconde;
  
    progress=document.getElementById("prog");
  
    progress.style = "width:" + Math.trunc((player.currentTime/player.duration)*100) + "%;"
}

function changeTime(event) {
    var percent = event.offsetX / this.offsetWidth;
    player.currentTime = percent * player.duration;
}

function convertHMS(pSec) {
    nbSec = pSec;
    sortie = {};
    sortie.heure = Math.trunc(nbSec/3600);
    if (sortie.heure < 10) {sortie.heure = "0"+sortie.heure}
  
    nbSec = nbSec%3600;
    sortie.minute = Math.trunc(nbSec/60);
    if (sortie.minute < 10) {sortie.minute = "0"+sortie.minute}
  
    nbSec = nbSec%60;
    sortie.seconde = Math.trunc(nbSec);
    if (sortie.seconde < 10) {sortie.seconde = "0"+sortie.seconde}
  
    return sortie
}

function jumpTime(event) {
    player = document.getElementById("audiosound");
    if (event.target.attributes["sens"].value == "+") {
      player.currentTime = player.currentTime + 10
    } else {
      player.currentTime = player.currentTime - 10
    }
}
  
function addZero(val) {
    if (Math.trunc(val) != val) {
      return "" + val;
    } else {
      return "" + val + ".0"
    }
}