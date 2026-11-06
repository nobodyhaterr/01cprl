/* ---------- Contenu modifiable ----------
   Chaque rubrique : identifiant, titre, introduction et sous-pages.
   Sous-page : [identifiant, titre, mise en page]
   Mises en page : ed = éditorial, grid = cartes, visual = visuel. */
const SEC = [
  {
    id: 'presentation',
    t: 'Présentation personnelle',
    l: 'Qui je suis, mon parcours et mes qualités.',
    k: [
      ['qui-suis-je', 'Qui suis-je ?', 'ed'],
      ['mon-parcours', 'Mon parcours', 'ed'],
      ['mes-qualites', 'Mes qualités', 'ed']
    ]
  },
  {
    id: 'bac-pro-ciel',
    t: 'Bac Pro CIEL',
    l: 'Présentation, compétences, réalisations et stages.',
    k: [
      ['bac-presentation', 'Présentation', 'ed'],
      ['competences', 'Mes compétences', 'grid'],
      ['realisations', 'Mes réalisations', 'grid'],
      ['stages', 'Mes stages', 'grid']
    ]
  },
  {
    id: 'passions',
    t: 'Passions',
    l: 'Informatique, jeux vidéo et sport.',
    k: [
      ['informatique', 'Informatique', 'visual'],
      ['jeux-video', 'Jeux vidéo', 'visual'],
      ['sport', 'Sport', 'visual']
    ]
  },
  {
    id: 'rubrique-4',
    t: 'Rubrique 4',
    l: 'Intitulé modifiable.',
    k: [
      ['rubrique-4-1', 'Sous-rubrique 4-1', 'ed'],
      ['rubrique-4-2', 'Sous-rubrique 4-2', 'ed'],
      ['rubrique-4-3', 'Sous-rubrique 4-3', 'ed']
    ]
  },
  {
    id: 'rubrique-5',
    t: 'Rubrique 5',
    l: 'Intitulé modifiable.',
    k: [
      ['rubrique-5-1', 'Sous-rubrique 5-1', 'ed'],
      ['rubrique-5-2', 'Sous-rubrique 5-2', 'ed'],
      ['rubrique-5-3', 'Sous-rubrique 5-3', 'ed']
    ]
  }
];

/* ---------- Éléments de la page ---------- */
const $ = s => document.querySelector(s);
const main = $('#main');
const menu = $('#menu');
const foot = $('#foot');
const burger = $('#burger');
const themeBtn = $('#theme');

/* ---------- Thème sauvegardé ---------- */
try {
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.dataset.theme = saved;
} catch (e) { /* stockage indisponible : le thème du système reste utilisé */ }

/* ---------- Outils de rendu ---------- */
function find(id) {
  for (const s of SEC) {
    if (s.id === id) return { s, k: null };
    const k = s.k.find(x => x[0] === id);
    if (k) return { s, k };
  }
  return null;
}

function card(titre, texte, href) {
  const tag = href ? 'a' : 'div';
  const lien = href ? ` href="${href}"` : '';
  return `<${tag} class="glass card lift rv"${lien}><h3>${titre}</h3><p>${texte}</p></${tag}>`;
}

function ph(texte) {
  return `<div class="ph">${texte}</div>`;
}

function home() {
  return `
    <section class="hero">
      <h1 class="ttl rv">Bienvenue</h1>
      <p class="lead rv">Introduction modifiable : présentez ici votre univers en quelques lignes.</p>
      <a class="btnp rv" href="#presentation">Découvrir</a>
    </section>
    <div class="grid">${SEC.map(s => card(s.t, s.l, '#' + s.id)).join('')}</div>`;
}

