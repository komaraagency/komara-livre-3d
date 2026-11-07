/* Contenu du livre.
   Cours 1 : redige. Cours suivants : feuilles vierges, a remplir dans l'app
   (le texte saisi est enregistre sur l'appareil) ou ici en HTML. */

window.LIVRE = {
  titre: "Komara Academy",
  sousTitre: "Le guide du business digital",
  auteur: "Komara Agency 🇬🇳",
  edition: "Édition 2026",
  pages: [
    /* ---------------- SOMMAIRE ---------------- */
    {
      id: "sommaire",
      titre: "Sommaire",
      chapitre: "Ouverture",
      html: `
        <h2>Ce que tu vas apprendre</h2>
        <ul class="sommaire">
          <li><b>Cours 1</b> — Vendre avec WhatsApp <span>6 pages</span></li>
          <li class="vide"><b>Cours 2</b> — À toi d'écrire <span>vierge</span></li>
          <li class="vide"><b>Cours 3</b> — À toi d'écrire <span>vierge</span></li>
          <li class="vide"><b>Cours 4</b> — À toi d'écrire <span>vierge</span></li>
          <li class="vide"><b>Cours 5</b> — À toi d'écrire <span>vierge</span></li>
        </ul>
        <p class="note">Touche 🔊 en haut pour écouter la page. Touche 🤖 pour poser une question au livre. Tourne la page avec le doigt.</p>
      `
    },

    /* ---------------- COURS 1 ---------------- */
    {
      id: "c1p1",
      chapitre: "Cours 1",
      titre: "Pourquoi WhatsApp vend mieux que tout le reste",
      html: `
        <p>En Guinée, au Maroc et partout en Afrique de l'Ouest, ton client n'installe pas une application pour t'acheter. Il a déjà WhatsApp, ouvert toute la journée.</p>
        <p>Vendre par WhatsApp, ce n'est pas envoyer des messages à la main toute la journée. C'est mettre en place un système qui répond au client <b>dans la seconde</b>, même quand tu dors.</p>
        <div class="cle">
          <b>La règle des 5 minutes</b>
          <p>Un client qui écrit et qui attend plus de 10 minutes est un client que tu perds. Un bot répond en 2 secondes, à 3h du matin comme à midi.</p>
        </div>
        <p>Ton objectif n'est pas d'avoir « un chatbot ». Ton objectif est de ne plus jamais perdre une commande parce que tu n'as pas vu le message.</p>
      `
    },
    {
      id: "c1p2",
      chapitre: "Cours 1",
      titre: "Les 3 niveaux de bot",
      html: `
        <p>Il existe trois niveaux. Choisis selon ton budget et ton volume de clients, jamais selon la mode.</p>
        <div class="carte-niveau">
          <h3>1. Bot Telegram scripté</h3>
          <p class="prix">50 €</p>
          <p>Un catalogue à boutons. Le client clique, choisit, commande. Simple, rapide, parfait pour tester une offre.</p>
        </div>
        <div class="carte-niveau">
          <h3>2. Bot WhatsApp vendeur</h3>
          <p class="prix">100 €</p>
          <p>Il répond aux questions, présente les prix, relance les clients qui hésitent et prend la commande. C'est le niveau le plus rentable pour une petite entreprise.</p>
        </div>
        <div class="carte-niveau">
          <h3>3. Agent IA Premium</h3>
          <p class="prix">150 €</p>
          <p>Multilingue, avec mémoire, connecté à ton fichier clients. Il parle comme un vrai vendeur et se souvient de chaque client.</p>
        </div>
      `
    },
    {
      id: "c1p3",
      chapitre: "Cours 1",
      titre: "Le scénario qui vend, en 5 étapes",
      html: `
        <p>Un bot qui vend suit toujours la même route. Copie cette structure :</p>
        <ol class="etapes">
          <li><b>Accueil</b> — Bonjour + le nom de ton entreprise + une question simple : « Tu cherches quoi aujourd'hui ? »</li>
          <li><b>Catalogue</b> — 3 à 6 produits maximum, avec le prix affiché. Cacher le prix fait fuir.</li>
          <li><b>Réponse aux objections</b> — trop cher, livraison, garantie. Prépare tes réponses une fois, le bot les répète.</li>
          <li><b>Commande</b> — nom, quartier, numéro, produit. Quatre champs, pas plus.</li>
          <li><b>Relance</b> — si le client disparaît 2 heures, le bot envoie un message doux : « Je te garde ta commande ? »</li>
        </ol>
        <p class="note">La relance est l'étape que tout le monde oublie. C'est souvent elle qui fait la moitié du chiffre.</p>
      `
    },
    {
      id: "c1p4",
      chapitre: "Cours 1",
      titre: "Fixer ses prix sans se brader",
      html: `
        <p>Un bot n'est pas une dépense, c'est un employé qui ne dort pas. Ton prix doit refléter ça.</p>
        <table class="grille">
          <tr><th>Prestation</th><th>Prix</th></tr>
          <tr><td>Bot Telegram scripté</td><td>50 €</td></tr>
          <tr><td>Bot WhatsApp vendeur</td><td>100 €</td></tr>
          <tr><td>Agent IA Premium</td><td>150 €</td></tr>
          <tr><td>Maintenance mensuelle</td><td>50 €/mois</td></tr>
          <tr><td>Site vitrine</td><td>250 €</td></tr>
          <tr><td>Logo seul</td><td>50 €</td></tr>
        </table>
        <p><b>La règle du démarrage :</b> 50 % à la commande, 50 % à la livraison. Ne livre jamais un fichier final avant le solde.</p>
        <p class="note">Pourquoi 50 € de maintenance ? Parce qu'un bot vit : les prix changent, WhatsApp change ses règles, les clients changent de numéro. La maintenance, c'est ce qui garde ton bot rentable dans le temps.</p>
      `
    },
    {
      id: "c1p5",
      chapitre: "Cours 1",
      titre: "Les 5 erreurs qui tuent un bot",
      html: `
        <ol class="erreurs">
          <li><b>Parler trop.</b> Un bot qui écrit un roman fait fuir. Une question, trois réponses possibles, on avance.</li>
          <li><b>Cacher les prix.</b> « Contactez-nous pour le prix » = client perdu.</li>
          <li><b>Trop de menus.</b> Plus de 3 niveaux de boutons, le client se noie.</li>
          <li><b>Aucune sortie vers un humain.</b> Prévois toujours « Parler à un humain » : c'est ce qui rassure.</li>
          <li><b>Lancer sans tester.</b> Essaie ton bot comme un client, sur un vrai téléphone, 20 fois avant de le montrer.</li>
        </ol>
        <div class="cle">
          <b>Le test final</b>
          <p>Donne ton bot à un ami qui ne connaît pas ton activité. S'il arrive à commander sans t'appeler, ton bot est prêt.</p>
        </div>
      `
    },
    {
      id: "c1p6",
      chapitre: "Cours 1",
      titre: "Passer à l'action",
      html: `
        <p>Tu as maintenant le plan complet : un canal, trois niveaux d'offre, un scénario en 5 étapes, des prix clairs et les pièges à éviter.</p>
        <p>La différence entre ceux qui vendent et les autres, ce n'est pas l'idée. C'est le fait de commencer cette semaine.</p>
        <div class="cle">
          <b>Ta prochaine étape</b>
          <p>Écris à Komara Agency sur WhatsApp avec ton activité et ton budget. Tu reçois un devis en 2 minutes, et ton bot peut être en ligne en quelques jours.</p>
        </div>
        <p class="cta-livre">
          <a href="https://wa.me/212701986219?text=Bonjour%20Komara%20Agency%2C%20j%27ai%20lu%20le%20livre%20et%20je%20veux%20un%20bot" target="_blank" rel="noopener">💬 Demander mon devis</a>
        </p>
      `
    }
  ],

  /* Feuilles vierges : l'utilisateur ecrit directement dans l'app.
     8 pages pretes, on peut en ajouter d'autres. */
  vierges: [
    { chapitre: "Cours 2", titre: "Titre du cours 2" },
    { chapitre: "Cours 3", titre: "Titre du cours 3" },
    { chapitre: "Cours 4", titre: "Titre du cours 4" },
    { chapitre: "Cours 5", titre: "Titre du cours 5" },
    { chapitre: "Cours 6", titre: "Titre du cours 6" },
    { chapitre: "Cours 7", titre: "Titre du cours 7" },
    { chapitre: "Cours 8", titre: "Titre du cours 8" },
    { chapitre: "Cours 9", titre: "Titre du cours 9" }
  ]
};
