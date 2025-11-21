// تسجيل الـ Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("Service Worker مسجل ✅"))
    .catch(err => console.error("فشل التسجيل:", err));
}

// زر التثبيت
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "inline-block";
});

installBtn.addEventListener("click", () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("المستخدم وافق على التثبيت ✅");
      } else {
        console.log("المستخدم رفض التثبيت ❌");
      }
      deferredPrompt = null;
    });
  }
});