function page(id) {
  if (id === 'accueil') return home();

  const f = find(id);
  if (!f) return null;

  const { s, k } = f;
  let corps;

  if (!k) {
    corps = `
      <h1 class="ttl rv">${s.t}</h1>
      <p class="lead rv">${s.l}</p>
      <div class="grid">${s.k.map(x => card(x[1], 'Accéder à cette page.', '#' + x[0])).join('')}</div>`;
  } else if (k[2] === 'ed') {
    corps = `
      <h1 class="ttl rv">${k[1]}</h1>
      <p class="lead rv">Introduction modifiable.</p>
      <div class="ed rv">
        <p>Texte modifiable : développez ici votre propos en quelques phrases courtes.</p>
        <p>Texte modifiable : second paragraphe à personnaliser.</p>
      </div>
      ${ph('Image ou galerie à ajouter')}`;
  } else if (k[2] === 'grid') {
    corps = `
      <h1 class="ttl rv">${k[1]}</h1>
      <p class="lead rv">Introduction modifiable.</p>
      <div class="grid">${[1, 2, 3].map(i => card('Élément ' + i, 'Titre et description modifiables.')).join('')}</div>
      ${ph('Galerie : images à ajouter')}`;
  } else {
    corps = `
      <div class="glass visual rv">
        <h1 class="ttl">${k[1]}</h1>
        <p class="lead">Présentation visuelle modifiable.</p>
      </div>
      ${ph('Images ou vidéos à ajouter')}`;
  }

  const fil = `
    <nav class="crumb" aria-label="Fil d’Ariane">
      <button class="btn" data-back aria-label="Retour">←</button>
      <a href="#accueil">Accueil</a><span>›</span>
      ${k ? `<a href="#${s.id}">${s.t}</a><span>›</span>` : ''}
      <span>${k ? k[1] : s.t}</span>
    </nav>`;

  return fil + corps;
}

function notFound() {
  return `
    <section class="hero">
      <h1 class="ttl">Page introuvable</h1>
      <p class="lead">Cette adresse n’existe pas ou a été déplacée.</p>
      <a class="btnp" href="#accueil">Retour à l’accueil</a>
    </section>`;
}

function back() {
  if (history.length > 1) history.back();
  else location.hash = '#accueil';
}

/* ---------- Navigation ---------- */
function closeDropdowns() {
  menu.querySelectorAll('.dd').forEach(d => {
    d.classList.remove('open');
    d.querySelector('button').setAttribute('aria-expanded', 'false');
  });
}

function buildNav() {
  menu.innerHTML =
    '<a href="#accueil" data-id="accueil">Accueil</a>' +
    SEC.map(s => `
      <div class="dd">
        <button data-s="${s.id}" aria-expanded="false">${s.t} ▾</button>
        <div class="dd-m glass">
          <a href="#${s.id}" data-id="${s.id}">Vue d’ensemble</a>
          ${s.k.map(k => `<a href="#${k[0]}" data-id="${k[0]}">${k[1]}</a>`).join('')}
        </div>
      </div>`).join('');

  foot.innerHTML = SEC.map(s => `<a href="#${s.id}">${s.t}</a>`).join('');
}

/* Apparition au défilement */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('on');
      io.unobserve(e.target);
    }
  });
}, { threshold: .12 });

/* Affiche la page correspondant à l'adresse */
function go() {
  const id = decodeURIComponent(location.hash.slice(1)) || 'accueil';
  const f = find(id);

  main.innerHTML = page(id) || notFound();

  /* Relance l'animation d'entrée de la page */
  main.classList.remove('in');
  void main.offsetWidth;
  main.classList.add('in');

  const titre = f ? (f.k ? f.k[1] : f.s.t) : (id === 'accueil' ? 'Accueil' : 'Page introuvable');
  document.title = titre + ' · Portfolio';

  menu.querySelectorAll('[data-id]').forEach(a => a.classList.toggle('on', a.dataset.id === id));
  menu.querySelectorAll('.dd > button').forEach(b => b.classList.toggle('on', !!f && b.dataset.s === f.s.id));

  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  closeDropdowns();
  window.scrollTo(0, 0);

  main.querySelectorAll('.rv').forEach(el => io.observe(el));
}

/* ---------- Événements ---------- */
menu.addEventListener('click', e => {
  const bouton = e.target.closest('.dd > button');
  if (!bouton) return;

  const dd = bouton.parentElement;
  const ouvrir = !dd.classList.contains('open');
  closeDropdowns();
  dd.classList.toggle('open', ouvrir);
  bouton.setAttribute('aria-expanded', ouvrir);
});

document.addEventListener('click', e => {
  if (!e.target.closest('.dd')) closeDropdowns();
});

burger.addEventListener('click', () => {
  const ouvert = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', ouvert);
});

themeBtn.addEventListener('click', () => {
  const racine = document.documentElement;
  const actuel = racine.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const nouveau = actuel === 'dark' ? 'light' : 'dark';
  racine.dataset.theme = nouveau;
  try { localStorage.setItem('theme', nouveau); } catch (e) { }
});

main.addEventListener('click', e => {
  if (e.target.closest('[data-back]')) back();
});

window.addEventListener('hashchange', go);

buildNav();
go();