# Komara Academy — Livre 3D intelligent (PWA)

Livre interactif en 3D pour téléphone. Installable, fonctionne hors ligne.

**Fonctions**
1. Couverture qui s'ouvre en 3D, effet d'ombre et de profondeur.
2. Pages qui se tournent au doigt (glissement en direct) + boutons et clavier.
3. Lecture à voix haute : bouton 🔊 lit la page en cours (Web Speech API, français).
4. Le livre répond : bouton 🤖, le bot cherche la réponse dans le contenu du livre et propose d'ouvrir la page concernée.
5. Feuilles vierges éditables pour les cours suivants, enregistrées sur l'appareil, exportables en .txt.

**Structure**
- `index.html` : la coquille (barres, scène 3D, panneaux).
- `livre.css` : rendu du papier, de la couverture et des animations.
- `livre.js` : moteur (navigation, gestes, lecture vocale, bot, sauvegarde).
- `pages-data.js` : **le contenu du livre**. Cours 1 rédigé, pages vierges déclarées ici.
- `sw.js`, `pwa.js`, `manifest.webmanifest` : PWA.

**Ajouter un cours**
Écrire une entrée dans `window.LIVRE.pages` de `pages-data.js`, ou remplir directement une feuille vierge dans l'app.

Publié sur https://komaraagency.github.io/komara-livre-3d/
