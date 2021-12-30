let musicData = `{
    "musics":[
        {
            "name": "music name",
            "author": "music author",
            "music_path": "mp3 file name",
            "image_path": "jpg file name"
        },
        {
            "name": "music name",
            "author": "music author",
            "music_path": "mp3 file name",
            "image_path": "jpg file name"
        }
    ]
}`
const data = JSON.parse(musicData)

var folder = "./musics"

let actualIndex = 0

if(getCookie("music_id")) actualIndex = parseInt(getCookie("music_id"))
if(getCookie("music_volume")) musicVolumeBarAction("cookie", parseInt(getCookie("music_volume")))
if(getCookie("music_currentTime")) player.currentTime = parseInt(getCookie("music_currentTime"))

createPlayList()
loadMusic(`${data.musics[actualIndex].music_path}`)

var time_value = 0

function createPlayList(){
    for (let i = 0; i < data.musics.length-1; i++) {
        const element = document.getElementById("playlist-list").children[0]
        const clon = element.cloneNode(true)
        music = document.getElementById("playlist-list").appendChild(clon)
        music.classList.remove("active")
    }

    for (let i = 0; i < data.musics.length; i++) {
        const element = document.getElementById("playlist-list").children[i]
        element.children[0].src = `./images/${data.musics[i].image_path}`
        element.children[1].children[0].innerHTML = data.musics[i].name
        element.children[1].children[1].innerHTML = data.musics[i].author
    }
}

function playing(){
    const music_played = document.getElementsByClassName("active")
    if(music_played.length > 0) music_played[0].classList.remove("active")
    
    const music_playing = document.getElementById("playlist-list").children[parseInt(getCookie("music_id"))]
    if(music_playing) music_playing.classList.add("active")    
}

function nextMusic(){
    if(actualIndex == data.musics.length - 1){
        actualIndex = 0
        loadMusic(data.musics[actualIndex].music_path)
    }else {
        actualIndex += 1
        loadMusic(data.musics[actualIndex].music_path)
    }
}

function prevMusic(){
    if(actualIndex == 0){
        actualIndex = data.musics.length - 1
        loadMusic(data.musics[actualIndex].music_path)
    }else{
        actualIndex -= 1
        loadMusic(data.musics[actualIndex].music_path)
    }
}

function loadMusic(route, first){
    source.src = "./"+folder+'/'+route
    setCookie("music_id", actualIndex, 2)
    loadInfo()
    playing()
    if(!player.paused){
        player.load()
        togglePlay()
    }else{
        player.load()
        changeIconPlay("paused")
    }
    
    
}

const musics = document.getElementById("playlist-list")
for (let i = 0; i < data.musics.length; i++) {
    musics.children[i].addEventListener("click", (e)=>{
        selectMusic(i)})
}


function selectMusic(music){
    actualIndex = music
    loadMusic(data.musics[music].music_path)
}

function musicTimeBarAction(){
    const bar_value = document.getElementById('music_time_bar')
    if(bar_value.value > time_value || bar_value.value < time_value){
        percentage = bar_value.value / 100
        time = percentage * player.duration
        time_value = time
        player.currentTime = time_value
        console.log(time_value)
    }
}

function musicVolumeBarAction(option, volume_value){
    const volume_bar = document.getElementById('music_volume_bar')
    const volume_icon = document.getElementById('music_volume_icon')

    /* control volume */

    if(option != "cookie"){

        if(volume_bar.value > 50){
            player.volume = volume_bar.value/110
        }else if(volume_bar.value < 50){
            player.volume = volume_bar.value/110
        }
    }else{
        if(volume_value > 50){
            player.volume = volume_bar.value/110
        }else if(volume_value < 50){
            player.volume = volume_bar.value/110
        }
        volume_bar.value = volume_value
    }
    

    if(player.volume <= 0){
        volume_icon.className = "fas fa-volume-mute volume"
    }else{
        volume_icon.className = "fas fa-volume-up volume"
    }

    setCookie("music_volume", volume_bar.value, "2")
}

function updateProgress(){
    musicVolumeBarAction()
    musicTimeBarAction()

    time_value = player.currentTime
    setCookie("music_currentTime", time_value, "2")
    const bar_value = document.getElementById('music_time_bar')

    a = player.currentTime / player.duration
    barValue = Math.floor(a * 100)

    time_value = barValue
    bar_value.value = time_value

    if(player.ended){
        nextMusic()
    }
}

function loadInfo(){
    console.log(data.musics[actualIndex])
    const img = document.getElementById('music-img')
    const title = document.getElementById('music-title')
    const author = document.getElementById('music-author')
    const duration = document.getElementById('music-duration')
    const current_time = document.getElementById('music-current-time')

    img.src = "./images/"+data.musics[actualIndex].image_path
    img.alt = `MUSIC ${data.musics[actualIndex].name}, ${data.musics[actualIndex].author}`
    title.innerHTML = data.musics[actualIndex].name
    author.innerHTML = data.musics[actualIndex].author



    player.onloadeddata = function() {
        function bar(){
            currentMinutes = Math.floor(player.currentTime/60)
            currentSeconds = Math.floor(player.currentTime - currentMinutes * 60)

            if(currentMinutes < 10) currentMinutes = `0${currentMinutes}`
            if(currentSeconds < 10) currentSeconds = `0${currentSeconds}`


            current_time.innerHTML = `${currentMinutes}:${currentSeconds}`

            durationMinutes = Math.floor(player.duration/60)
            durationSeconds = Math.floor(player.duration - durationMinutes * 60)

            if(durationMinutes < 10) durationMinutes = `0${durationMinutes}`
            if(durationSeconds < 10) durationSeconds = `0${durationSeconds}`

            duration.innerHTML = `${durationMinutes}:${durationSeconds}`           
            
        }

        bar()
        setInterval(() => {if (!player.paused) bar()}, 1000)
        };
    }

function togglePlay() {
    if(player.paused){
        changeIconPlay("played")
        return player.play()
    }else{
        changeIconPlay("paused")
        return player.pause();
    }
}

function changeIconPlay(value){
    var element = document.getElementById("iconPlay")
    if(value == "paused"){
        element.className = "fas fa-play"
        return "paused"
    }else if(value == "played"){
        element.className = "fas fa-pause"
        return "played"
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }