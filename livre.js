/* Komara Academy — moteur du livre 3D (v15)
   - couverture qui s'ouvre, pages tournees au doigt (seuil bas)
   - lecture a voix haute : voix la plus naturelle, phrases courtes, pauses
   - ecriture : zones d'exercice + panneau de notes, sauvegardes sur l'appareil
   - bot qui repond du contenu du livre et des infos Komara
   - partage de l'application, langue FR / EN / AR
   - pied de page sur chaque page
*/

(() => {
  "use strict";

  const LIVRE = window.LIVRE || { pages: [], vierges: [] };
  const CLE = "komara-livre-v1";
  const CLE_LANG = "komara-livre-langue";
  const WA = "212701986219";
  const LIEN = "https://komaraagency.github.io/komara-livre-3d/";
  const DUREE = 850;

  /* ================= LANGUES ================= */
  const T = {
    fr: {
      prec: "Précédent", sommaire: "Sommaire", ecrire: "Écrire", ecouter: "Écouter",
      livre: "Le livre", suiv: "Suivant",
      botTitre: "Le livre répond", botSous: "Pose ta question sur le contenu",
      ecrTitre: "Écrire", ecrSous: "Ta note reste sur ton téléphone",
      ecrFeuille: "Nouvelle page du livre", ecrFini: "C'est noté ✓",
      ecrNote: "Tu peux aussi écrire dans les zones « Ma réponse » sous chaque exercice.",
      optTitre: "Options", optSous: "Ton livre, tes règles",
      partager: "Partager l'application", copier: "Copier le lien",
      allerSom: "Aller au sommaire", ajouter: "Ajouter une feuille vierge",
      exporter: "Exporter mes notes", effacer: "Effacer mes notes",
      langue: "Langue", parler: "Parler à Komara",
      note: "Les feuilles vierges se remplissent directement dans le livre. Ton texte reste sur ton téléphone.",
      suite: "Fais défiler : la suite et l'exercice sont en bas",
      couverture: "Couverture", page: "Page", sur: "sur",
      ouvrePage: "Ouvrir la page", lienCopie: "Lien copié ✓", indecrisible: "Cette page est vide",
      pasVoix: "La lecture vocale n'est pas disponible sur ce navigateur",
      toastOuvre: "Touche la couverture pour ouvrir 📖",
      feuilleAjoutee: "Feuille vierge ajoutée 📄", notesExportees: "Notes exportées ⬇️",
      noteEnregistree: "Note enregistrée ✓", effaceConfirme: "Effacer tout ce que tu as écrit ?",
      notesEffacees: "Notes effacées",
      accueil: "Bonjour 👋 Je suis le livre et je réponds sur mon contenu : une balise, les liens, les formulaires, la mise en ligne. Je connais aussi les prix de Komara.",
      sugg: ["C'est quoi une balise ?", "Comment créer un lien ?", "Comment mettre mon site en ligne ?", "Combien coûte un site vitrine ?"],
      vide: "Je n'ai pas trouvé cette réponse dans le livre. Écris à Komara Agency sur WhatsApp, la réponse arrive en 2 minutes.",
      detail: "Écris ta question avec un peu plus de détails 🙂"
    },
    en: {
      prec: "Back", sommaire: "Contents", ecrire: "Write", ecouter: "Listen",
      livre: "Ask", suiv: "Next",
      botTitre: "The book answers", botSous: "Ask anything about the content",
      ecrTitre: "Write", ecrSous: "Your note stays on your phone",
      ecrFeuille: "New page", ecrFini: "Saved ✓",
      ecrNote: "You can also write in the “My answer” areas under each exercise.",
      optTitre: "Options", optSous: "Your book, your rules",
      partager: "Share the app", copier: "Copy the link",
      allerSom: "Go to contents", ajouter: "Add a blank page",
      exporter: "Export my notes", effacer: "Clear my notes",
      langue: "Language", parler: "Talk to Komara",
      note: "Blank pages are filled inside the book. Your text stays on your phone.",
      suite: "Scroll down: more and the exercise below",
      couverture: "Cover", page: "Page", sur: "of",
      ouvrePage: "Open page", lienCopie: "Link copied ✓", indecrisible: "This page is empty",
      pasVoix: "Speech is not available in this browser",
      toastOuvre: "Tap the cover to open 📖",
      feuilleAjoutee: "Blank page added 📄", notesExportees: "Notes exported ⬇️",
      noteEnregistree: "Note saved ✓", effaceConfirme: "Delete everything you wrote?",
      notesEffacees: "Notes cleared",
      accueil: "Hello 👋 I answer from the book: tags, links, forms, publishing. I also know Komara prices.",
      sugg: ["What is a tag?", "How do I create a link?", "How do I publish my site?", "How much is a website?"],
      vide: "I could not find that in the book. Message Komara Agency on WhatsApp and you will get an answer in 2 minutes.",
      detail: "Please add a little more detail to your question 🙂"
    },
    ar: {
      prec: "السابق", sommaire: "المحتويات", ecrire: "كتابة", ecouter: "استماع",
      livre: "اسأل", suiv: "التالي",
      botTitre: "الكتاب يجيب", botSous: "اسأل عن محتوى الكتاب",
      ecrTitre: "كتابة", ecrSous: "ملاحظتك تبقى على هاتفك",
      ecrFeuille: "صفحة جديدة", ecrFini: "تم الحفظ ✓",
      ecrNote: "يمكنك أيضا الكتابة في خانة «جوابي» أسفل كل تمرين.",
      optTitre: "خيارات", optSous: "كتابك، قواعدك",
      partager: "مشاركة التطبيق", copier: "نسخ الرابط",
      allerSom: "إلى المحتويات", ajouter: "إضافة صفحة فارغة",
      exporter: "تصدير ملاحظاتي", effacer: "حذف ملاحظاتي",
      langue: "اللغة", parler: "تحدث مع كومارا",
      note: "الصفحات الفارغة تكتب فيها داخل الكتاب. نصك يبقى على هاتفك.",
      suite: "مرر للأسفل: التتمة والتمرين",
      couverture: "الغلاف", page: "صفحة", sur: "من",
      ouvrePage: "افتح الصفحة", lienCopie: "تم نسخ الرابط ✓", indecrisible: "هذه الصفحة فارغة",
      pasVoix: "القراءة الصوتية غير متوفرة في هذا المتصفح",
      toastOuvre: "المس الغلاف لفتح الكتاب 📖",
      feuilleAjoutee: "تمت إضافة صفحة 📄", notesExportees: "تم تصدير الملاحظات ⬇️",
      noteEnregistree: "تم حفظ الملاحظة ✓", effaceConfirme: "حذف كل ما كتبته؟",
      notesEffacees: "تم حذف الملاحظات",
      accueil: "مرحبا 👋 أجيب من محتوى الكتاب: الوسوم، الروابط، النماذج، النشر. وأعرف أيضا أسعار كومارا.",
      sugg: ["ما هو الوسم؟", "كيف أنشئ رابطا؟", "كيف أنشر موقعي؟", "كم ثمن موقع؟"],
      vide: "لم أجد هذا الجواب في الكتاب. راسل كومارا على واتساب وستحصل على جواب في دقيقتين.",
      detail: "اكتب سؤالك بتفصيل أكثر 🙂"
    }
  };

  let lang = "fr";
  try { lang = localStorage.getItem(CLE_LANG) || "fr"; } catch (_) { lang = "fr"; }
  if (!T[lang]) lang = "fr";
  const t = (k) => (T[lang] && T[lang][k]) || T.fr[k] || k;

  let pages = [];
  let index = -1;
  let sauvegardes = {};

  const $ = (s) => document.querySelector(s);
  const livreEl = $("#livre");
  const sceneEl = $("#scene");
  const couvertureEl = $("#couverture");
  const etatPageEl = $("#etat-page");
  const btnPrec = $("#btn-prec");
  const btnSuiv = $("#btn-suiv");
  const btnLire = $("#btn-lire");
  const toastEl = $("#toast");
  const voile = $("#voile");
  const panneauBot = $("#panneau-bot");
  const panneauMenu = $("#panneau-menu");
  const panneauEcrire = $("#panneau-ecrire");
  const fil = $("#fil");
  const noteTitre = $("#note-titre");
  const noteCorps = $("#note-corps");

  /* ---------------- Divers ---------------- */
  let toastTimer = null;
  function toast(txt) {
    toastEl.textContent = txt;
    toastEl.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("visible"), 2600);
  }

  function charger() {
    try { sauvegardes = JSON.parse(localStorage.getItem(CLE) || "{}") || {}; }
    catch (_) { sauvegardes = {}; }
  }
  let timerSauve = null;
  function sauvegarder() {
    clearTimeout(timerSauve);
    timerSauve = setTimeout(() => {
      try { localStorage.setItem(CLE, JSON.stringify(sauvegardes)); }
      catch (_) { toast("Mémoire du téléphone pleine"); }
    }, 300);
  }

  /* ---------------- Construction ---------------- */
  function construirePages() {
    pages = [];
    (LIVRE.pages || []).forEach((p) => {
      pages.push({ id: p.id, chapitre: p.chapitre, titre: p.titre, motsCles: p.motsCles || "", html: p.html, vierge: false });
    });
    (LIVRE.vierges || []).forEach((v, i) => {
      pages.push({ id: "vierge-" + i, chapitre: v.chapitre, titre: v.titre, html: "", vierge: true });
    });
    const sup = sauvegardes._ajoutees || 0;
    for (let i = 0; i < sup; i++) {
      pages.push({ id: "libre-" + i, chapitre: "Feuille libre", titre: "Nouvelle feuille", html: "", vierge: true });
    }
  }

  function piedDePage() {
    const p = document.createElement("div");
    p.className = "pied-page";
    p.append("komara Agency ");
    const d = document.createElement("span");
    d.className = "drap-gn";
    d.setAttribute("role", "img");
    d.setAttribute("aria-label", "Guinée");
    p.append(d, " pour vous servir");
    return p;
  }

  function restaurerZones(racine, id) {
    const s = sauvegardes[id];
    if (!s) return;
    racine.querySelectorAll("[data-champ]").forEach((el) => {
      const v = s[el.dataset.champ];
      if (typeof v !== "string") return;
      if (el.dataset.champ === "titre") el.textContent = v;
      else el.innerHTML = v;
    });
  }

  function tete(numero, chapitre) {
    const d = document.createElement("div");
    d.className = "page-tete";
    const c = document.createElement("span");
    c.className = "page-chapitre";
    c.textContent = chapitre || "";
    const n = document.createElement("span");
    n.className = "page-num";
    n.textContent = "p. " + numero;
    d.append(c, n);
    return d;
  }

  function creerFeuille(page, numero) {
    const f = document.createElement("div");
    f.className = "feuille";
    f.dataset.id = page.id;

    const recto = document.createElement("div");
    recto.className = "face recto papier";

    if (page.vierge) {
      const badge = document.createElement("span");
      badge.className = "vierge-badge";
      badge.textContent = "Feuille vierge";

      const titre = document.createElement("div");
      titre.className = "champ-titre";
      titre.contentEditable = "true";
      titre.spellcheck = false;
      titre.dataset.placeholder = "Titre du cours";
      titre.dataset.page = page.id;
      titre.dataset.champ = "titre";
      titre.textContent = page.titre || "";

      const corps = document.createElement("div");
      corps.className = "champ-corps";
      corps.contentEditable = "true";
      corps.dataset.page = page.id;
      corps.dataset.champ = "corps";

      recto.append(badge, titre, corps, piedDePage());
      restaurerZones(recto, page.id);
    } else {
      const corps = document.createElement("div");
      corps.className = "page-corps";
      corps.innerHTML = page.html;
      const suite = document.createElement("div");
      suite.className = "suite-bas";
      const sp = document.createElement("span");
      sp.textContent = "▼ " + t("suite");
      suite.appendChild(sp);
      recto.append(corps, suite, piedDePage());
      restaurerZones(recto, page.id);
      const maj = () => {
        const reste = corps.scrollHeight - corps.scrollTop - corps.clientHeight;
        suite.classList.toggle("visible", reste > 24);
      };
      corps.addEventListener("scroll", maj, { passive: true });
      // mesure apres affichage, et apres chaque changement de taille
      setTimeout(maj, 300);
      if (window.ResizeObserver) new ResizeObserver(maj).observe(corps);
      recto.__majSuite = maj;
    }
    // le tete par-dessus (injecte en premier pour rester en haut)
    recto.insertBefore(tete(numero, page.chapitre), recto.firstChild);

    const verso = document.createElement("div");
    verso.className = "face verso papier";
    const vCorps = document.createElement("div");
    vCorps.className = "page-corps";
    const aide = document.createElement("p");
    aide.style.cssText = "color:#8d8574;font-size:14px;margin-top:38%";
    aide.textContent = page.vierge ? "(suite de la feuille)" : "Tourne la page avec ton doigt";
    vCorps.appendChild(aide);
    verso.append(tete(numero + 1, page.chapitre), vCorps, piedDePage());

    f.append(recto, verso);
    return f;
  }

  function dessiner() {
    Array.from(livreEl.querySelectorAll(".feuille")).forEach((f) => {
      if (f !== couvertureEl) f.remove();
    });
    const tranche = livreEl.querySelector(".tranche");
    pages.forEach((p, i) => {
      livreEl.insertBefore(creerFeuille(p, i + 1), tranche);
    });
    appliquerEtat(false);
  }

  /* ---------------- Etat ---------------- */
  function feuilles() {
    return Array.from(livreEl.querySelectorAll(".feuille")).filter((f) => f !== couvertureEl);
  }

  function majTextes() {
    if (index < 0) {
      etatPageEl.textContent = t("couverture");
    } else {
      const p = pages[index];
      etatPageEl.textContent = t("page") + " " + (index + 1) + " " + t("sur") + " " + pages.length +
        (p && p.chapitre ? " · " + p.chapitre : "");
    }
    btnPrec.disabled = index < 0;
    btnSuiv.disabled = index >= pages.length - 1;
  }

  function appliquerEtat(animer) {
    if (!animer) livreEl.classList.add("glisse");

    couvertureEl.classList.toggle("tournee", index >= 0);
    couvertureEl.style.zIndex = index >= 0 ? "10" : "1200";

    feuilles().forEach((f, i) => {
      const tournee = i < index;
      f.classList.toggle("tournee", tournee);
      f.style.transform = "";
      f.style.zIndex = tournee ? String(20 + i) : String(400 - i);
    });

    if (!animer) {
      void livreEl.offsetHeight;
      requestAnimationFrame(() => livreEl.classList.remove("glisse"));
    }
    majTextes();
  }

  function allerA(n) {
    n = Math.max(-1, Math.min(pages.length - 1, n));
    if (n === index) return;
    arreterLecture();
    index = n;
    appliquerEtat(true);
  }
  const suivant = () => allerA(index + 1);
  const precedent = () => allerA(index - 1);

  btnSuiv.addEventListener("click", suivant);
  btnPrec.addEventListener("click", precedent);
  $("#btn-sommaire").addEventListener("click", () => allerA(0));
  $("#btn-ouvrir").addEventListener("click", (e) => { e.stopPropagation(); allerA(0); });

  let glisseRecemment = false;
  couvertureEl.addEventListener("click", () => {
    if (glisseRecemment) return;
    if (index < 0) allerA(0);
  });

  /* ---------------- Glissement au doigt ---------------- */
  let actif = false, departX = 0, departY = 0, dx = 0, sens = 0, tDepart = 0;
  let feuilleTiree = null, dernierX = 0, dernierT = 0, vitesse = 0, echec = 0;

  const dansEdition = (el) => !!(el && (el.isContentEditable ||
    (el.closest && el.closest("input, textarea, .exo-reponse, .champ-corps"))));

  sceneEl.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, a, input, textarea, select")) return;
    if (dansEdition(e.target)) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    actif = true;
    departX = dernierX = e.clientX;
    departY = e.clientY;
    tDepart = performance.now();
    dx = 0; sens = 0; vitesse = 0; echec = 0;
    feuilleTiree = null;
  });

  sceneEl.addEventListener("pointermove", (e) => {
    if (!actif) return;

    const deltaX = e.clientX - departX;
    const deltaY = e.clientY - departY;
    dx = deltaX;

    if (sens === 0) {
      // on attend un vrai debut de geste
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
      // le geste est vertical (ou pas assez horizontal) : on laisse defiler la page
      if (Math.abs(deltaY) * 1.15 > Math.abs(deltaX)) { actif = false; return; }
      sens = deltaX < 0 ? -1 : 1;

      if (sens === -1) {
        if (index < pages.length - 1) {
          feuilleTiree = index < 0 ? couvertureEl : feuilles()[index];
        }
      } else if (index >= 0) {
        feuilleTiree = index === 0 ? couvertureEl : feuilles()[index - 1];
      }

      if (!feuilleTiree) { actif = false; return; }
      livreEl.classList.add("glisse");
      feuilleTiree.style.zIndex = "2000";
    }

    const largeur = sceneEl.clientWidth || 360;
    const p = Math.min(1, Math.abs(deltaX) / largeur);

    const now = performance.now();
    vitesse = (e.clientX - dernierX) / Math.max(1, now - dernierT);
    dernierX = e.clientX; dernierT = now;

    const angle = sens === -1 ? -180 * p : -180 * (1 - p);
    feuilleTiree.style.transition = "none";
    feuilleTiree.style.transform = "rotateY(" + angle + "deg)";
  }, { passive: true });

  function finGlisse(e) {
    if (!actif) return;
    actif = false;

    const duree = performance.now() - tDepart;

    // un simple tap sur le bord tourne la page
    if (!feuilleTiree && Math.abs(dx) < 10 && duree < 420 && e && typeof e.clientX === "number") {
      const largeur = sceneEl.clientWidth || 360;
      const rel = (e.clientX - sceneEl.getBoundingClientRect().left) / largeur;
      if (rel > 0.72) { suivant(); return; }
      if (rel < 0.28) { precedent(); return; }
      return;
    }

    if (!feuilleTiree) { livreEl.classList.remove("glisse"); return; }

    glisseRecemment = true;
    setTimeout(() => { glisseRecemment = false; }, 350);

    const f = feuilleTiree;
    feuilleTiree = null;

    const largeur = sceneEl.clientWidth || 360;
    const p = Math.min(1, Math.abs(dx) / largeur);
    // beaucoup plus sensible qu'avant (0.26 -> 0.13)
    const franc = p > 0.13 || Math.abs(vitesse) > 0.16;

    const versSuivante = sens === -1;

    let nouvelIndex = index;
    if (franc) nouvelIndex = versSuivante ? index + 1 : index - 1;
    nouvelIndex = Math.max(-1, Math.min(pages.length - 1, nouvelIndex));
    const change = nouvelIndex !== index;

    livreEl.classList.remove("glisse");
    f.style.transition = "";
    f.style.transform = change
      ? (versSuivante ? "rotateY(-180deg)" : "rotateY(0deg)")
      : (versSuivante ? "rotateY(0deg)" : "rotateY(-180deg)");

    if (change) {
      arreterLecture();
      index = nouvelIndex;
      majTextes();
    }

    setTimeout(() => {
      f.style.transform = "";
      f.style.transition = "";
      appliquerEtat(false);
    }, DUREE + 60);
  }

  // sur window : le doigt peut sortir de la page pendant le geste
  window.addEventListener("pointerup", finGlisse);
  window.addEventListener("pointercancel", finGlisse);

  document.addEventListener("keydown", (e) => {
    if (dansEdition(document.activeElement)) return;
    if (e.key === "ArrowRight") suivant();
    if (e.key === "ArrowLeft") precedent();
  });

  /* ---------------- Lecture a voix haute ---------------- */
  function textePage() {
    if (index < 0) {
      return "Komara Academy. Apprendre le HTML pas à pas. Touche la couverture pour ouvrir le livre.";
    }
    const f = feuilles()[index];
    if (!f) return "";
    const z = f.querySelector(".page-corps") || f.querySelector(".champ-corps");
    if (!z) return "";
    const c = z.cloneNode(true);

    // on retire seulement ce qui ne se lit pas : le code brut, les zones de saisie, le pied
    c.querySelectorAll("pre, script, style, .exo-reponse, .pied-page, .suite-bas, .vierge-badge").forEach((n) => n.remove());

    const out = [];
    const ajoute = (txt) => { const v = (txt || "").replace(/\s+/g, " ").trim(); if (v.length > 1) out.push(v); };

    const parcourir = (noeud) => {
      Array.from(noeud.children).forEach((el) => {
        const tag = el.tagName;
        if (el.classList.contains("exo-zone")) {
          ajoute(lang === "en" ? "Now write your answer in the box below." :
                 lang === "ar" ? "اكتب جوابك في الخانة أسفله." :
                 "Écris maintenant ta réponse dans la zone en dessous.");
          return;
        }
        // corrige replie : la voix le signale, elle ne le lit pas d'office
        if (tag === "DETAILS") {
          ajoute(lang === "en" ? "The answer is available below. Open it after you try." :
                 lang === "ar" ? "الجواب متوفر أسفله. افتحه بعد أن تحاول." :
                 "Le corrigé est juste en dessous. Ouvre-le après avoir essayé.");
          return;
        }
        // mini-titre de bloc : Objectif, A retenir, Exercice, Corrige...
        const etiquette = el.querySelector && el.querySelector(":scope > b, :scope > strong, :scope > .etiq, :scope > .cle-titre");
        if (tag === "TABLE") {
          const lignes = Array.from(el.querySelectorAll("tr")).map((tr) => {
            const cells = Array.from(tr.children).map((td) => td.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
            return cells.join(", ");
          }).filter(Boolean);
          lignes.forEach((l) => ajoute(l));
          return;
        }
        if (/^(H1|H2|H3|H4)$/.test(tag)) { ajoute(el.textContent); return; }
        if (/^(P|LI|BLOCKQUOTE|DT|DD|FIGCAPTION|CAPTION)$/.test(tag)) { ajoute(el.textContent); return; }
        if (el.children.length && !/^(SPAN|CODE|A|B|STRONG|EM|I)$/.test(tag)) {
          // bloc composite (objectif, a retenir, exercice, corrige...) : on lit tout son contenu en ordre
          if (el.querySelector("p, li, h2, h3, table, .exo-zone, div")) { parcourir(el); return; }
        }
        ajoute(el.textContent);
      });
    };
    parcourir(c);
    return out.join(". ");
  }

  function nettoyerPourVoix(txt) {
    let s = (txt || "")
      .replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}]/gu, " ")
      .replace(/[\u2019\u2018\u02BC]/g, "'")
      .replace(/[«»\u201C\u201D"]/g, " ")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    // acronymes : on les fait epeler proprement
    s = s.replace(/\bHTML\b/g, "H T M L")
         .replace(/\bCSS\b/g, "C S S")
         .replace(/\bSEO\b/g, "S E O")
         .replace(/\bURL\b/g, "U R L")
         .replace(/\bJS\b/g, "J S")
         .replace(/\bW3C\b/g, "W 3 C")
         .replace(/\bMDN\b/g, "M D N");

    // balises HTML : on les dit comme on les prononce
    const BAL = { h1:"h un", h2:"h deux", h3:"h trois", h4:"h quatre", h5:"h cinq", h6:"h six",
      p:"p", br:"b r", hr:"h r", em:"em", img:"image", src:"s r c", alt:"alt", href:"h ref",
      th:"t h", td:"t d", tr:"t r", li:"l i", ul:"u l", ol:"o l", nav:"nave", div:"dive", span:"spane",
      a:"a", id:"i d", css:"c s s", js:"j s", abbr:"abréviation", colspan:"col span", rowspan:"row span" };
    s = s.replace(/(?<![\p{L}\p{N}])(h[1-6]|br|hr|img|src|href|abbr|colspan|rowspan|th|td|tr|li|ul|ol|nav|div|span|id)(?![\p{L}\p{N}])/giu, (m) => BAL[m.toLowerCase()] || m);

    // prononciation francaise des mots importes
    s = s.replace(/\bbots\b/gi, "botes")
         .replace(/\bbot\b/gi, "bote")
         .replace(/\bWhatsApp\b/gi, "Ouatsapp")
         .replace(/\bGitHub\b/gi, "Guiteub")
         .replace(/\biframe\b/gi, "i-frame")
         .replace(/\bviewport\b/gi, "viou-porte")
         .replace(/\blabel\b/gi, "labèle");

    // les mots tout en majuscules font epeler : on les remet en minuscules
    s = s.replace(/\b[A-ZÀ-ÖØ-Ý]{3,}\b/g, (m) => m.charAt(0) + m.slice(1).toLowerCase());
    s = s.replace(/([.!?…])\s*\.+/g, "$1").replace(/\s+([,.;:!?])/g, "$1");
    return s;
  }

  let voix = null;
  function choisirVoix() {
    if (!("speechSynthesis" in window)) return null;
    const dispo = window.speechSynthesis.getVoices() || [];
    if (!dispo.length) return null;
    const cible = lang === "ar" ? "ar" : lang === "en" ? "en" : "fr";
    let liste = dispo.filter((v) => (v.lang || "").toLowerCase().indexOf(cible) === 0);
    if (!liste.length) liste = dispo.filter((v) => /^fr/i.test(v.lang));
    if (!liste.length) liste = dispo;

    const note = (v) => {
      const n = ((v.name || "") + " " + (v.voiceURI || "")).toLowerCase();
      let p = 0;
      if (/natural|neural|online|premium|enhanced|siri/.test(n)) p += 8;
      if (/google/.test(n)) p += 6;
      if (/denise|amélie|amelie|audrey|thomas|marie|julie|hortense|virginie|samantha|maged|majed|zeina/.test(n)) p += 4;
      if (v.localService) p += 1;
      if (/compact|espeak|pico|robotique|robot/.test(n)) p -= 10;
      return p;
    };
    return liste.sort((a, b) => note(b) - note(a))[0] || null;
  }

  let enLecture = false, fileVocale = [], posVocale = 0, pauseTimer = null;

  function majBoutonLecture() {
    btnLire.classList.toggle("actif", enLecture);
    btnLire.querySelector(".o-ico").textContent = enLecture ? "⏸" : "🔊";
  }

  function arreterLecture() {
    enLecture = false;
    clearTimeout(pauseTimer);
    fileVocale = [];
    posVocale = 0;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    majBoutonLecture();
  }

  function direSuivante() {
    if (!enLecture) return;
    if (posVocale >= fileVocale.length) { arreterLecture(); return; }
    const u = new SpeechSynthesisUtterance(fileVocale[posVocale++]);
    u.lang = lang === "ar" ? "ar-SA" : lang === "en" ? "en-US" : "fr-FR";
    u.rate = 0.92;
    u.pitch = 1;
    u.volume = 1;
    if (!voix) voix = choisirVoix();
    if (voix) u.voice = voix;
    u.onend = () => {
      if (!enLecture) return;
      // une vraie respiration entre les phrases : la lecture n'est plus monocorde
      pauseTimer = setTimeout(direSuivante, 300);
    };
    u.onerror = () => {
      if (!enLecture) return;
      pauseTimer = setTimeout(direSuivante, 120);
    };
    try { window.speechSynthesis.speak(u); } catch (_) { arreterLecture(); }
  }

  function lire() {
    if (!("speechSynthesis" in window)) { toast(t("pasVoix")); return; }
    if (enLecture) { arreterLecture(); return; }

    const brut = textePage();
    if (!brut || brut.length < 3) { toast(t("indecrisible")); return; }

    const propre = nettoyerPourVoix(brut);
    const phrases = propre.match(/[^.!?…]+[.!?…]*/g) || [propre];
    fileVocale = phrases.map((s) => s.trim()).filter((s) => s.length > 1);
    if (!fileVocale.length) { toast(t("indecrisible")); return; }

    window.speechSynthesis.cancel();
    voix = choisirVoix();
    posVocale = 0;
    enLecture = true;
    majBoutonLecture();
    direSuivante();
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", () => { voix = choisirVoix(); });
  }
  btnLire.addEventListener("click", lire);

  /* ---------------- Le livre repond ---------------- */
  const SAVOIR = [
    {
      test: /prix|tarif|co[uû]te|cout|devis|combien.*(€|euro|site|bot)|price|cost/i,
      texte: "Grille Komara Agency, en euros : Bot Telegram 50 €, Bot WhatsApp vendeur 100 €, Agent IA Premium 150 €, maintenance 50 € par mois, site vitrine 250 €, logo 50 €. Paiement 50 % à la commande et 50 % à la livraison.",
      page: -1
    },
    {
      test: /contact|joindre|téléphone|telephone|whatsapp|e-?mail|adresse|numéro|numero/i,
      texte: "Komara Agency : WhatsApp +212 701 986 219, e-mail ndinekomara2442@gmail.com. Basée à Casablanca, on travaille aussi en Guinée.",
      page: -1
    },
    {
      test: /qui (est|es)|komara agency|c'est quoi komara|agence/i,
      texte: "Komara Agency est une agence de Ndine Komara, basée à Casablanca : sites vitrines, bots WhatsApp et design. Ce livre est son cours de HTML.",
      page: -1
    },
    {
      test: /combien de chapitres|sommaire|programme|plan du livre/i,
      texte: "Le livre compte 20 chapitres en 5 parties : les bases, structurer, formulaires, qualité et pratique, plus 5 annexes. Le sommaire est la première page.",
      page: 0
    }
  ];

  const VIDES = ["les", "des", "une", "que", "qui", "pour", "avec", "dans", "sur", "est", "comment", "quoi", "combien", "quel", "quelle", "mon", "ton", "son", "the", "how", "what", "does"];

  function mots(txt) {
    return (txt || "").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((m) => m.length > 2 && VIDES.indexOf(m) === -1);
  }

  function passages() {
    const out = [];
    feuilles().forEach((f, i) => {
      const z = f.querySelector(".page-corps") || f.querySelector(".champ-corps");
      if (!z) return;
      const info = pages[i] || {};
      const complement = " " + (info.motsCles || "") + " " + (info.titre || "");
      z.querySelectorAll("p, li, h2, h3, td").forEach((el) => {
        const s = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (s.length > 8) out.push({ texte: s, page: i, titre: info.titre || "", complement: complement });
      });
    });
    return out;
  }

  function repondre(question) {
    const q = question || "";
    const mq = mots(q);
    if (!mq.length) return { texte: t("detail"), page: -1 };

    // 1) les informations de l'agence passent avant le contenu du livre
    for (let i = 0; i < SAVOIR.length; i++) {
      if (SAVOIR[i].test.test(q)) return { texte: SAVOIR[i].texte, page: SAVOIR[i].page };
    }

    const liste = passages();
    if (!liste.length) {
      return { texte: "Les pages ne sont pas encore chargées. Réessaie dans un instant.", page: -1 };
    }

    const sacsPage = pages.map((p) => new Set(mots((p.motsCles || "") + " " + (p.titre || "") + " " + (p.chapitre || ""))));
    const dfPage = {};
    sacsPage.forEach((sac) => sac.forEach((m) => { dfPage[m] = (dfPage[m] || 0) + 1; }));
    const poidsPage = (m) => 1 + Math.log(1 + pages.length / (dfPage[m] || 1));

    const scorePage = sacsPage.map((sac) => {
      let s = 0;
      mq.forEach((m) => {
        if (sac.has(m)) s += poidsPage(m);
        else if (Array.from(sac).some((x) => x.indexOf(m.slice(0, 4)) === 0)) s += poidsPage(m) * 0.8;
      });
      return s;
    });

    let meilleurePage = -1;
    let meilleurScore = 0;
    scorePage.forEach((sc, i) => {
      if (sc > meilleurScore) { meilleurScore = sc; meilleurePage = i; }
    });

    const dansLaPage = meilleurePage >= 0 ? liste.filter((x) => x.page === meilleurePage) : liste;
    const vivier = dansLaPage.length ? dansLaPage : liste;

    const N = vivier.length;
    const df = {};
    const sacsTxt = vivier.map((psg) => new Set(mots(psg.texte)));
    const sacs = vivier.map((psg, i) => {
      const sac = new Set([...sacsTxt[i], ...mots(psg.complement)]);
      sac.forEach((m) => { df[m] = (df[m] || 0) + 1; });
      return sac;
    });
    const poids = (m) => 1 + Math.log(1 + N / (df[m] || 1));

    const notes = vivier.map((psg, i) => {
      let score = 0;
      mq.forEach((m) => {
        if (sacsTxt[i].has(m)) score += 2.5 * poids(m);
        else if (sacs[i].has(m)) score += poids(m) * 0.8;
        else if (Array.from(sacs[i]).some((x) => x.indexOf(m.slice(0, 4)) === 0)) score += poids(m) * 0.4;
      });
      return Object.assign({}, psg, { score: score / Math.log(2 + psg.texte.length / 90) });
    }).sort((a, b) => b.score - a.score);

    const best = notes[0];

    if (!best || (meilleurScore === 0 && (!best.score || best.score < 1.1))) {
      return { texte: t("vide"), page: -1, wa: true };
    }

    const txt = best.texte;
    return { texte: txt.length > 420 ? txt.slice(0, 415) + "…" : txt, page: best.page };
  }

  function bulle(texte, qui, page) {
    const d = document.createElement("div");
    d.className = "msg " + qui;
    d.textContent = texte;
    if (typeof page === "number" && page >= 0) {
      const b = document.createElement("button");
      b.className = "aller";
      b.type = "button";
      b.textContent = t("ouvrePage") + " " + (page + 1);
      b.addEventListener("click", () => { fermerPanneaux(); allerA(page); });
      d.appendChild(document.createElement("br"));
      d.appendChild(b);
    }
    fil.appendChild(d);
    fil.scrollTop = fil.scrollHeight;
  }

  function proposer() {
    const zone = document.createElement("div");
    zone.className = "suggestions";
    (t("sugg") || []).forEach((s) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = s;
      b.addEventListener("click", () => { zone.remove(); poser(s); });
      zone.appendChild(b);
    });
    fil.appendChild(zone);
  }

  function poser(q) {
    bulle(q, "moi");
    const r = repondre(q);
    setTimeout(() => {
      bulle(r.texte, "bot", r.page);
      if (r.wa) {
        const d = document.createElement("div");
        d.className = "msg bot";
        const a = document.createElement("a");
        a.href = "https://wa.me/" + WA;
        a.target = "_blank";
        a.rel = "noopener";
        a.style.cssText = "color:#FFD700;font-weight:700";
        a.textContent = "💬 WhatsApp";
        d.appendChild(a);
        fil.appendChild(d);
        fil.scrollTop = fil.scrollHeight;
      }
    }, 200);
  }

  /* ---------------- Panneaux ---------------- */
  function ouvrirPanneau(p) {
    [panneauBot, panneauMenu, panneauEcrire].forEach((x) => x.classList.remove("ouvert"));
    p.classList.add("ouvert");
    voile.classList.add("visible");
    if (p === panneauBot) setTimeout(() => $("#question").focus(), 180);
    if (p === panneauEcrire) setTimeout(() => noteCorps.focus(), 180);
  }
  function fermerPanneaux() {
    [panneauBot, panneauMenu, panneauEcrire].forEach((x) => x.classList.remove("ouvert"));
    voile.classList.remove("visible");
  }
  const estOuvert = (p) => p.classList.contains("ouvert");

  $("#btn-bot").addEventListener("click", () => {
    if (!estOuvert(panneauBot)) {
      if (!fil.childElementCount) { bulle(t("accueil"), "bot"); proposer(); }
      ouvrirPanneau(panneauBot);
    } else fermerPanneaux();
  });
  $("#fermer-bot").addEventListener("click", fermerPanneaux);

  $("#form-bot").addEventListener("submit", (e) => {
    e.preventDefault();
    const champ = $("#question");
    const q = champ.value.trim();
    if (!q) return;
    champ.value = "";
    poser(q);
  });

  /* ---------------- Ecrire ---------------- */
  noteTitre.value = (sauvegardes._note && sauvegardes._note.titre) || "";
  noteCorps.value = (sauvegardes._note && sauvegardes._note.corps) || "";

  function sauverNote() {
    sauvegardes._note = { titre: noteTitre.value, corps: noteCorps.value };
    sauvegarder();
  }
  noteTitre.addEventListener("input", sauverNote);
  noteCorps.addEventListener("input", sauverNote);

  $("#btn-ecrire").addEventListener("click", () => {
    if (estOuvert(panneauEcrire)) fermerPanneaux();
    else ouvrirPanneau(panneauEcrire);
  });
  $("#fermer-ecrire").addEventListener("click", () => { sauverNote(); fermerPanneaux(); });
  $("#ecrire-fini").addEventListener("click", () => {
    sauverNote();
    fermerPanneaux();
    toast(t("noteEnregistree"));
  });
  $("#ecrire-feuille").addEventListener("click", () => {
    sauverNote();
    sauvegardes._ajoutees = (sauvegardes._ajoutees || 0) + 1;
    try { localStorage.setItem(CLE, JSON.stringify(sauvegardes)); } catch (_) {}
    construirePages();
    dessiner();
    fermerPanneaux();
    allerA(pages.length - 1);
    toast(t("feuilleAjoutee"));
  });

  /* ---------------- Menu ---------------- */
  $("#btn-menu").addEventListener("click", () => {
    if (!estOuvert(panneauMenu)) ouvrirPanneau(panneauMenu);
    else fermerPanneaux();
  });
  $("#fermer-menu").addEventListener("click", fermerPanneaux);
  voile.addEventListener("click", fermerPanneaux);
  $("#menu-sommaire").addEventListener("click", () => { fermerPanneaux(); allerA(0); });

  /* ---------------- Partage ---------------- */
  async function partager() {
    const data = {
      title: LIVRE.titre || "Apprendre le HTML pas à pas",
      text: "Le livre interactif de Komara Academy : 20 chapitres, exercices et corrigés.",
      url: LIEN
    };
    if (navigator.share) {
      try { await navigator.share(data); fermerPanneaux(); return; } catch (_) { /* annule */ }
    }
    copierLien();
  }

  function montrerLien() {
    const el = $("#lien-visible");
    if (!el) return;
    el.hidden = false;
    el.textContent = LIEN;
    try { el.scrollIntoView({ block: "nearest" }); } catch (_) {}
  }

  function copierLien() {
    const fini = () => toast(t("lienCopie"));
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(LIEN).then(fini).catch(() => { montrerLien(); });
    } else {
      montrerLien();
    }
  }

  $("#menu-partager").addEventListener("click", partager);
  $("#menu-copier").addEventListener("click", copierLien);

  $("#menu-ajouter").addEventListener("click", () => {
    sauvegardes._ajoutees = (sauvegardes._ajoutees || 0) + 1;
    try { localStorage.setItem(CLE, JSON.stringify(sauvegardes)); } catch (_) {}
    construirePages();
    dessiner();
    fermerPanneaux();
    allerA(pages.length - 1);
    toast(t("feuilleAjoutee"));
  });

  $("#menu-exporter").addEventListener("click", () => {
    const l = ["# Komara Academy — mes notes", ""];
    if (sauvegardes._note && (sauvegardes._note.titre || sauvegardes._note.corps)) {
      l.push("## " + (sauvegardes._note.titre || "Note libre"));
      l.push(sauvegardes._note.corps || "");
      l.push("");
    }
    pages.forEach((p, i) => {
      const s = sauvegardes[p.id];
      if (!s) return;
      const bouts = [];
      if (s.corps) bouts.push(s.corps);
      if (s.exo) bouts.push("Exercice : " + s.exo);
      if (!bouts.length) return;
      l.push("## " + (s.titre || p.titre) + "  (page " + (i + 1) + ")");
      bouts.forEach((b) => l.push(String(b).replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim()));
      l.push("");
    });
    const blob = new Blob([l.join("\n")], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "komara-academy-notes.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast(t("notesExportees"));
  });

  $("#menu-reset").addEventListener("click", () => {
    if (!confirm(t("effaceConfirme"))) return;
    sauvegardes = {};
    try { localStorage.removeItem(CLE); } catch (_) {}
    noteTitre.value = "";
    noteCorps.value = "";
    construirePages();
    dessiner();
    fermerPanneaux();
    toast(t("notesEffacees"));
  });

  /* ---------------- Langue ---------------- */
  function appliquerLangue() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-t]").forEach((el) => { el.textContent = t(el.dataset.t); });
    document.querySelectorAll(".langue-btn").forEach((b) => b.classList.toggle("actif", b.dataset.lang === lang));
    majTextes();
    voix = null;
    // le bot repart dans la langue choisie
    if (fil.childElementCount) {
      fil.innerHTML = "";
      bulle(t("accueil"), "bot");
      proposer();
    }
  }

  document.querySelectorAll(".langue-btn").forEach((b) => {
    b.addEventListener("click", () => {
      lang = b.dataset.lang;
      try { localStorage.setItem(CLE_LANG, lang); } catch (_) {}
      appliquerLangue();
      $("#question").placeholder = lang === "ar" ? "سؤالك..." : lang === "en" ? "Your question..." : "Ta question...";
      arreterLecture();
    });
  });

  /* ---------------- Saisie (feuilles + exercices) ---------------- */
  livreEl.addEventListener("input", (e) => {
    const el = e.target;
    if (!el.dataset || !el.dataset.page) return;
    const id = el.dataset.page;
    sauvegardes[id] = sauvegardes[id] || {};
    sauvegardes[id][el.dataset.champ] =
      el.dataset.champ === "titre" ? el.textContent : el.innerHTML;
    sauvegarder();
  });

  /* ---------------- Demarrage ---------------- */
  charger();
  construirePages();
  dessiner();
  appliquerEtat(false);
  appliquerLangue();
  $("#nom-livre").textContent = LIVRE.titre || "Komara Academy";
  $("#question").placeholder = lang === "ar" ? "سؤالك..." : lang === "en" ? "Your question..." : "Ta question...";

  setTimeout(() => { if (index < 0) toast(t("toastOuvre")); }, 1500);

  window.__livre = {
    total: () => pages.length,
    index: () => index,
    allerA,
    repondre,
    textePage,
    langue: () => lang
  };
})();
