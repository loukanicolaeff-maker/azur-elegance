# Mise à jour Azur Élégance — Guide de déploiement

## 📦 Contenu de ce dossier

Voici tous les fichiers nécessaires pour mettre à jour votre site. Le dossier
reproduit la structure exacte de votre site, il vous suffit de **tout copier**
à la racine de votre hébergement, en écrasant les anciens fichiers.

```
azur-elegance/
├── css/
│   └── style.css              ← MODIFIÉ (header, logo, pages légales, expérience)
├── js/
│   └── main.js                ← inchangé
├── images/
│   ├── logo-dark.png          ← NOUVEAU (logo bleu pour fond ivoire)
│   └── logo-light.png         ← NOUVEAU (logo blanc pour fond bleu nuit)
├── index.html                 ← MODIFIÉ (liens légaux du footer)
├── contact.html               ← MODIFIÉ (liens légaux du footer)
├── nos-prestations.html       ← MODIFIÉ (liens légaux du footer)
├── villa-one-eighty.html      ← MODIFIÉ (+ section "L'expérience")
├── le-domaine-de-la-brugaye.html  ← MODIFIÉ (+ section "L'expérience")
├── politique-de-confidentialite.html  ← NOUVEAU
├── declaration-accessibilite.html     ← NOUVEAU
├── conditions-generales.html          ← NOUVEAU
└── politique-de-remboursement.html    ← NOUVEAU
```

## ✨ Ce qui a été fait

### 1. Header plus visible en haut de page
Avant, le header était totalement transparent — peu lisible sur le hero clair.
Maintenant il a un voile ivoire subtil (72% d'opacité) avec un blur, et une
ombre douce. Au scroll, il devient presque opaque (96%) avec un blur renforcé
et le logo rétrécit un peu pour un effet dynamique élégant.

### 2. Logo image intégré au header et au footer
- **Header** : version bleu marine + monogramme AE doré (sur fond ivoire)
- **Footer** : version blanche + monogramme AE doré (sur fond bleu nuit)

Note : le texte "Azur ⁕ Élégance" reste présent dans le HTML mais masqué
visuellement — il reste lu par les lecteurs d'écran (accessibilité préservée).

### 3. Quatre nouvelles pages légales
Contenus adaptés depuis azur-elegance.fr :
- Politique de confidentialité
- Déclaration d'accessibilité
- Conditions générales
- Politique de remboursement

Chaque page reprend la charte graphique du site : eyebrow doré "⁕ MENTIONS
LÉGALES", titre en italique Cormorant Garamond, titres h2 précédés d'une
étoile ⁕ dorée, puces avec tirets dorés, encadré de contact à bordure dorée.

Les liens du footer de **toutes** les pages pointent désormais vers ces pages.

### 4. Sections "L'expérience" pour les biens de prestige

**Villa One Eighty** (insérée après "Un écrin contemporain") :
- Encadré doré "5 Chambres — 10 Personnes"
- Grille 2 colonnes : Piscine · 4 Salles de douche · Terrasses · 1 Salle de
  bain · Jardin · Climatisation · Parking Privé · Wifi

**Domaine de la Brugaye** (insérée après la présentation, avant le sommaire
des appartements) :
- Encadré doré "6 Chambres — 16 Personnes"
- Grille 3 colonnes : 3 Appartements - 1 Studio · 4 Salles de douche · Piscine
  · 4 Lits doubles · 4 Cuisines · Terrasses · 4 Lits simples · Climatisation
  · Jardin · 2 Canapés lits · Wifi · Parking Privé

Les **icônes sont des SVG dessinés sur-mesure** (line-art fin, bleu marine) —
pas besoin de charger des images externes, parfaitement nettes à toute
résolution (écran 4K, rétina, impression).

## 🚀 Déploiement

1. Téléchargez et dézippez le fichier.
2. Dans votre interface d'hébergement (FTP, cPanel, ou l'éditeur de votre
   hébergeur), copiez tout le contenu du dossier `azur-elegance/` à la racine
   de votre site.
3. Confirmez l'écrasement des fichiers existants.
4. Ouvrez votre site et videz le cache du navigateur (Ctrl+F5 ou Cmd+Shift+R)
   pour voir les changements.

C'est tout — aucune modification de base de données, aucun plugin à activer.

## ⚠️ Points d'attention

- **Liens sociaux du footer** : les liens Facebook / Instagram / LinkedIn
  pointent encore vers `#` (inchangé par rapport à avant). À remplacer par vos
  vraies URLs si besoin.
- **Téléphone et email** : repris tels quels
  (`conciergerie@azur-elegance.fr` et `06 74 89 15 45`).
- **Date des pages légales** : "Octobre 2025" — ajustable directement dans
  les fichiers HTML si besoin (cherchez `Dernière mise à jour`).
