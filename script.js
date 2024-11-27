let score = 0; // Inisialisasi skor
let currentQuestionIndex = 0;
let timeLeft = 15;
let timer;
let shuffledColors = [];
let currentColor = {};
let usedColorNames = []; // Array untuk menyimpan nama warna yang sudah digunakan
let playerName = ''; // Variabel untuk menyimpan nama pemain

if ('speechSynthesis' in window) {
    console.log('Speech Synthesis API is supported.');
} else {
    console.log('Speech Synthesis API is not supported in this browser.');
}

// Fungsi untuk mengeluarkan suara
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text); // Membuat objek untuk suara
    utterance.lang = 'id-ID'; // Atur bahasa ke Bahasa Indonesia
    speechSynthesis.speak(utterance); // Mengeluarkan suara
}

document.getElementById('startButton').onclick = function() {
    playerName = document.getElementById('playerName').value; // Simpan nama pemain ke variabel global
    console.log(playerName); // Debugging: lihat nama yang dimasukkan
    if (playerName) {
        document.getElementById('name-input').style.display = 'none';
        document.getElementById('instructions').style.display = 'block';
    } else {
        alert("Silakan masukkan nama Anda!"); // Peringatan jika nama kosong
    }
};

// Daftar semua gambar yang akan digunakan dalam permainan
const colors = [
    { name: 'Merah', image: 'merah.jpg' },
    { name: 'Hijau', image: 'hijau.jpg' },
    { name: 'Biru', image: 'biru.jpg' },
    { name: 'Kuning', image: 'kuning.jpg' },
    { name: 'Ungu', image: 'ungu.jpg' },
    { name: 'Orange', image: 'orange.jpg' },
    { name: 'Coklat', image: 'coklat.jpg' },
    { name: 'Abu-abu', image: 'abu.jpg' },
    { name: 'Pink', image: 'pink.jpg' },
    { name: 'Hitam', image: 'hitam.jpg' },
    // Tambahkan lebih banyak gambar di sini jika ada
];

document.getElementById('nextButton').onclick = function() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('name-input').style.display = 'block';
};

document.getElementById('startButton').onclick = function() {
    playerName = document.getElementById('playerName').value; // Simpan nama pemain ke variabel global
    console.log(playerName); // Debugging: lihat nama yang dimasukkan
    if (playerName) {
        document.getElementById('name-input').style.display = 'none';
        document.getElementById('instructions').style.display = 'block';
    } else {
        alert("Silakan masukkan nama Anda!"); // Peringatan jika nama kosong
    }
};

document.getElementById('startGameButton').onclick = function() {
    document.getElementById('instructions').style.display = 'none';
    startGame();
};

function startGame() {
    // Ambil 10 warna acak dari array colors
    const selectedColors = colors.sort(() => 0.5 - Math.random()).slice(0, 10);
    shuffledColors = selectedColors; // Simpan warna yang dipilih untuk sesi ini
    currentQuestionIndex = 0;
    timeLeft = 10; // Set waktu tersisa ke 10 detik
    document.getElementById('game').style.display = 'block';
    nextQuestion();
}

