// بيانات التطبيق
let steps = 0;
let calories = 0;
let timerInterval;
let currentExercise = null;

// عناصر DOM
const stepsElement = document.getElementById('steps');
const caloriesElement = document.getElementById('calories');
const timerElement = document.getElementById('timer');
const exerciseNameElement = document.getElementById('exerciseName');
const timeLeftElement = document.getElementById('timeLeft');
const installButton = document.getElementById('installButton');

// قاعدة بيانات التمارين
const exercises = [
    { id: 1, name: "تمارين البطن", duration: 30, calories: 5, type: "strength" },
    { id: 2, name: "تمارين الضغط", duration: 45, calories: 8, type: "strength" },
    { id: 3, name: "تمارين القرفصاء", duration: 60, calories: 6, type: "legs" },
    { id: 4, name: "الوثب في المكان", duration: 90, calories: 10, type: "cardio" },
    { id: 5, name: "الجرى الخفيف", duration: 120, calories: 15, type: "cardio" }
];

// تحديث الإحصائيات
function updateStats() {
    stepsElement.textContent = steps.toLocaleString();
    caloriesElement.textContent = calories.toLocaleString();
}

// بدء التمرين
function startExercise(name, duration) {
    if (currentExercise) {
        alert("هناك تمرين قيد التشغيل بالفعل!");
        return;
    }

    currentExercise = { name, duration, startTime: new Date() };
    exerciseNameElement.textContent = name;
    timeLeftElement.textContent = duration;
    timerElement.style.display = 'block';
    
    let timeLeft = duration;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;
        
        // تغيير لون العداد عندما يقل الوقت
        if (timeLeft <= 10) {
            timeLeftElement.style.color = '#ff6b6b';
        }
        
        if (timeLeft <= 0) {
            completeExercise();
        }
    }, 1000);
}

// إكمال التمرين
function completeExercise() {
    clearInterval(timerInterval);
    const exercise = exercises.find(ex => ex.name === currentExercise.name);
    
    if (exercise) {
        steps += 150;
        calories += exercise.calories;
        updateStats();
        
        // حفظ في localStorage
        saveWorkoutHistory(currentExercise);
        
        alert(`🎉 أحسنت! أكملت تمرين ${currentExercise.name}\n🔥 حرق ${exercise.calories} سعرة حرارية`);
    }
    
    timerElement.style.display = 'none';
    timeLeftElement.style.color = 'white';
    currentExercise = null;
}

// إيقاف التمرين
function stopExercise() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timerElement.style.display = 'none';
    timeLeftElement.style.color = 'white';
    currentExercise = null;
}

// حفظ تاريخ التمارين
function saveWorkoutHistory(exercise) {
    let history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    history.push({
        ...exercise,
        endTime: new Date(),
        calories: exercises.find(ex => ex.name === exercise.name)?.calories || 0
    });
    localStorage.setItem('workoutHistory', JSON.stringify(history));
}

// عرض تاريخ التمارين
function showWorkoutHistory() {
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    if (history.length === 0) {
        return "لا توجد تمارين سابقة";
    }
    
    return history.slice(-5).map(workout => 
        `${workout.name} - ${workout.calories} سعرة حرارية`
    ).join('\n');
}

// محاكاة عداد الخطوات
setInterval(() => {
    if (!currentExercise) {
        steps += Math.floor(Math.random() * 5) + 1;
        calories = Math.floor(steps * 0.03);
        updateStats();
    }
}, 3000);

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
            alert('✅ تم تثبيت التطبيق بنجاح!');
        }
        deferredPrompt = null;
    }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// إشعارات التذكير
function scheduleReminders() {
    if ('Notification' in window && Notification.permission === 'granted') {
        setInterval(() => {
            new Notification('💪 وقت التمرين!', {
                body: 'لا تنسى ممارسة التمارين اليومية',
                icon: './icons/icon-192x192.png'
            });
        }, 6 * 60 * 60 * 1000); // كل 6 ساعات
    }
}

// طلب إذن الإشعارات
if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            scheduleReminders();
        }
    });
}

// Initialize
updateStats();

// إضافة تمارين ديناميكية
function loadExercises() {
    const exerciseList = document.querySelector('.exercise-list');
    exerciseList.innerHTML = '';
    
    exercises.forEach(exercise => {
        const exerciseElement = document.createElement('div');
        exerciseElement.className = 'exercise';
        exerciseElement.innerHTML = `
            <span>${exercise.name}</span>
            <span>${exercise.duration} ثانية</span>
        `;
        exerciseElement.onclick = () => startExercise(exercise.name, exercise.duration);
        exerciseList.appendChild(exerciseElement);
    });
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadExercises();
    updateStats();
});