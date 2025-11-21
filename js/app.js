// --- 1. حاسبة مؤشر كتلة الجسم (BMI) ---
function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const heightCm = parseFloat(document.getElementById('height').value);
    const resultElement = document.getElementById('bmi-result');

    if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
        resultElement.textContent = "يرجى إدخال قيم صحيحة للوزن والطول.";
        return;
    }

    // التحويل من سم إلى متر
    const heightM = heightCm / 100;
    // صيغة BMI: الوزن (كجم) / (الطول * الطول) (متر مربع)
    const bmi = weight / (heightM * heightM);
    
    let classification = "";
    if (bmi < 18.5) {
        classification = "نقص في الوزن";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        classification = "وزن طبيعي";
    } else if (bmi >= 25 && bmi <= 29.9) {
        classification = "زيادة في الوزن";
    } else {
        classification = "سمنة";
    }

    resultElement.innerHTML = `مؤشر كتلة الجسم (BMI): <strong>${bmi.toFixed(2)}</strong><br>التصنيف: <strong>${classification}</strong>`;
}

// --- 2. مؤقت التمارين (Timer) ---
const timerButton = document.querySelector('.start-timer');
const timerDisplay = document.querySelector('.timer-display');
let isRunning = false;
let startTime;
let intervalId;

function updateTimer() {
    const elapsed = Date.now() - startTime;
    const totalSeconds = Math.floor(elapsed / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

timerButton.addEventListener('click', () => {
    if (!isRunning) {
        // بدء المؤقت
        isRunning = true;
        startTime = Date.now();
        intervalId = setInterval(updateTimer, 1000);
        timerButton.textContent = 'إيقاف مؤقت';
        timerButton.classList.remove('secondary');
        timerButton.classList.add('primary');
    } else {
        // إيقاف مؤقت
        isRunning = false;
        clearInterval(intervalId);
        timerButton.textContent = 'استئناف';
        timerButton.classList.remove('primary');
        timerButton.classList.add('secondary');
    }
});