function nextQuestion() {
    if (currentQuestionIndex < shuffledColors.length) {
        currentColor = shuffledColors[currentQuestionIndex];
        const optionsDiv = document.getElementById('optionsContainer');
        optionsDiv.innerHTML = ''; // Bersihkan pilihan sebelumnya

        const colorImage = document.getElementById('color-image');
        colorImage.src = currentColor.image;
        colorImage.alt = currentColor.name;
        colorImage.style.display = 'block';

        // Set waktu tersisa ke 5 detik
        timeLeft = 5; // ubah dari 10 menjadi 5
        const timerDisplay = document.getElementById('timerDisplay');
        timerDisplay.textContent = `Waktu tersisa: ${timeLeft} detik`;

        // Tampilkan skor saat ini
        document.getElementById('scoreDisplay').textContent = `Skor: ${score}`;

        // Ambil 5 warna acak dan tambahkan warna yang benar
        const randomColors = getRandomColors(5, currentColor.name);
        randomColors.push(currentColor); // Menambahkan warna yang benar ke pilihan

        // Mengacak pilihan
        randomColors.sort(() => 0.5 - Math.random());

        // Tambahkan pilihan jawaban
        randomColors.forEach((color) => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('option');
            optionDiv.textContent = color.name; // Nama warna yang ditampilkan
            optionDiv.style.backgroundColor = getColorBackground(color.name); // Mengatur warna latar belakang
            
            optionDiv.onclick = () => checkAnswer(color.name); // Pastikan ini dipanggil
            optionsDiv.appendChild(optionDiv);
        });

         // Mengeluarkan suara untuk nama warna yang ditanyakan
         let differentColor;
        do {
            differentColor = randomColors[Math.floor(Math.random() * randomColors.length)];
        } while (differentColor.name === currentColor.name); // Pastikan tidak sama dengan warna yang benar

        speak(differentColor.name); // Membacakan nama warna yang berbeda

        console.log('Jumlah pilihan:', randomColors.length); // Debugging
        console.log('Pilihan sebelum ditambahkan:', randomColors); // Debugging
        startTimer(); // Pastikan timer dimulai setelah semua persiapan
    } else {
        endGame(); // Jika tidak ada pertanyaan lagi, akhiri permainan
    }
}

// Fungsi untuk mendapatkan warna acak yang tidak sama dengan warna yang sudah digunakan
function getRandomColors(num, excludeColor) {
    const randomColors = [];
    while (randomColors.length < num) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        // Pastikan warna tidak sama dengan warna yang benar dan tidak ada duplikat
        if (!randomColors.includes(randomColor) && randomColor.name !== excludeColor) {
            randomColors.push(randomColor);
        }
    }
    return randomColors;
}

// Fungsi untuk mendapatkan warna ```javascript
function getColorBackground(colorName) {
    switch (colorName) {
        case 'Merah':
            return 'green';
        case 'Hijau':
            return 'blue';
        case 'Biru':
            return 'yellow';
        case 'Kuning':
            return 'purple';
        case 'Ungu':
            return 'orange';
        case 'Orange':
            return 'brown';
        case 'Coklat':
            return 'gray';
        case 'Abu-abu':
            return 'pink';
        case 'Pink':
            return 'black';
        case 'Hitam':
            return 'red';
        default:
            return 'white';
    }
}

function checkAnswer(answer) {
    if (answer === currentColor.name) {
        // Jika jawaban benar, tambahkan skor dan lanjutkan ke pertanyaan berikutnya
        console.log('Jawaban benar!');
        score++; // Tambahkan 1 ke skor
        currentQuestionIndex++;
        nextQuestion();
    } else {
        // Jika jawaban salah, tampilkan pesan dan lanjutkan ke pertanyaan berikutnya
        console.log('Jawaban salah!'); // Anda bisa menambahkan logika untuk menunjukkan pesan jika diperlukan
        currentQuestionIndex++; // Tetap lanjut ke pertanyaan berikutnya
        nextQuestion(); // Panggil fungsi untuk pertanyaan berikutnya
    }
}

function endGame() {
    console.log('Nama Pemain di akhir:', playerName); // Debugging: lihat nama pemain di akhir
    document.getElementById('game').style.display = 'none'; // Sembunyikan layar permainan
    document.getElementById('end-screen').style.display = 'block'; // Tampilkan layar akhir
    
    // Tampilkan nama pemain yang diinput
    document.getElementById('player-name-display').textContent = `Nama Pemain: ${playerName}`; // Tampilkan nama pemain yang diinput
    
    const finalScore = score; // Ambil nilai skor saat ini
    document.getElementById('final-score').textContent = `Skor akhir: ${finalScore}`; // Tampilkan skor akhir
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        const timerDisplay = document.getElementById('timerDisplay');
        timerDisplay.textContent = `Waktu tersisa: ${timeLeft} detik`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 2000);
}