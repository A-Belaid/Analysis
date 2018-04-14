README

Installer NodeJS LTS : https://nodejs.org/en/

SERVEUR

1) Dans le répertoire principal (Poly-Music) installer le module 'cors' avec : npm install cors --save

2) Aller dans répertoire server et partir la commande: node server.js

3) Aller sur localhost:8888 et cliquer sur le bouton 'Log in with Spotify' (se créer un compte au besoin). Cette action a pour but de vous associer un access_token de Spotify pour les futures requêtes

	NOTE: Il est primordial de faire cette action avant toute requête vers l'API, car sinon, les requêtes vers Spotify ne seraient pas possibles


CLIENT

1) Aller dans le répertoire polymusic-client et exécuter la commande: npm install

2) Rouler la commande sudo npm install @angular/cli --save -g

3) Rouler la commande ng serve -o
