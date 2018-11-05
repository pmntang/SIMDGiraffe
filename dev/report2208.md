Bonjour prof,
J’ai  avancé avec l'AST.
En fait après notre dernier entretien, je suis revenu au tokenizer, mais le problème c'est qu'il me paraissait trop rigide et il présentait de vraies limites en terme d,efficacité. Cela m'a poussé a rechercher encore et je suis tomber sur antlr4 [http://www.antlr.org/](http://www.antlr.org/)(que j'avais vu au départ et qui me semblait compliqué, mais qui me semble être le plus complet et le plus efficace. Même en terme de complication il ne l'est pas tant que cela, surtout en tenant compte de ce qu'il permet de faire).

Antlr4 [https://github.com/antlr/antlr4](https://github.com/antlr/antlr4) permet de spécifier une grammaire, de générer un parser et un lexer pour cette grammaire. 
Ce que j'ai pu faire avec c'est de générer l'ast du  dernier code c que tu m'as envoyé (la grammaire du c étant déjà disponible) sous forme de graphe et de structure de donnée.
C'est vraiment très simple (surtout après l'avoir fait). 
Il convient de noter que j'ai fait toutes ces manipulations avec les spécifications java de antlr4 (qui sont celles par défaut ) et je vais regarder comment l'intégrer maintenant dans JavaScript (il donne des spécifications pour JavaScript).
Je vais aussi pouvoir rédiger le paragraphe 2 de l'état de l'art car j’étais bloqué tant que je n'avait pas avancé sur l'ast.
J’espère intégrer l'ast dans le code JavaScript, rédiger le paragraphe 2 de l'état de l'art et au moins la partie du design et de l’implémentation de SIMDGirafe d'ici la fin de la semaine.
Je t'ai envoyé en fichier joint l'ast générer sous forme graphique et de structure de données.
Je suppose qu'il est question, en visualisant l'ast, de choisir (par un clic par exemple) la fonction intrinsic pour aller la visualiser en détail (du moins c'est que je pense).

L'une des choses que j'envisage aussi c'est d'écrire une grammaire du c (en BNF) plus simplifiée afin que l'ast généré soit assez simple et lisible (ou alors de voir comment inhiber certaine règle de production dans antlr4 dans la grammaire du c utilisée).
