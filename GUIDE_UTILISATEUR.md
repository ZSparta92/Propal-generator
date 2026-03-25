# 🍋 Guide Utilisateur — Générateur de Propositions BleuLemon

> Ce guide explique pas à pas comment utiliser l'application pour créer une proposition commerciale professionnelle en quelques minutes.

---

## 1. Page d'Accueil

Ouvrez l'application sur **http://localhost:3000**. Cliquez sur le bouton bleu **"Nouvelle proposition →"** pour commencer.

![Page d'accueil BleuLemon](assets/01_accueil.png)

---

## 2. Étape 1 — Informations Client

Le formulaire s'ouvre sur l'étape **Client**. Vous voyez la barre de progression avec les 10 étapes en haut.

**Saisie manuelle** : Remplissez les champs (nom de l'entreprise, secteur, localisation, interlocuteur, etc.).

**✨ Magic Fill (Mode Démo)** : Cliquez sur le bouton violet **"Simuler des données de test"** en haut à droite pour pré-remplir automatiquement tous les champs avec un cas réel (Air France - KLM).

> Choisissez également la **Langue** de la proposition : Français ou Anglais. En mode Anglais, Claude traduit automatiquement l'intégralité du brief.

![Étape 1 - Formulaire Client rempli avec Magic Fill](assets/03_etape1_magicfill.png)

---

## 3. Étape 2 — Informations Projet

Renseignez le titre, le type de projet (Migration, Implémentation, Optimisation…), les outils Atlassian concernés et le mode de déploiement (Cloud, On-Premise).

![Étape 2 - Informations Projet](assets/04_etape2_projet.png)

---

## 4. Étape 3 — Contexte & Besoins

Décrivez la **situation actuelle** du client, ses **objectifs business** et la volumétrie utilisateurs. Ces informations servent de brief à l'IA pour rédiger la section "Compréhension du besoin".

![Étape 3 - Contexte et Besoins](assets/05_etape3_contexte.png)

---

## 5. Étape 4 — Périmètre Fonctionnel

Définissez les modules Atlassian inclus dans le projet et toute précision sur le périmètre.

![Étape 4 - Périmètre Fonctionnel](assets/06_etape4_perimetre.png)

---

## 6. Étape 5 — Contraintes

Renseignez les contraintes projet : budget disponible, délais souhaités, contraintes techniques ou réglementaires. Ces champs sont optionnels.

![Étape 5 - Contraintes](assets/07_etape5_contraintes.png)

---

## 7. Étape 6 — Équipe BleuLemon

Ajoutez les membres de l'équipe BleuLemon qui interviendront sur le projet : nom, rôle et niveau d'expertise.

![Étape 6 - Équipe BleuLemon](assets/08_etape6_equipe.png)

---

## 8. Étape 7 — Phases et Charges

Construisez le tableau des charges par phase. Pour chaque phase, renseignez :
- Le **nom de la phase** (ex: Cadrage et Ateliers)
- La **description** de la phase
- Le nombre de **Jours BleuLemon** et de **Jours Client**

Les totaux sont calculés automatiquement.

![Étape 7 - Phases et Charges](assets/09_etape7_phases.png)

---

## 9. Étape 8 — Tarification

Renseignez les lignes de devis : poste, quantité et prix unitaire. Le total HT, la TVA à 20% et le total TTC se calculent en temps réel.

![Étape 8 - Tarification](assets/10_etape8_tarification.png)

---

## 10. Étape 9 — Livrables & Prérequis

Spécifiez les livrables attendus et les prérequis nécessaires côté client pour le bon déroulement du projet.

![Étape 9 - Livrables et Prérequis](assets/11_etape9_livrables.png)

---

## 11. Étape 10 — Revue & Génération

C'est la dernière étape. Vous voyez un tableau récapitulatif de toutes vos données financières ainsi que les informations de la proposition.

![Étape 10 - Revue (haut)](assets/12_etape10_revue_top.png)

Depuis cette page, deux options s'offrent à vous :

### Option A — Génération Automatique via API ⚡

Cliquez sur **"Générer la proposition"**. L'application :
1. Envoie votre brief à **Claude Sonnet 4** (Anthropic)
2. L'IA rédige toutes les sections narratives en Plain Text professionnel
3. Les données sont injectées dans le template Word officiel BleuLemon
4. Le fichier **`.docx`** est téléchargé automatiquement sur votre ordinateur

![Étape 10 - Boutons de génération](assets/13_etape10_revue_bottom.png)

### Option B — Mode Secours (Sans crédits API) 🛡️

Cliquez sur **"Afficher le Prompt (Mode Secours)"**. Une modale s'ouvre avec le prompt complet structuré contenant toutes vos données. Il vous suffit de :
1. Copier le texte (bouton **"Copier le texte"**)
2. Ouvrir [claude.ai](https://claude.ai) dans votre navigateur
3. Coller le prompt et joindre votre template Word vierge
4. Claude génère le `.docx` complet pour vous, gratuitement

![Étape 10 - Mode Secours (Prompt structuré)](assets/14_etape10_mode_secours.png)

---

## Résultat Final

Le document Word généré reprend l'intégralité de la charte graphique BleuLemon avec :
- Les en-têtes et pied de page officiels
- Les tableaux de charges et de tarification remplis
- Les sections narratives rédigées par l'IA, adaptées au contexte du client
- Les totaux financiers formatés (ex: `47 300,00 €`)

---

> 🍋 **BleuLemon** — Partenaire Platinum Atlassian
