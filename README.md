# QuestMaker

## Exemple de workflow CD (déploiement)

Ce repo inclut maintenant un workflow GitHub Actions de **CD** :

- Fichier : `.github/workflows/cd.yml`
- Déclenchement automatique quand le workflow **CI** est terminé avec succès sur `main`
- Déclenchement manuel possible via `workflow_dispatch`
- Build Next.js puis déploiement en production sur **Vercel**

### Pré-requis (secrets GitHub)

Dans `Settings > Secrets and variables > Actions`, ajouter :

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Pourquoi cet exemple est adapté à un PFE

- Il est **simple** (un seul job `deploy`)
- Il est **réaliste** (build + vrai déploiement cloud)
- Il sépare bien CI (tests) et CD (release)
- Il montre une bonne pratique importante : déployer uniquement si CI passe

### Variante ultra-minimale (si tu veux juste valider le principe)

Tu peux garder la même structure et remplacer l'étape Vercel par une étape `echo`/`scp` selon ton hébergement cible.
