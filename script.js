const albumCards = document.querySelectorAll(".album-card");
const audioPlayer = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const seekBar = document.getElementById("seek-bar");
const currentTimeEl = document.getElementById("current-time");
const totalDurationEl = document.getElementById("total-duration");
const volumeBar = document.getElementById("volume-bar");

const currentSongTitle = document.getElementById("current-song");
const currentArtist = document.getElementById("current-artist");
const songCover = document.getElementById("song-cover");

const musicPlayer = document.querySelector('.music-player');

let currentSongIndex = -1;
let isPlaying = false;
let songList = [];

// Prepare the song list from album cards
albumCards.forEach((card) => {
  const audio = card.getAttribute("data-audio");
  const title = card.querySelector("h3").textContent;
  const artist = card.querySelector("p").textContent;
  const image = card.querySelector("img").src;
  songList.push({ audio, title, artist, image });
});

// Load and play a song by index
function loadSong(index) {
  const song = songList[index];
  if (!song) return;

  audioPlayer.src = song.audio;
  currentSongTitle.textContent = song.title;
  currentArtist.textContent = song.artist;
  songCover.src = song.image;

  audioPlayer.play();
  isPlaying = true;
  playBtn.textContent = "⏸️";
  currentSongIndex = index;

  // Show music player by adding the 'visible' class
  musicPlayer.classList.add('visible');
}

// Hide player (optional)
function hidePlayer() {
  musicPlayer.classList.remove('visible');
  audioPlayer.pause();
  isPlaying = false;
  playBtn.textContent = "▶️";
  currentSongIndex = -1;
}

// Album card click - load song and show player
albumCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    loadSong(index);
  });
});

// Play/pause toggle
playBtn.addEventListener("click", () => {
  if (isPlaying) {
    audioPlayer.pause();
    playBtn.textContent = "▶️";
  } else {
    audioPlayer.play();
    playBtn.textContent = "⏸️";
  }
  isPlaying = !isPlaying;
});

// Next song
nextBtn.addEventListener("click", () => {
  if (currentSongIndex < songList.length - 1) {
    loadSong(currentSongIndex + 1);
  }
});

// Previous song
prevBtn.addEventListener("click", () => {
  if (currentSongIndex > 0) {
    loadSong(currentSongIndex - 1);
  }
});

// Update seek bar and time display
audioPlayer.addEventListener("timeupdate", () => {
  if (audioPlayer.duration) {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    seekBar.value = progress;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    totalDurationEl.textContent = formatTime(audioPlayer.duration);
  }
});

// Seek song on seek bar input
seekBar.addEventListener("input", () => {
  if (audioPlayer.duration) {
    const seekTime = (seekBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
  }
});

// Volume control
volumeBar.addEventListener("input", () => {
  audioPlayer.volume = volumeBar.value / 100;
});

// Format time (mm:ss)
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

// Auto play next song or stop at end
audioPlayer.addEventListener("ended", () => {
  if (currentSongIndex < songList.length - 1) {
    loadSong(currentSongIndex + 1);
  } else {
    isPlaying = false;
    playBtn.textContent = "▶️";
  }
});

// Search functionality
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  albumCards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const artist = card.querySelector("p").textContent.toLowerCase();

    if (title.includes(query) || artist.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});
