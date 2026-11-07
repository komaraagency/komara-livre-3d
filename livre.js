/* Komara Academy — moteur du livre 3D
   - couverture qui s'ouvre
   - pages tournees au doigt (glissement en direct)
   - lecture a voix haute (Web Speech API)
   - bot qui repond a partir du contenu du livre
   - feuilles vierges editables, sauvegardees sur l'appareil
*/

(() => {
  "use strict";

  const LIVRE = window.LIVRE || { pages: [], vierges: [] };
  const CLE = "komara-livre-v1";
  const WA = "212701986219";
  const DUREE = 850;

  let pages = [];
  let index = -1;
  let enLecture = false;
  let sauvegardes = {};

  const $ = (s) => document.querySelector(s);
  const livreEl = $("#livre");
  const sceneEl = $("#scene");
  const couvertureEl = $("#couverture");
  const compteurEl = $("#compteur");
  const etatPageEl = $("#etat-page");
  const btnPrec = $("#btn-prec");
  const btnSuiv = $("#btn-suiv");
  const btnLire = $("#btn-lire");
  const toastEl = $("#toast");
  const voile = $("#voile");
  const panneauBot = $("#panneau-bot");
  const panneauMenu = $("#panneau-menu");
  const fil = $("#fil");

  /* ---------------- Divers ---------------- */
  let toastTimer = null;
  function toast(txt) {
    toastEl.textContent = txt;
    toastEl.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("visible"), 2400);
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
    }, 350);
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

  function creerFeuille(page, numero) {
    const f = document.createElement("div");
    f.className = "feuille";
    f.dataset.id = page.id;

    const recto = document.createElement("div");
    recto.className = "face recto papier";

    const tete = document.createElement("div");
    tete.className = "page-tete";
    const chap = document.createElement("span");
    chap.className = "page-chapitre";
    chap.textContent = page.chapitre || "";
    const num = document.createElement("span");
    num.className = "page-num";
    num.textContent = "p. " + numero;
    tete.append(chap, num);
    recto.appendChild(tete);

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
      const sauvTitre = sauvegardes[page.id] && sauvegardes[page.id].titre;
      titre.textContent = sauvTitre || page.titre || "";

      const corps = document.createElement("div");
      corps.className = "champ-corps";
      corps.contentEditable = "true";
      corps.dataset.page = page.id;
      corps.dataset.champ = "corps";
      corps.innerHTML = (sauvegardes[page.id] && sauvegardes[page.id].corps) || "";

      recto.append(badge, titre, corps);
    } else {
      const corps = document.createElement("div");
      corps.className = "page-corps";
      corps.innerHTML = page.html;
      recto.appendChild(corps);
    }

    const verso = document.createElement("div");
    verso.className = "face verso papier";
    verso.innerHTML =
      '<div class="page-tete"><span class="page-chapitre">' + (page.chapitre || "") +
      '</span><span class="page-num">p. ' + (numero + 1) + "</span></div>" +
      '<div class="page-corps"><p style="color:#8d8574;font-size:14px;margin-top:38%">' +
      (page.vierge ? "(suite de la feuille)" : "Tourne la page avec ton doigt") +
      "</p></div>";

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
      etatPageEl.textContent = "Couverture";
    } else {
      const p = pages[index];
      etatPageEl.textContent = "Page " + (index + 1) + " sur " + pages.length + (p && p.chapitre ? " · " + p.chapitre : "");
    }
    btnPrec.disabled = index < 0;
    btnSuiv.disabled = index >= pages.length - 1;
  }

  function appliquerEtat(animer) {
    if (!animer) livreEl.classList.add("glisse");

    couvertureEl.classList.toggle("tournee", index >= 0);
    // fermee : la couverture couvre tout ; ouverte : elle passe derriere
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
  let actif = false, departX = 0, departY = 0, dx = 0, sens = 0;
  let feuilleTiree = null, dernierX = 0, dernierT = 0, vitesse = 0;

  sceneEl.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, a, input, textarea")) return;
    if (e.target.isContentEditable) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    actif = true;
    departX = dernierX = e.clientX;
    departY = e.clientY;
    dx = 0; sens = 0; vitesse = 0;
    dernierT = performance.now();
    feuilleTiree = null;
    try { sceneEl.setPointerCapture(e.pointerId); } catch (_) {}
  });

  sceneEl.addEventListener("pointermove", (e) => {
    if (!actif) return;

    const deltaX = e.clientX - departX;
    const deltaY = e.clientY - departY;
    dx = deltaX;

    if (sens === 0) {
      if (Math.abs(deltaX) < 12 && Math.abs(deltaY) < 12) return;
      // geste vertical : on laisse le texte defiler
      if (Math.abs(deltaY) > Math.abs(deltaX)) { actif = false; return; }
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

    const t = performance.now();
    vitesse = (e.clientX - dernierX) / Math.max(1, t - dernierT);
    dernierX = e.clientX; dernierT = t;

    const angle = sens === -1 ? -180 * p : -180 * (1 - p);
    feuilleTiree.style.transition = "none";
    feuilleTiree.style.transform = "rotateY(" + angle + "deg)";
  }, { passive: true });

  function finGlisse() {
    if (!actif) return;
    actif = false;

    if (!feuilleTiree) { livreEl.classList.remove("glisse"); return; }

    glisseRecemment = true;
    setTimeout(() => { glisseRecemment = false; }, 350);

    const f = feuilleTiree;
    feuilleTiree = null;

    const largeur = sceneEl.clientWidth || 360;
    const p = Math.min(1, Math.abs(dx) / largeur);
    const franc = p > 0.26 || Math.abs(vitesse) > 0.4;

    const versSuivante = sens === -1;
    const valide = franc;

    // nouvel index
    let nouvelIndex = index;
    if (valide) nouvelIndex = versSuivante ? index + 1 : index - 1;
    nouvelIndex = Math.max(-1, Math.min(pages.length - 1, nouvelIndex));
    const change = nouvelIndex !== index;

    // on anime la feuille tiree jusqu'a sa position finale
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

    // apres l'animation, on rend la main au CSS
    setTimeout(() => {
      f.style.transform = "";
      f.style.transition = "";
      appliquerEtat(false);
    }, DUREE + 60);
  }

  sceneEl.addEventListener("pointerup", finGlisse);
  sceneEl.addEventListener("pointercancel", finGlisse);

  document.addEventListener("keydown", (e) => {
    if (document.activeElement && document.activeElement.isContentEditable) return;
    if (e.key === "ArrowRight") suivant();
    if (e.key === "ArrowLeft") precedent();
  });

  /* ---------------- Lecture a voix haute ---------------- */
  function textePage() {
    if (index < 0) {
      return "Komara Academy. Le guide du business digital. Touche la couverture pour ouvrir le livre.";
    }
    const f = feuilles()[index];
    if (!f) return "";
    const z = f.querySelector(".page-corps") || f.querySelector(".champ-corps");
    return z ? z.innerText.replace(/\s+/g, " ").trim() : "";
  }

  function arreterLecture() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    enLecture = false;
    btnLire.classList.remove("actif");
    btnLire.textContent = "🔊";
  }

  function lire() {
    if (!("speechSynthesis" in window)) {
      toast("La lecture vocale n'est pas disponible sur ce navigateur");
      return;
    }
    if (enLecture) { arreterLecture(); return; }

    const texte = textePage();
    if (!texte) { toast("Cette page est vide"); return; }

    const u = new SpeechSynthesisUtterance(texte);
    u.lang = "fr-FR";
    u.rate = 0.98;
    const voix = window.speechSynthesis.getVoices()
      .find((v) => /^fr[-_]FR/i.test(v.lang)) ||
      window.speechSynthesis.getVoices().find((v) => /^fr/i.test(v.lang));
    if (voix) u.voice = voix;

    const fin = () => {
      enLecture = false;
      btnLire.classList.remove("actif");
      btnLire.textContent = "🔊";
    };
    u.onend = fin;
    u.onerror = fin;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    enLecture = true;
    btnLire.classList.add("actif");
    if (btnLire.classList) btnLire.classList.add("actif");
    btnLire.textContent = "⏸";
  }
  btnLire.addEventListener("click", lire);
  if ("speechSynthesis" in window) window.speechSynthesis.getVoices();

  /* ---------------- Le livre repond ---------------- */
  const ACCUEIL_BOT =
    "Bonjour 👋 Je suis le livre. Pose-moi une question sur ce que tu viens de lire : les prix, les étapes d'un bot, les erreurs à éviter.";

  const SUGGESTIONS = [
    "Combien coûte un bot WhatsApp ?",
    "Comment structurer un bot ?",
    "Quelles erreurs éviter ?",
    "Comment se passe le paiement ?"
  ];

  const VIDES = ["les","des","une","que","qui","pour","avec","dans","sur","est","comment","quoi","combien","quel","quelle","mon","ton","son","the"];

  function mots(t) {
    return (t || "").toLowerCase()
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
        const t = el.innerText.replace(/\s+/g, " ").trim();
        if (t.length > 8) out.push({ texte: t, page: i, titre: info.titre || "", complement });
      });
    });
    return out;
  }

  function repondre(question) {
    const mq = mots(question);
    if (!mq.length) return { texte: "Écris ta question avec un peu plus de détails 🙂", page: -1 };

    const liste = passages();
    if (!liste.length) {
      return { texte: "Les pages ne sont pas encore chargées. Réessaie dans un instant.", page: -1 };
    }

    /* ---- 1. choisir la PAGE : les mots rares pèsent plus que les mots banals ---- */
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

    /* ---- 2. choisir le meilleur PASSAGE ---- */
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
      return {
        texte: "Je n'ai pas encore cette réponse dans le livre. Écris à Komara Agency sur WhatsApp, la réponse arrive en 2 minutes.",
        page: -1,
        wa: true
      };
    }

    const t = best.texte;
    return { texte: t.length > 420 ? t.slice(0, 415) + "…" : t, page: best.page };
  }

  function bulle(texte, qui, page) {
    const d = document.createElement("div");
    d.className = "msg " + qui;
    d.textContent = texte;
    if (typeof page === "number" && page >= 0) {
      const b = document.createElement("button");
      b.className = "aller";
      b.type = "button";
      b.textContent = "Ouvrir la page " + (page + 1);
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
    SUGGESTIONS.forEach((s) => {
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
        a.textContent = "💬 Ouvrir WhatsApp";
        d.appendChild(a);
        fil.appendChild(d);
        fil.scrollTop = fil.scrollHeight;
      }
    }, 240);
  }

  function ouvrirPanneau(p) {
    [panneauBot, panneauMenu].forEach((x) => x.classList.remove("ouvert"));
    p.classList.add("ouvert");
    voile.classList.add("visible");
    if (p === panneauBot) setTimeout(() => $("#question").focus(), 200);
  }
  function fermerPanneaux() {
    [panneauBot, panneauMenu].forEach((x) => x.classList.remove("ouvert"));
    voile.classList.remove("visible");
  }
  const estOuvert = (p) => p.classList.contains("ouvert");

  $("#btn-bot").addEventListener("click", () => {
    if (!estOuvert(panneauBot)) {
      if (!fil.childElementCount) { bulle(ACCUEIL_BOT, "bot"); proposer(); }
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

  /* ---------------- Menu ---------------- */
  $("#btn-menu").addEventListener("click", () => {
    if (!estOuvert(panneauMenu)) ouvrirPanneau(panneauMenu);
    else fermerPanneaux();
  });
  $("#fermer-menu").addEventListener("click", fermerPanneaux);
  voile.addEventListener("click", fermerPanneaux);
  $("#menu-sommaire").addEventListener("click", () => { fermerPanneaux(); allerA(0); });

  $("#menu-ajouter").addEventListener("click", () => {
    sauvegardes._ajoutees = (sauvegardes._ajoutees || 0) + 1;
    try { localStorage.setItem(CLE, JSON.stringify(sauvegardes)); } catch (_) {}
    construirePages();
    dessiner();
    fermerPanneaux();
    allerA(pages.length - 1);
    toast("Feuille vierge ajoutée 📄");
  });

  $("#menu-exporter").addEventListener("click", () => {
    const l = ["# Komara Academy — mes notes", ""];
    pages.forEach((p, i) => {
      const s = sauvegardes[p.id];
      if (!s) return;
      l.push("## " + (s.titre || p.titre) + "  (page " + (i + 1) + ")");
      l.push((s.corps || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim() || "(vide)", "");
    });
    const blob = new Blob([l.join("\n")], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "komara-academy-notes.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast("Notes exportées ⬇️");
  });

  $("#menu-reset").addEventListener("click", () => {
    if (!confirm("Effacer tout ce que tu as écrit dans les feuilles vierges ?")) return;
    sauvegardes = {};
    try { localStorage.removeItem(CLE); } catch (_) {}
    construirePages();
    dessiner();
    fermerPanneaux();
    toast("Notes effacées");
  });

  /* ---------------- Saisie des feuilles vierges ---------------- */
  livreEl.addEventListener("input", (e) => {
    const el = e.target;
    if (!el.dataset || !el.dataset.page) return;
    const id = el.dataset.page;
    sauvegardes[id] = sauvegardes[id] || {};
    sauvegardes[id][el.dataset.champ] =
      el.dataset.champ === "corps" ? el.innerHTML : el.textContent;
    sauvegarder();
  });

  /* ---------------- Demarrage ---------------- */
  charger();
  construirePages();
  dessiner();
  appliquerEtat(false);
  $("#nom-livre").textContent = LIVRE.titre || "Komara Academy";

  setTimeout(() => { if (index < 0) toast("Touche la couverture pour ouvrir 📖"); }, 1500);

  window.__livre = {
    total: () => pages.length,
    index: () => index,
    allerA,
    repondre,
    textePage
  };
})();
