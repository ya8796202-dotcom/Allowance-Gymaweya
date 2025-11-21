// بيانات التطبيق
let steps = 0;
let calories = 0;
let timerInterval;

// عناصر DOM
const stepsElement = document.getElementById('steps');
const caloriesElement = document.getElementById('calories');
const timerElement = document.getElementById('timer');
const exerciseNameElement = document.getElementById('exerciseName');
const timeLeftElement = document.getElementById('timeLeft');
const installButton = document.getElementById('installButton');

// تحديث الإحصائيات
function updateStats() {
    stepsElement.textContent = steps;
    caloriesElement.textContent = calories;
}

// بدء التمرين
function startExercise(name, duration) {
    exerciseNameElement.textContent = name;
    timeLeftElement.textContent = duration;
    timerElement.style.display = 'block';
    
    let timeLeft = duration;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            stopExercise();
            // زيادة الإحصائيات
            steps += 100;
            calories += 5;
            updateStats();
            alert(`🎉 أحسنت! أكملت تمرين ${name}`);
        }
    }, 1000);
}

// إيقاف التمرين
function stopExercise() {
    clearInterval(timerInterval);
    timerElement.style.display = 'none';
}

// محاكاة عداد الخطوات
setInterval(() => {
    steps += Math.floor(Math.random() * 10);
    calories = Math.floor(steps * 0.04);
    updateStats();
}, 5000);

// PWA Installation
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
});

installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            installButton.style.display = 'none';
        }
        deferredPrompt = null;
    }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Initialize
updateStats();
