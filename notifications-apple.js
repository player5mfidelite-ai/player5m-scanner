let initializeApp;
let getMessaging;
let getToken;

const firebaseConfig = {
  apiKey: "AIzaSyA9PKABiwXGkNGewLAFO62ZOSxGxOHT-go",
  authDomain: "player-5m-fidelite.firebaseapp.com",
  projectId: "player-5m-fidelite",
  storageBucket: "player-5m-fidelite.firebasestorage.app",
  messagingSenderId: "69568689388",
  appId: "1:69568689388:web:05093db16c79e1966221c9"
};

let app = null;
let messaging = null;

const params = new URLSearchParams(window.location.search);
const carte = params.get("carte") || "";

let idClient = "";

try {
  const urlCarte = new URL(carte);
  idClient =
    String(urlCarte.searchParams.get("client") || "")
      .trim()
      .toUpperCase();
} catch (e) {}

window.afficherBoutonActivation = function() {

  let panneau = document.getElementById("activation-notifications-apple");

  if (!panneau) {
    panneau = document.createElement("div");
    panneau.id = "activation-notifications-apple";

    panneau.style.cssText =
      "position:fixed;inset:0;z-index:999999;" +
      "display:flex;align-items:center;justify-content:center;" +
      "background:rgba(0,0,0,.75);padding:20px;";

    panneau.innerHTML = `
      <div style="
        width:100%;
        max-width:360px;
        background:#1d1d1d;
        color:white;
        padding:24px 20px;
        border-radius:20px;
        text-align:center;
        font-family:Arial,sans-serif;
      ">
        <div style="font-size:26px;font-weight:bold;color:#ffcc00;">
          🔔 PLAYER 5M
        </div>

        <div style="margin-top:14px;font-size:17px;line-height:1.4;">
          Activez les notifications pour recevoir les nouveaux événements.
        </div>

        <button id="bouton-autoriser-player5m"
          style="
            width:100%;
            margin-top:22px;
            padding:15px;
            border:0;
            border-radius:12px;
            background:#e30620;
            color:white;
            font-size:18px;
            font-weight:bold;
          ">
          🔔 Autoriser les notifications
        </button>

        <div id="message-notifications-apple"
          style="margin-top:16px;line-height:1.4;">
        </div>
      </div>
    `;

    document.body.appendChild(panneau);
  }

  panneau.style.display = "flex";

  document
    .getElementById("bouton-autoriser-player5m")
    .onclick = activerNotificationsApple;
}

async function activerNotificationsApple() {

  const message =
    document.getElementById("message-notifications-apple");

  const autorisation = await Notification.requestPermission();

if (autorisation !== "granted") {
  message.innerHTML =
    "❌ Les notifications n’ont pas été autorisées.";
  return;
}

  if (!("Notification" in window)) {
    message.innerHTML =
      "❌ Notifications non disponibles sur cet iPhone.";
    return;
  }

  if (!("serviceWorker" in navigator)) {
    message.innerHTML =
      "❌ Service de notifications non disponible.";
    return;
  }

  try {

   const firebaseAppModule = await import(
  "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js"
);

const firebaseMessagingModule = await import(
  "https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging.js"
);

initializeApp = firebaseAppModule.initializeApp;
getMessaging = firebaseMessagingModule.getMessaging;
getToken = firebaseMessagingModule.getToken; 

    app = initializeApp(firebaseConfig);
messaging = getMessaging(app);

    const inscription =
      await navigator.serviceWorker.register("./service-worker.js");


    const token = await getToken(messaging, {
      vapidKey:
        "BMEwUrtWxL0Jkbb4wm2jexd-p4IarwqU8FdwwGX6kIOmHQboa8xDsJN7vSm-YWWfg9Tr4km0DAt8N0O-utU167A",
      serviceWorkerRegistration: inscription
    });

    const urlEnregistrement =
      "https://script.google.com/macros/s/AKfycbyZHXWM1EiMFAndTdAJtqbY0L_Hw8TH76PTFYMFbHzMHsQf3d-6l-5MND4w7z63VKI/exec" +
      "?action=enregistrer-notification" +
      "&token=" + encodeURIComponent(token) +
      "&idClient=" + encodeURIComponent(idClient) +
      "&nom=" +
      "&appareil=" + encodeURIComponent(navigator.userAgent);

    await fetch(urlEnregistrement, {
      method: "GET",
      mode: "no-cors"
    });

    await inscription.showNotification("PLAYER 5M 🎾", {
      body: "Les notifications Player 5M sont activées !"
    });

    message.innerHTML =
      "✅ Notifications activées avec succès !";

  } catch (erreur) {

    message.innerHTML =
      "❌ Une erreur est survenue : " + erreur.message;
  }
}

window.addEventListener("message", function(event) {

  if (
    event.data &&
    event.data.type === "PLAYER5M_ACTIVER_NOTIFICATIONS"
  ) {
    afficherBoutonActivation();
  }

});

window.addEventListener("DOMContentLoaded", function() {

 const estApplication =
  window.navigator.standalone === true ||
  window.matchMedia('(display-mode: standalone)').matches;

if (!estApplication) {
  return;
}

  const bouton = document.createElement("button");

  bouton.id = "bouton-notifications-iphone";
  bouton.textContent = "🔔 Activer les notifications";

  bouton.style.cssText =
    "position:fixed;" +
    "left:20px;" +
    "right:20px;" +
    "bottom:25px;" +
    "z-index:999999;" +
    "padding:16px;" +
    "border:0;" +
    "border-radius:14px;" +
    "background:#e30620;" +
    "color:white;" +
    "font-size:18px;" +
    "font-weight:bold;";

  bouton.addEventListener("click", function() {
    afficherBoutonActivation();
  });

  document.body.appendChild(bouton);

});
