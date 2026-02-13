const glitterContainer = document.querySelector(".glitters");
const heartExplosion = document.getElementById("heartExplosion");
const screens = document.querySelectorAll(".screen");
const beginBtn = document.getElementById("beginBtn");
const enterBtn = document.getElementById("enterBtn");
const nextBtns = document.querySelectorAll(".nextBtn");
const introLine = document.getElementById("introLine");
const bgMusic = document.getElementById("bgMusic");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const gameNextBtn = document.getElementById("gameNextBtn");

let score = 0;
let gameInterval;
let current = 0;

/* SONGS ARRAY */
const songs = [
  "song1.mp3",
  "song2.mp3",
  "game.mp3",
  "song3.mp3",
  "song4.mp3",
  "song5.mp3",
  "song6.mp3"
];

/* ================= MUSIC ================= */

function fadeOutMusic(callback) {
  let fadeOut = setInterval(() => {
    if (bgMusic.volume > 0.05) {
      bgMusic.volume -= 0.05;
    } else {
      clearInterval(fadeOut);
      bgMusic.pause();
      bgMusic.volume = 1;
      if (callback) callback();
    }
  }, 100);
}

function fadeInMusic() {
  bgMusic.volume = 0;
  bgMusic.play().catch(() => {});
  let fadeIn = setInterval(() => {
    if (bgMusic.volume < 0.95) {
      bgMusic.volume += 0.05;
    } else {
      clearInterval(fadeIn);
      bgMusic.volume = 1;
    }
  }, 100);
}

function playMusic(index) {
  fadeOutMusic(() => {
    bgMusic.src = songs[index];
    bgMusic.currentTime = 0;
    fadeInMusic();
  });
}

/* ================= TYPEWRITER ================= */

function typeWriter(element, speed = 70, callback = null) {
  const text = element.getAttribute("data-text");
  element.textContent = "";
  let i = 0;

  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else if (callback) {
      callback();
    }
  }

  typing();
}

/* ================= STOP VIDEOS ================= */

function stopVideos() {
  document.querySelectorAll("video").forEach(v => {
    v.pause();
    v.currentTime = 0;
  });
}

/* ================= GAME ================= */

function startGame() {

  score = 0;
  scoreDisplay.textContent = score;
  gameNextBtn.style.display = "none";

  clearInterval(gameInterval);

  gameInterval = setInterval(() => {

    const heart = document.createElement("div");
    heart.classList.add("fallHeart");

    heart.style.left = Math.random() * 90 + "%";
    heart.style.top = "0px";

    gameArea.appendChild(heart);

    let fall = setInterval(() => {
      heart.style.top = heart.offsetTop + 3 + "px";

      if (heart.offsetTop > gameArea.offsetHeight) {
        heart.remove();
        clearInterval(fall);
      }
    }, 20);

    function catchHeart() {
      score++;
      scoreDisplay.textContent = score;
      heart.remove();
      clearInterval(fall);
    }

    heart.addEventListener("mouseover", catchHeart);
    heart.addEventListener("touchstart", catchHeart);

  }, 700);

  setTimeout(() => {
    clearInterval(gameInterval);
    gameNextBtn.style.display = "inline-block";
  }, 20000);
}

/* ================= GLITTER ================= */

function createGlitters() {
  if (!glitterContainer) return;

  glitterContainer.innerHTML = "";

  for (let i = 0; i < 35; i++) {
    const sparkle = document.createElement("div");
    sparkle.classList.add("glitter");

    sparkle.style.left = Math.random() * 100 + "%";
    sparkle.style.top = Math.random() * 100 + "%";
    sparkle.style.animationDelay = Math.random() * 4 + "s";

    glitterContainer.appendChild(sparkle);
  }
}

/* ================= SHOW SLIDE ================= */

function showSlide(index) {

  screens.forEach(screen => screen.classList.remove("active"));
  screens[index].classList.add("active");

  stopVideos();
  playMusic(index);

  if (glitterContainer) glitterContainer.innerHTML = "";

  if (index === 5) {
    createGlitters();
  }

  if (screens[index].classList.contains("slideGame")) {
    startGame();
  }

  const heading = screens[index].querySelector("h1");
  const paragraph = screens[index].querySelector("p");

  if (index !== 0) {
    setTimeout(() => {
      if (heading) {
        typeWriter(heading, 90, () => {
          if (paragraph) {
            typeWriter(paragraph, 45);
          }
        });
      }
    }, 200);
  }
}

/* ================= INITIAL LOAD ================= */

document.addEventListener("DOMContentLoaded", () => {
  const firstHeading = screens[0].querySelector("h1");
  typeWriter(firstHeading, 90);
});

/* ================= BEGIN BUTTON ================= */

beginBtn.addEventListener("click", () => {

  // Play first song directly (required for mobile Safari)
  bgMusic.src = songs[0];
  bgMusic.currentTime = 0;
  bgMusic.volume = 1;
  bgMusic.play().catch(() => {});

  // 💖 Explosion Hearts
  for (let i = 0; i < 80; i++) {
    const heart = document.createElement("div");
    heart.classList.add("explodeHeart");

    heart.style.left = Math.random() * 100 + "%";
    heart.style.bottom = "-20px";
    heart.style.animationDuration = (4 + Math.random() * 3) + "s";

    heartExplosion.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 6000);
  }

  beginBtn.classList.remove("pulseBtn");
  beginBtn.style.display = "none";

  introLine.style.opacity = 1;

  typeWriter(introLine, 50, () => {
    enterBtn.style.display = "inline-block";
    enterBtn.classList.add("pulseBtn");
  });

});

/* ================= NAVIGATION ================= */

enterBtn.addEventListener("click", () => {
  current++;
  showSlide(current);
});

nextBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    current++;
    showSlide(current);
  });
});

if (gameNextBtn) {
  gameNextBtn.addEventListener("click", () => {
    current++;
    showSlide(current);
  });
}
