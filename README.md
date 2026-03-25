# 🍋 BleuLemon — Générateur de Propositions Commerciales

> **Projet de Fin d'Études (PFE) — Master 2 HSIM**  
> Application web full-stack permettant la génération automatique de propositions commerciales au format Word pour la société **BleuLemon**, partenaire Platinum Atlassian.

---

## 🎯 Contexte et Objectif

BleuLemon est une entreprise de conseil spécialisée dans les solutions Atlassian (Jira, Confluence, JSM, Opsgenie). La rédaction d'une proposition commerciale est un processus long et répétitif.

Ce projet automatise entièrement ce processus :
1. **L'utilisateur** renseigne les informations client à travers un formulaire guidé en 10 étapes.
2. **L'IA (Claude Sonnet 4)** analyse le brief et génère des sections narratives expertes.
3. **L'application** injecte le tout dans un template Word officiel BleuLemon et génère le fichier `.docx` final, prêt à envoyer au client.

---

## ✨ Fonctionnalités Principales

- **Formulaire guidé en 10 étapes** : informations client, périmètre projet, contexte & objectifs, charges, pricing, équipe BleuLemon, revue finale.
- **Génération IA** : rédaction automatique des sections narrative (Compréhension du besoin, Démarche, Livrables, Prérequis, Planning, Modalités) en Français ou Anglais.
- **Traduction dynamique** : si la langue cible est "Anglais", Claude traduit automatiquement le brief saisi en Français.
- **Templates bilingues** : `template-FR.docx` et `template-EN.docx` chargés dynamiquement selon la langue choisie.
- **Export Word** : le fichier `.docx` final est généré côté serveur via Docxtemplater et téléchargé directement.
- **Mode Secours (Prompt Manuel)** : génère un prompt complet à copier-coller dans Claude.ai pour utiliser le service sans consommer de crédits API.
- **Magic Fill ✨** : bouton "Simuler des données de test" pour pré-remplir le formulaire en un clic avec un scénario réaliste (Air France - KLM / Migration JSM).
- **Validation** : les champs obligatoires (Nom client, Titre projet, Référence, tableaux Charges & Prix) bloquent la navigation si non remplis.

---

## 🏗️ Architecture Technique

```
BleuLemon-Project/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Page d'accueil
│   │   ├── proposal/page.tsx         # Orchestrateur du formulaire 10 étapes
│   │   └── api/
│   │       ├── generate/route.ts     # Route API → appel Claude
│   │       └── download/route.ts     # Route API → génération du .docx
│   ├── components/
│   │   ├── form/                     # Composants de chaque étape du formulaire
│   │   │   ├── FormProvider.tsx      # Context global + Reducer de l'état
│   │   │   ├── StepClient.tsx        # Étape 1 : Info Client + Magic Fill
│   │   │   ├── StepProject.tsx       # Étape 2 : Info Projet
│   │   │   ├── StepContext.tsx       # Étape 3 : Contexte & Objectifs
│   │   │   ├── StepScope.tsx         # Étape 4 : Périmètre
│   │   │   ├── StepConstraints.tsx   # Étape 5 : Contraintes
│   │   │   ├── StepTeam.tsx          # Étape 6 : Équipe BleuLemon
│   │   │   ├── StepCharges.tsx       # Étape 7 : Tableau des charges
│   │   │   ├── StepPricing.tsx       # Étape 8 : Tableau des prix
│   │   │   ├── StepDeliverables.tsx  # Étape 9 : Livrables & Prérequis
│   │   │   └── StepReview.tsx        # Étape 10 : Revue + Bouton Générer
│   │   ├── preview/                  # Composants de prévisualisation
│   │   └── ui/                       # Composants UI réutilisables
│   ├── lib/
│   │   ├── claude.ts                 # Client Anthropic + parsing JSON
│   │   ├── prompt-builder.ts         # Construction du System et User Prompt
│   │   ├── docx-generator.ts         # Injection des données dans le template Word
│   │   ├── calculations.ts           # Calcul des totaux HT, TVA, TTC
│   │   ├── references.ts             # Références projet BleuLemon
│   │   ├── validators.ts             # Fonctions de validation formulaire
│   │   └── constants.ts              # Constantes et types
│   ├── types/
│   │   ├── proposal.ts               # Types TypeScript du formulaire
│   │   └── claude-response.ts        # Type de réponse JSON Claude
│   └── data/
│       └── references_bluelemon.json # Base de références projets
└── templates/
    ├── template-FR.docx              # Template Word officiel BleuLemon (FR)
    └── template-EN.docx              # Template Word officiel BleuLemon (EN)
```

---

## 🛠️ Stack Technique

| Technologie | Rôle |
|---|---|
| **Next.js 16** (App Router) | Framework Frontend & Backend (API Routes) |
| **React 19** | Interface utilisateur |
| **TypeScript** | Typage strict end-to-end |
| **Tailwind CSS v4** | Design system et styles |
| **Anthropic SDK** | Connexion à l'API Claude (claude-sonnet-4) |
| **Docxtemplater + PizZip** | Génération du fichier `.docx` côté serveur |
| **Zod** | Validation des schémas de données |
| **Lucide React** | Icônes |

---

## 🚀 Installation et Démarrage

### Prérequis
- Node.js ≥ 18
- Une clé API Anthropic ([console.anthropic.com](https://console.anthropic.com))

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/ZSparta92/Propal-generator.git
cd Propal-generator

# Installer les dépendances
npm install
```

### Configuration de l'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ Ne jamais committer ce fichier. Il est déjà présent dans le `.gitignore`.

### Démarrage

```bash
npm run dev
```

L'application est accessible sur : **http://localhost:3000**

---

## 📖 Guide d'Utilisation

1. **Accueil** → Cliquer sur "Créer une proposition"
2. **Étape 1 — Client** : Saisir les informations du client (ou utiliser le bouton ✨ *Simuler des données de test*)
3. **Étapes 2 à 9** : Compléter le formulaire guidé (projet, contexte, charges, prix, équipe...)
4. **Étape 10 — Revue** :
   - Vérifier le résumé complet
   - Cliquer sur **"Générer la proposition"** → Claude rédige les sections narratives et le `.docx` est téléchargé
   - Ou cliquer sur **"Afficher le Prompt Manuel"** pour copier-coller dans Claude.ai sans API

---

## 🔐 Variables dans le Template Word

Les templates `.docx` utilisent des balises Docxtemplater :

| Balise | Description |
|---|---|
| `{titre_projet}` | Titre de la proposition |
| `{nom_client}` | Nom de l'entreprise cliente |
| `{region}` | Localisation du client |
| `{date_proposition}` | Date du jour (auto) |
| `{date_validite_proposition}` | Date de validité de l'offre |
| `{consultant_relecteur}` | Nom du consultant BleuLemon |
| `{#charges}...{/charges}` | Boucle sur le tableau des charges |
| `{#prix}...{/prix}` | Boucle sur le tableau des prix |
| `{total_ht}`, `{tva}`, `{total_ttc}` | Totaux financiers (format : `12 000,00 €`) |
| `{comprehension_besoin}` | Section narrative générée par l'IA |
| `{demarche_proposee}` | Démarche et méthodologie |
| `{livrables}`, `{prerequis}` | Contenu structuré par l'IA |

---

## 👥 Auteur

Projet réalisé dans le cadre du **Master 2 HSIM** (Haute École de Management Informatique) — PFE 2026.

Développé avec l'assistance de l'IA pour **BleuLemon** — [bleulemon.fr](https://bleulemon.fr)
