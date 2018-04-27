/*RESTE A FAIRE :
* - Fin du jeu si vieRestante < 0
*   */
(function(){
    window.onload=function(){
        init();
    };

    function init() {
    //structure

    //parametres (données non modifiables et non modifiées par le jeu) - variables globales
        //intervalle entre deux rafraîchissements en millisecondes
        intervalleRafraichissement=30;
        /*intervalle entre deux nouvelles bulles en millisecondes*/
        intervalleNouvelleBulle=100;
        //nombre de bulles noires pour une bulle verte
        proportionBullesNoires=10;
        //temps de jeu en millisecondes
        tempsLimite=60000;
        // liste des couleurs, définie ici dans un dictionnaire JavaScript
        listeCouleurs =  {"B":"#3E8ADD","V": "#00c000","N": "#555"};
        //intervalle entre deux changements de vitesse en millisecondes (changement de niveau)
        intervalleChangementVitesse=4000;
        //incrément de vitesse à chaque changement de niveau
        incrementVitesse=2.5;
        //rayon de la bulle bleue
        rayonBulleBleue=10;
        //Taille mini des bulles
        rayonMiniBulle=6;
        //Taille maxi des bulles
        rayonMaxiBulle=30;

    //Initialisation des variables.
        monCanvas = document.querySelector("canvas");
        ctx=monCanvas.getContext("2d");

        ecranAccueil=document.querySelector("#ecranAccueil");
        ecranJeu=document.querySelector("#ecranJeu");
        ecranBilan=document.querySelector("#ecranBilan");



        //Lancement : affichage de la page d'accueil.
        afficherEcranAccueil();

    //Gestionnaires
    /* gestionnaire  sur  le  bouton #btnJeu associé à une fonction afficheEcranAccueil() qui met à jour la variable
    ecranCourant, affiche l'écran de jeu, masque les autres écrans*/
    document.querySelector("button#btnJouer").addEventListener("click", afficherEcranJeu, false);
    document.querySelector("button#btnQuitter").addEventListener("click", afficherEcranBilan, false);
    document.querySelector("button#btnAccueil").addEventListener("click", afficherEcranAccueil, false);
    document.querySelector("button#btnRejouer").addEventListener("click", afficherEcranJeu, false);
    //Interactivité sur le canvas
    monCanvas.addEventListener("mousemove", positionSouris, false);
    monCanvas.addEventListener("mouseout", sortirCurseur, false);




    //Moteur de règles
    inter=setInterval(regles, intervalleRafraichissement);
    }

    //Réinsitialise les données à chaque nouvelle partie.
    function reinitialisation(){
        tempsJeu=0;
        ecranCourant=null;
        niveauCourant=1;
        score=0;
        //Position de la souris
        sortirCurseur();
        //xSourisCanvas=monCanvas.width/2;
        //ySourisCanvas=monCanvas.height/2;
        //Liste des bulles
        listesBulles=[];
        //Nombre total de bulles (sans la bulle bleue)
        nbBulles=0;
        //Vitesse initiale des bulles en pixels par seconde
        vitesse=4
        nombreVies=3;
    }

    /*Permettra si la souris n'est pas sur le canvas de sortir le curseur*/
    function sortirCurseur(){
        xSourisCanvas=-100;
        ySourisCanvas=-100;
    }

    /*Fonction qui :
        - met à jour la variable ecranCourant (ecranCourant=''accueil'';),
        - affiche l'écran #accueil,
        - masque les autres écrans*/
    function afficherEcranAccueil(){
        ecranCourant=ecranAccueil;
        ecranAccueil.style.display="block";
        ecranJeu.style.display="none";
        ecranBilan.style.display="none";
    }
    function afficherEcranJeu(){
        reinitialisation();
        ecranCourant=ecranJeu;
        ecranJeu.style.display="block";
        ecranAccueil.style.display="none";
        ecranBilan.style.display="none";
    }
    function afficherEcranBilan(){
        ecranCourant=ecranBilan;//Ca stoppe le jeu
        document.querySelector("#scoreFinal").innerHTML = "Score final : "+score;
        document.querySelector("#niveauFinal").innerHTML = "Niveau atteint : "+niveauCourant;
        reinitialisation();
        ecranBilan.style.display="block";
        ecranAccueil.style.display="none";
        ecranJeu.style.display="none";
    }

    /*Fonction qui érifie que l'on se trouve bien dans l'écran de jeu et lance
    une fonction générique qui va dessiner les bulles que l'on nomme ici animer()*/
    function regles(){
        if(ecranCourant==ecranJeu){
            //Animation
            animer();
        }
    }

    /*Fonction qui devra mettre à jour la position de la souris.*/
    function positionSouris(evt){
        rect=monCanvas.getBoundingClientRect();
        xSourisCanvas=evt.clientX-monCanvas.offsetLeft;
        ySourisCanvas=evt.clientY-monCanvas.height/2;
    }

    /*Cette fonction va :
    - incrémenter le temps de jeu
    - à intervalles réguliers créer une nouvelle bulle – fonction creerBulle() – c'est-à-dire ajouter un enregistrement
        au tableau listeBulles ; après un certain nombre de bulles noires, créer une bulle verte ;une bulle est
        représentée par un tableau contenant :
        * la position selon x
        * la position selon y
        * la couleur
        * le rayon
        * un attribut précisant si la bulle est visible ou pas
    - grâce à une boucle sur l'ensemble des bulles contenues dans le tableau listeBulles, dessiner toutes  les  bulles
        contenues  à  un  instant  t  dans  le  tableau  des  bulles  –  fonction dessineBulle()
    - dessiner une bulle particulière – la bulle bleue – précisément à l'endroit du pointeur de la souris ; la position
        de la souris est obtenue en plaçant un gestionnaire/écouteur mousemove sur le canvas qui lance une fonction
        positionSouris() permettant de calculer cette position en x et en y (ce gestionnaire est inséré dans la partie
        «gestionnaires» du code de la fonction init(),  la  fonction  positionSouris()  étant  très  similaire  à  celle
        étudiée  dans  les  exercices précédents.
    -mettre à jour l'affichage : score, nombre de vies, niveau, temps de jeu.*/
    function animer(){
        if (tempsJeu < tempsLimite && nombreVies>=0) {
            //1-Temps de jeu
            tempsJeu = tempsJeu + intervalleRafraichissement;

            //2-Création des bulles N & V - Test sur le temps
            if (tempsJeu % intervalleNouvelleBulle === 0) {
                //Création d'une nouvelle bulle -> test s'il est temps de créer une verte.
                if (listesBulles.length % proportionBullesNoires === 0 && listesBulles.length != 0) {
                    creerBulle("V");
                } else {
                    creerBulle("N");
                }
            }

            //3-Dessin des bulles
            ctx.clearRect(0, 0, monCanvas.width, monCanvas.height);
            for (var j = 0; j < listesBulles.length; j++) {
                var bulle = listesBulles[j];
                dessinerBulle(bulle, j);
            }

            //4-Dessin de la bulle bleue (ne fais pas partie de la liste.)
            dessinerBulle([xSourisCanvas, ySourisCanvas, "B", rayonBulleBleue, true, true], null);

            //5-Affichage
            document.querySelector("#score").innerHTML = "Score : "+score;
            document.querySelector("#niveau").innerHTML = "Niveau : "+niveauCourant;
            document.querySelector("#vies").innerHTML = "Nombre de vies : "+nombreVies;
            document.querySelector("#temps").innerHTML = "Temps : "+Math.floor(tempsJeu / 1000);

            //Déplacement des bulles
            for (var i = 0; i < listesBulles.length; i++) {
                listesBulles[i][1] += vitesse;
            }

            //bout d'un certain temps de jeu, le niveau change : la vitesse des bulles augmente
            if (tempsJeu % intervalleChangementVitesse === 0) {
                //Changement de niveau
                vitesse += incrementVitesse;
                niveauCourant++;
            }
        }else{
            //Laisse un message à l'utilisateur lui indiquant que le temps est écoulé.
            document.querySelector("#message").innerHTML="C'est terminé ! Merci d'avoir joué."
            afficherEcranBilan();
        }
    }

    function getAlea(debut, fin){
        min = Math.ceil(debut);
        max = Math.floor(fin);
        return Math.floor(Math.random() * (max - min +1)) + min;
    }

    /*Fonction creerBulle() – indications :
    - argument : la couleur sous forme d'une lettre
    - actions :
        * création d'un tableau [position selon x en px, position selon y en px, couleur sous forme d'une lettre,
            rayon en px, un booléen pour la visibilité]
        * ajout de ce tableau dans le tableau listeBulles
    - retour: rien.*/
    function creerBulle(couleur){
        listesBulles.push([
                        getAlea(0, monCanvas.width),
                        0,
                        couleur,
                        getAlea(rayonMiniBulle, rayonMaxiBulle),
                        true
        ]);

    }

    /*Fonction dessineBulle()
    - argument: une bulle sous forme de tableau
    - action: dessin de la bulle dans le canvas
    - retour: rien*/
    function dessinerBulle(bulle){

        if (bulle[2]!="B"&&collision(bulle)&&bulle[4]){
            (bulle[2]=="N")?nombreVies--:score++;
            bulle[4]=false;//Invisible
        }

        if (bulle[4] == true){
            ctx.fillStyle = listeCouleurs[bulle[2]];
            ctx.beginPath();
            ctx.arc(bulle[0], bulle[1], bulle[3], 0, Math.PI*2, true); // Centre-x, centre-y, rayon , de 0 à 2π
            ctx.closePath();
            ctx.fill();
        }
    }

    /*Fonction qui retournera true si la bulle courante touche la bulle bleue.
    * 1-On calcule la distance mini pour laquelle il y a collision
    * 2-Calcul de la distance réelle entre les centre des bulles
    * 3-Si cette distanceMini et >= à la distance réelle : Paf la bulle !
    * Rappel de Maths - Distance entre 2points = √((xB-xA)²+(yB-yA)²)
    * PS : Il n'y a collision que si la souris est sur le canvas !
    * */
    function collision(b){
        if (xSourisCanvas>0 && xSourisCanvas<monCanvas.width && ySourisCanvas>0 && ySourisCanvas<monCanvas.height){
            //1-Distance en dessous de laquelle il y a collision
            var distanceMini=b[3]+rayonBulleBleue;
            //2-La distance réelle
            var distanceReelle= Math.sqrt(Math.pow((b[0]-xSourisCanvas),2)+Math.pow((b[1]-ySourisCanvas),2));
            //3-Comparaison
            if (distanceMini>distanceReelle){
                //console.log("Distance mini : "+distanceMini+" et distance réelle : "+distanceReelle+".");
                //console.log("Collision avec la bulle de coord "+b[0]+"/"+b[1]+" et de rayon "+b[3]+".");
                return true;//Paf la bulle
            }
        }
        //Si pas dans le canvas ou pas de collision.
        return false;
    }
})();