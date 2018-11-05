**Node**

NPM gestionnaire de paquets de Node.js

## Dessiner correctement les ronds avec les rotations 12h* 
En definitive, il faut renoncer a vouloir faire soi meme du svg, et utiliser une librairie. En voici un debut de reponse.
Confronté au même probleme, il n'a trouvé qu'une seule librairie, qui etait payante.

<https://www.beyondjava.net/how-to-connect-html-elements-with-an-arrow-using-svg>

Precisions sur ce que nous voulons:
Une librairie svg nous permettant de manipuler les points (élément html ou figure svg) par simple invocation de leur classe ou de leur id et non en étant obligé de calculer leur coordonnées.
 Donc l'auteur ci-dessus confonté a ce probleme n'a trouver qu'une librairie payante -july 27 2017.
 <https://jsplumbtoolkit.com/features> avec une version tres (trop) simplifiée gratuite.
 
 Finalement Treant.js semble être un bon candidat, mais malheureusement a notre avis il n'avait pas encore atteint la maturité necessaire, de plus il a trop de dépence pour certaine fonctionalité essentielle (Raphael et Jquery).
 Aucune n'a repondu a notre besoin specifique.
 
 01/08/2017
 
## Dessiner l'arbre syntaxique du code 12h*

L'objectif ici c'est de construire de l'ast de tout le code, et une fois cela fait, un clic sur une fonction intrinseque devrait renvoyer a sa visualisation. Ceci procurer l'avantage d'inserer la fonction intrinseque dans le flot d'un programme c pour le visualiser dans un contexte d'execution particulier. L'outil le plus niveau disbonible actuellement dans ce sens est un tokenizer. Mais le tokenizer se contentant juste de générer une liste de tokens, la construction de l'ast neccessite soit d'etendre un parseur existant afin qu'il reconnaisse les types et les fonctions intrinseques, soit de construire un tel parseur en revenant a la grammaire du c.
Nous laissons cet aspect de côté pour l'instant et nous concentrons sur la modélisation et la visualisation des fonctions intrinseques en dehors de tout programme quelconque.


## Expliquer dans l'article le code-donc continuer l'article 18h*

## modeliser les fonctions a afficher 14h*

Il s'agit de preparer l'ensemble des fonctions intrinseque a visualiser, selon le modele preparé.

### vague 1


* _mm512_add_epi64
* _mm512_srli_epi64
* _mm512_mullo_epi64
* _mm512_rorv_epi32
* _mm512_cvtepi64_epi32
* _mm512_rorv_epi32


### vague 2

* _mm_slli_si128
* _mm_add_epi32



### vague 3

* _mm256_set_epi8
* _mm256_shuffle_epi8
* _mm256_and_si256
* _mm256_srli_epi16
* _mm256_slli_epi16
* _mm256_or_si256


### vague 4

* _mm_min_epu16
* _mm_max_epu16
* _mm_alignr_epi8


Trie et regroupement par Bonjour prof.


