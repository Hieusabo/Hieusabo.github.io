const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const playlist = $('.playlist')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const app = {
  songs: [
  {
    name:'The Woods',
    singer: 'Hollow Coves',
    path: 'asset/ALVYN & JSTN DMND - SKY BRI [NCS Release].mp3',
    image: 'asset/imgs/download.jpeg'
  },
  {
    name:'Jealous',
    singer: 'Labrinth',
    path: 'asset/y2mate.is - labrinth___jealous__official_video_-50VWOBi0VFs-192k-1692857322.mp3',
    image: 'asset/imgs/download (1).jpeg'
  },
  {
    name:'These Memories',
    singer: 'Hollow Coves',
    path: 'asset/y2mate.is - Hollow Coves These Memories Official Music Video -j6Keg3XKKjM-192k-1692857104.mp3',
    image: 'asset/imgs/download (5).jpeg'
  },
  {
    name:'LP',
    singer: 'Lost On You',
    path: 'asset/y2mate.is - LP Lost On You Live -wDjeBNv6ip0-192k-1692857164.mp3',
    image: 'asset/imgs/download (2).jpeg'
  },
  {
    name:'Creep',
    singer: 'Radiohead',
    path: 'asset/y2mate.is - Radiohead Creep Acoustic Cover -EjWAdKWEVUE-192k-1692857374.mp3',
    image: 'asset/imgs/radiohead.avif'
  },
  {
    name:'Freaks',
    singer: 'Surf Curse',
    path: 'asset/y2mate.is - Surf Curse Freaks Official Audio -NfMegACVJQw-192k-1692857239.mp3',
    image: 'asset/imgs/download (3).jpeg'
  },
  {
    name:'Another Love',
    singer: 'Tom Odell',
    path: 'asset/y2mate.is - Tom Odell Another Love Official Video -MwpMEbgC7DA-192k-1692857148.mp3',
    image: 'asset/imgs/download (4).jpeg'
  },
  
],

  currentIndex:0,
  isPlaying: false,
  isRandom: false,

  render: function() {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? "active" :''}" data-index="${index }">
          <div class="thumb" style="background-image: url('${song.image}')">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
        `
        
      })
      playlist.innerHTML = htmls.join('')
    },

//Current song
defineProperties: function () {
  Object.defineProperty(this, 'currentSong', {
    get:function () {
      return this.songs[this.currentIndex]
    }
  })
},

//CD zoom in and out
handleEvents: function(){
  _this = this
  
  const cd = $('.cd')
  const cdWidth = cd.offsetWidth 

  //CD spining
  const cdThumbAnimate = cdThumb.animate({
    transform: 'rotate(360deg)'
  }, {
    duration: 10000,
    iterations: Infinity
  })
  cdThumbAnimate.pause()
  
  document.onscroll = function() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const newcdWidth = cdWidth - scrollTop
    cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0
    cd.style.opacity = newcdWidth/cdWidth  
  }
  playBtn.onclick = function () {
    if(_this.isPlaying){
        audio.pause()    
    } else {
        audio.play()
        
    }
  }
  //song play
  audio.onplay = function() {
    _this.isPlaying = true
    player.classList.add('playing')
    cdThumbAnimate.play()
  }
  //song pause
  audio.onpause = function() {
    _this.isPlaying = false
    player.classList.remove('playing')
    cdThumbAnimate.pause()
  }
  //song progress
  audio.ontimeupdate = function() {
    if (audio.duration) {
      const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
      progress.value = progressPercent
    }
  }
  //next song
  btnNext.onclick = function() {
    _this.nextSong()
    audio.play()
    _this.render()
    _this.scollToActiveSong()
  }
  //prev song
  btnPrev.onclick = function() {
    _this.prevSong()
    audio.play()
    _this.render()
  }
  //song adjustment
    progress.onchange = function(e) {
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
    }
  //song random
  randomBtn.onclick = function() {
    _this.isRandom = !_this.isRandom
    randomBtn.classList.toggle('active', _this.isRandom)
    _this.playRandomSong()
  }


  //song repeat
  repeatBtn.onclick = function() {
    _this.isRepeat = !_this.isRepeat
    repeatBtn.classList.toggle('active', _this.isRepeat)
  }

  audio.onended = function() {
    if(_this.isRepeat) {
      audio.play()
    } else {
      btnNext.click()
    }
  }

  //Click action
  playlist.onclick = function(e) {
    // click song
    const songNode = e.target.closest('.song:not(.active)')

    if (songNode || e.target.closest('.option')) {
      if (songNode) {
        _this.currentIndex = songNode.dataset.index
        _this.loadCurrentSong()
        audio.play()
        _this.render()
      }
    }
  }
},
//Song view
scollToActiveSong: function() {
  setTimout(()=> {
    $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
    })
  }, 500)
},
//Handle when play
loadCurrentSong: function() {
  heading.textContent = this.currentSong.name
  cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
  audio.src = this.currentSong.path
},

nextSong: function() {
  this.currentIndex++
  if (this.currentIndex >= this.songs.length) {
    this.currentIndex = 0
  }
  this.loadCurrentSong()
},

prevSong: function() {
  this.currentIndex--
  if (this.currentIndex < 0) {
    this.currentIndex = this.songs.length - 1
  }
  this.loadCurrentSong()
},

playRandomSong: function() {
  let nextIndex
  do {
    nextIndex = Math.floor(Math.random() * this.songs.length)
  }
  while (this.currentIndex === nextIndex)
  this.loadCurrentSong()
},

start: function() {
  this.handleEvents()
  this.defineProperties()
        this.render()
        this.loadCurrentSong()
      } 
    }
app.start()