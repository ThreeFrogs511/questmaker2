
# image de départ, modèle de construction
FROM node:20-alpine AS base

# répertoire du travail du conteneur
WORKDIR /app

# on installe les dépendances 
COPY package*.json ./
RUN npm ci

# on copie tout le dossier courant dans /app
COPY . .

# commande par défaut lancée au démarrage du conteneur
CMD ["npm", "run" ,"dev"]

# port du conteneur
EXPOSE 3000