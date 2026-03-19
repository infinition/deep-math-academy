(function () {
    const COURSE_TOOLKITS = {
        bases: {
            analogy: "Les symboles sont les panneaux routiers des mathematiques: ils evitent les phrases longues et ambigues.",
            equation: "$$a + b = b + a$$",
            breakdown: [
                "On identifie le symbole et son role (operation, relation, ensemble).",
                "On lit le symbole comme une action concrete sur des objets.",
                "On verifie le resultat avec un exemple numerique simple."
            ],
            why: "Un bon niveau en notation fait gagner enormement de temps en ML, DL et IA.",
            example: "Lire une equation de loss sans bloquer: tu passes de la formule a l'implementation en quelques minutes."
        },
        analysis: {
            analogy: "L'analyse est le tableau de bord d'une voiture: vitesse instantanee, distance totale et trajectoire.",
            equation: "$$f'(x)=\\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}$$",
            breakdown: [
                "La fonction decrit comment une sortie reagit quand l'entree change.",
                "La derivee mesure la sensibilite locale (pente) autour d'un point.",
                "Le gradient guide les mises a jour de parametres pendant l'apprentissage."
            ],
            why: "Sans analyse, impossible de comprendre l'optimisation et la stabilite d'un modele.",
            example: "Tuner un learning rate pour eviter qu'un entrainement diverge."
        },
        algebra: {
            analogy: "L'algebre lineaire est une usine de transformations: les vecteurs sont des matieres premieres, les matrices des machines.",
            equation: "$$A\\mathbf{x}=\\mathbf{b}$$",
            breakdown: [
                "Un vecteur code un etat (features, embedding, signal).",
                "Une matrice applique une transformation lineaire a cet etat.",
                "Les decompositions revelent la structure cachee des donnees."
            ],
            why: "Toute architecture de deep learning manipule des vecteurs, matrices et tenseurs en continu.",
            example: "Compresser des features avec PCA/SVD avant classification."
        },
        stats: {
            analogy: "Les stats, c'est un radar: elles distinguent signal utile et bruit trompeur.",
            equation: "$$P(A\\mid B)=\\frac{P(B\\mid A)P(A)}{P(B)}$$",
            breakdown: [
                "On part d'un prior (ce qu'on croit avant observation).",
                "On injecte des donnees via la vraisemblance.",
                "On obtient un posterior pour prendre une decision robuste."
            ],
            why: "Le raisonnement probabiliste est central pour l'incertitude, l'evaluation et la calibration.",
            example: "Decider un seuil de fraude en equilibrant faux positifs et faux negatifs."
        },
        ai_dynamics: {
            analogy: "Un modele moderne ressemble a un pilote automatique: il percoit, predit, corrige puis agit.",
            equation: "$$\\theta_{t+1}=\\theta_t-\\eta\\nabla_\\theta \\mathcal{L}(\\theta_t)$$",
            breakdown: [
                "On definit un objectif (loss, energie libre, action, score).",
                "On calcule une direction d'amelioration via gradients ou flux.",
                "On met a jour le systeme puis on mesure la performance."
            ],
            why: "Cette boucle perception-prediction-correction est la base de toute IA efficace.",
            example: "Stabiliser un agent qui utilise outils + memoire + planning."
        },
        quantum: {
            analogy: "Le quantique ressemble a une partition musicale: l'amplitude est la partition, la mesure est l'instant du son entendu.",
            equation: "$$i\\hbar\\frac{\\partial}{\\partial t}\\lvert\\psi\\rangle=\\hat{H}\\lvert\\psi\\rangle$$",
            breakdown: [
                "L'etat quantique encode des amplitudes, pas des certitudes directes.",
                "Les operateurs transforment l'etat de maniere lineaire et unitaire.",
                "La mesure convertit amplitude en probabilite observable."
            ],
            why: "Le quantique apporte une intuition utile pour superposition, information et optimisation avancee.",
            example: "Comparer une recherche exhaustive vs une intuition de parallelisme quantique sur un mini probleme."
        }
    };

    const MODULE_TOOLKITS = {
        math_symbols: {
            analogy: "Un symbole mathematique est comme une icone sur ton telephone: un petit dessin qui declenche une action precise. ∀ veut dire 'pour tout', ∈ veut dire 'appartient a', ⇒ veut dire 'implique'. Maitriser ces raccourcis, c'est lire les maths comme un natif lit sa langue.",
            equation: "$$\\forall x\\in\\mathbb{R},\\;x^2\\ge 0$$",
            breakdown: [
                "∀ (pour tout) annonce une propriete universelle: ca marche pour TOUS les x sans exception.",
                "x ∈ ℝ precise le terrain de jeu: x est un nombre reel (entier, decimal, negatif, irrationnel...).",
                "x² ≥ 0 est l'affirmation: le carre de n'importe quel reel est toujours positif ou nul.",
                "Ensemble, cette ligne dit: 'peu importe le nombre reel que tu choisis, son carre ne sera jamais negatif'."
            ],
            equationTerms: [
                { term: '∀ (pour tout)', meaning: "Quantificateur universel: la propriete vaut sans exception pour chaque element du domaine." },
                { term: 'x', meaning: "Variable muette: un placeholder pour n'importe quel element de l'ensemble." },
                { term: '∈ (appartient a)', meaning: "Indique l'ensemble dans lequel vit la variable." },
                { term: 'ℝ (reels)', meaning: "L'ensemble des nombres reels: la droite continue de -∞ a +∞." },
                { term: 'x²', meaning: "x multiplie par lui-meme: toujours ≥ 0 car negatif × negatif = positif." },
                { term: '≥ 0', meaning: "Superieur ou egal a zero: le resultat peut etre nul (quand x=0) mais jamais negatif." }
            ],
            why: "En IA, chaque papier de recherche, chaque formule de loss, chaque definition de modele utilise ces symboles. Les lire couramment te fait gagner des heures de comprehension et te permet de passer directement de la formule au code.",
            example: "Quand tu lis la loss cross-entropy $$\\mathcal{L}=-\\sum_i y_i\\log(\\hat{y}_i)$$, savoir que Σ signifie 'somme sur tous les i' et que log est le logarithme te permet de la coder en une ligne: loss = -sum(y * log(y_hat)).",
            tip: "Cree-toi un aide-memoire personnel avec les 20 symboles que tu rencontres le plus souvent. En 2 semaines de pratique quotidienne, tu les liras aussi vite que des mots.",
            didYouKnow: "Le symbole ∀ (pour tout) a ete invente par Gerhard Gentzen en 1935: c'est simplement un A renverse (de l'allemand 'Alle' = tous). Le symbole ∃ (il existe) est un E renverse. Ces notations ont moins de 100 ans!"
        },
        ana_intro: {
            analogy: "L'analyse mathematique, c'est comme avoir un microscope ET un telescope en meme temps. Le microscope (la derivee) te montre ce qui se passe a l'echelle infinitesimale — la pente en un point precis. Le telescope (l'integrale) te montre le panorama complet — l'aire totale accumulee. Le theoreme fondamental dit que ces deux instruments sont les faces d'une meme piece.",
            equation: "$$\\int_a^b f'(x)\\,dx=f(b)-f(a)$$",
            breakdown: [
                "f'(x) est la derivee: elle mesure la vitesse de changement instantanee de f en chaque point x.",
                "∫ de a a b signifie: on additionne tous ces petits changements de a jusqu'a b.",
                "f(b) - f(a) est le resultat: la difference totale entre l'arrivee et le depart.",
                "Le theoreme fondamental revele que integrer la vitesse donne la distance parcourue — un lien profond entre local et global."
            ],
            equationTerms: [
                { term: '∫ₐᵇ', meaning: "Integrale de a a b: on accumule continument une quantite le long de l'intervalle [a, b]." },
                { term: "f'(x)", meaning: "Derivee de f: le taux de variation instantane, la 'vitesse' de la fonction en x." },
                { term: 'dx', meaning: "Differentielle: une tranche infinitesimale de l'axe des x, l'element d'integration." },
                { term: 'f(b) - f(a)', meaning: "Variation nette: la difference entre la valeur de f a l'arrivee et au depart." }
            ],
            why: "En deep learning, la backpropagation est une application directe de la regle de chaine (derivees composees). L'integrale apparait dans les fonctions de loss continues, les distributions de probabilite, et les Neural ODE. Comprendre l'analyse, c'est comprendre COMMENT un reseau apprend.",
            example: "Quand PyTorch calcule loss.backward(), il applique exactement la regle de chaine du calcul differentiel pour propager les gradients couche par couche — c'est de l'analyse appliquee automatiquement.",
            tip: "Retiens cette intuition cle: derivee = pente locale = vitesse instantanee. Integrale = somme globale = distance parcourue. Tout le reste en decoule.",
            didYouKnow: "Newton et Leibniz ont decouvert le calcul infinitesimal independamment vers 1665-1675, declenchant une querelle de priorite qui a dure des decennies. Ironiquement, on utilise la notation de Leibniz (dy/dx) et les theoremes de Newton — le meilleur des deux mondes!"
        },
        functions: {
            analogy: "Une fonction est comme un distributeur automatique: tu inseres une piece (l'input x), la machine execute sa recette interne, et elle te rend un produit (l'output f(x)). Chaque piece donne exactement un produit — c'est la regle fondamentale. Si tu mets la meme piece deux fois, tu obtiens le meme resultat.",
            equation: "$$f: x\\mapsto f(x)$$",
            breakdown: [
                "f est le nom de la fonction: c'est l'etiquette de la machine.",
                "x est la variable d'entree (le domaine): ce qu'on injecte dans la machine.",
                "↦ (mapsto) signifie 'envoie vers': c'est la fleche de transformation.",
                "f(x) est la sortie: le resultat apres application de la regle interne.",
                "Unicite: pour chaque x, il y a exactement UN f(x) — pas deux, pas zero."
            ],
            equationTerms: [
                { term: 'f', meaning: "Le nom de la fonction: une regle qui associe a chaque entree une unique sortie." },
                { term: 'x', meaning: "La variable d'entree, aussi appelee argument ou variable independante." },
                { term: '↦ (mapsto)', meaning: "Symbole d'association: x est transforme en f(x) par la regle f." },
                { term: 'f(x)', meaning: "L'image de x par f: la valeur produite quand on applique la regle a x." }
            ],
            why: "En IA, TOUT est fonction. Un reseau de neurones est une fonction parametree f_θ(x). La loss est une fonction. L'activation ReLU est une fonction. Comprendre les proprietes des fonctions (continuite, derivabilite, composition) est le socle de tout le reste.",
            example: "Un reseau de neurones a une couche s'ecrit f(x) = σ(Wx + b): c'est une fonction composee — multiplication matricielle, addition de biais, puis activation. Chaque couche est une fonction empilee sur la precedente.",
            tip: "Pour bien comprendre une fonction, trace toujours son graphe mentalement: quand x augmente, f(x) monte ou descend? Ou sont les zeros? Y a-t-il des asymptotes? Cette intuition geometrique est inestimable.",
            didYouKnow: "Le mot 'fonction' a ete introduit par Leibniz en 1694, mais le concept moderne (une correspondance entre ensembles) n'a ete formalise par Dirichlet qu'en 1837. Pendant 143 ans, les mathematiciens utilisaient un mot sans definition precise!"
        },
        derivatives: {
            analogy: "Imagine que tu conduis une voiture et que tu regardes le compteur de vitesse. La position de la voiture est la fonction f, et la vitesse affichee est la derivee f'. A chaque instant, le compteur te dit COMBIEN tu avances par seconde — c'est exactement ce que fait la derivee: elle mesure le taux de changement instantane.",
            equation: "$$f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}$$",
            breakdown: [
                "f(x+h) - f(x) mesure combien la fonction a change quand on avance d'un petit pas h.",
                "Diviser par h donne le taux moyen de changement sur l'intervalle [x, x+h] — comme une vitesse moyenne.",
                "lim h→0 fait tendre ce pas vers zero: on passe de la vitesse moyenne a la vitesse INSTANTANEE.",
                "Le resultat f'(x) est la pente exacte de la tangente a la courbe au point x."
            ],
            equationTerms: [
                { term: "f'(x)", meaning: "La derivee de f en x: le taux de variation instantane, la pente de la tangente." },
                { term: 'lim h→0', meaning: "Limite quand h tend vers 0: on fait tendre l'intervalle vers un point unique." },
                { term: 'f(x+h)', meaning: "La valeur de f un petit pas h plus loin: le point d'arrivee." },
                { term: 'f(x)', meaning: "La valeur de f au point de depart." },
                { term: 'h', meaning: "Un petit increment: la taille du pas qu'on fait tendre vers zero." },
                { term: '[f(x+h)-f(x)]/h', meaning: "Le taux d'accroissement: variation de f divisee par la distance parcourue — une pente." }
            ],
            why: "La derivee est LE mecanisme central du deep learning. Quand un reseau 'apprend', il calcule la derivee de la loss par rapport a chaque poids (le gradient), puis ajuste les poids dans la direction opposee. Sans derivees, pas de backpropagation, pas d'apprentissage.",
            example: "Si la loss L(w) = (y - wx)² pour un poids w, la derivee dL/dw = -2x(y - wx) te dit exactement comment modifier w pour reduire l'erreur. C'est la base de la descente de gradient.",
            tip: "Retiens les derivees de base par coeur: (xⁿ)' = nxⁿ⁻¹, (eˣ)' = eˣ, (ln x)' = 1/x, (sin x)' = cos x. Avec la regle de chaine, tu peux deriver n'importe quelle composition.",
            didYouKnow: "Le symbole f'(x) vient de Lagrange (1797), dy/dx de Leibniz (1675), et ḟ (point au-dessus) de Newton. En physique on utilise souvent le point de Newton, en maths le prime de Lagrange, et en analyse la fraction de Leibniz. Trois notations pour le meme concept!"
        },
        gradient: {
            analogy: "Si la derivee est le compteur de vitesse sur une route droite, le gradient est la boussole d'un randonneur en montagne. En chaque point du terrain, le gradient pointe vers la montee la plus raide. Pour descendre au fond de la vallee (minimiser la loss), il suffit de marcher dans la direction OPPOSEE au gradient.",
            equation: "$$\\mathbf{x}_{t+1}=\\mathbf{x}_t-\\eta\\nabla f(\\mathbf{x}_t)$$",
            breakdown: [
                "x_t est la position actuelle des parametres a l'etape t.",
                "∇f(x_t) est le gradient: un vecteur qui pointe vers la montee la plus raide au point x_t.",
                "η (eta) est le learning rate: la taille du pas qu'on fait a chaque iteration.",
                "Le signe moins (-) inverse la direction: au lieu de monter, on descend.",
                "x_{t+1} est la nouvelle position: on a fait un pas vers le minimum."
            ],
            equationTerms: [
                { term: 'x_{t+1}', meaning: "Les parametres mis a jour: la nouvelle position apres un pas d'optimisation." },
                { term: 'x_t', meaning: "Les parametres actuels: la position de depart a l'etape t." },
                { term: 'η (learning rate)', meaning: "La taille du pas: trop grand = on oscille ou diverge, trop petit = on avance trop lentement." },
                { term: '∇f(x_t)', meaning: "Le gradient: un vecteur de derivees partielles, chaque composante dit comment f varie quand on bouge une dimension." },
                { term: '- (signe moins)', meaning: "On descend: on va dans la direction opposee au gradient pour minimiser f." }
            ],
            why: "La descente de gradient est l'algorithme d'optimisation fondamental de tout le deep learning. Adam, SGD, AdaGrad, RMSProp — tous sont des variantes sophistiquees de cette idee simple. Comprendre le gradient, c'est comprendre comment chaque reseau de neurones apprend.",
            example: "Entrainer un reseau c'est essentiellement: (1) passer des donnees, (2) calculer la loss, (3) calculer le gradient de la loss par rapport a chaque poids, (4) faire un pas dans la direction opposee. Repeter 10 000 fois.",
            tip: "Le learning rate est l'hyperparametre le plus important. Un bon reflexe: commencer avec η=1e-3 (Adam) ou η=0.1 (SGD), puis utiliser un scheduler qui reduit η au fil du temps.",
            didYouKnow: "La descente de gradient a ete inventee par Cauchy en 1847, soit 170 ans avant le deep learning moderne! Ce qui a change, c'est l'autograd (differentiation automatique) qui calcule le gradient de millions de parametres en une seule passe arriere."
        },
        integrals: {
            analogy: "L'integrale, c'est comme mesurer l'aire d'un terrain irregulier en le decoupant en fines bandes verticales. Chaque bande a une largeur minuscule (dx) et une hauteur f(x). On additionne toutes ces bandes de a a b pour obtenir l'aire totale sous la courbe. Plus les bandes sont fines, plus le resultat est precis.",
            equation: "$$\\int_a^b f(x)\\,dx=\\lim_{n\\to\\infty}\\sum_{k=1}^{n} f(x_k)\\Delta x$$",
            breakdown: [
                "On decoupe l'intervalle [a,b] en n petits morceaux de largeur Δx = (b-a)/n.",
                "Pour chaque morceau k, on mesure la hauteur f(x_k): c'est l'aire d'un rectangle fin.",
                "Σ additionne tous ces rectangles: on obtient une approximation de l'aire.",
                "lim n→∞ fait tendre le nombre de rectangles vers l'infini: l'approximation devient exacte.",
                "Le resultat ∫f(x)dx est l'aire EXACTE sous la courbe entre a et b."
            ],
            equationTerms: [
                { term: '∫ₐᵇ', meaning: "Le symbole d'integration: un S allonge (de 'Summa' en latin) avec les bornes a et b." },
                { term: 'f(x)', meaning: "La fonction a integrer: la hauteur de la courbe au point x." },
                { term: 'dx', meaning: "L'element infinitesimal de largeur: la tranche infiniment fine qu'on additionne." },
                { term: 'Σ_{k=1}^{n}', meaning: "La somme discrete sur n rectangles: l'approximation avant le passage a la limite." },
                { term: 'Δx', meaning: "La largeur de chaque rectangle: (b-a)/n, qui tend vers 0 quand n → ∞." },
                { term: 'lim n→∞', meaning: "Passage a la limite: l'approximation par rectangles devient une aire exacte." }
            ],
            why: "En IA, l'integrale apparait partout: les distributions de probabilite (l'aire sous la densite vaut 1), la cross-entropy (integrale de -p·log(q)), les Neural ODE (integration d'une dynamique continue), et la normalisation des softmax sur des espaces continus.",
            example: "Quand on dit qu'une variable aleatoire continue X suit une loi normale, ca signifie que ∫f(x)dx = 1 sur tout ℝ. La probabilite que X tombe entre a et b est exactement ∫ₐᵇ f(x)dx — une aire sous la cloche de Gauss.",
            tip: "L'integration numerique (methode des trapezes, Simpson, Monte Carlo) est souvent plus utile en pratique que le calcul analytique. En haute dimension, seule la methode de Monte Carlo reste tractable.",
            didYouKnow: "Le symbole ∫ a ete invente par Leibniz en 1675 comme un S allonge pour 'summa' (somme en latin). Archimede calculait deja des aires 2000 ans plus tot avec sa methode d'exhaustion — l'ancetre de l'integrale — pour trouver l'aire d'un disque!"
        },
        sequences: {
            analogy: "Une suite, c'est comme un feuilleton: chaque episode (u_n) a un numero (n) et un contenu. La grande question: est-ce que la serie converge vers un denouement stable (une limite L), ou est-ce qu'elle diverge (le scenario part dans tous les sens)? En IA, les suites apparaissent a chaque iteration d'entrainement.",
            equation: "$$\\lim_{n\\to\\infty}u_n=L$$",
            breakdown: [
                "u_n est le terme general: la valeur de la suite a l'etape n (par exemple la loss a l'epoch n).",
                "n → ∞ signifie qu'on laisse le processus tourner indefiniment.",
                "L est la limite: la valeur vers laquelle u_n se stabilise.",
                "La convergence signifie: a partir d'un certain rang, u_n reste aussi proche de L qu'on veut."
            ],
            equationTerms: [
                { term: 'u_n', meaning: "Le n-ieme terme de la suite: une valeur indexee par l'entier naturel n." },
                { term: 'lim n→∞', meaning: "Limite quand n tend vers l'infini: le comportement asymptotique de la suite." },
                { term: 'L', meaning: "La limite: la valeur vers laquelle la suite se stabilise (si elle converge)." }
            ],
            why: "L'entrainement d'un reseau genere une suite de valeurs de loss (L₀, L₁, L₂, ...). La convergence de cette suite signifie que le modele a appris. Les series (sommes de suites) apparaissent dans les developpements de Taylor, les fonctions generatrices, et l'analyse de complexite.",
            example: "Quand tu traces la courbe de loss pendant l'entrainement et qu'elle se stabilise autour d'une valeur, tu observes la convergence d'une suite. Si elle oscille ou explose, la suite diverge — souvent a cause d'un learning rate trop grand.",
            tip: "Pour verifier la convergence en pratique, surveille la loss sur le validation set (pas le train set). Si la loss de train descend mais celle de validation remonte, c'est de l'overfitting, pas de la convergence utile.",
            didYouKnow: "La serie harmonique 1 + 1/2 + 1/3 + 1/4 + ... diverge vers l'infini, meme si chaque terme tend vers 0! C'est un piege classique: des termes qui diminuent ne garantissent PAS que la somme converge. Il faut qu'ils diminuent 'assez vite'."
        },
        distances: {
            analogy: "Une distance, c'est une regle pour mesurer a quel point deux objets sont differents. Comme un metre-ruban dans un espace de donnees. La distance euclidienne mesure 'a vol d'oiseau', la distance de Manhattan suit les rues, et la distance cosinus mesure l'angle entre deux directions. Choisir la bonne distance, c'est decider ce que 'similaire' signifie.",
            equation: "$$d(\\mathbf{x},\\mathbf{y})=\\sqrt{\\sum_i(x_i-y_i)^2}$$",
            breakdown: [
                "x_i - y_i mesure l'ecart entre x et y sur chaque dimension i.",
                "(x_i - y_i)² met l'ecart au carre: les gros ecarts comptent beaucoup plus.",
                "Σ additionne les carres sur toutes les dimensions: on combine les ecarts.",
                "√ prend la racine carree: on revient dans l'unite d'origine."
            ],
            equationTerms: [
                { term: 'd(x, y)', meaning: "La distance entre les points x et y: un nombre ≥ 0 qui mesure leur dissimilarite." },
                { term: 'x_i, y_i', meaning: "Les composantes (coordonnees) des vecteurs x et y sur la dimension i." },
                { term: '(x_i - y_i)²', meaning: "Le carre de l'ecart: elimine le signe et penalise les grands ecarts." },
                { term: 'Σ_i', meaning: "Somme sur toutes les dimensions: chaque axe contribue a la distance totale." },
                { term: '√ (racine)', meaning: "Racine carree: ramene la somme des carres dans l'echelle originale des donnees." }
            ],
            why: "En IA, la distance est au coeur du kNN, du clustering (k-means), des embeddings (similitude cosinus), de la recherche vectorielle (RAG), et des metriques d'evaluation. Le choix de la distance determine souvent la qualite du modele plus que l'algorithme lui-meme.",
            example: "Quand un moteur de recherche semantique trouve des documents similaires a ta requete, il calcule la distance cosinus entre l'embedding de ta requete et ceux des documents. Les plus proches sont les plus pertinents.",
            tip: "En haute dimension (>100), la distance euclidienne perd son pouvoir discriminant (malediction de la dimensionnalite). Prefere la distance cosinus pour comparer des embeddings, ou utilise des techniques de reduction de dimension d'abord.",
            didYouKnow: "En dimension 100, presque tous les points d'une boule sont concentres pres de la surface — le volume interieur est negligeable! C'est la 'malediction de la dimensionnalite': nos intuitions 3D ne marchent plus du tout en haute dimension."
        },
        alg_intro: {
            analogy: "L'algebre lineaire est le GPS de l'IA: elle te permet de naviguer dans des espaces a 100, 1000 ou 1 million de dimensions aussi naturellement qu'en 3D. Chaque couche d'un reseau de neurones est une transformation lineaire — une multiplication matricielle suivie d'un biais. Maitriser l'algebre lineaire, c'est comprendre le langage natif du deep learning.",
            equation: "$$\\mathbf{y}=W\\mathbf{x}+\\mathbf{b}$$",
            breakdown: [
                "x est le vecteur d'entree: les features ou l'embedding qui entre dans la couche.",
                "W est la matrice de poids: elle encode la transformation apprise par le reseau.",
                "Wx est le produit matriciel: chaque neurone de sortie combine toutes les entrees avec ses poids.",
                "b est le vecteur de biais: un decalage qui permet a la transformation de ne pas passer par l'origine.",
                "y est la sortie: le resultat de la transformation lineaire, pret pour l'activation non-lineaire."
            ],
            equationTerms: [
                { term: 'y', meaning: "Le vecteur de sortie: le resultat de la transformation, de dimension m (nombre de neurones de sortie)." },
                { term: 'W', meaning: "La matrice de poids (m×n): chaque ligne encode les poids d'un neurone de sortie." },
                { term: 'x', meaning: "Le vecteur d'entree de dimension n: les donnees ou features injectees dans la couche." },
                { term: 'b', meaning: "Le vecteur de biais de dimension m: permet de decaler la sortie sans contrainte sur l'origine." }
            ],
            why: "y = Wx + b est l'equation la plus executee en deep learning. Chaque couche dense, chaque tete d'attention, chaque projection d'embedding repose sur cette operation. Comprendre ce que fait geometriquement une multiplication matricielle, c'est voir a travers le reseau.",
            example: "Une couche Dense(128, 64) dans Keras effectue y = Wx + b avec W de taille 64×128, soit 8192 multiplications pour chaque input. Un GPT-3 fait ca des milliards de fois par inference.",
            tip: "Visualise Wx comme une rotation + etirement de l'espace d'entree. Le biais b translate ensuite le resultat. L'activation non-lineaire (ReLU, etc.) plie l'espace — c'est ce qui donne sa puissance au reseau.",
            didYouKnow: "Le mot 'matrice' vient du latin 'matrix' (uterus/source). James Joseph Sylvester l'a introduit en 1850 pour decrire un tableau de nombres 'engendrant' des determinants. Arthur Cayley a ensuite formalise l'algebre des matrices en 1858."
        },
        sets: {
            analogy: "Les ensembles sont comme des boites etiquetees. Tu peux mettre des objets dedans (elements), fusionner deux boites (union ∪), garder seulement ce qui est en commun (intersection ∩), ou retirer les elements d'une boite presents dans l'autre (difference ∖). C'est la base de TOUTE la logique mathematique.",
            equation: "$$A\\cup B,\\;A\\cap B,\\;A\\setminus B$$",
            breakdown: [
                "A ∪ B (union) rassemble TOUS les elements de A et de B — comme mixer deux playlists sans doublons.",
                "A ∩ B (intersection) garde seulement les elements communs — les chansons presentes dans les deux playlists.",
                "A ∖ B (difference) garde les elements de A qui ne sont PAS dans B — ta playlist sans les morceaux de l'autre.",
                "Ces trois operations permettent de combiner, filtrer et organiser n'importe quelle collection de donnees."
            ],
            equationTerms: [
                { term: 'A, B', meaning: "Des ensembles: des collections d'elements distincts, sans ordre ni repetition." },
                { term: '∪ (union)', meaning: "Reunion: tout ce qui est dans A OU dans B (ou les deux)." },
                { term: '∩ (intersection)', meaning: "Croisement: uniquement ce qui est dans A ET dans B simultanement." },
                { term: '∖ (difference)', meaning: "Soustraction ensembliste: les elements de A qui ne sont pas dans B." }
            ],
            why: "Les ensembles structurent toute la theorie: les domaines de fonctions, les espaces vectoriels, les evenements en probabilite, les classes en classification. En pratique, les operations ensemblistes sont partout: filtrage de donnees, selection de features, evaluation (TP, FP, FN sont des intersections d'ensembles).",
            example: "En evaluation de modele: vrais positifs = predictions positives ∩ labels positifs. Faux positifs = predictions positives ∖ labels positifs. C'est de la theorie des ensembles appliquee!",
            tip: "Dessine des diagrammes de Venn pour toute question ensembliste. C'est le meilleur outil de verification rapide, meme pour les chercheurs experimentes.",
            didYouKnow: "Georg Cantor a prouve en 1874 qu'il existe des infinis de 'tailles' differentes: l'ensemble des reels est STRICTEMENT plus grand que celui des entiers, meme si les deux sont infinis! Cette decouverte a declenche une crise en mathematiques et rendu Cantor tres impopulaire aupres de certains collegues."
        },
        vectors: {
            analogy: "Un vecteur, c'est une fleche dans l'espace. Elle a une direction (ou elle pointe), un sens (vers le haut ou le bas), et une longueur (son intensite). En IA, les vecteurs representent TOUT: un mot est un vecteur (embedding), une image est un vecteur de pixels, un utilisateur est un vecteur de preferences. Deux vecteurs proches = deux objets similaires.",
            equation: "$$\\lVert\\mathbf{v}\\rVert_2=\\sqrt{\\mathbf{v}^\\top\\mathbf{v}}$$",
            breakdown: [
                "v est un vecteur: une liste ordonnee de nombres (v₁, v₂, ..., vₙ).",
                "v⊤v est le produit scalaire de v avec lui-meme: v₁² + v₂² + ... + vₙ².",
                "La racine carree donne la norme L2: la 'longueur' du vecteur dans l'espace euclidien.",
                "‖v‖₂ = 0 seulement si v est le vecteur nul (toutes les composantes a zero)."
            ],
            equationTerms: [
                { term: '‖v‖₂', meaning: "La norme euclidienne (L2) du vecteur: sa longueur dans l'espace." },
                { term: 'v⊤', meaning: "La transposee de v: le vecteur colonne devient vecteur ligne (pour le produit scalaire)." },
                { term: 'v⊤v', meaning: "Le produit scalaire de v avec lui-meme: la somme des carres des composantes." },
                { term: '√', meaning: "La racine carree: ramene la somme des carres a l'echelle de longueur originale." }
            ],
            why: "Les vecteurs sont le format universel des donnees en IA. Les embeddings de mots (Word2Vec, BERT) sont des vecteurs de dimension 768+. Les images sont des tenseurs (vecteurs multidimensionnels). La similarite entre vecteurs (cosinus, distance euclidienne) est le coeur de la recherche semantique et du RAG.",
            example: "Dans Word2Vec, le celebre exemple: vec('roi') - vec('homme') + vec('femme') ≈ vec('reine'). Les relations semantiques sont encodees comme des directions dans l'espace vectoriel!",
            tip: "Pour comparer des vecteurs en IA, utilise la similarite cosinus plutot que la distance euclidienne: elle ignore la longueur des vecteurs et ne compare que leurs directions — ce qui compte pour le sens semantique.",
            didYouKnow: "Le mot 'vecteur' vient du latin 'vehere' (transporter). Hermann Grassmann a invente l'algebre des vecteurs en 1844 dans un livre si abstrait que personne ne l'a compris de son vivant. Il est mort (1877) sans savoir que ses idees deviendraient fondamentales!"
        },
        matrices: {
            analogy: "Une matrice est comme un studio de mixage audio avec des boutons. Chaque ligne est un canal de sortie, chaque colonne est un canal d'entree, et chaque coefficient dit combien de signal d'entree va vers cette sortie. Multiplier un vecteur par une matrice, c'est mixer les entrees pour produire les sorties — exactement ce que fait chaque couche de neurones.",
            equation: "$$C=AB$$",
            breakdown: [
                "A est une matrice m×n et B une matrice n×p.",
                "Le produit C = AB donne une matrice m×p.",
                "Chaque element C_{ij} est le produit scalaire de la ligne i de A avec la colonne j de B.",
                "Geometriquement: on applique la transformation B, puis la transformation A — c'est une composition."
            ],
            equationTerms: [
                { term: 'A (matrice)', meaning: "Un tableau rectangulaire de nombres organise en lignes et colonnes, representant une transformation lineaire." },
                { term: 'B (matrice)', meaning: "La deuxieme matrice: la premiere transformation appliquee aux donnees." },
                { term: 'C = AB', meaning: "Le produit matriciel: la composition des deux transformations. Attention: AB ≠ BA en general!" }
            ],
            why: "Le produit matriciel est l'operation la plus executee en deep learning. Une inference GPT-4 implique des milliers de multiplications de matrices enormes. Les GPU sont concus specifiquement pour paralléliser ces calculs. Comprendre les matrices, c'est comprendre pourquoi les GPU sont essentiels a l'IA.",
            example: "Dans un Transformer, les matrices Q, K, V transforment les embeddings d'entree. L'attention est un produit matriciel QK⊤ suivi d'un softmax et d'un produit par V. Trois produits matriciels par tete d'attention!",
            tip: "Attention: AB ≠ BA en general! L'ordre des multiplications matricielles compte. C'est pour ca qu'en deep learning, l'ordre des couches change completement le comportement du reseau.",
            didYouKnow: "Un GPU moderne (comme le H100 de NVIDIA) peut effectuer 4000 TERAFLOPS en precision FP8, soit 4 × 10¹⁵ operations par seconde. Quasiment toutes ces operations sont des multiplications de matrices pour le deep learning. Le produit matriciel est litteralement le battement de coeur de l'IA."
        },
        spaces: {
            analogy: "Un espace vectoriel est comme une salle de jeu avec deux regles: tu peux additionner des briques (vecteurs) et les agrandir/reduire (multiplication par un scalaire), et le resultat reste toujours dans la salle. Ces deux regles simples — addition et homothetie — suffisent a construire toute la geometrie lineaire. L'espace des embeddings de BERT, par exemple, est un espace vectoriel de dimension 768.",
            equation: "$$\\text{span}(v_1,\\dots,v_k)=\\left\\{\\sum_i\\alpha_i v_i\\right\\}$$",
            breakdown: [
                "v₁, ..., v_k sont des vecteurs de base: les 'briques elementaires'.",
                "α_i sont des scalaires (nombres reels): les coefficients de la combinaison lineaire.",
                "Σ αᵢvᵢ combine les briques: chaque vecteur est etire par son coefficient puis additionne aux autres.",
                "span(...) est l'ensemble de TOUTES les combinaisons possibles: le sous-espace engendre par ces vecteurs."
            ],
            equationTerms: [
                { term: 'span(v₁,...,v_k)', meaning: "Le sous-espace engendre: l'ensemble de tous les vecteurs qu'on peut fabriquer en combinant v₁ a v_k." },
                { term: 'αᵢ', meaning: "Coefficients scalaires: des nombres reels qui dosent la contribution de chaque vecteur de base." },
                { term: 'Σ αᵢvᵢ', meaning: "Combinaison lineaire: la somme ponderee des vecteurs de base, le building block de l'algebre lineaire." }
            ],
            why: "Les sous-espaces sont partout en IA: PCA trouve le sous-espace de variance maximale, les embeddings vivent dans des sous-espaces appris, et la theorie de l'approximation universelle dit qu'un reseau peut representer n'importe quelle fonction continue dans un espace de dimension suffisante.",
            example: "PCA (Analyse en Composantes Principales) projette des donnees de grande dimension sur un sous-espace de dimension k qui capture le maximum de variance. C'est litteralement trouver le meilleur span(v₁,...,v_k) pour resumer les donnees.",
            tip: "La dimension d'un espace vectoriel est le nombre minimum de vecteurs necessaires pour engendrer tout l'espace. En pratique, si tes features sont redondantes (correlees), la dimension 'effective' de tes donnees est bien plus petite que le nombre de features.",
            didYouKnow: "L'espace vectoriel le plus grand utilise en pratique est celui des parametres de GPT-4, estime a ~1.8 trillion de dimensions (un parametre = une dimension). C'est un point dans un espace a 1.8 × 10¹² dimensions, et l'entrainement cherche le meilleur point dans cet espace astronomique!"
        },
        linear_map: {
            analogy: "Une application lineaire est une transformation qui respecte deux regles d'or: (1) transformer une somme = somme des transformes, (2) transformer un multiple = multiple du transforme. Visuellement, les lignes droites restent droites et l'origine reste fixe. Les grilles carrees deviennent des parallelogrammes — elles se deforment mais ne se courbent jamais.",
            equation: "$$T(\\alpha u+\\beta v)=\\alpha T(u)+\\beta T(v)$$",
            breakdown: [
                "T est l'application lineaire: une regle qui transforme des vecteurs.",
                "αu + βv est une combinaison lineaire dans l'espace de depart.",
                "T(αu + βv) transforme d'abord, puis on observe le resultat.",
                "αT(u) + βT(v) transforme chaque vecteur separement, puis combine — et on obtient le meme resultat!",
                "Cette propriete de 'superposition' est la definition meme de la linearite."
            ],
            equationTerms: [
                { term: 'T', meaning: "L'application lineaire: une fonction qui preserve les combinaisons lineaires." },
                { term: 'α, β', meaning: "Des scalaires: les coefficients de la combinaison lineaire, preserves par T." },
                { term: 'u, v', meaning: "Des vecteurs de l'espace de depart, les objets transformes par T." },
                { term: 'T(u), T(v)', meaning: "Les images de u et v par T: les vecteurs transformes dans l'espace d'arrivee." }
            ],
            why: "Chaque couche d'un reseau de neurones (avant l'activation) est une application lineaire. La backpropagation exploite la linearite pour propager les gradients efficacement. Et la raison pour laquelle on AJOUTE des non-linearites (ReLU, etc.), c'est precisement parce que composer des applications lineaires donne... une application lineaire. Sans activation non-lineaire, 100 couches = 1 couche!",
            example: "Empilez 10 couches lineaires sans activation: y = W₁₀(W₉(...W₁x...)) = (W₁₀·W₉·...·W₁)x = Wx. Dix couches se reduisent a une seule! C'est pour ca que l'activation non-lineaire est indispensable.",
            tip: "Toute application lineaire entre espaces de dimension finie peut etre representee par une matrice. Trouver cette matrice, c'est 'concretiser' l'application: on passe du concept abstrait au tableau de nombres qu'on peut multiplier.",
            didYouKnow: "Le theoreme du rang dit que pour toute application lineaire T: dim(Image) + dim(Noyau) = dim(Depart). C'est une loi de conservation: l'information 'perdue' par T (le noyau) plus l'information 'conservee' (l'image) egale toujours l'information de depart. Elegant!"
        },
        det_inv: {
            analogy: "Le determinant est le facteur de zoom d'une transformation: si det(A) = 2, la transformation double les aires (en 2D) ou les volumes (en 3D). Si det(A) = 0, tout est ecrase a plat — la transformation perd de l'information et n'est PAS inversible. L'inverse A⁻¹ est le bouton 'annuler': elle defait exactement ce que A a fait.",
            equation: "$$A^{-1}=\\frac{1}{\\det(A)}\\,\\mathrm{adj}(A)$$",
            breakdown: [
                "det(A) est le determinant: un nombre qui mesure le facteur d'echelle volumique de la transformation A.",
                "Si det(A) = 0, la matrice est singuliere: elle ecrase l'espace et n'a pas d'inverse.",
                "adj(A) est la matrice adjointe (comatrice transposee): elle contient les cofacteurs de A.",
                "A⁻¹ = adj(A)/det(A) est l'inverse: la transformation qui annule l'effet de A (AA⁻¹ = I)."
            ],
            equationTerms: [
                { term: 'A⁻¹', meaning: "La matrice inverse: l'unique matrice telle que AA⁻¹ = A⁻¹A = I (matrice identite)." },
                { term: 'det(A)', meaning: "Le determinant: un scalaire qui mesure le facteur d'agrandissement de volume (0 = ecrasement)." },
                { term: 'adj(A)', meaning: "La matrice adjointe: la transposee de la matrice des cofacteurs." }
            ],
            why: "Le determinant intervient en regularisation (det proche de 0 = matrice mal conditionnee = instabilite numerique), en normalizing flows (le log-determinant du Jacobien mesure le changement de densite), et l'inversibilite est cruciale pour resoudre les systemes lineaires.",
            example: "Dans les Normalizing Flows, on transforme une distribution simple (gaussienne) en distribution complexe via des transformations inversibles. Le log|det(J)| du Jacobien corrige la densite de probabilite — sans determinant, pas de flows!",
            tip: "En pratique, ne calcule JAMAIS l'inverse explicitement pour resoudre Ax = b. Utilise plutot une factorisation (LU, Cholesky, QR) qui est numeriquement plus stable et plus rapide. numpy.linalg.solve > numpy.linalg.inv.",
            didYouKnow: "Le determinant 3×3 a ete decouvert par le mathematicien japonais Seki Takakazu en 1683, independamment de Leibniz qui l'a publie en 1693. La 'regle de Sarrus' que tu as peut-etre apprise n'est en fait qu'un moyen mnemonique — elle ne generalise PAS aux matrices 4×4 et au-dela!"
        },
        eigen: {
            analogy: "Imagine que tu etires une feuille de caoutchouc. La plupart des points bougent dans des directions compliquees. Mais certaines directions speciales ne font que s'allonger ou se comprimer sans tourner: ce sont les directions propres. La valeur propre λ te dit de combien: λ > 1 = etirement, 0 < λ < 1 = compression, λ < 0 = retournement.",
            equation: "$$A\\mathbf{v}=\\lambda\\mathbf{v}$$",
            breakdown: [
                "A est une matrice carree: une transformation lineaire de l'espace dans lui-meme.",
                "v est un vecteur propre: une direction speciale qui reste inchangee (a un facteur pres) par A.",
                "λ est la valeur propre associee: le facteur d'etirement le long de cette direction.",
                "Av = λv signifie: appliquer A a v ne fait que multiplier v par λ — v ne tourne pas!"
            ],
            equationTerms: [
                { term: 'A', meaning: "La matrice carree: la transformation lineaire dont on cherche les directions invariantes." },
                { term: 'v (vecteur propre)', meaning: "Un vecteur non-nul qui ne change pas de direction sous l'action de A." },
                { term: 'λ (valeur propre)', meaning: "Le facteur d'etirement: de combien v est dilate (λ>1), comprime (0<λ<1) ou retourne (λ<0)." }
            ],
            why: "Les valeurs propres sont partout en IA: PCA utilise les vecteurs propres de la matrice de covariance pour trouver les axes de variance maximale. Le PageRank de Google est un probleme de valeur propre. Le spectral clustering utilise les valeurs propres du Laplacien du graphe. Les modes propres d'un reseau recurrent determinent s'il explose ou s'eteint.",
            example: "PCA decompose la matrice de covariance: les vecteurs propres sont les 'axes principaux' des donnees, et les valeurs propres mesurent la variance le long de chaque axe. Garder les k plus grandes valeurs propres = garder les k directions les plus informatives.",
            tip: "Si les valeurs propres d'un Jacobien recurrent sont >1 en module, les gradients explosent. Si elles sont <1, ils s'evanouissent. C'est l'origine exacte du probleme du vanishing/exploding gradient dans les RNN!",
            didYouKnow: "Le PageRank de Google (1998) classe les pages web en trouvant le vecteur propre dominant de la matrice de liens du web. Larry Page et Sergey Brin ont litteralement bati un empire de 1000+ milliards de dollars sur... une decomposition en valeurs propres!"
        },
        svd: {
            analogy: "La SVD decompose n'importe quelle transformation en trois etapes intuitives: (1) rotation V⊤ pour aligner les donnees, (2) etirement Σ le long des axes (les valeurs singulieres), (3) rotation U pour orienter le resultat. C'est comme decomposer un mouvement de danse complexe en: se tourner, s'etirer, se tourner a nouveau.",
            equation: "$$A=U\\Sigma V^\\top$$",
            breakdown: [
                "V⊤ est une rotation dans l'espace de depart: elle aligne les donnees sur des axes optimaux.",
                "Σ est une matrice diagonale de valeurs singulieres σ₁ ≥ σ₂ ≥ ... ≥ 0: les facteurs d'etirement.",
                "U est une rotation dans l'espace d'arrivee: elle oriente le resultat final.",
                "Tronquer a k valeurs singulieres donne la meilleure approximation de rang k de A (theoreme d'Eckart-Young)."
            ],
            equationTerms: [
                { term: 'U', meaning: "Matrice orthogonale m×m: les vecteurs singuliers gauches (rotation de sortie)." },
                { term: 'Σ', meaning: "Matrice diagonale m×n: les valeurs singulieres σ₁ ≥ σ₂ ≥ ... ≥ 0 (facteurs d'etirement)." },
                { term: 'V⊤', meaning: "Matrice orthogonale n×n transposee: les vecteurs singuliers droits (rotation d'entree)." },
                { term: 'A = UΣV⊤', meaning: "Toute matrice se decompose ainsi, meme non carree! C'est la generalisation des valeurs propres." }
            ],
            why: "La SVD est l'outil le plus polyvalent de l'algebre lineaire appliquee: compression d'images (garder les top-k valeurs singulieres), systemes de recommandation (factorisation matricielle), PCA (SVD de la matrice centree), pseudo-inverse (pour les moindres carres), et LoRA (adaptation low-rank des LLM).",
            example: "LoRA (Low-Rank Adaptation) fine-tune les LLM en ajoutant de petites matrices de rang faible ΔW = BA au lieu de modifier les enormes matrices de poids. L'idee vient directement de la SVD: les mises a jour utiles vivent dans un sous-espace de faible dimension.",
            tip: "En pratique, ne calcule jamais la SVD complete de grosses matrices. Utilise la SVD tronquee (scipy.sparse.linalg.svds ou randomized SVD de sklearn) qui ne calcule que les k premieres valeurs singulieres — c'est exponentiellement plus rapide.",
            didYouKnow: "La SVD a ete decouverte independamment par Eugenio Beltrami (1873) et Camille Jordan (1874). Netflix a organise un concours a 1 million de dollars en 2009 pour ameliorer ses recommandations — la solution gagnante reposait largement sur... la factorisation SVD des matrices utilisateur-film!"
        },
        stat_intro: {
            analogy: "Les statistiques sont le traducteur entre le monde bruyant des donnees et le monde clair des decisions. Imagine un medecin qui regarde 1000 analyses sanguines: les stats lui disent 'cette valeur est anormale avec 95% de confiance'. Sans stats, il n'aurait que du bruit.",
            equation: "$$\\mathbb{E}[X]=\\sum_x xP(X=x)$$",
            breakdown: [
                "X est une variable aleatoire: une quantite dont la valeur depend du hasard (ex: le score d'un de).",
                "P(X = x) est la probabilite que X prenne la valeur x.",
                "x · P(X = x) pondere chaque valeur par sa probabilite: les valeurs frequentes comptent plus.",
                "Σ additionne toutes ces contributions: le resultat est la valeur 'moyenne attendue' de X.",
                "E[X] est l'esperance: si tu repetes l'experience a l'infini, c'est la moyenne observee."
            ],
            equationTerms: [
                { term: 'E[X]', meaning: "L'esperance mathematique: la valeur moyenne de X sur un tres grand nombre de repetitions." },
                { term: 'X', meaning: "Variable aleatoire: une quantite qui peut prendre differentes valeurs selon le hasard." },
                { term: 'P(X=x)', meaning: "La probabilite que X vaille exactement x: un nombre entre 0 et 1." },
                { term: 'Σ_x', meaning: "Somme sur toutes les valeurs possibles de X: on considere chaque scenario." }
            ],
            why: "L'esperance est la brique de base de toute loss en ML: la loss moyenne sur le dataset est une esperance empirique. L'esperance du reward en RL definit l'objectif de l'agent. Les intervalles de confiance, les tests A/B, la calibration — tout repose sur les stats.",
            example: "Quand tu calcules la loss moyenne sur ton dataset d'entrainement: L = (1/n)Σ L(yᵢ, ŷᵢ), tu estimes l'esperance E[L]. Le theoreme central limite te dit que cette estimation est fiable si n est assez grand.",
            tip: "Toujours regarder au-dela de la moyenne! La variance te dit si tes resultats sont stables, les quantiles te montrent les extremes. Un modele avec une loss moyenne de 0.5 mais une variance de 10 est BEAUCOUP moins fiable qu'un avec loss = 0.6 et variance = 0.1.",
            didYouKnow: "Le mot 'statistique' vient de l'allemand 'Statistik', invente par Gottfried Achenwall en 1749 pour designer la 'science de l'Etat' (donnees gouvernementales). La discipline a garde ce nom meme quand elle a deborde bien au-dela de la politique pour devenir le langage universel de l'incertitude."
        },
        descrip: {
            analogy: "Les stats descriptives sont comme le resume au dos d'un livre: en quelques chiffres (moyenne, mediane, ecart-type, quartiles), elles te donnent le portrait-robot de tes donnees. La moyenne dit 'ou est le centre', l'ecart-type dit 'a quel point c'est disperse', et la mediane dit 'ou est le milieu reel, sans etre influence par les valeurs extremes'.",
            equation: "$$\\sigma=\\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(x_i-\\mu)^2}$$",
            breakdown: [
                "μ est la moyenne: la somme de toutes les valeurs divisee par n.",
                "xᵢ - μ est l'ecart de chaque observation a la moyenne: positif si au-dessus, negatif si en-dessous.",
                "(xᵢ - μ)² met l'ecart au carre: elimine les signes et penalise les grands ecarts.",
                "Σ/n fait la moyenne des carres: la variance σ².",
                "√ prend la racine: σ est l'ecart-type, dans la meme unite que les donnees originales."
            ],
            equationTerms: [
                { term: 'σ (sigma)', meaning: "L'ecart-type: mesure la dispersion typique des donnees autour de la moyenne." },
                { term: 'n', meaning: "Le nombre d'observations: la taille de l'echantillon." },
                { term: 'xᵢ', meaning: "La i-eme observation: une valeur individuelle du dataset." },
                { term: 'μ (mu)', meaning: "La moyenne arithmetique: le centre de gravite des donnees." },
                { term: '(xᵢ - μ)²', meaning: "Le carre de l'ecart a la moyenne: toujours positif, penalise les outliers." }
            ],
            why: "Avant d'entrainer un modele, il faut TOUJOURS faire une analyse descriptive: distribution des features, detection d'outliers, valeurs manquantes. Les stats descriptives sont le diagnostic medical de tes donnees — on ne prescrit pas un traitement sans diagnostic.",
            example: "Si la moyenne des ages est 35 ans mais la mediane est 28 ans, ta distribution est asymetrique a droite (quelques personnes tres agees tirent la moyenne vers le haut). La mediane est plus representative du 'participant typique'.",
            tip: "Utilise toujours df.describe() (Pandas) ou un equivalent comme premiere etape sur tout nouveau dataset. Regarde min, max, quartiles, et surtout l'ecart entre moyenne et mediane — un gros ecart signale une asymetrie importante.",
            didYouKnow: "L'ecart-type a ete introduit par Karl Pearson en 1894, mais le symbole σ a ete propose plus tard. Fait surprenant: pour une loi normale, environ 68% des donnees tombent a ±1σ de la moyenne, 95% a ±2σ, et 99.7% a ±3σ. C'est la fameuse 'regle 68-95-99.7'!"
        },
        correlation: {
            analogy: "La correlation mesure si deux variables 'dansent ensemble': quand l'une monte, l'autre monte aussi (correlation positive) ou descend (correlation negative)? Attention: deux variables peuvent etre parfaitement correlees sans qu'aucune ne CAUSE l'autre! Les ventes de glaces et les noyades sont correlees (toutes deux augmentent en ete), mais les glaces ne causent pas les noyades.",
            equation: "$$\\rho_{X,Y}=\\frac{\\mathrm{Cov}(X,Y)}{\\sigma_X\\sigma_Y}$$",
            breakdown: [
                "Cov(X,Y) = E[(X-μ_X)(Y-μ_Y)] est la covariance: elle mesure si X et Y devient dans le meme sens.",
                "σ_X et σ_Y sont les ecarts-types de X et Y: ils normalisent la covariance.",
                "La division par σ_X·σ_Y ramene ρ entre -1 et +1: une echelle universelle.",
                "ρ = +1: correlation positive parfaite. ρ = -1: negative parfaite. ρ = 0: pas de relation LINEAIRE."
            ],
            equationTerms: [
                { term: 'ρ_{X,Y}', meaning: "Le coefficient de correlation de Pearson: un nombre entre -1 et +1 mesurant la dependance lineaire." },
                { term: 'Cov(X,Y)', meaning: "La covariance: mesure la tendance de X et Y a varier ensemble. Positive = meme sens, negative = sens oppose." },
                { term: 'σ_X, σ_Y', meaning: "Les ecarts-types: normalisent la covariance pour obtenir un coefficient sans unite." }
            ],
            why: "En feature engineering, la matrice de correlation revele les redundances entre features. En finance quantitative, la correlation entre actifs determine la diversification. En IA, la decorrelation des features ameliore l'entrainement (batch normalization, whitening).",
            example: "Si deux features ont ρ = 0.98, elles sont presque identiques: en garder une seule suffit. C'est le principe de la selection de features par correlation. Inversement, ρ ≈ 0 ne signifie PAS independance — il peut y avoir une relation non-lineaire invisible a Pearson!",
            tip: "Correlation ≠ causalite est le piege #1 en data science. Pour establir un lien causal, il faut un design experimental (A/B test) ou des methodes causales (do-calculus, instruments). Une correlation, aussi forte soit-elle, ne prouve RIEN sur la causalite.",
            didYouKnow: "Le site 'Spurious Correlations' de Tyler Vigen montre des correlations absurdes mais reelles: le taux de divorce dans le Maine est correle a 99.26% avec la consommation de margarine par habitant (2000-2009). La lecon: avec assez de donnees, on trouve TOUJOURS des correlations fortuites."
        },
        proba_fond: {
            analogy: "La probabilite est une comptabilite rigoureuse de l'incertitude. Imagine une urne avec des boules de couleurs: la proba te dit combien de chances tu as de tirer une boule rouge. Ce n'est pas de la divination — c'est une mesure precise qui obeit a des regles mathematiques strictes, comme l'addition et la multiplication.",
            equation: "$$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$$",
            breakdown: [
                "P(A) est la probabilite de A: un nombre entre 0 (impossible) et 1 (certain).",
                "A ∪ B est l'evenement 'A ou B (ou les deux)': au moins un des deux se produit.",
                "P(A) + P(B) surestime car il compte deux fois le cas ou A ET B arrivent ensemble.",
                "On soustrait P(A ∩ B) pour corriger: c'est le principe d'inclusion-exclusion.",
                "Si A et B sont mutuellement exclusifs (ne peuvent pas arriver ensemble), P(A ∩ B) = 0 et P(A ∪ B) = P(A) + P(B)."
            ],
            equationTerms: [
                { term: 'P(A)', meaning: "Probabilite de l'evenement A: un nombre entre 0 et 1 mesurant sa vraisemblance." },
                { term: 'A ∪ B', meaning: "Union: l'evenement 'au moins un des deux se realise'." },
                { term: 'A ∩ B', meaning: "Intersection: l'evenement 'les deux se realisent simultanement'." },
                { term: 'P(A∩B)', meaning: "La probabilite conjointe: la chance que A et B arrivent en meme temps." }
            ],
            why: "Toute l'IA est probabiliste: la sortie d'un classificateur est une distribution de probabilite sur les classes. Le softmax produit des probabilites. La loss cross-entropy mesure la divergence entre distribution predite et vraie. Le bayesien update est du Bayes pur. Sans probas, pas d'IA.",
            example: "P(spam | contient 'gratuit') est une probabilite conditionnelle. Le filtre anti-spam de ton email utilise le theoreme de Bayes pour combiner la proba a priori de spam avec la vraisemblance que les spams contiennent 'gratuit'.",
            tip: "Les trois pieges probabilistes classiques: (1) confondre P(A|B) et P(B|A), (2) oublier les probabilites de base (base rate neglect), (3) croire que les evenements independants ont une 'memoire'. Le de n'a pas de memoire: apres 10 six, le prochain lancer a toujours 1/6 de chance.",
            didYouKnow: "La theorie des probabilites est nee en 1654 d'une correspondance entre Pascal et Fermat sur un probleme de... jeux de des! Le Chevalier de Mere, joueur professionnel, avait pose la question a Pascal. Les mathematiques de l'incertitude sont nees d'un probleme de gambling."
        },
        lois_discretes: {
            analogy: "Les lois discretes comptent des evenements entiers: pile ou face (Bernoulli), nombre de succes en n essais (binomiale), nombre de clients dans une file d'attente (Poisson). Chaque loi est comme un modele de generateur aleatoire specifique: tu choisis le bon generateur selon la situation, et il te donne les probabilites de chaque resultat possible.",
            equation: "$$P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k}$$",
            breakdown: [
                "C'est la loi binomiale: la probabilite d'obtenir exactement k succes en n essais independants.",
                "p est la probabilite de succes a chaque essai (ex: p = 0.5 pour pile/face equitable).",
                "(n choose k) = n!/(k!(n-k)!) est le nombre de facons de placer k succes parmi n essais.",
                "p^k est la probabilite d'avoir k succes consecutifs.",
                "(1-p)^(n-k) est la probabilite d'avoir n-k echecs consecutifs.",
                "On multiplie le tout: nombre d'arrangements × probabilite de chaque arrangement."
            ],
            equationTerms: [
                { term: 'P(X=k)', meaning: "La probabilite que la variable X prenne exactement la valeur k." },
                { term: '(n choose k)', meaning: "Le coefficient binomial: le nombre de facons de choisir k elements parmi n." },
                { term: 'p^k', meaning: "La probabilite de k succes: chaque succes a une probabilite p." },
                { term: '(1-p)^(n-k)', meaning: "La probabilite de n-k echecs: chaque echec a une probabilite 1-p." },
                { term: 'n', meaning: "Le nombre total d'essais independants." },
                { term: 'k', meaning: "Le nombre de succes dont on calcule la probabilite." }
            ],
            why: "La binomiale modelise toute situation de type succes/echec repetes: taux de clics, taux de conversion, taux d'erreur d'un classificateur. La loi de Poisson modelise les evenements rares (bugs par jour, requetes par seconde). Ces lois sont les briques des tests statistiques et de l'evaluation de modeles.",
            example: "Si ton modele a 90% de precision (p=0.9) et que tu testes sur 100 exemples (n=100), la binomiale te dit la probabilite d'avoir exactement 85 bonnes reponses, ou la probabilite d'en avoir moins de 80 (alerte de regression).",
            tip: "Quand n est grand et p est petit, la binomiale est bien approximee par une Poisson de parametre λ = np. Quand n est grand et p n'est pas extreme, elle est bien approximee par une gaussienne de moyenne np et variance np(1-p).",
            didYouKnow: "Le coefficient binomial (n choose k) apparait dans le Triangle de Pascal (1654), mais il etait connu en Chine depuis le XIe siecle (Triangle de Yang Hui, 1261) et en Perse depuis le XIIe siecle (al-Karaji). Pascal l'a rendu celebre en Occident, mais il n'etait pas le premier de 400 ans!"
        },
        lois_continues: {
            analogy: "Les lois continues modelisent des quantites qui peuvent prendre n'importe quelle valeur sur un intervalle: la taille d'une personne, la temperature, le temps d'attente. La plus celebre est la gaussienne (courbe en cloche): elle apparait partout grace au theoreme central limite qui dit que la somme de plein de petits effets aleatoires independants tend toujours vers une gaussienne.",
            equation: "$$f(x)=\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$$",
            breakdown: [
                "f(x) est la densite de probabilite: ce n'est PAS une probabilite directe, mais P(a < X < b) = ∫f(x)dx de a a b.",
                "μ (mu) est la moyenne: le centre de la cloche, la valeur la plus probable.",
                "σ (sigma) est l'ecart-type: la 'largeur' de la cloche (petit σ = pic etroit, grand σ = cloche etalee).",
                "e^(-...) est l'exponentielle decreissante: elle fait tendre la densite vers 0 quand on s'eloigne de μ.",
                "1/(σ√(2π)) est le facteur de normalisation: il garantit que l'aire totale sous la courbe vaut exactement 1."
            ],
            equationTerms: [
                { term: 'f(x)', meaning: "La densite de probabilite en x: l'aire sous la courbe entre a et b donne P(a < X < b)." },
                { term: 'μ (moyenne)', meaning: "Le centre de la distribution: la valeur autour de laquelle les donnees se concentrent." },
                { term: 'σ (ecart-type)', meaning: "La dispersion: controle la largeur de la cloche. 68% des donnees sont a ±1σ de μ." },
                { term: 'e^(-(x-μ)²/2σ²)', meaning: "Le noyau gaussien: decroit exponentiellement avec le carre de la distance a la moyenne." },
                { term: '1/(σ√(2π))', meaning: "Le facteur de normalisation: garantit que ∫f(x)dx = 1 (axiome des probabilites)." }
            ],
            why: "La gaussienne est omnipresente en IA: initialisation des poids (He, Xavier), bruit dans les VAE et modeles de diffusion, prior bayesien, batch normalization, kernel RBF. Le theoreme central limite explique pourquoi les moyennes de losses convergent vers une gaussienne quand le batch est grand.",
            example: "Dans un VAE (Variational AutoEncoder), l'encodeur produit μ et σ pour chaque dimension latente, et on echantillonne z ~ N(μ, σ²). Le 'reparametrization trick' z = μ + σ·ε (avec ε ~ N(0,1)) permet de backpropager a travers cet echantillonnage.",
            tip: "Si tes donnees ne sont PAS gaussiennes, ne suppose pas qu'elles le sont! Utilise un QQ-plot (quantile-quantile) pour verifier visuellement. Beaucoup de methodes statistiques classiques supposent la normalite — si elle n'est pas verifiee, les conclusions sont invalides.",
            didYouKnow: "La courbe en cloche est aussi appelee 'gaussienne' en l'honneur de Gauss (1809), mais elle a ete decouverte par Abraham de Moivre en 1733, soit 76 ans plus tot! De Moivre l'a trouvee en approximant les coefficients binomiaux. Gauss l'a rendue celebre en l'utilisant pour l'astronomie."
        },
        ai_intro: {
            analogy: "Une IA moderne fonctionne comme une equipe de Formula 1: le pilote (le modele) percoit la piste, l'ingenieur (l'optimiseur) corrige la strategie en temps reel, le mecanicien (le pipeline de donnees) prepare la voiture, et le directeur (la loss function) decide si on gagne ou on perd. Chaque composant est specialise, mais c'est la boucle complete qui fait la performance.",
            equation: "$$\\text{Percevoir}\\rightarrow\\text{Predire}\\rightarrow\\text{Corriger}\\rightarrow\\text{Agir}$$",
            breakdown: [
                "Percevoir: le modele recoit des donnees brutes (texte, image, son, capteurs) et les encode en representations internes.",
                "Predire: a partir de ces representations, il emet une prediction (classe, texte genere, action a prendre).",
                "Corriger: on compare la prediction a la realite (via la loss), et on calcule le gradient pour identifier les erreurs.",
                "Agir: on met a jour les parametres (ou on execute l'action) et on recommence — c'est une boucle iterative."
            ],
            equationTerms: [
                { term: 'Percevoir', meaning: "L'encodage: transformer des donnees brutes en representations utilisables (embeddings, features maps)." },
                { term: 'Predire', meaning: "L'inference: le modele produit une sortie a partir de ses representations internes." },
                { term: 'Corriger', meaning: "L'apprentissage: mesurer l'erreur et calculer comment ajuster les parametres." },
                { term: 'Agir', meaning: "La mise a jour: appliquer les corrections (gradient descent) ou executer une action dans l'environnement." }
            ],
            why: "Cette boucle est le schema mental unificateur de TOUTE l'IA: le supervised learning (percevoir des features, predire un label, corriger via la loss), le RL (percevoir l'etat, predire une action, corriger via le reward), et meme les LLM (percevoir le contexte, predire le prochain token, corriger via RLHF).",
            example: "ChatGPT en action: (1) Percevoir: encoder ta question en tokens puis en embeddings. (2) Predire: generer le prochain token le plus probable. (3) Corriger: pendant l'entrainement, RLHF ajuste les poids pour privilegier les reponses utiles. (4) Agir: afficher la reponse token par token.",
            tip: "Quand tu analyses un systeme d'IA, identifie toujours ces 4 etapes. Ca clarifie instantanement l'architecture: qu'est-ce qui percoit? Qu'est-ce qui predit? Comment on corrige? Qu'est-ce qui agit?",
            didYouKnow: "Le premier programme d'IA, le Logic Theorist (1956), pouvait prouver des theoremes mathematiques. Il a demontre 38 des 52 theoremes du Principia Mathematica, et pour l'un d'eux, il a trouve une preuve plus elegante que celle de Russell et Whitehead!"
        },
        transformers: {
            analogy: "Imagine une reunion ou chaque participant (token) regarde tous les autres pour decider a qui preter attention. Le PDG (token important) attire beaucoup d'attention, le stagiaire (token peu pertinent) moins. Le mecanisme d'attention calcule un score de pertinence entre chaque paire de tokens, puis chaque token aggrege l'information des autres proportionnellement a ces scores. C'est un vote pondere contextuel.",
            equation: "$$\\mathrm{Attention}(Q,K,V)=\\mathrm{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V$$",
            breakdown: [
                "Q (Query) represente 'ce que je cherche': chaque token formule sa question.",
                "K (Key) represente 'ce que j'offre': chaque token affiche son etiquette de contenu.",
                "QK⊤ calcule les scores de compatibilite: le produit scalaire entre chaque query et chaque key.",
                "÷ √d_k normalise pour eviter que les scores explosent en grande dimension.",
                "softmax transforme les scores en probabilites: chaque token distribue son attention entre 0 et 1.",
                "× V (Value) aggrege: chaque token recoit un melange pondere des valeurs des autres, selon l'attention calculee."
            ],
            equationTerms: [
                { term: 'Q (Query)', meaning: "Les requetes: chaque token projete pour exprimer 'ce que je cherche dans le contexte'." },
                { term: 'K (Key)', meaning: "Les cles: chaque token projete pour exprimer 'ce que je contiens comme information'." },
                { term: 'V (Value)', meaning: "Les valeurs: le contenu reel que chaque token transmet quand il est 'selectionne' par l'attention." },
                { term: 'QK⊤', meaning: "La matrice de scores: le produit scalaire entre queries et keys mesure la compatibilite." },
                { term: '√d_k', meaning: "Facteur de normalisation: empeche les scores de devenir trop grands en haute dimension (d_k = dim des keys)." },
                { term: 'softmax', meaning: "Normalisation exponentielle: transforme les scores bruts en poids d'attention qui somment a 1." }
            ],
            why: "Le Transformer (Vaswani et al., 2017) est l'architecture dominante de l'IA moderne: GPT, BERT, T5, ViT, Stable Diffusion, AlphaFold — tous utilisent l'attention. Comprendre cette equation, c'est comprendre le coeur de 90% des modeles de pointe actuels.",
            example: "Dans la phrase 'Le chat dort sur le tapis car il est fatigue', l'attention permet au modele de comprendre que 'il' se refere a 'chat' et non a 'tapis', en donnant un score d'attention eleve entre 'il' et 'chat'.",
            tip: "Le Multi-Head Attention repete le mecanisme avec des projections differentes (h tetes). Chaque tete peut apprendre un type de relation different: syntaxique, semantique, positionnelle. Les tetes sont concatenees puis projetees: c'est comme avoir plusieurs 'angles de vue' simultanes.",
            didYouKnow: "Le papier 'Attention Is All You Need' (2017) est le papier le plus cite de l'histoire recente de l'IA avec plus de 130 000 citations. Il a ete ecrit en quelques mois chez Google Brain par 8 auteurs, dont plusieurs sont partis fonder leurs propres startups d'IA (Adept, Character.ai, Cohere, etc.)."
        },
        backprop: {
            analogy: "Imagine une chaine de montage avec 10 postes. Le produit final a un defaut. La backpropagation remonte la chaine poste par poste pour attribuer a chacun sa part de responsabilite dans le defaut. Le poste qui a le plus contribue a l'erreur recevra la plus grosse correction. C'est exactement la regle de chaine du calcul differentiel appliquee a un graphe de calcul.",
            equation: "$$\\frac{\\partial \\mathcal{L}}{\\partial w}=\\frac{\\partial \\mathcal{L}}{\\partial y}\\frac{\\partial y}{\\partial w}$$",
            breakdown: [
                "L est la loss: la mesure d'erreur a la sortie du reseau.",
                "w est un poids quelque part dans le reseau: on veut savoir 'combien w a contribue a l'erreur'.",
                "y est une sortie intermediaire qui depend de w.",
                "∂L/∂y est le gradient de la loss par rapport a y: 'combien L change si y change'.",
                "∂y/∂w est le gradient local: 'combien y change si w change'.",
                "Le produit des deux donne ∂L/∂w: la responsabilite totale de w dans l'erreur — c'est la regle de chaine!"
            ],
            equationTerms: [
                { term: '∂L/∂w', meaning: "Le gradient de la loss par rapport au poids w: la direction et l'intensite de correction a appliquer a w." },
                { term: '∂L/∂y', meaning: "Le signal d'erreur en aval: combien la loss varie quand la sortie intermediaire y change." },
                { term: '∂y/∂w', meaning: "La sensibilite locale: combien la sortie y varie quand le poids w change." },
                { term: 'Regle de chaine', meaning: "Le principe: le gradient total est le produit des gradients locaux le long du chemin de calcul." }
            ],
            why: "La backpropagation est l'algorithme qui a rendu le deep learning possible. Sans elle, on ne pourrait pas entrainer des reseaux a millions de parametres. PyTorch, TensorFlow, JAX — tous implementent l'autograd (differentiation automatique) qui automatise la backpropagation pour n'importe quel graphe de calcul.",
            example: "loss.backward() dans PyTorch parcourt le graphe de calcul en sens inverse, appliquant la regle de chaine a chaque noeud pour calculer ∂L/∂w pour CHAQUE poids du reseau. Un GPT-3 avec 175 milliards de parametres calcule 175 milliards de gradients en une seule passe arriere!",
            tip: "Les problemes de gradient (vanishing, exploding) sont le defi central de la backpropagation en reseaux profonds. Les skip connections (ResNet), la normalisation (BatchNorm, LayerNorm), et les activations bien choisies (ReLU > sigmoid) sont des solutions architecturales a ce probleme mathematique.",
            didYouKnow: "La backpropagation a ete inventee independamment au moins 3 fois: par Seppo Linnainmaa (1970, sous le nom de 'differentiation automatique inverse'), par Paul Werbos (1974, dans sa these de doctorat), et popularisee par Rumelhart, Hinton & Williams (1986). Hinton lui-meme a dit que ca lui a pris des annees avant de comprendre que c'etait 'juste la regle de chaine'!"
        },
        ml_foundations: {
            analogy: "Le Machine Learning est comme apprendre a reconnaitre les chiens et les chats a partir de photos: au lieu de programmer des regles ('si oreilles pointues ET museau court ALORS chat'), on montre des milliers d'exemples etiquetes au modele, et il decouvre les regles tout seul. Le defi: qu'il apprenne des REGULARITES generales, pas qu'il memorise les photos d'entrainement.",
            equation: "$$\\hat{y}=f_\\theta(x),\\quad \\theta^*=\\arg\\min_\\theta\\mathcal{L}(\\theta)$$",
            breakdown: [
                "f_θ(x) est le modele parametrique: une fonction avec des parametres θ ajustables (poids du reseau).",
                "ŷ = f_θ(x) est la prediction: ce que le modele produit pour une entree x donnee.",
                "L(θ) est la loss: la mesure d'erreur entre les predictions ŷ et les vraies valeurs y.",
                "argmin_θ L(θ) cherche les parametres θ* qui minimisent la loss: le meilleur modele possible.",
                "En pratique, on approche ce minimum par descente de gradient iterative, pas par calcul exact."
            ],
            equationTerms: [
                { term: 'ŷ (y chapeau)', meaning: "La prediction du modele: l'estimation de la vraie valeur y." },
                { term: 'f_θ', meaning: "Le modele parametrique: une fonction dont le comportement est determine par les parametres θ." },
                { term: 'θ (theta)', meaning: "Les parametres du modele: les poids et biais qu'on ajuste pendant l'entrainement." },
                { term: 'θ* (theta etoile)', meaning: "Les parametres optimaux: ceux qui minimisent la loss sur les donnees." },
                { term: 'argmin', meaning: "L'operateur qui retourne les parametres realisant le minimum, pas la valeur du minimum." },
                { term: 'L(θ)', meaning: "La fonction de loss: mesure la qualite du modele (plus elle est basse, mieux c'est)." }
            ],
            why: "Cette equation resume TOUT le ML supervise: (1) choisir un modele f_θ, (2) definir une loss L, (3) optimiser θ pour minimiser L. Que ce soit une regression lineaire, un random forest, ou GPT-4, le schema est identique. Les differences sont dans le choix de f, L, et la methode d'optimisation.",
            example: "Regression lineaire: f_θ(x) = wx + b, L = Σ(y - ŷ)² (MSE). Random Forest: f = ensemble d'arbres, L = Gini/entropie. Reseau de neurones: f = couches empilees, L = cross-entropy. Meme schema, complexite croissante.",
            tip: "Le dilemme biais-variance est LA tension fondamentale du ML: un modele trop simple (haut biais) sous-apprend, un modele trop complexe (haute variance) sur-apprend. La regularisation (L1, L2, dropout) et la validation croisee sont tes outils pour trouver l'equilibre.",
            didYouKnow: "Arthur Samuel, qui a invente le terme 'Machine Learning' en 1959, a cree un programme de jeu de dames qui a battu un champion du Connecticut en 1962. Il a appris en jouant contre lui-meme des milliers de parties — une forme primitive de self-play, 54 ans avant AlphaGo!"
        },
        neural_pde: {
            analogy: "Dans un reseau classique, les donnees traversent des couches discretes: couche 1, couche 2, couche 3... Dans une Neural ODE, les donnees evoluent en CONTINU, comme un fluide qui s'ecoule. Au lieu de 'couche 5', on a 'temps t=0.5'. L'avantage: on peut choisir la precision apres coup, utiliser des solveurs adaptatifs, et le modele est naturellement inversible.",
            equation: "$$\\partial_t h = D\\nabla^2 h + f_\\theta(h,t)$$",
            breakdown: [
                "h est l'etat cache (le champ): il evolue dans le temps comme la temperature dans une barre de metal.",
                "∂_t h est la derivee temporelle: comment h change a chaque instant.",
                "D∇²h est le terme de diffusion: il 'lisse' h, comme la chaleur qui se repartit uniformement.",
                "f_θ(h,t) est le terme de reaction apprish par le reseau: il ajoute de la non-linearite et de la complexite.",
                "Ensemble: l'etat evolue sous l'effet combine de la diffusion (physique) et du reseau (appris)."
            ],
            equationTerms: [
                { term: '∂_t h', meaning: "La variation temporelle de l'etat: comment le champ h evolue au fil du temps." },
                { term: 'D', meaning: "Le coefficient de diffusion: controle la vitesse de lissage/propagation." },
                { term: '∇²h', meaning: "Le Laplacien de h: mesure combien h differe de sa moyenne locale (concavite spatiale)." },
                { term: 'f_θ(h,t)', meaning: "Le reseau de neurones parametrique: une correction apprise qui enrichit la dynamique physique." }
            ],
            why: "Les Neural ODE/PDE unifient deep learning et physique: on peut integrer des lois physiques connues (diffusion, conservation) dans le modele tout en apprenant les corrections inconnues. C'est la base du 'physics-informed ML' et des modeles de dynamique continue.",
            example: "DeepONet et Fourier Neural Operators apprennent a resoudre des EDP (equations de Navier-Stokes, Maxwell...) 1000x plus vite que les solveurs numeriques classiques. Ils sont utilises pour la simulation meteo, la dynamique des fluides, et la conception de materiaux.",
            tip: "Le solveur ODE (torchdiffeq.odeint) remplace les couches discretes. L'avantage: memoire constante O(1) via la methode adjointe (au lieu de O(L) pour L couches). L'inconvenient: le temps de calcul est moins predictible car le solveur adapte son pas.",
            didYouKnow: "Les modeles de diffusion (Stable Diffusion, DALL-E, Midjourney) sont mathematiquement des EDP stochastiques: ils ajoutent progressivement du bruit gaussien (processus de diffusion direct), puis apprennent a inverser ce processus (debruitage). L'image emerge du bruit comme un message secret revele par un filtre magique!"
        },
        free_energy: {
            analogy: "Le principe d'energie libre de Friston dit qu'un cerveau (ou un agent IA) cherche a minimiser sa 'surprise' — l'ecart entre ce qu'il predit et ce qu'il observe. C'est comme un thermostat ultra-intelligent: il a un modele interne du monde, il predit ce qui va arriver, et il ajuste soit ses croyances (perception) soit ses actions (comportement) pour que la realite colle a ses predictions.",
            equation: "$$F \\approx \\text{Complexite} - \\text{Precision}\\times\\text{Ajustement}$$",
            breakdown: [
                "F est l'energie libre variationnelle: une borne superieure sur la surprise (log-vraisemblance negative).",
                "Complexite mesure l'ecart entre le modele interne et les croyances a priori: le 'cout de mise a jour'.",
                "Precision mesure la confiance dans les observations: des donnees fiables ont une haute precision.",
                "Ajustement mesure combien le modele interne colle aux observations reelles.",
                "Minimiser F revient a trouver le meilleur compromis entre coller aux donnees et rester simple."
            ],
            equationTerms: [
                { term: 'F (energie libre)', meaning: "La quantite a minimiser: un proxy de la surprise que l'agent cherche a reduire." },
                { term: 'Complexite', meaning: "La KL-divergence entre posterior et prior: le cout de mettre a jour ses croyances." },
                { term: 'Precision', meaning: "L'inverse de la variance du bruit: haute precision = observations fiables." },
                { term: 'Ajustement', meaning: "L'adequation du modele interne aux donnees observees: data fit." }
            ],
            why: "Le Free Energy Principle unifie perception, apprentissage et action dans un meme cadre mathematique. Les VAE minimisent exactement cette energie libre. L'inference active (active inference) generalise le RL en termes de minimisation d'energie libre. C'est un candidat serieux pour une theorie unifiee de l'intelligence.",
            example: "Un VAE minimise F = KL(q(z|x) || p(z)) - E[log p(x|z)]. Le premier terme est la 'complexite' (rester proche du prior), le second est 'l'ajustement' (reconstruire les donnees). C'est exactement l'energie libre de Friston appliquee aux autoencodeurs!",
            tip: "Pour intuiter l'energie libre: un bon modele du monde doit etre (1) simple (faible complexite, prior raisonnable) et (2) precis (bon ajustement aux observations). C'est la version formelle du rasoir d'Occam: le modele le plus simple qui explique les donnees.",
            didYouKnow: "Karl Friston est le neuroscientifique vivant le plus cite au monde (plus de 300 000 citations). Son Free Energy Principle, propose en 2006, tente de deriver TOUTE la cognition d'un seul principe variationnel. Certains le comparent a la thermodynamique de l'esprit — d'autres disent que c'est trop beau pour etre vrai!"
        },
        action_flow: {
            analogy: "Le principe de moindre action est le 'GPS ultime' de la physique: parmi tous les chemins possibles entre A et B, la nature choisit toujours celui qui minimise une quantite appelee 'action'. En IA, le Flow Matching applique la meme idee: pour transformer du bruit en donnees, on cherche le chemin le plus court (le flux optimal) dans l'espace des distributions.",
            equation: "$$S=\\int L(q,\\dot q,t)\\,dt$$",
            breakdown: [
                "S est l'action: la quantite totale a minimiser le long de la trajectoire.",
                "L est le Lagrangien: la difference entre energie cinetique et potentielle (en physique), ou un cout local (en IA).",
                "q est la configuration du systeme: les coordonnees generalisees (position, etat latent).",
                "q̇ est la vitesse: le taux de changement de q dans le temps.",
                "∫dt integre le Lagrangien sur tout le trajet: on minimise le cout TOTAL, pas juste le cout local."
            ],
            equationTerms: [
                { term: 'S (action)', meaning: "La fonctionnelle a minimiser: elle mesure le 'cout total' d'une trajectoire entiere." },
                { term: 'L (Lagrangien)', meaning: "Le cout local instantane: en physique, L = T - V (cinetique moins potentielle)." },
                { term: 'q (configuration)', meaning: "L'etat du systeme a l'instant t: position, angle, etat latent..." },
                { term: 'q̇ (vitesse)', meaning: "La derivee temporelle de q: le taux de changement de la configuration." },
                { term: '∫ dt', meaning: "Integration temporelle: on accumule le cout local sur toute la duree du mouvement." }
            ],
            why: "Le Flow Matching (Lipman et al., 2023) est le successeur des modeles de diffusion: au lieu d'inverser un processus de bruit, il apprend directement le champ de vitesse v(x,t) qui transporte du bruit vers les donnees. C'est plus rapide, plus stable, et mathematiquement relie au principe de moindre action via le transport optimal.",
            example: "Stable Diffusion 3 utilise Flow Matching au lieu de la diffusion classique: le modele apprend un 'flux rectiligne' (rectified flow) qui transforme le bruit gaussien en image en suivant des trajectoires quasi-droites — plus rapide et meilleur que les trajectoires courbes de la diffusion.",
            tip: "Pour comprendre le Flow Matching, pense a un GPS qui calcule le chemin le plus court entre bruit et donnees. Le champ de vitesse v(x,t) est la direction a suivre a chaque point et chaque instant. Le reseau apprend ce champ de vitesse.",
            didYouKnow: "Le principe de moindre action a ete decouvert par Maupertuis en 1744, formalise par Euler et Lagrange, et generalise par Hamilton. Feynman l'a place au coeur de la physique quantique avec son integrale de chemin: la particule 'explore' tous les chemins possibles et seuls ceux pres du minimum d'action contribuent significativement!"
        },
        equivariance: {
            analogy: "L'equivariance dit: 'si je tourne l'image de 90 degres, la prediction doit tourner de 90 degres aussi'. C'est comme un traducteur qui preserverait la structure des phrases: tourner l'input = tourner l'output. Le theoreme de Noether relie chaque symetrie a une quantite conservee — en physique comme en IA, les symetries simplifient enormement les problemes.",
            equation: "$$f(T_g x)=T'_g f(x)$$",
            breakdown: [
                "T_g est une transformation du groupe G appliquee a l'input: rotation, translation, reflexion...",
                "f est le modele: il transforme des entrees en sorties.",
                "f(T_g x) signifie: transformer d'abord l'entree, puis appliquer le modele.",
                "T'_g f(x) signifie: appliquer le modele d'abord, puis transformer la sortie.",
                "L'equivariance exige que ces deux chemins donnent le MEME resultat."
            ],
            equationTerms: [
                { term: 'f', meaning: "Le modele equivariant: sa sortie 'suit' les transformations appliquees a l'entree." },
                { term: 'T_g', meaning: "La transformation d'entree: un element du groupe de symetrie G (ex: rotation de g degres)." },
                { term: "T'_g", meaning: "La transformation de sortie correspondante: comment la sortie doit changer en reponse." },
                { term: 'g ∈ G', meaning: "Un element du groupe de symetrie: le type et l'amplitude de la transformation." }
            ],
            why: "Les reseaux equivariants (E(n)-GNN, SE(3)-Transformers) exploitent les symetries physiques pour etre plus efficaces avec moins de donnees. AlphaFold 2 utilise des operations equivariantes SE(3) pour predire les structures de proteines. Encoder les bonnes symetries, c'est donner des 'raccourcis physiques' au modele.",
            example: "AlphaFold 2 utilise des SE(3)-Transformers: le reseau est equivariant aux rotations et translations 3D, ce qui signifie que la structure predite d'une proteine ne depend pas de son orientation initiale. Une propriete physiquement correcte encodee dans l'architecture!",
            tip: "Avant de construire un modele, demande-toi: quelles sont les symetries de mon probleme? Invariance par translation (CNN), par permutation (GNN, Transformers), par rotation (spherical CNN)? Encoder ces symetries reduit drastiquement le nombre de parametres necessaires.",
            didYouKnow: "Le theoreme de Noether (1918) prouve que chaque symetrie continue implique une loi de conservation: la symetrie temporelle donne la conservation de l'energie, la symetrie spatiale donne la conservation de la quantite de mouvement. Einstein a dit que Noether etait 'le genie mathematique le plus creatif depuis que les femmes ont acces a l'education superieure'."
        },
        attractors: {
            analogy: "Un attracteur est comme un entonnoir dans l'espace des etats: peu importe d'ou tu pars, les trajectoires convergent vers lui. Un attracteur etrange (chaotique) est un entonnoir fractal: les trajectoires y restent piégees mais ne se repetent jamais exactement. L'effet papillon dit que deux trajectoires quasi-identiques divergent exponentiellement — le chaos deterministe.",
            equation: "$$\\dot x=f(x)$$",
            breakdown: [
                "x est l'etat du systeme: un point dans l'espace des phases (ex: position + vitesse d'un pendule).",
                "ẋ = dx/dt est la derivee temporelle: comment l'etat change a chaque instant.",
                "f(x) est le champ vectoriel: en chaque point, il indique la direction et la vitesse de l'evolution.",
                "La trajectoire x(t) est la solution: elle suit le champ vectoriel a partir d'une condition initiale."
            ],
            equationTerms: [
                { term: 'ẋ (x point)', meaning: "La vitesse de changement de l'etat: la derivee temporelle dx/dt." },
                { term: 'x', meaning: "L'etat du systeme dynamique: un vecteur dans l'espace des phases." },
                { term: 'f(x)', meaning: "Le champ vectoriel: la 'regle d'evolution' qui determine la dynamique." }
            ],
            why: "Les systemes dynamiques sont au coeur des RNN (le hidden state evolue comme ẋ = f(x,u)), des Neural ODE, et de la theorie de la stabilite de l'entrainement (les attracteurs du paysage de loss). L'exposant de Lyapunov mesure la sensibilite aux conditions initiales — c'est lie au vanishing/exploding gradient.",
            example: "L'attracteur de Lorenz (le fameux 'papillon') est un systeme de 3 equations: ẋ = σ(y-x), ẏ = x(ρ-z)-y, ż = xy-βz. Avec σ=10, ρ=28, β=8/3, les trajectoires forment un attracteur etrange fractal. Un changement de 10⁻¹⁵ dans les conditions initiales donne des trajectoires completement differentes apres quelques dizaines d'iterations.",
            tip: "L'analyse de stabilite (valeurs propres du Jacobien ∂f/∂x autour des points fixes) te dit si un equilibre est stable (attracteur) ou instable (repulseur). En deep learning, ca te dit si l'entrainement converge ou diverge autour d'un minimum.",
            didYouKnow: "Edward Lorenz a decouvert le chaos en 1963 par accident: en relancant une simulation meteo avec des valeurs arrondies (3 decimales au lieu de 6), il a obtenu des resultats completement differents. Sa question celebre 'Un battement d'aile de papillon au Bresil peut-il provoquer une tornade au Texas?' a donne son nom a l'effet papillon."
        },
        hypergraphs: {
            analogy: "Un graphe classique relie des paires de noeuds. Un hypergraphe relie des GROUPES de noeuds en une seule hyper-arete: comme une reunion qui connecte 5 personnes en meme temps, pas juste des paires. Les hypergraphes emergents de Wolfram proposent que l'univers lui-meme emerge de regles simples appliquees repetitivement a un hypergraphe — la structure de l'espace-temps n'est pas donnee, elle EMERGE.",
            equation: "$$G_{t+1}=R(G_t)$$",
            breakdown: [
                "G_t est l'hypergraphe a l'etape t: un ensemble de noeuds et d'hyper-aretes.",
                "R est la regle de reecriture: elle transforme certains motifs locaux en nouveaux motifs.",
                "G_{t+1} est l'hypergraphe resultant apres application de la regle.",
                "En iterant, des structures complexes emergent de regles simples: le comportement macroscopique n'est pas programme, il apparait."
            ],
            equationTerms: [
                { term: 'G_t', meaning: "L'hypergraphe au temps t: un reseau de relations multi-noeud a un instant donne." },
                { term: 'R', meaning: "La regle de reecriture: une transformation locale qui modifie la structure de l'hypergraphe." },
                { term: 'G_{t+1}', meaning: "L'hypergraphe apres une etape: le resultat de l'application de la regle R." }
            ],
            why: "Les hypergraphes modelisent des relations d'ordre superieur: co-auteurs d'un papier (3+ personnes), reactions chimiques (multi-reactifs), circuits logiques. Les Hypergraph Neural Networks generalisent les GNN pour ces interactions de groupe, avec des applications en biologie (interactions proteiques) et chimie (synthese moleculaire).",
            example: "Le Wolfram Physics Project (2020) propose que l'univers est un hypergraphe qui evolue selon des regles simples. Remarquablement, les proprietes de la relativite generale et de la mecanique quantique emergent naturellement de certaines classes de regles — sans etre programmees!",
            tip: "Pour modeliser des interactions de groupe (pas juste pairwise), pense hypergraphe. En deep learning, les Hypergraph Transformers generalisent le message passing aux hyper-aretes: chaque noeud aggrege l'information de tous les groupes auxquels il appartient.",
            didYouKnow: "Stephen Wolfram, createur de Mathematica, a lance en 2020 un projet ambitieux pour decouvrir les 'regles fondamentales de la physique' via l'exploration computationnelle d'hypergraphes. Jonathan Gorard, son collaborateur, a montre que certaines proprietes de la relativite generale emergent naturellement de ces systemes!"
        },
        unified_stack: {
            analogy: "L'architecture 5 couches est comme un robot complet: (1) les yeux et oreilles (perception), (2) le modele interne du monde (dynamique), (3) le raisonnement (inference), (4) la prise de decision (planning), (5) les mains et jambes (action). Chaque couche peut etre implementee par differentes techniques, mais la structure reste la meme — c'est un template universel pour tout agent intelligent.",
            equation: "$$\\pi^*=\\arg\\min_\\pi\\;\\mathbb{E}[\\mathcal{C}(x,\\pi)]$$",
            breakdown: [
                "π est la politique de l'agent: la strategie qui decide quelle action prendre dans chaque situation.",
                "C(x, π) est le cout: la mesure de performance quand on applique la politique π dans le contexte x.",
                "E[...] est l'esperance: on moyenne le cout sur toutes les situations possibles.",
                "argmin_π cherche la politique optimale π* qui minimise le cout moyen.",
                "Les 5 couches travaillent ensemble pour realiser cette politique optimale."
            ],
            equationTerms: [
                { term: 'π* (politique optimale)', meaning: "La meilleure strategie possible: celle qui minimise le cout attendu sur toutes les situations." },
                { term: 'π (politique)', meaning: "Une regle de decision: pour chaque etat, elle prescrit une action ou une distribution sur les actions." },
                { term: 'E[·]', meaning: "L'esperance: la moyenne sur les etats, observations, et aleas de l'environnement." },
                { term: 'C(x, π)', meaning: "La fonction de cout: penalise les mauvaises decisions et recompense les bonnes." }
            ],
            why: "Cette architecture en 5 couches est le blueprint des agents IA les plus avances: un LLM avec RAG + outils + planning est une implementation partielle de cette stack. Les agents autonomes (AutoGPT, Devin, Claude) suivent ce pattern: percevoir le contexte, raisonner, planifier, agir, observer le resultat.",
            example: "Un agent Claude Code: (1) Perception: lit le code et les fichiers. (2) Dynamique: modele interne du code et de ses effets. (3) Inference: comprend le probleme et les contraintes. (4) Planning: elabore un plan d'action. (5) Action: edite les fichiers et execute les commandes.",
            tip: "Quand tu concois un agent IA, identifie explicitement ces 5 couches. Laquelle est le maillon faible? Souvent c'est la couche 2 (world model) ou 4 (planning) qui limite la performance — pas la perception ou l'action.",
            didYouKnow: "L'idee d'une architecture cognitive unifiee remonte a SOAR (1983) de Newell, Laird et Rosenbloom a Carnegie Mellon. 40 ans plus tard, les agents LLM redecouvrent les memes principes: memoire de travail, chunking, impasses et sub-goaling — mais avec la puissance des Transformers en plus!"
        },
        cnn_vision: {
            analogy: "Un CNN regarde une image comme un expert en puzzle: il detecte d'abord les petits motifs (bords, textures), puis les assemble en formes (yeux, roues), puis en objets (visage, voiture). Chaque couche de convolution est un filtre qui scanne toute l'image a la recherche d'un motif specifique. Les couches profondes detectent des concepts de plus en plus abstraits.",
            equation: "$$y_{ij}=\\sum_{m,n} x_{i+m,j+n}\\cdot k_{mn}+b$$",
            breakdown: [
                "x est l'image d'entree: une grille de pixels (ou de features d'une couche precedente).",
                "k est le kernel (filtre): une petite matrice (3×3, 5×5) qui detecte un motif specifique.",
                "Le filtre 'glisse' sur l'image: a chaque position (i,j), il calcule un produit scalaire local.",
                "b est le biais: un decalage constant ajoute au resultat de la convolution.",
                "y est la feature map: une nouvelle 'image' ou chaque pixel indique l'intensite du motif detecte."
            ],
            equationTerms: [
                { term: 'y_{ij}', meaning: "La valeur de la feature map en position (i,j): l'intensite du motif detecte a cet endroit." },
                { term: 'x_{i+m,j+n}', meaning: "Les pixels de l'image dans la zone receptive du filtre: le patch local analyse." },
                { term: 'k_{mn}', meaning: "Les poids du kernel: les coefficients du filtre qui definissent quel motif est detecte." },
                { term: 'Σ_{m,n}', meaning: "Somme sur les positions du kernel: le produit scalaire entre patch local et filtre." },
                { term: 'b', meaning: "Le biais: permet de decaler le seuil de detection du motif." }
            ],
            why: "Les CNN ont revolutionne la vision par ordinateur: ImageNet (2012, AlexNet), detection d'objets (YOLO, 2016), segmentation (U-Net). Meme si les Vision Transformers (ViT) les concurrencent, les CNN restent essentiels pour les applications a faible latence et les appareils mobiles.",
            example: "Le premier filtre d'un CNN apprend souvent des detecteurs de bords horizontaux, verticaux et diagonaux — tres similaires aux filtres de Sobel inventes dans les annees 1960. Le reseau redecouvre automatiquement ce que les ingenieurs avaient concu manuellement!",
            tip: "Les CNN exploitent deux proprietes cles: (1) localite spatiale — les motifs sont locaux, et (2) invariance par translation — un chat est un chat qu'il soit en haut a gauche ou en bas a droite de l'image. Ces inductive biases sont la raison de leur efficacite sur les images.",
            didYouKnow: "Le premier CNN (Neocognitron, Fukushima 1980) s'inspirait du cortex visuel des chats. Hubel et Wiesel avaient decouvert en 1962 que certains neurones du chat reagissent a des bords orientes specifiques — exactement comme les filtres de convolution! Leur decouverte leur a valu le prix Nobel en 1981."
        },
        rnn_sequences: {
            analogy: "Un RNN lit une sequence element par element, comme un humain qui lit un livre mot par mot. A chaque mot, il met a jour sa 'memoire' (le hidden state) qui resume tout ce qu'il a lu jusqu'ici. Le probleme: pour les longues sequences, les premiers mots sont 'oublies' (vanishing gradient). Les LSTM et GRU ajoutent des 'portes' qui controlent quelles informations garder ou oublier.",
            equation: "$$h_t=\\sigma(W_h h_{t-1}+W_x x_t+b)$$",
            breakdown: [
                "x_t est l'input au temps t: le mot, le prix, ou le signal a l'instant present.",
                "h_{t-1} est le hidden state precedent: le resume de tout ce qui s'est passe avant.",
                "W_x x_t projette l'input: l'information nouvelle est combinee avec...",
                "W_h h_{t-1} qui projette la memoire: l'information passee.",
                "σ est l'activation (tanh ou ReLU): elle compresse le resultat dans une plage bornee.",
                "h_t est le nouveau hidden state: la memoire mise a jour avec l'information presente."
            ],
            equationTerms: [
                { term: 'h_t', meaning: "Le hidden state au temps t: la 'memoire' du reseau, un vecteur qui resume la sequence vue." },
                { term: 'h_{t-1}', meaning: "Le hidden state precedent: la memoire avant d'avoir vu x_t." },
                { term: 'W_h', meaning: "La matrice de recurrence: comment la memoire passee est transformee." },
                { term: 'W_x', meaning: "La matrice d'input: comment l'information nouvelle est integree." },
                { term: 'x_t', meaning: "L'entree au temps t: l'element courant de la sequence." },
                { term: 'σ', meaning: "La fonction d'activation: introduit la non-linearite et borne les valeurs." }
            ],
            why: "Les RNN etaient le standard pour les sequences (texte, parole, series temporelles) avant les Transformers. Les LSTM/GRU restent utilises pour les applications temps-reel a faible latence. Comprendre les RNN aide a comprendre les problemes de gradient (vanishing/exploding) que les architectures modernes cherchent a resoudre.",
            example: "Quand tu dictes un message vocal et qu'il se transcrit en temps reel, c'est souvent un modele a base de RNN/LSTM (ou CTC) qui traite le signal audio sequentiellement, maintenant un contexte de ce qui a ete dit precedemment.",
            tip: "Si tes sequences depassent ~100-200 tokens, les RNN simples perdent le contexte du debut. Les LSTM/GRU aident (jusqu'a ~500-1000 tokens), mais les Transformers gagnent pour les longues sequences grace a l'attention qui connecte directement n'importe quels tokens, sans passer par un bottleneck de hidden state.",
            didYouKnow: "Le LSTM (Long Short-Term Memory) a ete invente par Sepp Hochreiter et Jurgen Schmidhuber en 1997, mais n'est devenu populaire qu'en 2014 — 17 ans plus tard! Hochreiter avait identifie le probleme du vanishing gradient dans sa these de 1991, ce qui l'a conduit a concevoir le LSTM avec ses fameuses 'portes' (forget gate, input gate, output gate)."
        },
        optimization: {
            analogy: "L'optimisation en deep learning, c'est comme chercher le point le plus bas d'un terrain montagneux dans le brouillard: tu ne vois que la pente a tes pieds (le gradient local), et tu descends pas a pas. SGD est la marche basique, Momentum ajoute de l'inertie (comme une bille qui roule), Adam combine inertie et adaptation du pas — le standard actuel.",
            equation: "$$\\theta_{t+1}=\\theta_t-\\eta_t\\,\\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t}+\\epsilon}$$",
            breakdown: [
                "θ_t sont les parametres courants du modele.",
                "m̂_t est la moyenne mobile exponentielle du gradient (le momentum): elle lisse les fluctuations.",
                "v̂_t est la moyenne mobile exponentielle du carre du gradient: elle mesure la 'variance' du gradient.",
                "m̂_t / √v̂_t adapte le pas par parametre: les parametres a gradient stable ont un grand pas, les instables un petit.",
                "η_t est le learning rate (possiblement schedled) et ε evite la division par zero."
            ],
            equationTerms: [
                { term: 'θ_{t+1}', meaning: "Les parametres mis a jour: le resultat apres un pas d'Adam." },
                { term: 'm̂_t (premier moment)', meaning: "L'estimation corrigee de la moyenne du gradient: donne la direction de descente lissee." },
                { term: 'v̂_t (second moment)', meaning: "L'estimation corrigee de la variance du gradient: adapte le pas par parametre." },
                { term: 'η_t (learning rate)', meaning: "Le taux d'apprentissage global: souvent decroissant avec un scheduler (cosine, warmup)." },
                { term: 'ε (epsilon)', meaning: "Un petit nombre (typ. 1e-8) pour la stabilite numerique: evite la division par zero." }
            ],
            why: "Le choix de l'optimiseur et de ses hyperparametres (learning rate, weight decay, scheduler) a souvent plus d'impact que le choix de l'architecture. Adam est le default, mais AdamW (avec weight decay decouple) est prefere pour les Transformers. Comprendre les optimiseurs, c'est comprendre comment le modele apprend.",
            example: "Le training recipe classique d'un Transformer: AdamW avec β₁=0.9, β₂=0.95, lr=3e-4 avec warmup lineaire pendant 2000 steps puis decay cosinus. Ces chiffres specifiques ont ete trouves empiriquement et sont devenus un standard communautaire.",
            tip: "Le learning rate est l'hyperparametre #1. Un bon reflexe: faire un learning rate finder (augmenter lr exponentiellement, observer ou la loss commence a diverger) puis choisir un lr 10x plus petit que ce point critique.",
            didYouKnow: "L'optimiseur Adam (Kingma & Ba, 2015) est le papier le plus utilise du deep learning moderne avec plus de 180 000 citations. Son nom signifie 'Adaptive Moment Estimation'. Fait surprenant: pour les LLM, on a recemment decouvert que l'ancien SGD avec momentum peut rivaliser avec Adam si on le tune bien — le debat continue!"
        },
        regularization: {
            analogy: "La regularisation est comme un coach qui empeche un athlete de se specialiser trop: 'ne memorise pas les exercices d'entrainement, apprends les mouvements generaux'. Le dropout eteint aleatoirement des neurones (comme remplacer des joueurs au hasard), le weight decay penalise les gros poids (comme limiter la masse musculaire), et l'early stopping arrete l'entrainement avant le surapprentissage.",
            equation: "$$\\mathcal{L}_{reg}=\\mathcal{L}_{data}+\\lambda\\|\\theta\\|_2^2$$",
            breakdown: [
                "L_data est la loss sur les donnees: mesure la qualite des predictions.",
                "‖θ‖₂² est la norme L2 des parametres: la somme des carres de tous les poids.",
                "λ est le coefficient de regularisation: il dose le compromis entre fit et simplicite.",
                "L_reg est la loss totale: le modele doit etre bon ET simple.",
                "Grand λ = modele simple (sous-fit possible). Petit λ = modele complexe (surfit possible)."
            ],
            equationTerms: [
                { term: 'L_reg', meaning: "La loss regularisee: le critere complet qui combine qualite de prediction et simplicite du modele." },
                { term: 'L_data', meaning: "La loss sur les donnees: cross-entropy, MSE, etc." },
                { term: 'λ (lambda)', meaning: "Le coefficient de regularisation: controle le trade-off biais/variance." },
                { term: '‖θ‖₂²', meaning: "La norme L2 au carre: penalise les poids de grande magnitude, favorisant des modeles 'plus lisses'." }
            ],
            why: "La regularisation est la reponse au probleme #1 du ML: l'overfitting. Dropout, weight decay, data augmentation, batch normalization, early stopping — toutes ces techniques visent a empecher le modele de memoriser le bruit des donnees d'entrainement et a favoriser la generalisation.",
            example: "Dropout(0.1) dans un Transformer eteint aleatoirement 10% des neurones a chaque forward pass pendant l'entrainement. Le reseau doit apprendre des representations redondantes et robustes — comme un etudiant qui revise avec differents partenaires au lieu de toujours les memes.",
            tip: "Pour les LLM, la regularisation principale est le VOLUME de donnees (pas le dropout ou weight decay): avec assez de donnees, le modele ne surfit pas car il n'a pas le temps de memoriser. C'est le regime 'chinchilla': plus de donnees, moins d'epochs.",
            didYouKnow: "Le dropout a ete invente par Geoffrey Hinton en 2012, inspire par... la reproduction sexuee! Hinton a raisonne que la recombinaison genetique empeche les genes de trop cooperer entre eux, forgant chacun a etre utile individuellement — exactement ce que dropout fait avec les neurones."
        },
        loss_functions: {
            analogy: "La loss function est le 'critique gastronomique' de ton modele: elle goute la prediction, la compare a la verite, et donne une note (un nombre). Plus le nombre est bas, meilleure est la prediction. Le gradient de la loss dit au chef (le modele) exactement QUOI ameliorer: 'plus de sel ici, moins de cuisson la'. Le choix de la loss determine ce que le modele optimise.",
            equation: "$$\\mathcal{L}_{CE}=-\\sum_{i=1}^{C} y_i\\log(\\hat{y}_i)$$",
            breakdown: [
                "C est le nombre de classes (categories possibles).",
                "y_i est la vraie etiquette (one-hot): y_i = 1 pour la bonne classe, 0 sinon.",
                "ŷ_i est la probabilite predite pour la classe i (sortie du softmax).",
                "log(ŷ_i) est le logarithme: il penalise severement les predictions confiantes mais fausses.",
                "-Σ ne somme en pratique que le terme de la bonne classe (les autres y_i = 0): L = -log(ŷ_correct).",
                "Minimiser L revient a maximiser la probabilite attribuee a la bonne reponse."
            ],
            equationTerms: [
                { term: 'L_CE', meaning: "La cross-entropy loss: la loss standard pour la classification multi-classes." },
                { term: 'C', meaning: "Le nombre de classes: les categories possibles du probleme de classification." },
                { term: 'y_i', meaning: "Le label one-hot: 1 pour la vraie classe, 0 pour les autres." },
                { term: 'ŷ_i', meaning: "La probabilite predite pour la classe i: sortie du softmax, entre 0 et 1." },
                { term: 'log(ŷ_i)', meaning: "Le logarithme: penalise exponentiellement les predictions proches de 0 pour la bonne classe." }
            ],
            why: "Le choix de la loss determine le COMPORTEMENT du modele: MSE pour la regression, cross-entropy pour la classification, contrastive loss pour les embeddings, REINFORCE pour le RL. Changer la loss change ce que le modele apprend — c'est le levier le plus puissant du ML engineer.",
            example: "La cross-entropy de -log(0.9) = 0.105, mais -log(0.1) = 2.302. Predire la bonne classe a 90% coute 20x moins cher que la predire a 10%. Cette asymetrie logarithmique force le modele a etre confiant sur les bonnes reponses.",
            tip: "Pour les datasets desequilibres (99% negatifs, 1% positifs), la cross-entropy standard est mauvaise: le modele peut predire 'negatif' pour tout et avoir 99% d'accuracy. Utilise la focal loss (Lin et al., 2017) qui down-weight les exemples faciles et se concentre sur les durs.",
            didYouKnow: "La cross-entropy vient de la theorie de l'information de Claude Shannon (1948). Elle mesure le nombre moyen de bits necessaires pour encoder un message si on utilise la distribution predite ŷ au lieu de la vraie distribution y. Minimiser la cross-entropy = trouver le meilleur code de compression!"
        },
        activation_functions: {
            analogy: "Les fonctions d'activation sont les 'filtres de decision' des neurones. Sans elles, un reseau de 100 couches se reduirait a une seule couche lineaire. ReLU (le plus utilise) est comme un interrupteur: il laisse passer les valeurs positives et bloque les negatives. GELU (utilise dans les Transformers) est un ReLU 'doux' avec une transition graduelle.",
            equation: "$$\\text{ReLU}(x)=\\max(0,x)$$",
            breakdown: [
                "Si x > 0, ReLU(x) = x: le signal passe tel quel.",
                "Si x ≤ 0, ReLU(x) = 0: le signal est bloque.",
                "C'est un seuil brutal a zero: la non-linearite la plus simple possible.",
                "La derivee est 1 pour x > 0 et 0 pour x < 0: le gradient passe ou est completement bloque."
            ],
            equationTerms: [
                { term: 'ReLU', meaning: "Rectified Linear Unit: l'activation standard du deep learning moderne." },
                { term: 'max(0, x)', meaning: "Le maximum entre 0 et x: laisse passer les positifs, bloque les negatifs." },
                { term: 'x', meaning: "La pre-activation: la sortie de la couche lineaire avant l'activation." }
            ],
            why: "Sans activation non-lineaire, empiler N couches lineaires = 1 seule couche (car la composition de fonctions lineaires est lineaire). Les activations sont ce qui donne au deep learning sa puissance d'approximation universelle: avec ReLU, un reseau a 1 couche cachee suffisamment large peut approximer n'importe quelle fonction continue.",
            example: "GPT utilise GELU (Gaussian Error Linear Unit): GELU(x) = x · Φ(x) ou Φ est la CDF de la gaussienne. Contrairement a ReLU qui a un 'coude' brutal en 0, GELU est lisse partout — ce qui aide l'optimisation dans les Transformers.",
            tip: "ReLU est le choix par defaut pour les CNN et MLP. GELU/SiLU pour les Transformers. Sigmoid/tanh uniquement pour les gates (LSTM) ou les sorties de probabilite. N'utilise JAMAIS sigmoid dans les couches cachees — le gradient s'evanouit tres vite!",
            didYouKnow: "Le theoreme d'approximation universelle (Cybenko, 1989) prouve qu'un reseau a une seule couche cachee avec activation sigmoide peut approximer n'importe quelle fonction continue a n'importe quelle precision. Mais en pratique, les reseaux PROFONDS (nombreuses couches) sont exponentiellement plus efficaces que les reseaux LARGES (une seule grande couche) — c'est la magie de la profondeur!"
        },
        normalization: {
            analogy: "La normalisation est comme un calibrateur automatique dans une chaine de production: a chaque etape, elle recentre et reechelonne les valeurs pour qu'elles restent dans une plage 'confortable'. Sans normalisation, les valeurs peuvent exploser ou s'ecraser au fil des couches, rendant l'entrainement instable.",
            equation: "$$\\hat{x}=\\frac{x-\\mu}{\\sigma}\\cdot\\gamma+\\beta$$",
            breakdown: [
                "μ est la moyenne des activations (sur le batch, la couche, ou les features selon la variante).",
                "σ est l'ecart-type des activations.",
                "(x - μ)/σ centre les valeurs a 0 et les met a l'echelle 1: c'est la standardisation.",
                "γ (gain) et β (biais) sont des parametres appris: ils permettent au reseau de 'defaire' la normalisation si necessaire.",
                "Le reseau apprend la meilleure echelle et le meilleur decalage pour chaque couche."
            ],
            equationTerms: [
                { term: 'x̂ (normalise)', meaning: "L'activation normalisee: centree, mise a l'echelle, puis ajustee par γ et β." },
                { term: 'μ (moyenne)', meaning: "La moyenne des activations, calculee sur une dimension specifique (batch, layer, group)." },
                { term: 'σ (ecart-type)', meaning: "L'ecart-type des activations: mesure de la dispersion." },
                { term: 'γ, β (gain et biais)', meaning: "Parametres appris: permettent au reseau de choisir l'echelle et le decalage optimaux." }
            ],
            why: "La normalisation est une des innovations les plus impactantes du deep learning: BatchNorm (2015) a permis d'entrainer des reseaux beaucoup plus profonds, LayerNorm est essentiel dans les Transformers, et RMSNorm est utilise dans LLaMA. Sans normalisation, GPT ne pourrait pas avoir 96 couches.",
            example: "Dans un Transformer: LayerNorm est applique avant ou apres chaque bloc d'attention et chaque FFN. La variante 'Pre-LN' (norm avant attention) est devenue le standard car elle stabilise mieux l'entrainement des gros modeles.",
            tip: "BatchNorm pour les CNN, LayerNorm pour les Transformers, GroupNorm quand le batch est petit (detection d'objets). RMSNorm est une simplification de LayerNorm (sans soustraire la moyenne) qui est 10-15% plus rapide — utilise dans LLaMA et Mistral.",
            didYouKnow: "BatchNorm (Ioffe & Szegedy, 2015) a ete presente comme une correction du 'internal covariate shift', mais des recherches ulterieures ont montre que ce n'etait probablement pas le vrai mecanisme. L'explication actuelle: BatchNorm lisse le paysage de loss, rendant l'optimisation plus facile. On utilise un outil super efficace sans comprendre completement pourquoi!"
        },
        duality: {
            analogy: "La dualite onde-corpuscule, c'est comme un acteur qui change de role selon la scene: dans l'experience des fentes de Young, la lumiere se comporte comme une onde (interferences). Mais quand on detecte photon par photon, elle se comporte comme une particule. Le test que tu choisis determine ce que tu observes — c'est la nature qui repond differemment selon la question posee.",
            equation: "$$I(y)\\propto\\left|\\psi_1(y)+\\psi_2(y)\\right|^2$$",
            breakdown: [
                "ψ₁(y) et ψ₂(y) sont les amplitudes de probabilite passant par chaque fente.",
                "ψ₁ + ψ₂ est la superposition: les deux chemins se combinent AVANT la detection.",
                "|...|² donne l'intensite observable: le module carre de la somme, pas la somme des modules carres.",
                "Les termes croises (interference) creent les franges: certains points s'annulent, d'autres se renforcent."
            ],
            equationTerms: [
                { term: 'I(y)', meaning: "L'intensite mesuree a la position y sur l'ecran: proportionnelle a la probabilite de detection." },
                { term: 'ψ₁(y), ψ₂(y)', meaning: "Les amplitudes complexes associees a chaque chemin (fente 1 et fente 2)." },
                { term: '|ψ₁ + ψ₂|²', meaning: "Le module carre de la somme: c'est ICI que naissent les interferences quantiques." }
            ],
            why: "La dualite est le premier choc conceptuel de la physique quantique. En informatique quantique, les qubits exploitent cette nature duale: ils sont 'les deux a la fois' (superposition) jusqu'a la mesure. Comprendre la dualite, c'est comprendre pourquoi un qubit est fondamentalement different d'un bit probabiliste.",
            example: "L'experience des fentes de Young avec des electrons: meme envoyes un par un, les electrons forment des franges d'interference apres des milliers d'impacts. Chaque electron interfere avec LUI-MEME en passant par les deux fentes simultanement!",
            tip: "Ne pense pas 'c'est une onde OU un corpuscule'. Pense: c'est un objet quantique qui se propage comme une onde (amplitude complexe) et se detecte comme une particule (clic dans un detecteur). La dualite est une propriete de l'objet, pas un choix humain.",
            didYouKnow: "En 1961, Claus Jonsson a realise l'experience des fentes de Young avec des electrons, confirmant leur nature ondulatoire. En 1989, Tonomura l'a fait electron par electron, montrant que les franges emergent statistiquement. En 2019, des chercheurs ont meme fait interferer des molecules de 2000 atomes — les plus gros objets jamais superposes!"
        },
        postulats: {
            analogy: "Les postulats quantiques sont les regles du jeu: (1) L'etat d'un systeme est un vecteur |ψ⟩ dans un espace de Hilbert. (2) Les observables sont des operateurs hermitiens. (3) La mesure projette l'etat et donne une valeur propre. (4) L'evolution temporelle est unitaire (equation de Schrodinger). Ces 4 regles suffisent a deduire TOUTE la mecanique quantique.",
            equation: "$$\\sum_i |c_i|^2=1$$",
            breakdown: [
                "|ψ⟩ = Σ cᵢ|i⟩ exprime l'etat comme superposition de la base {|i⟩}.",
                "cᵢ = ⟨i|ψ⟩ sont les amplitudes de probabilite: des nombres COMPLEXES.",
                "|cᵢ|² est la probabilite de mesurer le resultat i: un nombre reel entre 0 et 1.",
                "Σ|cᵢ|² = 1 est la normalisation: les probabilites doivent sommer a 1 (certitude)."
            ],
            equationTerms: [
                { term: 'cᵢ', meaning: "L'amplitude de probabilite pour l'etat |i⟩: un nombre complexe dont le module carre donne la probabilite." },
                { term: '|cᵢ|²', meaning: "La probabilite d'observer le resultat i lors d'une mesure." },
                { term: 'Σᵢ |cᵢ|² = 1', meaning: "La condition de normalisation: l'etat doit etre un vecteur unitaire dans l'espace de Hilbert." }
            ],
            why: "Les postulats sont le fondement axiomatique de tout le reste: qubits, portes, mesures, intrication, algorithmes quantiques. Sans les comprendre, on ne peut pas distinguer un vrai avantage quantique d'un buzzword marketing.",
            example: "Un qubit dans l'etat |ψ⟩ = (1/√2)|0⟩ + (1/√2)|1⟩ a des amplitudes c₀ = c₁ = 1/√2. La normalisation donne |1/√2|² + |1/√2|² = 1/2 + 1/2 = 1. La mesure donne |0⟩ ou |1⟩ chacun avec 50% de probabilite.",
            tip: "La cle: les amplitudes sont des nombres COMPLEXES (pas juste reels). La phase relative entre les amplitudes est ce qui permet l'interference — c'est la ressource fondamentale du calcul quantique.",
            didYouKnow: "Les postulats quantiques ont ete formalises progressivement entre 1925 (Heisenberg) et 1932 (von Neumann). Fait remarquable: en presque 100 ans, aucune experience n'a jamais contredit ces postulats. La mecanique quantique est la theorie physique la plus precisement testee de l'histoire — certaines predictions ont ete verifiees a 12 chiffres significatifs!"
        },
        hilbert: {
            analogy: "L'espace de Hilbert est la 'scene' sur laquelle se joue toute la mecanique quantique. C'est un espace vectoriel avec un produit scalaire (le bracket ⟨·|·⟩) qui permet de mesurer les angles et distances entre etats quantiques. Pour un qubit, c'est ℂ² (2 dimensions complexes); pour n qubits, c'est ℂ^(2ⁿ) — un espace dont la dimension double a chaque qubit ajoute.",
            equation: "$$\\lvert\\psi\\rangle=\\alpha\\lvert0\\rangle+\\beta\\lvert1\\rangle,\\;|\\alpha|^2+|\\beta|^2=1$$",
            breakdown: [
                "|0⟩ et |1⟩ forment la base computationnelle: les 'axes' de l'espace du qubit.",
                "α et β sont des amplitudes complexes: α = |α|e^(iφ_α), β = |β|e^(iφ_β).",
                "La superposition αe|0⟩ + β|1⟩ place le qubit 'entre' |0⟩ et |1⟩ sur la sphere de Bloch.",
                "|α|² + |β|² = 1 signifie que |ψ⟩ vit sur la sphere unitaire de ℂ²."
            ],
            equationTerms: [
                { term: '|ψ⟩ (ket psi)', meaning: "Le vecteur d'etat du qubit: un element de l'espace de Hilbert ℂ²." },
                { term: 'α, β', meaning: "Les amplitudes complexes: elles encodent a la fois probabilite (module) et phase (argument)." },
                { term: '|0⟩, |1⟩', meaning: "La base computationnelle: les deux etats de base du qubit, analogues a 0 et 1 classiques." },
                { term: '|α|² + |β|² = 1', meaning: "Normalisation: le vecteur d'etat a une norme de 1 dans l'espace de Hilbert." }
            ],
            why: "L'espace de Hilbert fournit la geometrie de l'information quantique. La dimension 2ⁿ pour n qubits est la raison du potentiel exponentiel du calcul quantique — et aussi la raison pour laquelle simuler un systeme quantique sur un ordinateur classique est exponentiellement couteux.",
            example: "10 qubits vivent dans un espace de dimension 2¹⁰ = 1024. 50 qubits: 2⁵⁰ ≈ 10¹⁵ dimensions. 300 qubits: 2³⁰⁰ ≈ 10⁹⁰ dimensions — plus que le nombre d'atomes dans l'univers observable! C'est pourquoi aucun supercalculateur classique ne peut simuler 300+ qubits.",
            tip: "La notation de Dirac (bra-ket) est un raccourci puissant: |ψ⟩ est un vecteur colonne (ket), ⟨ψ| est un vecteur ligne (bra), et ⟨φ|ψ⟩ est le produit scalaire. Maitriser cette notation rend toute la mecanique quantique plus lisible.",
            didYouKnow: "David Hilbert, qui a donne son nom a ces espaces, n'a jamais travaille sur la mecanique quantique! Ce sont John von Neumann et Paul Dirac qui ont realise que les espaces de Hilbert (definis par Hilbert en 1906 pour l'analyse fonctionnelle) etaient le cadre mathematique parfait pour la physique quantique."
        },
        operators: {
            analogy: "Un operateur quantique est comme un bouton sur un tableau de commande: il transforme l'etat du systeme. Les operateurs hermitiens (observables) representent les quantites mesurables: position, impulsion, energie. Leurs valeurs propres sont les resultats possibles de la mesure, et l'esperance ⟨A⟩ est la moyenne de ces resultats ponderee par les probabilites quantiques.",
            equation: "$$\\langle A\\rangle=\\langle\\psi|\\hat A|\\psi\\rangle$$",
            breakdown: [
                "Â est un operateur hermitien (Â = Â†): il represente une observable physique.",
                "|ψ⟩ est l'etat quantique du systeme.",
                "⟨ψ|Â|ψ⟩ est le 'sandwich' bra-operateur-ket: le produit scalaire de |ψ⟩ avec Â|ψ⟩.",
                "⟨A⟩ est la valeur moyenne de la mesure si on repete l'experience sur plein de copies identiques de |ψ⟩."
            ],
            equationTerms: [
                { term: '⟨A⟩', meaning: "La valeur d'expectation de l'observable A: la moyenne des resultats de mesure." },
                { term: 'Â (A chapeau)', meaning: "L'operateur hermitien associe a l'observable: ses valeurs propres sont les resultats possibles." },
                { term: '⟨ψ|', meaning: "Le bra: le conjugue transpose du ket |ψ⟩." },
                { term: '|ψ⟩', meaning: "Le ket: le vecteur d'etat du systeme quantique." }
            ],
            why: "Les operateurs sont le langage des transformations quantiques: les portes logiques sont des operateurs unitaires, les mesures projettent sur les espaces propres d'operateurs hermitiens. En QML, les 'observables' qu'on mesure a la sortie du circuit sont les predictions du modele quantique.",
            example: "Pour un qubit dans l'etat |+⟩ = (|0⟩+|1⟩)/√2, la valeur d'expectation du Pauli Z est ⟨+|Z|+⟩ = 0. Cela signifie que la mesure donne +1 et -1 avec la meme probabilite, donc la moyenne est nulle.",
            tip: "Les trois matrices de Pauli (σ_x, σ_y, σ_z) plus l'identite forment une base pour TOUT operateur 2×2. Tout operateur sur un qubit peut s'ecrire comme combinaison lineaire de ces quatre matrices — c'est l'equivalent quantique des coordonnees cartesiennes.",
            didYouKnow: "Le principe d'incertitude de Heisenberg (1927) decoule directement de la non-commutativite des operateurs: [X̂,P̂] = iℏ implique ΔX·ΔP ≥ ℏ/2. Ce n'est pas une limitation technologique — c'est une propriete FONDAMENTALE de la nature! Mesurer la position avec plus de precision rend necessairement l'impulsion plus incertaine."
        },
        linear_algebra: {
            analogy: "Le produit tensoriel ⊗ est l'outil qui combine deux systemes quantiques en un seul. C'est comme empiler deux jeux de cartes pour creer un jeu combine: si le systeme A a 2 etats et B a 3 etats, le systeme combine A⊗B a 2×3 = 6 etats. C'est cette multiplication des dimensions qui donne sa puissance au calcul quantique.",
            equation: "$$|ab\\rangle=|a\\rangle\\otimes|b\\rangle$$",
            breakdown: [
                "|a⟩ est l'etat du sous-systeme A (dimension d_A).",
                "|b⟩ est l'etat du sous-systeme B (dimension d_B).",
                "⊗ est le produit tensoriel: il combine les deux espaces en un seul de dimension d_A × d_B.",
                "|ab⟩ est un etat produit: chaque sous-systeme a un etat bien defini.",
                "Les etats NON-produit (qui ne s'ecrivent pas |a⟩⊗|b⟩) sont les etats intriques!"
            ],
            equationTerms: [
                { term: '|a⟩ ⊗ |b⟩', meaning: "Le produit tensoriel de deux etats: l'etat combine des deux sous-systemes." },
                { term: '⊗ (tenseur)', meaning: "L'operation de composition d'espaces: d_A × d_B dimensions dans l'espace combine." },
                { term: '|ab⟩', meaning: "Notation raccourcie pour |a⟩ ⊗ |b⟩: pratique mais peut masquer les subtilites." }
            ],
            why: "Le produit tensoriel est la raison pour laquelle n qubits vivent dans un espace de dimension 2ⁿ: chaque qubit ajoute un facteur ×2. C'est aussi la raison de l'intrication: les etats qui ne se factorisent pas en produit tensoriel sont intriques — la ressource cle du calcul quantique.",
            example: "2 qubits: espace de dim 4 (|00⟩, |01⟩, |10⟩, |11⟩). L'etat de Bell |Φ+⟩ = (|00⟩+|11⟩)/√2 ne peut PAS s'ecrire comme |a⟩⊗|b⟩ pour aucun |a⟩, |b⟩ — c'est un etat intrique.",
            tip: "En pratique, le produit tensoriel de matrices s'obtient par le produit de Kronecker. Pour simuler n qubits sur un ordinateur classique, les matrices font 2ⁿ×2ⁿ — c'est pourquoi la simulation classique est exponentiellement couteuse.",
            didYouKnow: "Le mot 'tenseur' a ete invente par William Rowan Hamilton en 1846, mais le produit tensoriel moderne a ete formalise par le mathematicien Hermann Grassmann. Fait amusant: en deep learning, les 'tenseurs' de PyTorch/TensorFlow ne sont PAS de vrais tenseurs au sens mathematique — ce sont des tableaux multidimensionnels (arrays). L'abus de langage est universel!"
        },
        groups: {
            analogy: "Un groupe capture les symetries d'un objet mathematique. C'est comme l'ensemble de tous les mouvements qui laissent un Rubik's Cube 'inchange' dans sa structure: rotations, inversions, compositions. En physique quantique, les groupes de symetrie (U(1), SU(2), SU(3)) dictent les lois de conservation et les interactions fondamentales.",
            equation: "$$U(\\theta)=e^{-i\\theta\\hat G}$$",
            breakdown: [
                "U(θ) est l'operateur unitaire parametre par θ: une transformation de symetrie.",
                "e^(−i...) est l'exponentielle de matrice: elle genere des rotations et transformations continues.",
                "θ est l'angle ou parametre de la transformation: 0 = identite, 2π = tour complet.",
                "Ĝ est le generateur du groupe: l'operateur hermitien dont l'exponentielle produit la symetrie."
            ],
            equationTerms: [
                { term: 'U(θ)', meaning: "L'operateur unitaire: une transformation qui preserve la norme (les probabilites restent valides)." },
                { term: 'e^{-iθĜ}', meaning: "L'exponentielle du generateur: la facon standard de construire une transformation continue." },
                { term: 'θ', meaning: "Le parametre de transformation: l'amplitude de la rotation ou du decalage." },
                { term: 'Ĝ (generateur)', meaning: "L'observable associee a la symetrie: par le theoreme de Noether, elle est conservee." }
            ],
            why: "En informatique quantique, toute porte logique est un element d'un groupe unitaire. Decomposer les circuits en termes de generateurs (Pauli, CNOT) est la base de la compilation de circuits. En QML, les circuits parametriques U(θ) sont les 'couches' du reseau quantique.",
            example: "La porte de rotation R_z(θ) = e^(-iθZ/2) tourne le qubit autour de l'axe Z de la sphere de Bloch d'un angle θ. Avec R_x, R_y et CNOT, on peut construire N'IMPORTE quelle transformation unitaire — c'est un jeu universel de portes.",
            tip: "L'algebre de Lie (les generateurs + leurs commutateurs) determine completement les proprietes du groupe. Pour SU(2), les generateurs sont les matrices de Pauli σ_x, σ_y, σ_z. Leurs commutateurs [σ_i, σ_j] = 2iε_{ijk}σ_k encodent la structure de toutes les rotations.",
            didYouKnow: "Le theoreme de Noether (1918) relie chaque symetrie continue a une loi de conservation: la symetrie U(1) donne la conservation de la charge electrique, SU(2) la conservation de l'isospin, et SU(3) la conservation de la charge de couleur. TOUTE la physique des particules (le Modele Standard) est construite sur les groupes de jauge U(1) × SU(2) × SU(3)!"
        },
        functional_analysis: {
            analogy: "L'analyse fonctionnelle, c'est decomposer un signal complexe en harmoniques simples, comme un equalizer decompose un son en frequences graves et aigues. En quantique, tout etat peut se decomposer sur une base propre d'un operateur: les coefficients de la decomposition donnent les amplitudes de probabilite pour chaque resultat de mesure.",
            equation: "$$f=\\sum_n c_n\\phi_n$$",
            breakdown: [
                "f est la fonction ou l'etat a decomposer.",
                "φₙ sont les fonctions de base (modes propres, harmoniques, fonctions propres d'un operateur).",
                "cₙ = ⟨φₙ|f⟩ sont les coefficients: la 'quantite' de chaque mode present dans f.",
                "La somme reconstruit f a partir de ses composantes: c'est une decomposition spectrale."
            ],
            equationTerms: [
                { term: 'f', meaning: "L'etat ou la fonction a decomposer: un element de l'espace de Hilbert." },
                { term: 'cₙ', meaning: "Les coefficients de Fourier generalises: la projection de f sur chaque mode φₙ." },
                { term: 'φₙ', meaning: "Les fonctions de base orthonormees: les 'briques elementaires' de la decomposition." }
            ],
            why: "La decomposition spectrale est au coeur de TOUT en quantique: mesurer un observable = decomposer l'etat sur sa base propre. En QML, l'encoding de donnees dans un circuit quantique utilise des decompositions spectrales. La transformee de Fourier quantique (QFT) est l'ingredient cle de l'algorithme de Shor.",
            example: "La Transformee de Fourier Quantique decompose un etat de n qubits en ses composantes frequentielles en O(n²) portes, contre O(n·2ⁿ) classiquement. C'est cette acceleration exponentielle qui rend la factorisation de Shor possible.",
            tip: "Tout operateur hermitien a une decomposition spectrale  = Σ λₙ |φₙ⟩⟨φₙ|. Les valeurs propres λₙ sont les resultats de mesure possibles, et les vecteurs propres |φₙ⟩ sont les etats post-mesure. C'est LA connexion entre algebre lineaire et physique quantique.",
            didYouKnow: "Joseph Fourier a propose sa fameuse decomposition en series en 1807 pour etudier la propagation de la chaleur. Les mathematiciens de l'epoque (Lagrange, Laplace) etaient sceptiques. Il a fallu attendre Dirichlet (1829) pour une preuve rigoureuse. 200 ans plus tard, la FFT (Fast Fourier Transform) est l'un des algorithmes les plus utilises en informatique!"
        },
        quantum_probability: {
            analogy: "La probabilite quantique est une extension radicale de la probabilite classique. Classiquement, on additionne des probabilites (nombres reels positifs). Quantiquement, on additionne des AMPLITUDES (nombres complexes) puis on prend le module carre. Cette difference minuscule — additionner des nombres complexes au lieu de reels — est la source de TOUTE la puissance quantique: interferences, intrication, avantage algorithmique.",
            equation: "$$P(i)=|\\langle i|\\psi\\rangle|^2$$",
            breakdown: [
                "⟨i|ψ⟩ est l'amplitude de probabilite: un nombre COMPLEXE.",
                "|...|² prend le module carre: on passe du complexe au reel positif.",
                "P(i) est la probabilite classique de mesurer le resultat i: un nombre entre 0 et 1.",
                "La difference avec le classique: les amplitudes interferent (constructivement ou destructivement) AVANT le |.|²."
            ],
            equationTerms: [
                { term: 'P(i)', meaning: "La probabilite de mesurer le resultat i: la prediction observable, toujours reelle et positive." },
                { term: '⟨i|ψ⟩', meaning: "L'amplitude de probabilite: un nombre complexe dont le module carre donne la probabilite." },
                { term: '|·|² (module carre)', meaning: "La regle de Born: la passerelle entre le monde quantique (amplitudes) et le monde classique (probabilites)." }
            ],
            why: "La regle de Born (P = |amplitude|²) est le pont entre theorie quantique et observation. En QML, les predictions du circuit quantique sont des probabilites obtenues en mesurant des qubits — chaque mesure applique cette regle. Comprendre les interferences d'amplitudes est cle pour concevoir des algorithmes quantiques efficaces.",
            example: "Interference destructive: si deux chemins ont des amplitudes +0.5 et -0.5, leur somme est 0, donc P = |0|² = 0. Classiquement, P = 0.25 + 0.25 = 0.5. L'annulation quantique permet d'eliminer les mauvaises reponses dans l'algorithme de Grover!",
            tip: "Rappelle-toi: les amplitudes sont comme des fleches dans le plan complexe. Elles s'additionnent vectoriellement. Si deux fleches pointent en sens oppose, elles s'annulent (interference destructive). Les algorithmes quantiques manipulent les phases pour que les bonnes reponses s'amplifient et les mauvaises s'annulent.",
            didYouKnow: "La regle de Born (1926) est le SEUL element non-deterministe de la mecanique quantique. Tout le reste (equation de Schrodinger, portes quantiques) est parfaitement deterministe. Einstein n'a jamais accepte cette regle: 'Dieu ne joue pas aux des'. Bohr aurait repondu: 'Einstein, arretez de dire a Dieu ce qu'il doit faire!'"
        },
        qubits: {
            analogy: "Un qubit est le bit quantique: la brique elementaire de l'information quantique. Contrairement au bit classique (0 OU 1), le qubit peut etre dans une superposition (α|0⟩ + β|1⟩) — il est 'les deux a la fois' jusqu'a la mesure. Sur la sphere de Bloch, chaque point represente un etat pur: le pole nord est |0⟩, le pole sud est |1⟩, et l'equateur contient les superpositions egales.",
            equation: "$$|\\psi\\rangle=\\cos\\frac{\\theta}{2}|0\\rangle+e^{i\\phi}\\sin\\frac{\\theta}{2}|1\\rangle$$",
            breakdown: [
                "θ est l'angle polaire sur la sphere de Bloch: il controle les probabilites (θ=0 → |0⟩, θ=π → |1⟩).",
                "φ est l'angle azimutal: il controle la phase relative entre |0⟩ et |1⟩.",
                "cos(θ/2) et sin(θ/2) donnent les modules des amplitudes: ils determinent P(0) = cos²(θ/2) et P(1) = sin²(θ/2).",
                "e^(iφ) est le facteur de phase: invisible dans une seule mesure, mais crucial pour les interferences."
            ],
            equationTerms: [
                { term: 'θ (angle polaire)', meaning: "Controle le ratio de probabilite entre |0⟩ et |1⟩: 0 = certainement |0⟩, π = certainement |1⟩." },
                { term: 'φ (angle azimutal)', meaning: "La phase relative: invisible a la mesure Z, mais essentielle pour les interferences et portes." },
                { term: 'cos(θ/2), sin(θ/2)', meaning: "Les amplitudes reelles: le θ/2 (pas θ) vient de la representation spinorielle SU(2)." },
                { term: 'e^{iφ}', meaning: "Le facteur de phase complexe: un point sur le cercle unite dans le plan complexe." }
            ],
            why: "Le qubit est le fondement de l'informatique quantique. Comprendre sa geometrie (sphere de Bloch) et ses 2 degres de liberte (θ et φ) est essentiel pour comprendre les portes, les circuits, et les algorithmes quantiques.",
            example: "L'etat |+⟩ = (|0⟩+|1⟩)/√2 est a l'equateur de la sphere de Bloch (θ=π/2, φ=0). L'etat |−⟩ = (|0⟩−|1⟩)/√2 est aussi a l'equateur mais oppose (θ=π/2, φ=π). Les deux donnent 50/50 en mesure Z, mais ils sont orthogonaux — la phase φ fait toute la difference!",
            tip: "Une mesure Z (la mesure standard) ne revele que θ, pas φ. Pour 'voir' la phase, il faut d'abord appliquer une porte Hadamard puis mesurer — c'est une mesure dans la base X. Differentes bases de mesure revelent differentes informations sur le qubit.",
            didYouKnow: "Le terme 'qubit' a ete invente par Benjamin Schumacher en 1995 (par analogie avec 'bit'). Aujourd'hui, Google et IBM disposent de processeurs a 1000+ qubits physiques, mais a cause du bruit, seuls quelques dizaines de qubits logiques (corriges d'erreurs) sont utilisables. Le ratio qubit physique/logique est actuellement d'environ 1000:1!"
        },
        gates: {
            analogy: "Les portes quantiques sont les instructions elementaires d'un ordinateur quantique, comme AND, OR, NOT sont celles d'un ordinateur classique. Mais les portes quantiques sont REVERSIBLES (unitaires): chaque operation peut etre 'defaite'. La porte Hadamard cree des superpositions, CNOT cree de l'intrication, et les portes de rotation ajustent les amplitudes avec precision.",
            equation: "$$|\\psi'\\rangle=U|\\psi\\rangle,\\;U^\\dagger U=I$$",
            breakdown: [
                "U est une matrice unitaire: une transformation qui preserve la norme (les probabilites restent valides).",
                "|ψ⟩ est l'etat d'entree: l'etat du qubit avant la porte.",
                "U|ψ⟩ = |ψ'⟩ est l'etat de sortie: le qubit transforme par la porte.",
                "U†U = I (unitarite): U est inversible et son inverse est son adjoint U†."
            ],
            equationTerms: [
                { term: 'U', meaning: "La matrice unitaire de la porte: elle definit completement la transformation." },
                { term: 'U†', meaning: "L'adjoint (conjugue transpose) de U: c'est aussi l'inverse de U pour les matrices unitaires." },
                { term: 'I (identite)', meaning: "La matrice identite: UU† = U†U = I confirme que U est reversible." },
                { term: '|ψ⟩ → |ψ\'⟩', meaning: "La transformation d'etat: le qubit passe de l'etat initial a l'etat final." }
            ],
            why: "Les portes quantiques sont les briques de tout algorithme quantique. Un jeu universel (ex: {H, T, CNOT}) peut approximer n'importe quelle transformation unitaire — c'est l'equivalent quantique de la completude de Turing. En QML, les portes parametriques R(θ) sont les 'poids' qu'on optimise.",
            example: "Porte Hadamard: H|0⟩ = (|0⟩+|1⟩)/√2 — cree une superposition egale. CNOT: bascule le qubit cible si le controle est |1⟩ — cree de l'intrication. Ensemble: H sur qubit 1, puis CNOT(1,2) cree l'etat de Bell (|00⟩+|11⟩)/√2.",
            tip: "Toute porte a 1 qubit est une rotation sur la sphere de Bloch. Les 3 portes de Pauli (X, Y, Z) sont des rotations de π autour des axes x, y, z. X = NOT quantique, Z = porte de phase, H = rotation de π autour de l'axe (x+z)/√2.",
            didYouKnow: "Le theoreme de Solovay-Kitaev (1997) prouve qu'on peut approximer n'importe quelle porte a 1 qubit avec une precision ε en utilisant seulement O(log^c(1/ε)) portes d'un jeu fini. C'est remarquablement efficace: pour atteindre 10⁻¹⁰ de precision, il suffit d'environ 100 portes!"
        },
        measurement: {
            analogy: "La mesure quantique est l'acte irreversible qui transforme un etat superpose en un resultat classique. C'est comme ouvrir la boite de Schrodinger: avant la mesure, le chat est dans une superposition; apres, il est definitvement vivant ou mort. La mesure 'effondre' la superposition sur un des resultats possibles, avec des probabilites dictees par les amplitudes.",
            equation: "$$P(m)=\\langle\\psi|\\Pi_m|\\psi\\rangle$$",
            breakdown: [
                "Π_m est le projecteur associe au resultat m: il selectionne la composante de |ψ⟩ correspondant a m.",
                "⟨ψ|Π_m|ψ⟩ est la probabilite du resultat m: la norme carree de la projection.",
                "Apres mesure du resultat m, l'etat s'effondre: |ψ⟩ → Π_m|ψ⟩/√P(m).",
                "La mesure est IRREVERSIBLE: l'information sur les autres composantes est perdue."
            ],
            equationTerms: [
                { term: 'P(m)', meaning: "La probabilite d'obtenir le resultat m: un nombre entre 0 et 1." },
                { term: 'Π_m', meaning: "Le projecteur sur le sous-espace associe au resultat m: Π_m² = Π_m et Σ_m Π_m = I." },
                { term: '⟨ψ|Π_m|ψ⟩', meaning: "La valeur d'expectation du projecteur: egale a la probabilite du resultat." }
            ],
            why: "La mesure est l'interface entre le monde quantique et le monde classique. En QML, on mesure les qubits de sortie pour obtenir les predictions du modele. Le choix de QUOI mesurer (quelle base, quels qubits) est une decision de design cruciale qui affecte directement la qualite des resultats.",
            example: "Mesurer |+⟩ = (|0⟩+|1⟩)/√2 dans la base Z donne |0⟩ ou |1⟩ avec 50/50. Mais mesurer dans la base X donne |+⟩ avec certitude (100%). La meme etat, deux resultats completement differents selon la base de mesure choisie!",
            tip: "En informatique quantique, on ne peut mesurer qu'une seule fois (la mesure detruit la superposition). Pour estimer une probabilite avec precision ε, il faut repeter le circuit ~1/ε² fois. C'est le 'cout d'echantillonnage' — la limite pratique majeure des algorithmes quantiques.",
            didYouKnow: "Le 'probleme de la mesure' est le plus grand mystere ouvert de la physique quantique. Personne ne sait exactement POURQUOI la mesure provoque l'effondrement de la fonction d'onde. Les interpretations rivales (Copenhague, mondes multiples, decoherence, QBism) sont toutes mathematiquement compatibles avec les experiences — le debat dure depuis 1927!"
        },
        schrodinger: {
            analogy: "L'equation de Schrodinger est le 'moteur' de l'evolution quantique: elle dit exactement comment un etat quantique change dans le temps. L'hamiltonien Ĥ joue le role de metronome: il determine la vitesse et la direction de l'evolution. Un hamiltonien constant fait tourner l'etat sur la sphere de Bloch; un hamiltonien qui varie dans le temps peut creer des transitions complexes.",
            equation: "$$i\\hbar\\partial_t|\\psi\\rangle=\\hat H|\\psi\\rangle$$",
            breakdown: [
                "i est l'unite imaginaire: sa presence garantit que l'evolution est unitaire (preserve les probabilites).",
                "ℏ (h-barre) est la constante de Planck reduite: elle fixe l'echelle de l'energie quantique.",
                "∂_t|ψ⟩ est la derivee temporelle de l'etat: comment |ψ⟩ change a chaque instant.",
                "Ĥ est l'hamiltonien: l'operateur d'energie totale du systeme, il dicte la dynamique.",
                "La solution est |ψ(t)⟩ = e^(-iĤt/ℏ)|ψ(0)⟩: une rotation unitaire dans l'espace de Hilbert."
            ],
            equationTerms: [
                { term: 'i (imaginaire)', meaning: "L'unite imaginaire: sa presence rend l'evolution unitaire et preservatrice de probabilites." },
                { term: 'ℏ (h-barre)', meaning: "La constante de Planck reduite ≈ 1.055 × 10⁻³⁴ J·s: l'echelle fondamentale du quantique." },
                { term: '∂_t|ψ⟩', meaning: "La variation temporelle de l'etat: la vitesse d'evolution du vecteur d'etat." },
                { term: 'Ĥ (hamiltonien)', meaning: "L'operateur d'energie: il encode la dynamique du systeme et determine son evolution." }
            ],
            why: "L'equation de Schrodinger gouverne TOUTE evolution quantique fermee. En informatique quantique, appliquer une porte U pendant un temps t revient a resoudre cette equation avec un hamiltonien choisi. La simulation hamiltonienne (simuler l'evolution de Schrodinger pour des systemes physiques) est l'application la plus prometteuse du calcul quantique.",
            example: "Un qubit dans un champ magnetique B evolue sous Ĥ = -γBσ_z/2: il precesse autour de l'axe Z a une frequence proportionnelle a B. C'est exactement ce qu'exploitent les IRM medicales — la resonance magnetique nucleaire est de la mecanique quantique en action!",
            tip: "Pour un hamiltonien constant, la solution est toujours |ψ(t)⟩ = e^(-iĤt/ℏ)|ψ(0)⟩. Pour un hamiltonien dependant du temps, il faut des methodes numeriques (Trotter-Suzuki, Magnus expansion). La simulation de l'evolution temporelle est l'un des problemes les plus etudies en informatique quantique.",
            didYouKnow: "Schrodinger a formule son equation en 1926 pendant des vacances de Noel a Arosa (Suisse) avec une maitresse dont l'identite reste inconnue. En quelques semaines, il a produit une des equations les plus fondamentales de la physique. Il a aussi invente le celebre paradoxe du 'chat de Schrodinger' en 1935 — ironiquement, pour montrer l'ABSURDITE de la superposition a grande echelle!"
        },
        circuits: {
            analogy: "Un circuit quantique est une recette de cuisine quantique: on prepare les ingredients (initialisation des qubits a |0⟩), on applique des operations dans l'ordre (portes quantiques), et on goute le resultat (mesure). Comme une recette, l'ORDRE des operations compte enormement — inverser deux portes change generalement le resultat.",
            equation: "$$|\\psi_{out}\\rangle=U_L\\cdots U_2U_1|\\psi_{in}\\rangle$$",
            breakdown: [
                "|ψ_in⟩ est l'etat initial: typiquement |00...0⟩ (tous les qubits a zero).",
                "U₁ est la premiere porte appliquee, U₂ la deuxieme, etc.",
                "Les portes s'appliquent de droite a gauche: U₁ agit en premier.",
                "|ψ_out⟩ est l'etat final: il encode la reponse qu'on extrait par mesure.",
                "La profondeur du circuit (nombre de couches L) determine le temps de calcul et la sensibilite au bruit."
            ],
            equationTerms: [
                { term: '|ψ_out⟩', meaning: "L'etat de sortie: le resultat du calcul quantique, a mesurer pour obtenir la reponse." },
                { term: 'U_L···U_2 U_1', meaning: "La composition des portes: appliquees sequentiellement de droite a gauche." },
                { term: '|ψ_in⟩', meaning: "L'etat initial: generalement |0⟩^⊗n, l'etat de base de n qubits." }
            ],
            why: "Le modele de circuit est le paradigme dominant de l'informatique quantique. Tout algorithme quantique (Shor, Grover, VQE) s'exprime comme un circuit. La 'compilation' d'un algorithme en portes natives du hardware est un defi majeur: chaque processeur quantique a son propre jeu de portes.",
            example: "L'algorithme de Grover pour chercher dans une base de donnees de N elements utilise un circuit de profondeur O(√N): √N iterations d'un 'oracle' suivi d'un 'amplificateur'. Pour N = 1 million, Grover necessite ~1000 iterations au lieu de 1 million classiquement.",
            tip: "La profondeur du circuit est le facteur limitant sur le hardware actuel (bruyant). Chaque porte ajoute du bruit, donc les circuits courts sont meilleurs. L'objectif des algorithmes NISQ (Noisy Intermediate-Scale Quantum) est de resoudre des problemes utiles avec des circuits peu profonds.",
            didYouKnow: "Le premier circuit quantique sur hardware reel a ete execute en 1998 par Isaac Chuang sur un ordinateur quantique a 2 qubits utilisant la RMN (resonance magnetique nucleaire). Aujourd'hui, IBM met a disposition des circuits de 1000+ qubits sur le cloud — accessible gratuitement via Qiskit!"
        },
        algorithms: {
            analogy: "Les algorithmes quantiques exploitent les interferences pour amplifier les bonnes reponses et annuler les mauvaises. L'algorithme de Grover est une 'loupe quantique': il amplifie l'amplitude de la bonne reponse en O(√N) etapes au lieu de N. L'algorithme de Shor factorise les grands nombres en temps polynomial — menacant RSA.",
            equation: "$$\\mathcal{O}(\\sqrt{N})\\;\\text{(Grover)}$$",
            breakdown: [
                "N est la taille de l'espace de recherche: le nombre d'elements possibles.",
                "Classiquement, trouver un element marque necessite O(N) essais (recherche lineaire).",
                "Grover trouve l'element en O(√N) essais: une acceleration quadratique.",
                "Cette acceleration vient de l'amplification d'amplitude: a chaque iteration, la probabilite de la bonne reponse augmente."
            ],
            equationTerms: [
                { term: 'O(√N)', meaning: "La complexite de Grover: racine carree du nombre d'elements — quadratiquement plus rapide que le classique." },
                { term: 'N', meaning: "La taille de l'espace de recherche: le nombre total d'elements a examiner." }
            ],
            why: "Les algorithmes quantiques sont la raison d'etre de l'informatique quantique. Shor (factorisation en temps polynomial) menace la cryptographie RSA. Grover (recherche en √N) accelere les recherches non structurees. Les algorithmes variationnels (VQE, QAOA) sont les candidats NISQ les plus prometteurs.",
            example: "Factoriser un nombre de 2048 bits avec un algorithme classique prendrait des milliards d'annees. Avec l'algorithme de Shor et un ordinateur quantique suffisamment grand (~4000 qubits logiques), cela prendrait quelques heures. C'est pourquoi la cryptographie post-quantique est un sujet brulant!",
            tip: "Ne surestimez pas l'avantage quantique: Grover ne donne 'que' une acceleration quadratique (pas exponentielle). L'avantage exponentiel de Shor est specifique a la factorisation et aux problemes a structure algebrique. Pour les problemes generiques, l'avantage quantique est souvent modeste.",
            didYouKnow: "Peter Shor a invente son algorithme de factorisation en 1994 chez Bell Labs, provoquant une onde de choc dans le monde de la cryptographie. Le premier nombre factorise par un ordinateur quantique reel (15 = 3 × 5) ne l'a ete qu'en 2001. En 2023, le record est la factorisation de 48-bit numbers — on est encore tres loin de menacer RSA-2048!"
        },
        qml: {
            analogy: "Le Quantum Machine Learning utilise des circuits quantiques parametriques comme 'reseaux de neurones quantiques'. Au lieu de poids matriciels, on a des angles de rotation θ de portes quantiques. L'entrainement ajuste ces angles pour minimiser une loss — exactement comme en deep learning classique, mais sur du hardware quantique.",
            equation: "$$\\theta^*=\\arg\\min_\\theta\\,\\mathcal{L}(\\langle O\\rangle_\\theta)$$",
            breakdown: [
                "θ sont les parametres du circuit quantique: les angles des portes de rotation.",
                "⟨O⟩_θ est la valeur d'expectation d'un observable O pour le circuit parametre par θ: c'est la prediction.",
                "L(⟨O⟩_θ) est la loss: elle compare la prediction quantique a la cible.",
                "argmin_θ cherche les angles optimaux: on utilise un optimiseur classique (Adam, COBYLA) pour ajuster θ."
            ],
            equationTerms: [
                { term: 'θ* (angles optimaux)', meaning: "Les parametres de portes qui minimisent la loss: l'equivalent quantique des poids optimaux." },
                { term: '⟨O⟩_θ', meaning: "La valeur d'expectation: la prediction du circuit quantique, mesuree en moyennant sur plusieurs executions." },
                { term: 'L (loss)', meaning: "La fonction de cout: MSE, cross-entropy, ou toute loss classique appliquee a la prediction quantique." }
            ],
            why: "Le QML est le pont entre informatique quantique et IA. L'espoir: les circuits quantiques pourraient apprendre des fonctions que les reseaux classiques ne peuvent pas representer efficacement — un 'avantage quantique' pour l'apprentissage. En pratique, l'avantage reste a demontrer pour des problemes reels.",
            example: "Un circuit variationnel pour classification: (1) encoder les features dans des rotations R_x(x_i), (2) appliquer des couches d'intrication (CNOT) + rotations parametriques R_y(θ_i), (3) mesurer un qubit de sortie, (4) la probabilite P(|1⟩) est la prediction de classe.",
            tip: "Le 'barren plateau' est le defi #1 du QML: pour des circuits aleatoires profonds, les gradients tendent vers zero exponentiellement avec le nombre de qubits. Solutions: circuits peu profonds, initialisation structuree, encodage adapte aux donnees.",
            didYouKnow: "Le terme 'Quantum Machine Learning' a explose apres 2014 (papier de Rebentrost, Mohseni & Lloyd sur le HHL pour les moindres carres). Mais le debat sur l'avantage quantique reel pour le ML est intense: en 2022, plusieurs papiers ont montre que des methodes classiques 'dequantisees' atteignent souvent les memes performances!"
        },
        hybrid_models: {
            analogy: "Un modele hybride classique-quantique combine le meilleur des deux mondes: le classique prepare les donnees et optimise, le quantique effectue les transformations couteuses, et le classique interprete les resultats. C'est comme un sandwich: pain classique, garniture quantique, pain classique.",
            equation: "$$y=f_{cl}(U_\\theta(x))$$",
            breakdown: [
                "x est l'input classique: les donnees ou features.",
                "U_θ est le circuit quantique parametre: il transforme x en un etat quantique mesurable.",
                "La mesure du circuit donne un vecteur de probabilites ou d'expectation values.",
                "f_cl est un post-traitement classique (MLP, softmax): il transforme les resultats quantiques en prediction finale."
            ],
            equationTerms: [
                { term: 'y', meaning: "La prediction finale: un resultat classique (classe, valeur continue, etc.)." },
                { term: 'f_cl', meaning: "Le post-traitement classique: couche dense, softmax, ou tout traitement classique." },
                { term: 'U_θ(x)', meaning: "Le circuit quantique: encode les donnees, applique des portes parametriques, et est mesure." }
            ],
            why: "Les modeles hybrides sont l'approche dominante du QML actuel (ere NISQ): les ordinateurs quantiques sont trop petits et bruyants pour fonctionner seuls. Le classique compense les limitations du quantique, et le quantique apporte (potentiellement) une expressivite supplementaire.",
            example: "PennyLane (Xanadu) et Qiskit Machine Learning (IBM) permettent d'inserer des circuits quantiques dans des pipelines PyTorch/TensorFlow comme des couches classiques. Les gradients traversent le circuit quantique via le 'parameter shift rule'.",
            tip: "Le 'parameter shift rule' est l'equivalent quantique de la backpropagation: pour estimer le gradient ∂L/∂θ_i, on execute le circuit avec θ_i + π/2 et θ_i − π/2, et on fait la difference. Simple mais couteux: 2 executions du circuit par parametre!",
            didYouKnow: "Le VQE (Variational Quantum Eigensolver, Peruzzo 2014) est le premier algorithme hybride a avoir ete demontre experimentalement pour un probleme de chimie (molecule H₂). Depuis, des equipes ont simule des molecules allant jusqu'a H₂O et LiH. L'objectif ultime: simuler la catalyse enzymatique et la conception de medicaments!"
        },
        qft: {
            analogy: "La theorie quantique des champs (QFT) est l'extension de la mecanique quantique aux systemes avec un nombre INFINI de degres de liberte. Au lieu de quantifier une particule, on quantifie un CHAMP: chaque point de l'espace a son propre 'oscillateur quantique'. Les particules emergent comme des excitations (vibrations) du champ — comme les notes emergent de la vibration d'une corde de guitare.",
            equation: "$$[\\hat\\phi(x),\\hat\\pi(y)]=i\\hbar\\delta(x-y)$$",
            breakdown: [
                "φ̂(x) est l'operateur de champ au point x: la quantification du champ classique.",
                "π̂(y) est le moment conjugue au point y: l'analogue de l'impulsion.",
                "[·,·] est le commutateur: il encode les relations d'incertitude entre champ et moment.",
                "iℏδ(x-y) dit que le champ et le moment au MEME point ne commutent pas (incertitude), mais en des points differents, si."
            ],
            equationTerms: [
                { term: 'φ̂(x)', meaning: "L'operateur de champ: la valeur quantifiee du champ au point spatial x." },
                { term: 'π̂(y)', meaning: "Le moment conjugue du champ: l'equivalent quantique de la vitesse de variation du champ." },
                { term: '[·,·] = iℏδ(x-y)', meaning: "Les relations de commutation canoniques: le fondement de la quantification des champs." }
            ],
            why: "La QFT est le cadre theorique le plus abouti de la physique: le Modele Standard (electromagnetisme, force faible, force forte) est une QFT. En informatique quantique, simuler des QFT est l'une des applications les plus prometteuses — car les methodes classiques (lattice QCD) sont extremement couteuses.",
            example: "La simulation de la QCD (chromodynamique quantique) sur reseau est l'un des plus gros consommateurs de supercalcul au monde. Un ordinateur quantique pourrait simuler ces systemes exponentiellement plus vite, ouvrant la porte a la prediction precise des proprietes du proton.",
            tip: "Pour le QML, la QFT est moins directement utile. Mais les concepts de 'champs' et 'particules comme excitations' inspirent les architectures: les reseaux de neurones quantiques sur reseau (lattice QNNS) sont un domaine de recherche actif.",
            didYouKnow: "La QFT predit que le vide n'est pas 'vide' mais rempli de fluctuations quantiques. L'effet Casimir (1948, mesure experimentalement en 1997) montre que deux plaques metalliques dans le vide s'attirent a cause de ces fluctuations — une force litteralement creee par le 'rien'!"
        },
        stat_mech: {
            analogy: "La mecanique statistique relie le monde microscopique (atomes, etats quantiques) au monde macroscopique (temperature, pression, entropie). C'est comme deduire le comportement d'une foule (temperature = agitation moyenne) a partir du comportement individuel de chaque personne (etat quantique). La matrice densite thermique ρ encode les probabilites de chaque micro-etat a une temperature donnee.",
            equation: "$$\\rho=\\frac{e^{-\\beta \\hat H}}{Z},\\quad Z=\\mathrm{Tr}(e^{-\\beta \\hat H})$$",
            breakdown: [
                "β = 1/(k_B T) est l'inverse de la temperature: β grand = froid (peu d'energie), β petit = chaud (beaucoup d'energie).",
                "e^{-βĤ} est l'operateur de Boltzmann: il pondere chaque etat propre par e^{-βE_n} (les hautes energies sont exponentiellement supprimes).",
                "Z = Tr(e^{-βĤ}) est la fonction de partition: le facteur de normalisation qui assure Tr(ρ) = 1.",
                "ρ est la matrice densite thermique: l'etat d'equilibre a la temperature T."
            ],
            equationTerms: [
                { term: 'ρ (matrice densite)', meaning: "L'etat thermique: un melange statistique des etats d'energie pondere par la temperature." },
                { term: 'β = 1/(k_B T)', meaning: "L'inverse de la temperature: controle la distribution de l'energie entre les micro-etats." },
                { term: 'Ĥ (hamiltonien)', meaning: "L'operateur d'energie: ses valeurs propres E_n sont les energies des micro-etats." },
                { term: 'Z (partition)', meaning: "La fonction de partition: elle contient toute la thermodynamique (energie libre F = -k_B T ln Z)." }
            ],
            why: "La mecanique statistique inspire directement les modeles d'IA: les machines de Boltzmann, l'echantillonnage MCMC, le simulated annealing, et les modeles de diffusion ont tous des racines en physique statistique. La fonction de partition Z est aussi l'objet central des modeles generatifs basés sur l'énergie (EBM).",
            example: "Le simulated annealing est directement inspire du refroidissement thermique: on 'refroidit' lentement le systeme (augmente β) pour qu'il tombe dans le minimum global d'energie. En optimisation combinatoire, ca permet de s'echapper des minima locaux.",
            tip: "La temperature en ML (softmax avec temperature T) vient directement de la physique statistique: P(classe i) ∝ e^{logit_i / T}. T→0 = argmax (aucune exploration), T→∞ = uniforme (exploration maximale). C'est le meme β que dans la distribution de Boltzmann!",
            didYouKnow: "Ludwig Boltzmann, fondateur de la mecanique statistique, s'est suicide en 1906, en partie a cause du rejet de ses idees par la communaute scientifique (Ernst Mach niait l'existence des atomes). Sur sa tombe a Vienne est gravee son equation S = k log W — l'une des formules les plus fondamentales de la physique, validee un an apres sa mort par Einstein."
        },
        spin_su2: {
            analogy: "Le spin est une propriete purement quantique sans equivalent classique exact, mais on peut l'imaginer comme une 'rotation interne' de la particule. Un spin-1/2 (electron, proton) a deux etats: 'up' et 'down'. La symetrie SU(2) decrit toutes les rotations possibles du spin — et remarquablement, une rotation de 360° ne ramene PAS un spin-1/2 a son etat initial. Il faut 720°!",
            equation: "$$U(\\mathbf{n},\\theta)=e^{-i\\theta\\mathbf{n}\\cdot\\boldsymbol{\\sigma}/2}$$",
            breakdown: [
                "n est l'axe de rotation: un vecteur unitaire dans ℝ³.",
                "θ est l'angle de rotation autour de cet axe.",
                "σ = (σ_x, σ_y, σ_z) sont les matrices de Pauli: les generateurs de SU(2).",
                "n·σ est la combinaison lineaire: projette la rotation sur les generateurs.",
                "e^{-iθn·σ/2} est la matrice de rotation unitaire 2×2: elle tourne le spin sur la sphere de Bloch."
            ],
            equationTerms: [
                { term: 'U(n, θ)', meaning: "La matrice de rotation SU(2): tourne l'etat du spin de θ autour de l'axe n." },
                { term: 'σ (Pauli)', meaning: "Les matrices de Pauli: σ_x = (0,1;1,0), σ_y = (0,-i;i,0), σ_z = (1,0;0,-1)." },
                { term: 'n·σ', meaning: "Le produit scalaire axe-Pauli: n_x σ_x + n_y σ_y + n_z σ_z." },
                { term: 'θ/2', meaning: "La demi-angle: le facteur /2 est la signature de SU(2) vs SO(3) (spineur vs vecteur)." }
            ],
            why: "SU(2) est LE groupe de symetrie du qubit: toute porte a 1 qubit est un element de SU(2). Les portes R_x, R_y, R_z sont des rotations autour des axes x, y, z de la sphere de Bloch. La decomposition d'Euler dit que toute porte 1-qubit = R_z(α)R_y(β)R_z(γ) — trois rotations suffisent.",
            example: "La porte Hadamard H est une rotation de π autour de l'axe (x+z)/√2: H = e^{-iπ(σ_x + σ_z)/(2√2)}. Geometriquement, elle echange |0⟩ et |+⟩ sur la sphere de Bloch — une rotation de 180° autour d'un axe diagonal.",
            tip: "Toute porte 1-qubit a 3 parametres reels (les angles d'Euler α, β, γ) plus une phase globale (irrelevante). SU(2) est un espace a 3 dimensions, isomorphe a la 3-sphere S³. Cette geometrie compacte est ce qui rend l'optimisation des portes 1-qubit tractable.",
            didYouKnow: "La decouverte du spin par Goudsmit et Uhlenbeck en 1925 a ete un choc: aucune propriete classique ne correspondait. Pauli, qui a formule le principe d'exclusion la meme annee, a d'abord rejete l'idee du spin car une rotation classique de l'electron impliquerait une vitesse de surface superieure a celle de la lumiere! Le spin n'est pas une rotation — c'est une propriete intrinsequement quantique."
        },
        entropy: {
            analogy: "L'entropie quantique mesure le 'desordre' ou l'ignorance sur un systeme. Un etat pur (superposition connue) a une entropie de 0 — on connait tout. Un etat mixte (melange statistique) a une entropie positive — il y a de l'incertitude. L'entropie de von Neumann generalise l'entropie de Shannon a la mecanique quantique, en tenant compte de l'intrication.",
            equation: "$$S(\\rho)=-\\mathrm{Tr}(\\rho\\log\\rho)$$",
            breakdown: [
                "ρ est la matrice densite: elle decrit completement l'etat (pur ou mixte) du systeme.",
                "log(ρ) est le logarithme matriciel de ρ: il se calcule via la decomposition spectrale.",
                "Tr est la trace: la somme des elements diagonaux, equivalente a Σ λᵢ log(λᵢ) ou λᵢ sont les valeurs propres de ρ.",
                "Le signe moins assure que S ≥ 0: l'entropie est toujours positive ou nulle."
            ],
            equationTerms: [
                { term: 'S(ρ)', meaning: "L'entropie de von Neumann: 0 pour un etat pur, maximale (log d) pour le melange maximal." },
                { term: 'ρ (matrice densite)', meaning: "L'etat du systeme: encode les probabilites et les coherences quantiques." },
                { term: 'Tr (trace)', meaning: "La somme des elements diagonaux: Tr(ρ log ρ) = Σ λᵢ log λᵢ." },
                { term: '-log ρ', meaning: "La 'surprise' quantique: les etats improbables (petits λᵢ) contribuent beaucoup a l'entropie." }
            ],
            why: "L'entropie quantique est fondamentale pour la theorie de l'information quantique: elle donne les limites de compression, de transmission, et de cryptographie quantique. L'entropie d'intrication (entropie de von Neumann du sous-systeme) mesure combien deux systemes sont intriques.",
            example: "L'etat de Bell (|00⟩+|11⟩)/√2 est un etat pur (S = 0 pour le systeme total), mais chaque qubit individuellement est dans un etat mixte ρ_A = I/2 avec S = log 2 = 1 bit. C'est le paradoxe de l'intrication: le tout est plus simple que les parties!",
            tip: "Si S(ρ_A) > 0 pour un sous-systeme d'un etat pur global, les sous-systemes sont intriques. C'est le critere le plus direct pour detecter l'intrication bipartite: mesure l'entropie du sous-systeme!",
            didYouKnow: "John von Neumann a invente l'entropie quantique S(ρ) = -Tr(ρ log ρ) en 1932, 16 ans AVANT que Shannon invente l'entropie classique H(X) = -Σ pᵢ log pᵢ en 1948! La legende dit que von Neumann a suggere a Shannon d'appeler sa quantite 'entropie' car 'personne ne sait vraiment ce que c'est, donc dans un debat tu auras toujours l'avantage'."
        },
        channels: {
            analogy: "Un canal quantique est une transformation physiquement valide d'un etat quantique, tenant compte du bruit et des interactions avec l'environnement. C'est comme un tuyau imparfait: l'information quantique entre d'un cote et ressort (possiblement deformee) de l'autre. La representation de Kraus decompose ce processus en 'operateurs de saut' E_k qui decrivent les differentes facons dont le bruit peut affecter l'etat.",
            equation: "$$\\mathcal{E}(\\rho)=\\sum_k E_k\\rho E_k^\\dagger$$",
            breakdown: [
                "ε est le canal quantique: une transformation completement positive et preservant la trace (CPTP).",
                "ρ est la matrice densite d'entree: l'etat quantique avant le canal.",
                "E_k sont les operateurs de Kraus: chaque k represente un 'scenario de bruit' possible.",
                "Σ_k E_k† E_k = I assure que les probabilites sont conservees.",
                "ε(ρ) est l'etat de sortie: le melange des differents scenarios de bruit."
            ],
            equationTerms: [
                { term: 'ε(ρ)', meaning: "L'etat de sortie apres passage dans le canal: generalement plus 'bruite' que l'entree." },
                { term: 'E_k (operateurs de Kraus)', meaning: "Les elements du canal: chaque E_k represente une evolution conditionnelle possible du systeme." },
                { term: 'E_k†', meaning: "L'adjoint de E_k: assure que la transformation preserve la positivite et la trace." },
                { term: 'Σ_k E_k† E_k = I', meaning: "La condition de completude: les probabilites totales sont conservees." }
            ],
            why: "Les canaux quantiques modelisent TOUT processus physique realiste: la decoherence, le bruit de porte, la perte de photons, l'erreur de mesure. Comprendre les canaux est essentiel pour la correction d'erreurs quantiques et l'evaluation de la fidelite des processeurs quantiques.",
            example: "Le canal de depolarisation ε(ρ) = (1-p)ρ + p·I/2 remplace l'etat par le melange maximal I/2 avec probabilite p. C'est le modele de bruit le plus simple: chaque qubit est 'randomise' avec probabilite p.",
            tip: "Pour caracteriser le bruit d'un processeur quantique, on utilise la 'process tomography' ou le 'randomized benchmarking'. Ces techniques estiment les operateurs de Kraus du canal reel du hardware — indispensable pour la correction d'erreurs.",
            didYouKnow: "Karl Kraus a publie sa representation en 1983, mais les bases mathematiques (les applications completement positives) avaient ete posees par Stinespring en 1955. Le theoreme de Stinespring dit que tout canal quantique peut etre vu comme une evolution unitaire dans un espace plus grand suivie d'une trace partielle — le bruit est de l'intrication avec l'environnement!"
        },
        theorems: {
            analogy: "Les theoremes de l'information quantique sont les 'lois de la physique' de l'information quantique: ils disent ce qui est possible et impossible. Comme les lois de la thermodynamique interdisent le perpetuum mobile, ces theoremes interdisent (entre autres) de cloner un etat quantique inconnu, et limitent la quantite d'information classique extractible d'un systeme quantique.",
            equation: "$$I(X;Y)\\le \\chi \\quad \\text{(borne de Holevo)}$$",
            breakdown: [
                "I(X;Y) est l'information mutuelle classique: combien d'information classique on peut extraire.",
                "χ = S(ρ) - Σ p_i S(ρ_i) est la quantite de Holevo: une borne superieure sur l'information extractible.",
                "S(ρ) est l'entropie de l'etat moyen, S(ρ_i) est l'entropie de chaque etat prepare.",
                "La borne dit: meme avec les meilleures mesures, on ne peut pas extraire plus que χ bits d'un qubit."
            ],
            equationTerms: [
                { term: 'I(X;Y)', meaning: "L'information mutuelle: la quantite d'information classique que Y revele sur X." },
                { term: 'χ (Holevo)', meaning: "La borne de Holevo: le maximum d'information classique extractible par mesure d'un etat quantique." }
            ],
            why: "Ces theoremes fixent les regles du jeu: le no-cloning interdit la copie d'etats quantiques (fondement de la QKD), Holevo limite la capacite des canaux quantiques, et le theoreme de HSW donne la capacite maximale de transmission d'information classique via un canal quantique.",
            example: "Le theoreme de no-cloning: il n'existe aucune operation unitaire U telle que U|ψ⟩|0⟩ = |ψ⟩|ψ⟩ pour tout |ψ⟩. C'est ce qui rend la cryptographie quantique possible: un espion ne peut pas copier un qubit sans le perturber!",
            tip: "Le no-cloning a une consequence pratique majeure: on ne peut pas utiliser la repetition (la technique classique de correction d'erreurs) directement sur des qubits. La correction d'erreurs quantique doit encoder l'information de facon non-triviale sur plusieurs qubits — d'ou la complexite du sujet.",
            didYouKnow: "Le theoreme de no-cloning a ete prouve en 1982 par Wootters et Zurek, motive par une proposition erronee de Nick Herbert (le 'FLASH paper') qui pretendait utiliser le clonage quantique pour communiquer plus vite que la lumiere. L'erreur de Herbert a conduit a l'une des decouvertes les plus fondamentales de l'information quantique!"
        },
        qec: {
            analogy: "La correction d'erreurs quantique protege l'information en l'encodant sur plusieurs qubits physiques. C'est comme ecrire un message important en triple: si une copie est endommagee, les deux autres permettent de reconstruire l'original. Mais en quantique, c'est plus subtil: on ne peut pas copier l'etat (no-cloning), donc on utilise l'intrication pour distribuer l'information sans la dupliquer.",
            equation: "$$d\\ge 2t+1$$",
            breakdown: [
                "d est la distance du code: le nombre minimum de qubits physiques qui doivent avoir une erreur pour creer une erreur logique indetectable.",
                "t est le nombre d'erreurs corrigeables: le code peut corriger jusqu'a t erreurs arbitraires.",
                "d ≥ 2t+1 est la condition de Knill-Laflamme: pour corriger t erreurs, la distance doit etre au moins 2t+1.",
                "Plus la distance est grande, meilleure est la protection — mais au prix de plus de qubits physiques."
            ],
            equationTerms: [
                { term: 'd (distance)', meaning: "La distance du code: mesure la robustesse, le nombre minimum d'erreurs creant un echec non detectable." },
                { term: 't (erreurs corrigeables)', meaning: "Le nombre maximum d'erreurs physiques que le code peut corriger." },
                { term: '2t+1', meaning: "La relation fondamentale: il faut 'assez de distance' pour distinguer les erreurs des non-erreurs." }
            ],
            why: "Sans correction d'erreurs, un ordinateur quantique est inutilisable pour les longs calculs: le bruit accumule des erreurs exponentiellement. Le seuil de correction d'erreurs (error threshold) dit: si le taux d'erreur physique est en dessous d'un seuil (~1%), on peut calculer indefiniment avec une precision arbitraire. C'est le 'Saint Graal' du hardware quantique.",
            example: "Le code de surface (le plus prometteur) utilise un reseau 2D de qubits. Pour d=3 (correction d'1 erreur), il faut 17 qubits physiques pour 1 qubit logique. Pour d=7 (correction de 3 erreurs), il en faut 97. Google Willow (2024) a demontre que plus on augmente d, plus le taux d'erreur logique diminue — le seuil est franchi!",
            tip: "Le ratio qubits physiques/logiques est le facteur limitant actuel. Avec les taux d'erreur actuels (~10⁻³), il faut environ 1000 qubits physiques par qubit logique pour les applications cryptographiquement pertinentes (Shor sur RSA-2048). C'est pourquoi les estimations parlent de millions de qubits physiques.",
            didYouKnow: "Peter Shor a invente la premiere correction d'erreurs quantique en 1995, un an apres son algorithme de factorisation. C'est un double coup de genie: d'abord il a montre que le calcul quantique pouvait etre puissant (factorisation), puis qu'il pouvait etre robuste (correction d'erreurs). En 2024, Google Willow a pour la premiere fois demontre experimentalement que l'ajout de qubits physiques REDUIT le taux d'erreur logique — une etape historique!"
        },
        networks: {
            analogy: "Un reseau quantique relie des processeurs quantiques distants par des liens d'intrication, comme Internet relie des ordinateurs par des cables. L'intrication distribuee permet la teleportation quantique, la QKD, et a terme un 'Internet quantique' ou les noeuds partagent des etats intriques pour des calculs distribues impossibles classiquement.",
            equation: "$$|\\Phi^+\\rangle_{AB}=\\frac{|00\\rangle+|11\\rangle}{\\sqrt{2}}$$",
            breakdown: [
                "|Φ+⟩ est un etat de Bell: l'etat intrique maximal de 2 qubits.",
                "A et B sont deux noeuds distants: chacun detient un qubit de la paire.",
                "(|00⟩+|11⟩)/√2 signifie: les qubits sont parfaitement correles (mesurer l'un donne le resultat de l'autre).",
                "Cette paire intriquee est la 'ressource' de base de tout protocole de reseau quantique."
            ],
            equationTerms: [
                { term: '|Φ+⟩_{AB}', meaning: "L'etat de Bell: une paire maximalement intriquee partagee entre les noeuds A et B." },
                { term: '(|00⟩+|11⟩)/√2', meaning: "Superposition de correlations parfaites: les deux qubits sont toujours mesures dans le meme etat." },
                { term: 'A, B', meaning: "Les deux noeuds du reseau: potentiellement separes par des kilometres." }
            ],
            why: "L'Internet quantique est la prochaine grande etape apres les processeurs quantiques individuels. Il permettra la cryptographie a securite inconditionnelle (QKD), le calcul quantique distribue (pour depasser les limites d'un seul processeur), et des protocoles de consensus byzantin quantique.",
            example: "En 2022, des chercheurs ont realise un reseau quantique a 3 noeuds a Delft (Pays-Bas), partageant de l'intrication entre processeurs distants via des photons a travers des fibres optiques. C'est le premier 'Internet quantique' experimental multi-noeud.",
            tip: "Le defi principal est la perte de photons dans les fibres: un photon a ~1.5μm perd 50% de son signal tous les ~15 km dans la fibre. Les repeteurs quantiques (qui utilisent l'intrication swapping) sont necessaires pour les longues distances, mais ils sont encore tres experimentaux.",
            didYouKnow: "La teleportation quantique (Bennett et al., 1993) utilise une paire de Bell pour 'teleporter' l'etat d'un qubit de A a B sans l'envoyer physiquement. Attention: aucune information ne voyage plus vite que la lumiere — la teleportation necessite un canal classique (a la vitesse de la lumiere) pour transmettre les 2 bits de correction. C'est elegant mais pas magique!"
        },
        qkd: {
            analogy: "La QKD (Quantum Key Distribution) utilise les lois de la physique quantique pour distribuer des cles de chiffrement avec une securite PROUVEE par les lois de la nature. Le principe: si un espion tente d'intercepter les qubits en transit, il les perturbe inevitablement (theoreme de no-cloning), et Alice et Bob detectent sa presence par un taux d'erreur anormalement eleve.",
            equation: "$$QBER=\\frac{N_{erreurs}}{N_{bits}}$$",
            breakdown: [
                "QBER est le Quantum Bit Error Rate: le taux d'erreur mesure par Alice et Bob.",
                "N_erreurs est le nombre de bits ou Alice et Bob obtiennent des resultats differents.",
                "N_bits est le nombre total de bits compares.",
                "Si QBER > seuil (~11% pour BB84), Eve est detectee et la cle est abandonnee."
            ],
            equationTerms: [
                { term: 'QBER', meaning: "Le taux d'erreur quantique: l'indicateur de securite — bas = securise, eleve = espionnage possible." },
                { term: 'N_erreurs', meaning: "Le nombre de discordances: bits ou les mesures d'Alice et Bob different." },
                { term: 'N_bits', meaning: "Le nombre total de bits utilises pour l'estimation: un echantillon aleatoire de la cle brute." }
            ],
            why: "La QKD est la seule methode de chiffrement dont la securite repose sur les lois de la physique plutot que sur la difficulte d'un probleme mathematique. Face a la menace des ordinateurs quantiques (qui casseront RSA via Shor), la QKD offre une securite a long terme — c'est la raison de l'investissement massif de la Chine et de l'UE.",
            example: "Le protocole BB84 (Bennett-Brassard, 1984): Alice envoie des qubits polarises aleatoirement dans deux bases (rectilinear/diagonal). Bob mesure dans une base aleatoire. Ils comparent les bases (pas les resultats!) et gardent seulement les bits ou ils ont utilise la meme base.",
            tip: "La QKD ne remplace pas le chiffrement — elle ne distribue que la CLE. L'encryption des messages utilise toujours un algorithme classique (AES, etc.), mais avec une cle generee par QKD et donc a securite quantique.",
            didYouKnow: "La Chine a lance le satellite Micius en 2016, realisant la premiere QKD intercontinentale par satellite (Pekin-Vienne, 7600 km) en 2017. Le reseau QKD chinois relie deja Pekin, Shanghai, Jinan et Hefei sur plus de 2000 km de fibre optique — le plus grand reseau quantique deploye au monde!"
        },
        commitment: {
            analogy: "Le commitment quantique est comme un coffre-fort numerique: Alice place un secret dedans (phase de 'commit') et ne peut plus le changer (binding), mais Bob ne peut pas voir le contenu avant l'ouverture (hiding). Le defi quantique: le theoreme de Mayers-Lo-Chau montre qu'un commitment PARFAIT (a la fois parfaitement binding ET parfaitement hiding) est impossible en quantique!",
            equation: "$$\\text{binding} + \\text{hiding}$$",
            breakdown: [
                "Binding: apres le commit, Alice ne peut pas changer le secret.",
                "Hiding: avant l'ouverture, Bob ne peut pas deviner le secret.",
                "En quantique, on ne peut pas avoir les deux proprietes parfaitement simultanement.",
                "On peut cependant avoir des commitments 'computationnellement' securises ou 'statistiquement' binding/hiding."
            ],
            equationTerms: [
                { term: 'binding', meaning: "La propriete qui empeche Alice de changer le secret apres le commit." },
                { term: 'hiding', meaning: "La propriete qui empeche Bob de decouvrir le secret avant l'ouverture." }
            ],
            why: "Le commitment est une primitive fondamentale de la cryptographie: il est utilise dans les preuves a divulgation nulle (zero-knowledge), les encheres scellees, le tirage au sort equitable, et les protocoles de vote electronique. Comprendre ses limites quantiques est essentiel pour la cryptographie post-quantique.",
            example: "Enchère scellee: chaque participant 'commit' son offre avant l'ouverture. Le binding empeche de changer son offre apres avoir vu les autres. Le hiding empeche les autres de voir ton offre avant l'ouverture. Le protocole doit etre equitable pour tous.",
            tip: "L'impossibilite du commitment quantique parfait est une consequence profonde: elle implique que certains protocoles cryptographiques classiques n'ont pas d'equivalent quantique a securite inconditionnelle. C'est un exemple ou le quantique REDUIT les possibilites plutot que de les augmenter!",
            didYouKnow: "Le theoreme d'impossibilite du commitment quantique parfait (Mayers 1997, Lo & Chau 1997) a ete un choc: on pensait que le quantique rendrait la cryptographie plus puissante, pas moins! C'est l'un des rares cas ou la mecanique quantique impose des contraintes plus fortes que la physique classique."
        },
        randomness: {
            analogy: "Un generateur de nombres aleatoires quantique (QRNG) exploite l'indeterminisme FONDAMENTAL de la mesure quantique pour produire de l'alea pur — pas du pseudo-alea algorithmique. C'est comme le 'vrai hasard' de la roulette quantique: le resultat est fondamentalement imprevisible, meme par un adversaire avec une puissance de calcul infinie.",
            equation: "$$H_{min}(X)=-\\log_2\\max_x P(X=x)$$",
            breakdown: [
                "H_min est la min-entropie: la mesure la plus conservatrice de l'alea.",
                "max_x P(X=x) est la probabilite du resultat le plus probable.",
                "-log₂ convertit en bits: H_min = 1 pour un bit parfaitement aleatoire (P_max = 1/2).",
                "La min-entropie est le critere standard pour certifier la qualite de l'alea quantique."
            ],
            equationTerms: [
                { term: 'H_min(X)', meaning: "La min-entropie: le nombre de bits aleatoires extractibles de la source X." },
                { term: 'max_x P(X=x)', meaning: "La probabilite de deviner: la probabilite du resultat le plus previsible." },
                { term: '-log₂', meaning: "La conversion en bits: transforme la probabilite en mesure d'information." }
            ],
            why: "L'alea veritable est essentiel pour la cryptographie (generation de cles), la simulation Monte Carlo, les loteries equitables, et les protocoles de securite. Les QRNG certifies par les violations de Bell fournissent un alea dont la qualite est PROUVEE par la physique — impossible avec des generateurs classiques.",
            example: "Quand on mesure un qubit dans l'etat |+⟩ = (|0⟩+|1⟩)/√2 dans la base Z, le resultat est fondamentalement aleatoire: 50/50 sans aucune cause cachee. Contrairement a un 'rand()' algorithmique qui est deterministe si on connait la seed.",
            tip: "Les QRNG commerciaux existent deja (ID Quantique, QuintessenceLabs). Pour les applications cryptographiques critiques, un QRNG certifie par violation de Bell (device-independent) est le gold standard — il ne fait confiance a aucune hypothese sur le hardware.",
            didYouKnow: "Le theoreme de Bell (1964) prouve qu'aucune theorie 'a variables cachees locales' ne peut reproduire les correlations quantiques. Cela implique que l'alea quantique est FONDAMENTAL, pas juste notre ignorance. Les experiences de violation de Bell (Aspect 1982, Nobel 2022) ont confirme cette prediction — le hasard quantique est le seul 'vrai hasard' connu en physique."
        },
        security: {
            analogy: "La securite quantique analyse les attaques physiques qui exploitent les imperfections reelles du hardware: detecteurs qui cliquent differemment selon l'etat (attaque par blinding), fuites de photons (trojan horse), ou canaux lateraux electromagnétiques. Meme si un protocole est theoriquement securise, son implementation physique peut avoir des failles que la theorie ne prevoit pas.",
            equation: "$$I(\\text{Eve};K)\\to 0$$",
            breakdown: [
                "I(Eve; K) est l'information mutuelle entre l'espion (Eve) et la cle finale K.",
                "→ 0 signifie que l'information d'Eve sur la cle tend vers zero.",
                "C'est la condition de securite ideale: Eve ne sait RIEN sur la cle.",
                "En pratique, on demontre que I(Eve; K) ≤ ε pour un ε tres petit (securite composable)."
            ],
            equationTerms: [
                { term: 'I(Eve; K)', meaning: "L'information mutuelle: combien Eve sait sur la cle K." },
                { term: 'K', meaning: "La cle cryptographique finale: le secret partage entre Alice et Bob." },
                { term: '→ 0', meaning: "Tend vers zero: la securite est asymptotiquement parfaite." }
            ],
            why: "La securite pratique est le maillon faible de la cryptographie quantique: les preuves theoriques supposent du hardware ideal, mais le hardware reel a des imperfections. Les attaques par canal lateral en QKD (blinding, photon number splitting, Trojan horse) montrent que la securite physique est aussi critique que la securite mathematique.",
            example: "L'attaque par 'detector blinding' (Lydersen et al., 2010): l'attaquant aveuglit les detecteurs de Bob avec un laser puissant, puis les controle pour produire des 'clics' deterministes. Resultat: Eve obtient la cle complete sans etre detectee! La parade: monitorer la puissance lumineuse entrante.",
            tip: "En securite quantique, ne fais JAMAIS confiance au hardware par defaut. Le framework 'device-independent' est le plus securise: la securite est prouvee uniquement a partir des correlations observees (violations de Bell), sans aucune hypothese sur le fonctionnement interne des appareils.",
            didYouKnow: "En 2010, l'equipe de Vadim Makarov a pirate un systeme QKD commercial (ID Quantique) en utilisant l'attaque de blinding — obtenant la cle complete sans declencher d'alarme! Cela a provoque une revolution dans le domaine: maintenant, toute implementation QKD doit prouver sa resistancee aux attaques physiques, pas seulement mathematiques."
        },
        open_systems: {
            analogy: "Un systeme quantique ouvert interagit avec son environnement, comme un glaçon dans un verre d'eau: le glaçon (le systeme) s'equilibre progressivement avec l'eau (l'environnement). L'equation de Lindblad decrit cette evolution irreversible: le systeme perd sa 'quanticite' (coherence) au profit de l'environnement, un processus appele decoherence.",
            equation: "$$\\dot\\rho=-\\frac{i}{\\hbar}[H,\\rho]+\\mathcal{D}(\\rho)$$",
            breakdown: [
                "ρ̇ est la derivee temporelle de la matrice densite: comment l'etat change dans le temps.",
                "-i/ℏ [H, ρ] est la partie hamiltonienne: l'evolution unitaire (coherente) du systeme isole.",
                "D(ρ) est le dissipateur de Lindblad: il decrit les effets de l'environnement (decoherence, dissipation).",
                "Ensemble: l'etat evolue sous l'influence CONJOINTE de sa dynamique propre et du bruit environnemental."
            ],
            equationTerms: [
                { term: 'ρ̇', meaning: "La variation temporelle de l'etat: combine evolution coherente et dissipation." },
                { term: '[H, ρ]', meaning: "Le commutateur avec l'hamiltonien: la partie 'Schrodinger' de l'evolution." },
                { term: 'D(ρ)', meaning: "Le dissipateur de Lindblad: encode les sauts quantiques et la perte de coherence." }
            ],
            why: "Les systemes quantiques reels sont TOUJOURS ouverts: le bruit est inévitable. L'equation de Lindblad est l'outil standard pour modeliser le bruit dans les processeurs quantiques, les temps de coherence (T1, T2), et l'efficacite de la correction d'erreurs. Sans ce modele, on ne peut pas predire la performance du hardware.",
            example: "Un qubit supraconducteur a un temps T1 (relaxation) d'environ 100-300 μs et un T2 (dephasing) similaire. Cela signifie qu'une porte quantique (qui prend ~20-50 ns) a environ 10⁻³ probabilite d'erreur — on peut faire ~1000 portes avant que le qubit soit 'detruit' par le bruit.",
            tip: "Les deux temps de coherence cles: T1 (relaxation, perte d'energie: |1⟩ → |0⟩) et T2 (dephasing, perte de coherence de phase). Toujours T2 ≤ 2T1. Pour augmenter T1: meilleure isolation. Pour augmenter T2: techniques d'echo dynamique (comme le spin echo en RMN).",
            didYouKnow: "L'equation de Lindblad (1976) porte le nom du physicien suedois Goran Lindblad, mais a ete derivee independamment par Vittorio Gorini, Andrzej Kossakowski et George Sudarshan la meme annee. C'est la forme la plus generale d'evolution markovienne d'un systeme quantique ouvert — tout canal quantique a temps continu est un cas particulier!"
        },
        decoherence: {
            analogy: "La decoherence, c'est comme un message ecrit sur un tableau blanc dans un bureau partage: au fil du temps, les gens l'effacent par petits morceaux (l'environnement interagit avec le systeme) jusqu'a ce que le message soit illisible. En quantique, la decoherence efface les phases relatives — l'information quantique qui distingue une superposition d'un melange classique.",
            equation: "$$\\rho_{01}(t)=\\rho_{01}(0)e^{-t/T_2}$$",
            breakdown: [
                "ρ₀₁ est l'element hors-diagonale de la matrice densite: il encode la coherence quantique.",
                "ρ₀₁(0) est la coherence initiale: l'amplitude de la superposition au temps 0.",
                "e^{-t/T₂} est la decroissance exponentielle: la coherence s'efface au rythme 1/T₂.",
                "T₂ est le temps de decoherence: apres t = T₂, la coherence est reduite de 63%."
            ],
            equationTerms: [
                { term: 'ρ₀₁(t)', meaning: "La coherence au temps t: mesure la 'quanticite' restante de l'etat." },
                { term: 'T₂ (temps de decoherence)', meaning: "Le temps caracteristique de perte de coherence: la 'duree de vie' de la superposition." },
                { term: 'e^{-t/T₂}', meaning: "La decroissance exponentielle: typique des processus markoviens de perte de coherence." }
            ],
            why: "La decoherence est l'ennemi #1 de l'informatique quantique: elle limite le nombre de portes qu'on peut executer avant que l'etat soit corrompu. Le ratio T₂/t_gate (temps de coherence sur temps de porte) determine combien d'operations utiles sont possibles — c'est le facteur de merite principal des processeurs quantiques.",
            example: "Pour un qubit supraconducteur typique: T₂ ≈ 100 μs, t_gate ≈ 30 ns. Ratio: ~3000 portes avant decoherence. C'est suffisant pour des circuits courts (NISQ) mais pas pour des algorithmes profonds comme Shor (qui necessite des millions de portes) — d'ou le besoin de correction d'erreurs.",
            tip: "Les techniques de 'dynamical decoupling' (sequences d'impulsions rapides) peuvent etendre T₂ en 'moyennant' le bruit de l'environnement. C'est l'equivalent quantique du moyennage du bruit en traitement du signal — et ca peut multiplier T₂ par un facteur 10 ou plus!",
            didYouKnow: "Wojciech Zurek a propose en 1981 que la decoherence resolvait le 'probleme de la mesure' de la mecanique quantique: les objets macroscopiques (comme les chats de Schrodinger) decoherent si vite (en ~10⁻²⁰ secondes!) qu'ils semblent toujours classiques. La decoherence explique pourquoi le monde nous parait classique meme si les lois fondamentales sont quantiques."
        },
        superconducting: {
            analogy: "Un qubit supraconducteur est un circuit electrique refroidi a ~15 millikelvins (-273.135°C, plus froid que l'espace interstellaire!) ou le courant circule sans resistance. La non-linearite vient de la jonction Josephson: un 'sandwich' isolant entre deux supraconducteurs qui cree un oscillateur non-harmonique. Cette non-linearite est ce qui distingue les deux niveaux du qubit des autres niveaux — sans elle, ce serait un simple oscillateur harmonique.",
            equation: "$$H=4E_C(\\hat n-n_g)^2-E_J\\cos\\hat\\varphi$$",
            breakdown: [
                "E_C est l'energie de charge: le cout energetique d'ajouter un electron au circuit.",
                "n̂ est l'operateur de nombre de paires de Cooper: le nombre de charges sur le condensateur.",
                "n_g est la charge de gate: un biais electrostatique externe.",
                "E_J est l'energie Josephson: la force de la jonction, elle cree la non-linearite.",
                "cos(φ̂) est le potentiel Josephson: un potentiel periodique qui piege les niveaux d'energie."
            ],
            equationTerms: [
                { term: 'E_C (energie de charge)', meaning: "Le cout energetique de fluctuations de charge: controle la sensibilite au bruit de charge." },
                { term: 'E_J (energie Josephson)', meaning: "L'energie de couplage de la jonction: controle la non-linearite et les niveaux d'energie." },
                { term: 'n̂ (nombre de charges)', meaning: "L'operateur de nombre de paires de Cooper sur la capacite du circuit." },
                { term: 'cos(φ̂)', meaning: "Le potentiel non-lineaire de la jonction Josephson: source de l'anharmonicite." }
            ],
            why: "Les qubits supraconducteurs sont la plateforme dominante (IBM, Google, Rigetti). Leurs avantages: fabrication par lithographie (scalable), temps de porte rapides (~20-50 ns), et conception flexible. Comprendre leur hamiltonien aide a comprendre les sources de bruit et les strategies de correction.",
            example: "Le transmon (le qubit supraconducteur le plus utilise) opere dans le regime E_J/E_C >> 1: la sensibilite au bruit de charge est exponentiellement supprimee, au prix d'une anharmonicite reduite. C'est le compromis design qui a rendu les qubits supraconducteurs viables.",
            tip: "Le ratio E_J/E_C determine le type de qubit: E_J/E_C ~ 1 = Cooper pair box (sensible au bruit), E_J/E_C >> 1 = transmon (robuste mais faible anharmonicite). Le transmon typique a E_J/E_C ≈ 50-100.",
            didYouKnow: "Le qubit transmon a ete invente par Jens Koch et al. en 2007 au groupe de Rob Schoelkopf a Yale. En 17 ans, le temps de coherence des qubits supraconducteurs est passe de quelques nanosecondes a plus de 1 milliseconde — une amelioration d'un facteur d'un million! Google Sycamore (2019) et Willow (2024) ont utilise des transmons pour revendiquer la 'suprematie quantique'."
        },
        trapped_ions: {
            analogy: "Les ions pieges sont des atomes charges suspendus dans le vide par des champs electriques, comme des perles maintenues en levitation par des jets d'air. Chaque ion est un qubit naturel (deux niveaux d'energie de l'atome), et on les controle avec des lasers ultra-precis. L'avantage: les qubits ioniques sont tous identiques (ce sont des atomes!) et ont les meilleurs temps de coherence de toutes les plateformes.",
            equation: "$$H_{MS}\\propto\\sigma_x^{(i)}\\sigma_x^{(j)}$$",
            breakdown: [
                "H_MS est l'hamiltonien de la porte Molmer-Sorensen: l'interaction d'intrication standard pour les ions pieges.",
                "σ_x^(i) est l'operateur de Pauli X sur l'ion i: il fait basculer son etat.",
                "σ_x^(j) est l'operateur de Pauli X sur l'ion j.",
                "Le produit σ_x ⊗ σ_x couple les deux ions: il cree de l'intrication en passant par les modes vibrationnels collectifs."
            ],
            equationTerms: [
                { term: 'H_MS', meaning: "L'hamiltonien Molmer-Sorensen: l'interaction standard pour creer des portes a 2 qubits avec des ions." },
                { term: 'σ_x^{(i)}', meaning: "L'operateur de Pauli X sur le qubit i: fait basculer |0⟩ ↔ |1⟩." },
                { term: '∝ (proportionnel)', meaning: "L'amplitude de l'interaction depend de l'intensite du laser et de la frequence de desyntonisation." }
            ],
            why: "Les ions pieges sont les concurrents principaux des supraconducteurs. Avantages: connectivite all-to-all (tout qubit peut interagir avec tout autre), fidelites de porte record (>99.9%), et qubits identiques. Inconvenients: portes plus lentes (~10-100 μs vs 20-50 ns) et scalabilite plus complexe.",
            example: "IonQ et Quantinuum (Honeywell) sont les leaders commerciaux. Quantinuum detient le record de fidelite de porte a 2 qubits: 99.91% (2023). Leurs processeurs H-series utilisent des ions d'ytterbium (Yb+) dans des pieges lineaires.",
            tip: "La connectivite all-to-all des ions pieges est un avantage algorithmique majeur: les circuits qui necessitent des SWAP gates sur les architectures a connectivite limitee (supraconducteurs) sont natifs sur les ions. Cela reduit la profondeur du circuit — crucial pour l'ere NISQ.",
            didYouKnow: "Les ions pieges ont ete proposes pour le calcul quantique par Cirac et Zoller en 1995. La premiere porte quantique a 2 qubits ioniques a ete realisee la meme annee par l'equipe de Dave Wineland au NIST. Wineland a recu le prix Nobel de physique en 2012 pour 'les methodes experimentales permettant la mesure et la manipulation de systemes quantiques individuels'."
        },
        photonic: {
            analogy: "L'informatique quantique photonique utilise des photons (particules de lumiere) comme qubits. Les photons voyagent a la vitesse de la lumiere, ne decoherent presque pas, et se manipulent avec des composants optiques (lames separatrices, dephaseurs, detecteurs). L'inconvenient: les photons n'interagissent pas facilement entre eux, rendant les portes a 2 qubits difficiles.",
            equation: "$$P_0=\\cos^2(\\phi/2),\\;P_1=\\sin^2(\\phi/2)$$",
            breakdown: [
                "P₀ et P₁ sont les probabilites de detecter le photon en sortie 0 ou 1 d'un interferometre.",
                "φ est la phase relative accumulee entre les deux chemins optiques.",
                "cos² et sin² viennent de l'interference a deux ondes: constructive en sortie 0, destructive en sortie 1, ou vice versa.",
                "En ajustant φ, on controle arbitrairement la repartition de probabilite entre les deux sorties."
            ],
            equationTerms: [
                { term: 'P₀, P₁', meaning: "Les probabilites de detection dans chaque voie de sortie: elles somment a 1." },
                { term: 'φ (phase)', meaning: "La phase relative entre les deux bras de l'interferometre: le 'bouton de controle' du qubit photonique." },
                { term: 'cos²(φ/2), sin²(φ/2)', meaning: "Les fonctions d'interference: la signature du comportement ondulatoire du photon." }
            ],
            why: "Les photons sont la plateforme naturelle pour les communications quantiques (QKD) et les reseaux quantiques (pas de decoherence en propagation). Pour le calcul, l'approche 'boson sampling' de Jiuzhang (USTC, Chine) a revendique un avantage quantique en 2020. Xanadu developpe Borealis, un processeur photonique programmable.",
            example: "Le boson sampling consiste a envoyer des photons identiques dans un reseau d'interferometres et a compter les photons en sortie. Le resultat est (vraisemblablement) impossible a simuler classiquement pour un grand nombre de photons — c'est un candidat pour l'avantage quantique.",
            tip: "L'informatique quantique photonique a un avantage unique: elle fonctionne a temperature ambiante (pas besoin de refrigerateurs a dilution). Les pertes optiques sont le defi principal: chaque composant perd quelques pourcents de photons, et la detection de photons uniques n'est pas parfaite.",
            didYouKnow: "En 2020, le processeur photonique chinois Jiuzhang a effectue un calcul de boson sampling en 200 secondes qu'un supercalculateur classique mettrait 2.5 milliards d'annees a reproduire (selon les auteurs). C'etait la deuxieme revendication de 'suprematie quantique' apres Google Sycamore. L'equipe dirigee par Jian-Wei Pan a Hefei est la plus grande equipe quantique du monde!"
        }
    };

    COURSE_TOOLKITS.ml_expert = {
        analogy: "Le parcours ML expert ressemble a un atelier: on commence par les bons outils, puis on monte des systemes complets.",
        equation: "$$\\theta_{t+1}=\\theta_t-\\eta\\nabla_\\theta\\mathcal{L}(\\theta_t)$$",
        breakdown: [
            "On choisit un objectif mesurable (loss, reward, score).",
            "On estime comment chaque parametre influence l'objectif.",
            "On met a jour iterativement jusqu'a stabilisation utile."
        ],
        why: "Ce schema relie ML classique, deep learning, RL et modeles generatifs.",
        example: "Concevoir un pipeline bout-en-bout: retrieval, modele, evaluation offline et monitoring production."
    };

    Object.assign(MODULE_TOOLKITS, {
        coverage_global: {
            analogy: "Cette page est le plan de batiment: on voit toutes les pieces avant de meubler.",
            equation: "$$\\text{Couverture}=\\frac{\\text{chapitres\\ crees}}{\\text{chapitres\\ vises}}$$"
        },
        lexique_math_annotations: {
            analogy: "Le lexique est un traducteur simultane entre notation mathematique et intuition terrain.",
            equation: "$$X\\in\\mathbb{R}^{m\\times n},\\quad y\\in\\mathbb{R}^{m},\\quad \\hat{y}=f_\\theta(X)$$"
        },
        math_fondamentales: {
            analogy: "C'est la grammaire de l'IA: sans grammaire, on ne peut pas lire les modeles.",
            equation: "$$\\nabla_\\theta \\mathcal{L}(\\theta)=\\left[\\frac{\\partial \\mathcal{L}}{\\partial \\theta_1},\\dots,\\frac{\\partial \\mathcal{L}}{\\partial \\theta_n}\\right]$$"
        },
        data_science_classique: {
            analogy: "Le ML classique est la boite a outils robuste avant les gros reseaux.",
            equation: "$$\\hat{y}=f_\\theta(x),\\quad \\theta^*=\\arg\\min_\\theta \\mathcal{L}(y,\\hat{y})$$"
        },
        deep_learning_base: {
            analogy: "Le deep learning empile des couches comme une chaine de montage de representations.",
            equation: "$$h^{(l+1)}=\\sigma\\left(W^{(l)}h^{(l)}+b^{(l)}\\right)$$"
        },
        vision_par_ordinateur: {
            analogy: "La vision decompose une image en motifs, puis en objets, puis en decisions.",
            equation: "$$y=\\operatorname{Conv}(x;K)$$"
        },
        nlp_langage: {
            analogy: "Le NLP transforme les mots en vecteurs pour raisonner sur du sens.",
            equation: "$$\\operatorname{Attention}(Q,K,V)=\\operatorname{softmax}\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V$$"
        },
        modeles_generatifs: {
            analogy: "Un modele generatif apprend une distribution, pas juste une etiquette.",
            equation: "$$\\theta^*=\\arg\\max_\\theta \\sum_i \\log p_\\theta(x_i)$$"
        },
        architectures_recherche_chaude: {
            analogy: "Ces architectures sont les laboratoires qui prepareront les standards de demain.",
            equation: "$$\\text{Score}=f(\\text{qualite},\\text{latence},\\text{cout},\\text{robustesse})$$"
        },
        rl_robotique_controle: {
            analogy: "Le RL apprend par essais/erreurs comme un pilote qui affine ses reflexes.",
            equation: "$$G_t=\\sum_{k=0}^{\\infty} \\gamma^k r_{t+k+1}$$"
        },
        graphes: {
            analogy: "Un graphe capture les relations: ce sont les routes entre les donnees.",
            equation: "$$h_v^{(k+1)}=\\phi\\left(h_v^{(k)},\\square_{u\\in\\mathcal{N}(v)}\\psi(h_v^{(k)},h_u^{(k)})\\right)$$"
        },
        auto_supervise_representation: {
            analogy: "L'auto-supervise apprend a representer avant d'apprendre a predire.",
            equation: "$$\\mathcal{L}_{contrastive}=-\\log\\frac{\\exp(\\operatorname{sim}(z_i,z_i^+)/\\tau)}{\\sum_j \\exp(\\operatorname{sim}(z_i,z_j)/\\tau)}$$"
        },
        inference_probabiliste_structures: {
            analogy: "L'inference probabiliste met a jour des croyances quand les observations arrivent.",
            equation: "$$p(z\\mid x)=\\frac{p(x\\mid z)p(z)}{p(x)}$$"
        },
        theoremes_equations: {
            analogy: "Ces equations sont les lois de conservation conceptuelles de l'IA moderne.",
            equation: "$$\\operatorname{Erreur}=\\operatorname{Biais}^2+\\operatorname{Variance}+\\operatorname{Bruit}$$"
        },
        pertes_metriques_objectifs: {
            analogy: "La loss dit quoi corriger, la metrique dit quoi celebrer en production.",
            equation: "$$\\mathcal{L}_{CE}(y,\\hat{y})=-\\sum_i y_i \\log(\\hat{y}_i)$$"
        },
        entrainement_gros_modeles: {
            analogy: "L'entrainement moderne est une orchestration de vitesse, memoire et stabilite.",
            equation: "$$\\theta_{t+1}=\\theta_t-\\eta_t\\,\\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t}+\\epsilon}$$"
        },
        donnees_systemes_mlops: {
            analogy: "Le MLOps est la chaine logistique qui rend un modele fiable dans le temps.",
            equation: "$$\\text{Valeur\\ ML}=\\text{Modele}\\times\\text{Donnees}\\times\\text{Ops}$$"
        },
        multimodal: {
            analogy: "Le multimodal aligne plusieurs sens (texte, image, audio) dans un meme espace.",
            equation: "$$\\mathcal{L}=\\mathcal{L}_{text}+\\mathcal{L}_{image}+\\mathcal{L}_{align}$$"
        },
        buzzwords_ia: {
            analogy: "Les buzzwords sont utiles seulement s'ils se rattachent a un mecanisme concret.",
            equation: "$$\\text{Impact\\ reel}=\\text{idee}\\times\\text{execution}\\times\\text{evaluation}$$"
        },
        socle_ultra_court: {
            analogy: "Ce socle est le minimum viable pour lire la recherche sans se noyer.",
            equation: "$$\\text{Socle}=\\text{Maths}+\\text{ML\\ classique}+\\text{DL}+\\text{RL}+\\text{MLOps}$$"
        },
        recherche_active: {
            analogy: "La recherche active est un radar: elle montre ou se deplace la frontiere de performance.",
            equation: "$$\\Delta\\text{SOTA}=f(\\text{donnees},\\text{architecture},\\text{compute},\\text{eval})$$"
        },
        ml_algorithms: {
            analogy: "Le ML classique, c'est une boite a outils de lunettes differentes sur les memes donnees.",
            equation: "$$\\theta^*=\\arg\\min_\\theta\\frac{1}{m}\\sum_{i=1}^{m}\\mathcal{L}(y_i,f_\\theta(x_i))+\\lambda\\Omega(\\theta)$$",
            example: "Choisir entre RandomForest et XGBoost sur un dataset tabulaire avec contraintes d'explicabilite."
        },
        dl_algorithms: {
            analogy: "Le DL empile des filtres successifs pour passer du brut a l'abstrait.",
            equation: "$$h^{(l+1)}=\\sigma\\left(W^{(l)}h^{(l)}+b^{(l)}\\right)$$",
            example: "Passer d'un CNN a un ViT selon la taille du dataset et le cout d'inference cible."
        },
        rl_intro: {
            analogy: "Le RL apprend par essais-erreurs comme un pilote qui ajuste sa trajectoire a chaque tour.",
            equation: "$$J(\\pi)=\\mathbb{E}_{\\pi}\\left[\\sum_{t=0}^{\\infty}\\gamma^t r_t\\right]$$",
            example: "Regler un agent de pricing dynamique qui maximise marge sans perdre conversion."
        },
        genai: {
            analogy: "La GenAI apprend la grammaire d'un monde pour echantillonner de nouveaux exemples plausibles.",
            equation: "$$\\max_\\theta\\sum_{t=1}^{T}\\log p_\\theta(x_t\\mid x_{<t})$$",
            example: "Brancher un chatbot RAG sur une base documentaire metier avec evaluation factuelle."
        },
        world_models: {
            analogy: "Un world model est un simulateur mental latent: il predit l'avenir avant d'agir.",
            equation: "$$z_{t+1}=f_\\theta(z_t,a_t),\\quad \\hat{o}_{t+1}=g_\\theta(z_{t+1})$$",
            example: "Planifier une sequence d'actions robot en simulant d'abord dans l'espace latent."
        },
        expert_missing: {
            analogy: "La checklist expert agit comme une carte des competences pour fermer les angles morts.",
            equation: "$$\\text{Niveau expert}=\\text{Maths}\\times\\text{Modeles}\\times\\text{Systemes}\\times\\text{Eval}\\times\\text{MLOps}$$",
            example: "Monter un plan de progression trimestriel avec jalons theorie, code, eval et deploiement."
        },
        q_learning: {
            analogy: "Q-learning construit une carte de chaleur des bonnes decisions dans chaque situation.",
            equation: "$$Q(s,a)\\leftarrow Q(s,a)+\\alpha\\left[r+\\gamma\\max_{a'}Q(s',a')-Q(s,a)\\right]$$",
            example: "Apprendre une politique de navigation grille avec recompenses clairsemees."
        }
    });

    function escapeLatexHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function wrapLatexExpression(expression, displayMode) {
        const expr = String(expression || '').trim();
        if (!expr) return '';

        const wrappedMath = displayMode ? `$$${expr}$$` : `$${expr}$`;
        const sourceCode = displayMode ? `$$${expr}$$` : `$${expr}$`;

        return `
            <span class="dma-latex-wrap ${displayMode ? 'dma-latex-display' : 'dma-latex-inline'}" data-latex-eye="1">
                <span class="dma-latex-render">${wrappedMath}</span>
                <button type="button" class="dma-latex-eye" aria-label="Voir le code LaTeX">&#128065;</button>
                <code class="dma-latex-source">${escapeLatexHtml(sourceCode)}</code>
            </span>
        `;
    }

    function renderEquationWithEye(rawEquation) {
        const textRaw = String(rawEquation || '').trim();
        if (!textRaw) return '';

        if (textRaw.startsWith('$$') && textRaw.endsWith('$$')) {
            return wrapLatexExpression(textRaw.slice(2, -2), true);
        }
        if (textRaw.startsWith('\\[') && textRaw.endsWith('\\]')) {
            return wrapLatexExpression(textRaw.slice(2, -2), true);
        }
        if (textRaw.startsWith('$') && textRaw.endsWith('$')) {
            return wrapLatexExpression(textRaw.slice(1, -1), false);
        }

        return wrapLatexExpression(textRaw, false);
    }

    function wrapDisplayBlocks(html) {
        let output = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, expr) => wrapLatexExpression(expr, true));
        output = output.replace(/\\\\\[([\s\S]+?)\\\\\]/g, (match, expr) => wrapLatexExpression(expr, true));
        return output;
    }

    function wrapInlineBlocks(html) {
        return html.replace(/(^|[^$])\$(?!\$)([^$\n]+?)\$(?!\$)/g, (match, prefix, expr) => {
            const candidate = String(expr || '').trim();
            if (!candidate) return match;
            if (candidate.includes('<') || candidate.includes('>')) return match;
            return `${prefix}${wrapLatexExpression(candidate, false)}`;
        });
    }

    window.prepareLatexSourceBlocks = function (html) {
        if (!html || typeof html !== 'string') return html;
        const wrappedDisplay = html.includes('data-latex-eye="1"') ? html : wrapDisplayBlocks(html);
        return wrapInlineBlocks(wrappedDisplay);
    };

    window.bindLatexEyeInteractions = function (root) {
        const area = root || document.getElementById('content-area');
        if (!area) return;

        area.querySelectorAll('[data-latex-eye="1"]').forEach(wrapper => {
            if (wrapper.dataset.boundEye === '1') return;
            wrapper.dataset.boundEye = '1';

            const eye = wrapper.querySelector('.dma-latex-eye');
            if (!eye) return;

            eye.addEventListener('click', (event) => {
                event.preventDefault();
                wrapper.classList.toggle('is-open');
            });

            wrapper.addEventListener('mouseenter', () => wrapper.classList.add('is-hover'));
            wrapper.addEventListener('mouseleave', () => wrapper.classList.remove('is-hover'));
        });
    };

    function normalizeLabel(text) {
        return String(text || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function inferToolkitFromLabel(moduleId, title) {
        const label = normalizeLabel(`${moduleId} ${title}`);
        const rules = [
            {
                keys: ['derive', 'gradient', 'jacob', 'hess', 'taylor'],
                analogy: "On regarde une pente locale pour savoir dans quelle direction avancer ou corriger.",
                equation: "$$\\theta_{t+1}=\\theta_t-\\eta\\nabla_\\theta\\mathcal{L}(\\theta_t)$$",
                example: "Ajuster les poids d'un modele pour reduire la loss a chaque iteration."
            },
            {
                keys: ['vecteur', 'matrix', 'algebre', 'svd', 'eigen', 'espace'],
                analogy: "Les donnees vivent dans un espace; les matrices sont les transformations de cet espace.",
                equation: "$$\\mathbf{y}=W\\mathbf{x}+\\mathbf{b}$$",
                example: "Projeter des embeddings en dimension plus faible pour visualiser des clusters."
            },
            {
                keys: ['proba', 'bayes', 'stat', 'bernoulli', 'gauss', 'bootstrap'],
                analogy: "On transforme de l'incertitude en decision mesurable avec des regles probabilistes.",
                equation: "$$P(A\\mid B)=\\frac{P(B\\mid A)P(A)}{P(B)}$$",
                example: "Prioriser des alertes selon la probabilite de vrai incident."
            },
            {
                keys: ['optim', 'adam', 'sgd', 'momentum', 'lagrange'],
                analogy: "L'optimisation est une recherche de trajectoire stable vers un minimum utile.",
                equation: "$$\\theta_{t+1}=\\theta_t-\\eta_t\\,g_t$$",
                example: "Trouver un compromis vitesse/stabilite entre SGD et AdamW."
            },
            {
                keys: ['cnn', 'vision', 'image', 'yolo', 'segment'],
                analogy: "La vision extrait des motifs locaux puis compose des objets et decisions globales.",
                equation: "$$(f*g)(t)=\\sum_\\tau f(\\tau)g(t-\\tau)$$",
                example: "Passer de la classification image a la detection d'objets sur flux video."
            },
            {
                keys: ['nlp', 'lang', 'bert', 'gpt', 'transformer', 'attention'],
                analogy: "Chaque token regarde les autres pour construire un sens contextuel.",
                equation: "$$\\operatorname{Attention}(Q,K,V)=\\operatorname{softmax}\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V$$",
                example: "Ameliorer un assistant texte avec un meilleur contexte de conversation."
            },
            {
                keys: ['gan', 'vae', 'diffusion', 'generatif', 'genai'],
                analogy: "Un modele generatif apprend la distribution des exemples pour en creer de nouveaux.",
                equation: "$$\\theta^*=\\arg\\max_\\theta\\sum_i\\log p_\\theta(x_i)$$",
                example: "Generer des variantes d'images produits pour des tests marketing."
            },
            {
                keys: ['rl', 'q_learning', 'policy', 'actor', 'critic', 'robot'],
                analogy: "L'agent apprend comme un joueur: action, feedback, correction, repetition.",
                equation: "$$Q(s,a)\\leftarrow Q(s,a)+\\alpha\\left[r+\\gamma\\max_{a'}Q(s',a')-Q(s,a)\\right]$$",
                example: "Apprendre une strategie de navigation efficace sous contraintes de cout."
            },
            {
                keys: ['graph', 'gnn', 'sage', 'gat', 'laplac'],
                analogy: "Un graphe met les relations au centre; chaque noeud apprend de ses voisins.",
                equation: "$$h_v^{(k+1)}=\\phi\\left(h_v^{(k)},\\square_{u\\in\\mathcal{N}(v)}\\psi(h_u^{(k)})\\right)$$",
                example: "Predire des liens probables dans un reseau de recommandation."
            },
            {
                keys: ['rag', 'agent', 'tool', 'multimodal', 'vlm', 'world model'],
                analogy: "On combine memoire externe, raisonnement et action outillee dans une seule boucle.",
                equation: "$$\\text{Decision}=f(\\text{Reasoning},\\text{Retrieved Context},\\text{Tools})$$",
                example: "Construire un assistant entreprise qui cite ses sources et appelle des APIs metier."
            },
            {
                keys: ['quantum', 'qubit', 'schrodinger', 'hilbert', 'gate'],
                analogy: "Le quantique manipule des amplitudes coherentes avant mesure probabiliste.",
                equation: "$$i\\hbar\\frac{\\partial}{\\partial t}\\lvert\\psi\\rangle=\\hat{H}\\lvert\\psi\\rangle$$",
                example: "Comparer une intuition classique a une simulation de circuit quantique simple."
            }
        ];

        const rule = rules.find(item => item.keys.some(key => label.includes(key)));
        if (!rule) return {};

        return {
            analogy: rule.analogy,
            equation: rule.equation,
            example: rule.example
        };
    }

    function stripEquationDelimiters(value) {
        const raw = String(value || '').trim();
        if (!raw) return '';
        if (raw.startsWith('$$') && raw.endsWith('$$')) return raw.slice(2, -2).trim();
        if (raw.startsWith('\\[') && raw.endsWith('\\]')) return raw.slice(2, -2).trim();
        if (raw.startsWith('$') && raw.endsWith('$')) return raw.slice(1, -1).trim();
        return raw;
    }

    function inferEquationTerms(equation) {
        const expr = stripEquationDelimiters(equation);
        const lexicon = [
            { pattern: /\\theta|\btheta\b|θ/i, term: 'θ (parametres)', meaning: "Les poids internes du modele ajustes pendant l'apprentissage. Un GPT-4 en a ~1.8 trillion." },
            { pattern: /\\mathcal\{L\}|\\ell|\bloss\b/i, term: 'L (loss)', meaning: "La mesure d'erreur a minimiser. Plus elle est basse, mieux le modele predit. Exemples: MSE, cross-entropy, contrastive loss." },
            { pattern: /\\nabla|grad/i, term: '∇ (gradient)', meaning: "Le vecteur de derivees partielles: il pointe vers la montee la plus raide. On descend en sens inverse pour minimiser la loss." },
            { pattern: /\\eta|\blr\b|learning/i, term: 'η (learning rate)', meaning: "La taille du pas d'optimisation. Typiquement 1e-3 a 1e-5. Trop grand = divergence, trop petit = stagnation." },
            { pattern: /\\gamma|discount/i, term: 'γ (discount)', meaning: "Le facteur d'actualisation des recompenses futures (RL). γ=0.99 valorise le long terme, γ=0.9 le court terme." },
            { pattern: /\\alpha(?!\\lpha)/i, term: 'α', meaning: "Coefficient de controle: pas d'apprentissage (Q-learning), taux de melange, ou force de regularisation selon le contexte." },
            { pattern: /\\beta/i, term: 'β', meaning: "Hyperparametre de ponderation. En Adam: β₁=0.9 (momentum), β₂=0.999 (adaptation). En VAE: poids de la KL-divergence." },
            { pattern: /\bQ\(|Q\(/, term: 'Q(s,a)', meaning: "La Q-value: la recompense totale attendue en prenant l'action a dans l'etat s, puis en suivant la politique optimale." },
            { pattern: /softmax/i, term: 'softmax', meaning: "softmax(z)ᵢ = exp(zᵢ)/Σexp(zⱼ). Transforme des logits en probabilites qui somment a 1. Attention: sensible a la temperature." },
            { pattern: /\\sum|∑/, term: 'Σ (somme)', meaning: "Somme discrete: accumule des contributions elementaires. En ML: souvent la somme sur les exemples du batch ou les classes." },
            { pattern: /\\int|∫/, term: '∫ (integrale)', meaning: "Addition continue d'un effet local sur un intervalle. Generalise la somme discrete au cas continu. Cle pour les densites de probabilite." },
            { pattern: /\\mathbb\{E\}|expect|\\operatorname\{E\}/i, term: 'E[·] (esperance)', meaning: "La moyenne sur une distribution. E[X] = Σ x·P(x) (discret) ou ∫ x·f(x)dx (continu). Fondement de toute loss en ML." },
            { pattern: /\\operatorname\{Var\}|\\sigma\^2|variance/i, term: 'Var / σ²', meaning: "La variance: mesure la dispersion autour de la moyenne. σ = √Var est l'ecart-type, dans l'unite des donnees." },
            { pattern: /p\(|P\(/, term: 'p(·) / P(·)', meaning: "Probabilite (discrete) ou densite (continue). P(A) ∈ [0,1]. p(x) peut depasser 1 (c'est une densite, pas une probabilite directe)." },
            { pattern: /\\arg\\min|\\arg\\max|argmin|argmax/i, term: 'argmin / argmax', meaning: "Retourne le parametre qui minimise/maximise la fonction, pas la valeur du min/max elle-meme." },
            { pattern: /\\lim|\\to\s*0|\\to\\infty/i, term: 'lim (limite)', meaning: "Le comportement quand la variable tend vers une valeur. Fondement du calcul infinitesimal: derivee = lim du taux d'accroissement." },
            { pattern: /\\partial|\\frac\{\\partial/i, term: '∂ (derivee partielle)', meaning: "La derivee par rapport a une variable en gardant les autres fixes. ∂L/∂w = sensibilite de la loss au poids w." },
            { pattern: /\\log|\\ln/i, term: 'log / ln', meaning: "Le logarithme: inverse de l'exponentielle. log(ab) = log(a)+log(b). En ML: transforme des produits en sommes (log-likelihood)." },
            { pattern: /\\sigma\(|\\operatorname\{sigmoid\}|ReLU|\\max\(0/i, term: 'σ / ReLU (activation)', meaning: "Fonction d'activation non-lineaire. Sans elle, N couches lineaires = 1 seule couche. Donne sa puissance au deep learning." },
            { pattern: /\\hat\{y\}|\\hat y/i, term: 'ŷ (prediction)', meaning: "La sortie du modele: l'estimation de la vraie valeur y. Le chapeau ^ signifie 'estime' par convention." },
            { pattern: /\\lambda/i, term: 'λ (lambda)', meaning: "Souvent: coefficient de regularisation (L1/L2), valeur propre (algebre lineaire), ou taux de Poisson (stats)." },
            { pattern: /\\rho/i, term: 'ρ (rho)', meaning: "En stats: coefficient de correlation. En quantique: matrice densite. En optimisation: facteur d'oubli." },
            { pattern: /\\pi(?!\\)/i, term: 'π (politique/pi)', meaning: "En RL: la politique (strategie de l'agent). En maths: le nombre pi ≈ 3.14159. Contexte determine le sens." },
            { pattern: /\\mathbf\{x\}|x_t|x_i/i, term: 'x (entree)', meaning: "Le vecteur d'entree: features, embedding, signal brut. Dimension typique: 768 (BERT) a 12288 (GPT-4)." },
            { pattern: /W(?!_)|\\mathbf\{W\}/i, term: 'W (poids)', meaning: "La matrice de poids apprise: encode la transformation lineaire. Chaque ligne = un neurone de sortie." }
        ];

        const hits = [];
        lexicon.forEach(item => {
            if (item.pattern.test(expr)) hits.push({ term: item.term, meaning: item.meaning });
        });

        if (!hits.length) {
            return [
                { term: 'Terme gauche', meaning: "Ce que le modele produit, estime ou cherche a predire." },
                { term: 'Terme droit', meaning: "La regle de calcul qui combine donnees, parametres et contraintes." }
            ];
        }

        const unique = [];
        const seen = new Set();
        hits.forEach(item => {
            if (seen.has(item.term)) return;
            seen.add(item.term);
            unique.push(item);
        });
        return unique.slice(0, 6);
    }

    function inferTipsAndFact(moduleId, title, courseId) {
        const label = normalizeLabel(`${courseId} ${moduleId} ${title}`);

        let tip = "Relie chaque symbole de la formule a un objet concret de ton probleme avant de coder quoi que ce soit.";
        let fact = "Geoffrey Hinton, Yann LeCun et Yoshua Bengio ont recu le prix Turing 2018 (le 'Nobel de l'informatique') pour leurs travaux sur le deep learning, commences dans les annees 1980 alors que presque personne n'y croyait.";

        if (/derive|gradient|jacob|hess|taylor/.test(label)) {
            tip = "Retiens les derivees de base par coeur (xⁿ, eˣ, ln, sin, cos) et maitrise la regle de chaine: tu pourras deriver n'importe quelle expression composee.";
            fact = "La differentiation automatique (autograd) de PyTorch/JAX n'utilise NI la derivation symbolique NI les differences finies: elle applique la regle de chaine sur le graphe de calcul, combinant exactitude et efficacite.";
        } else if (/fonction|function|map/.test(label)) {
            tip = "Pour verifier ta comprehension d'une fonction, donne-toi 3 inputs concrets et calcule les outputs a la main. Si tu ne peux pas, tu ne comprends pas encore la formule.";
            fact = "Le theoreme d'approximation universelle (Cybenko, 1989) prouve qu'un reseau a une couche cachee peut approximer n'importe quelle fonction continue — mais il ne dit pas que c'est PRATIQUE. Les reseaux profonds sont exponentiellement plus efficaces.";
        } else if (/integrale|integral|aire/.test(label)) {
            tip = "En haute dimension, l'integration numerique classique (trapezes, Simpson) est impraticable. Utilise la methode de Monte Carlo: elle converge en O(1/√N) independamment de la dimension!";
            fact = "L'integration de Monte Carlo a ete inventee par Ulam et von Neumann pendant le projet Manhattan (1946) pour simuler la diffusion des neutrons dans une bombe atomique.";
        } else if (/suite|sequence|serie|convergence/.test(label)) {
            tip = "En deep learning, surveille toujours la loss de VALIDATION (pas train) pour juger la convergence. La loss de train peut descendre indefiniment par memorisation sans que le modele ne generalise.";
            fact = "Le serie de Grandi (1 - 1 + 1 - 1 + ...) n'a pas de somme au sens classique, mais Euler lui attribuait la valeur 1/2 par 'sommation de Cesaro'. Cette idee revient en physique des cordes ou des series divergentes ont un sens physique!";
        } else if (/distance|similari|metric|embed/.test(label)) {
            tip = "Pour les embeddings en haute dimension (>100), prefere la similarite cosinus a la distance euclidienne: elle est invariante a la norme des vecteurs et discrimine mieux le sens semantique.";
            fact = "La 'malediction de la dimensionnalite' (Bellman, 1957) dit qu'en dimension d, il faut exponentiellement plus de donnees pour couvrir l'espace. En dim 100, le volume d'une boule est presque entierement concentre pres de la surface!";
        } else if (/vecteur|vector/.test(label)) {
            tip = "Visualise les operations vectorielles: l'addition = bout a bout des fleches, le produit scalaire = projection, le produit vectoriel = perpendiculaire aux deux. L'intuition geometrique est plus fiable que le calcul aveugle.";
            fact = "Les word embeddings (Word2Vec, 2013) ont montre que les relations semantiques sont des DIRECTIONS dans l'espace vectoriel: vec('roi') - vec('homme') + vec('femme') ≈ vec('reine'). Les mots vivent dans une geometrie de sens!";
        } else if (/matri|matrix/.test(label)) {
            tip = "Quand tu multiplies des matrices, pense a la composition de transformations: AB signifie 'appliquer B d'abord, puis A'. L'ordre compte car AB ≠ BA en general!";
            fact = "Un GPU moderne (NVIDIA H100) effectue ~4000 TFLOPS en FP8. Presque toute cette puissance est dediee aux multiplications matricielles du deep learning. Le produit matriciel est litteralement le battement de coeur de l'IA.";
        } else if (/eigen|propre|spectral/.test(label)) {
            tip = "Si les valeurs propres d'un RNN sont >1 en module, les gradients explosent; si <1, ils s'evanouissent. C'est l'explication exacte du vanishing/exploding gradient.";
            fact = "Le PageRank de Google (1998) classe les pages web via le vecteur propre dominant de la matrice de liens. Larry Page et Sergey Brin ont bati un empire de 1000+ milliards sur une decomposition en valeurs propres!";
        } else if (/svd|decompo|pca/.test(label)) {
            tip = "Ne calcule jamais la SVD complete de grosses matrices. Utilise la SVD tronquee (randomized SVD) qui ne calcule que les k premieres valeurs singulieres — c'est exponentiellement plus rapide.";
            fact = "Netflix a organise un concours a 1 million de dollars (2009) pour ameliorer ses recommandations. La solution gagnante reposait largement sur la factorisation SVD des matrices utilisateur-film!";
        } else if (/rl|q_learning|policy|actor|critic|reward/.test(label)) {
            tip = "Observe toujours le tradeoff exploration/exploitation: un agent qui exploite trop tot rate potentiellement de meilleures strategies. Epsilon-greedy avec decay est le point de depart le plus simple.";
            fact = "AlphaGo (2016) a battu Lee Sedol au Go avec un coup ('Move 37') que les experts humains ont d'abord considere comme une erreur. Ce coup est devenu l'un des plus celebres de l'histoire du Go — genere par un agent RL!";
        } else if (/transformer|nlp|gpt|bert|attention|llm/.test(label)) {
            tip = "Le Multi-Head Attention utilise h tetes qui apprennent chacune un type de relation different (syntaxique, semantique, positionnelle). Visualise les matrices d'attention pour comprendre ce que chaque tete a appris.";
            fact = "Le papier 'Attention Is All You Need' (2017) a plus de 130 000 citations. Les 8 auteurs sont partis fonder Adept, Character.ai, Cohere, Essential AI, et d'autres startups d'IA — probablement le papier le plus 'commercially impactful' de l'histoire de l'IA.";
        } else if (/vision|cnn|yolo|segment|image/.test(label)) {
            tip = "Verifie d'abord l'echelle des objets (petits/grands) et la qualite des annotations avant de choisir une architecture. La majorite des gains en vision vient du pipeline de donnees, pas du backbone.";
            fact = "Le premier CNN (Neocognitron, Fukushima 1980) s'inspirait du cortex visuel des chats. Hubel et Wiesel avaient decouvert que certains neurones reagissent a des bords orientes — exactement comme les filtres de convolution!";
        } else if (/stats|proba|bayes|bootstrap|hypoth/.test(label)) {
            tip = "Toujours regarder au-dela de la moyenne: la variance te dit si tes resultats sont stables, et les quantiles te montrent les extremes. Un modele avec loss moyenne = 0.5 et variance = 10 est beaucoup moins fiable qu'un avec loss = 0.6 et variance = 0.1.";
            fact = "La theorie des probabilites est nee en 1654 d'une correspondance entre Pascal et Fermat sur un probleme de jeux de des. Le Chevalier de Mere, joueur professionnel, avait pose la question — les maths de l'incertitude sont nees du gambling!";
        } else if (/quantum|qubit|schrodinger|hilbert|gate|intricat/.test(label)) {
            tip = "Distingue toujours amplitude (nombre complexe, monde quantique) et probabilite (nombre reel positif, monde classique). L'interference entre amplitudes est LA source de tout avantage quantique.";
            fact = "Le theoreme de Bell (1964) prouve que les correlations quantiques sont plus fortes que tout ce que la physique classique permet. Les experiences de violation de Bell ont valu le prix Nobel 2022 a Aspect, Clauser et Zeilinger.";
        } else if (/generatif|diffusion|vae|gan|flow/.test(label)) {
            tip = "Les modeles generatifs apprennent des DISTRIBUTIONS, pas des etiquettes. Pour les evaluer, utilise FID (images), perplexite (texte), ou des metriques humaines — la loss d'entrainement ne suffit pas.";
            fact = "Les modeles de diffusion (Stable Diffusion, DALL-E) sont mathematiquement des EDP stochastiques: ils ajoutent du bruit gaussien puis apprennent a l'inverser. L'image emerge du bruit pur comme un message secret revele par un filtre.";
        } else if (/graph|gnn|sage|gat|laplac/.test(label)) {
            tip = "Pour les GNN, le nombre de couches de message-passing determine le 'rayon de reception' de chaque noeud. Trop de couches = over-smoothing (tous les noeuds deviennent identiques). 2-3 couches suffisent souvent.";
            fact = "Le theoreme spectral sur graphes relie les valeurs propres du Laplacien a la structure du graphe: le nombre de composantes connexes = nombre de valeurs propres nulles. Les GNN spectraux exploitent cette correspondance.";
        } else if (/optim|adam|sgd|momentum|lr|learning.*rate/.test(label)) {
            tip = "Le learning rate est l'hyperparametre #1. Bon reflexe: lr finder (augmenter lr exponentiellement, observer ou la loss diverge) puis choisir un lr 10x plus petit. Toujours utiliser un warmup + cosine decay.";
            fact = "Adam (Kingma & Ba, 2015) est l'optimiseur le plus utilise du deep learning avec 180 000+ citations. Son nom signifie 'Adaptive Moment Estimation'. Mais pour les LLM, SGD avec momentum peut rivaliser si on le tune bien!";
        } else if (/regulari|dropout|weight.*decay|overfit/.test(label)) {
            tip = "Pour les LLM, la regularisation principale est le VOLUME de donnees: avec assez de texte, le modele n'a pas le temps de memoriser. Le dropout est souvent inutile pour les tres gros modeles bien nourris en donnees.";
            fact = "Le dropout a ete invente par Hinton en 2012, inspire par la reproduction sexuee! La recombinaison genetique empeche les genes de trop cooperer, forcant chacun a etre utile seul — exactement ce que dropout fait avec les neurones.";
        } else if (/loss|cout|objectif|cross.*entropy|mse/.test(label)) {
            tip = "Le choix de la loss determine le COMPORTEMENT du modele. Changer la loss change ce que le modele optimise. Pour les datasets desequilibres, utilise la focal loss au lieu de la cross-entropy standard.";
            fact = "La cross-entropy vient de la theorie de l'information de Shannon (1948). Minimiser la cross-entropy = trouver le meilleur code de compression — le modele apprend litteralement a compresser l'information!";
        } else if (/backprop|retropropag|chaine/.test(label)) {
            tip = "Les skip connections (ResNet), la normalisation (LayerNorm), et les activations bien choisies (ReLU > sigmoid) resolvent les problemes de gradient. Ce sont des solutions architecturales a un probleme mathematique.";
            fact = "La backpropagation a ete inventee 3 fois: Linnainmaa (1970), Werbos (1974), Rumelhart/Hinton/Williams (1986). Hinton a dit que ca lui a pris des annees pour realiser que c'etait 'juste la regle de chaine'!";
        } else if (/norm|batch|layer|rms/.test(label)) {
            tip = "BatchNorm pour les CNN, LayerNorm pour les Transformers, GroupNorm quand le batch est petit. RMSNorm (LLaMA, Mistral) est une simplification 10-15% plus rapide que LayerNorm.";
            fact = "BatchNorm (2015) lisse le paysage de loss, rendant l'optimisation plus facile. Mais l'explication originale ('internal covariate shift') s'est averee incorrecte — on utilise un outil super efficace sans comprendre completement pourquoi!";
        } else if (/activ|relu|gelu|sigmoid|tanh/.test(label)) {
            tip = "ReLU est le defaut pour CNN/MLP, GELU/SiLU pour les Transformers. N'utilise JAMAIS sigmoid dans les couches cachees — le gradient s'evanouit. Sigmoid uniquement pour les sorties de probabilite ou les gates LSTM.";
            fact = "Le theoreme d'approximation universelle (1989) prouve qu'un reseau a 1 couche cachee avec activation peut approximer toute fonction continue. Mais les reseaux PROFONDS sont exponentiellement plus efficaces que les reseaux larges!";
        } else if (/mlops|deploy|production|pipeline|infra/.test(label)) {
            tip = "En production, le monitoring de data drift est aussi important que la precision du modele. Un modele parfait sur des donnees de 2023 peut etre inutile sur des donnees de 2025 si la distribution a change.";
            fact = "Google a publie 'Hidden Technical Debt in ML Systems' (2015), montrant que le code ML ne represente qu'une fraction minuscule d'un systeme ML complet. L'essentiel est la plomberie: donnees, monitoring, serving, tests.";
        } else if (/rag|agent|tool|retriev/.test(label)) {
            tip = "Dans un systeme RAG, la qualite du retrieval est plus importante que la taille du LLM. Un petit modele avec d'excellentes sources bat souvent un gros modele sans contexte pertinent.";
            fact = "Le concept de RAG (Retrieval-Augmented Generation) a ete formalise par Lewis et al. chez Meta en 2020. L'idee est simple mais revolutionnaire: au lieu de tout stocker dans les poids du modele, on lui donne acces a une base de connaissances externe.";
        } else if (/world.*model|simul|latent|imagination/.test(label)) {
            tip = "Un world model apprend dans un espace LATENT compact, pas dans l'espace brut des observations. La qualite de la representation latente determine la qualite des predictions — d'ou l'importance de l'encodeur.";
            fact = "Yann LeCun propose que les 'world models' (modeles du monde) sont la piece manquante de l'IA: un systeme qui apprend un modele interne de la physique du monde pour planifier et raisonner, comme le cerveau humain anticipe les consequences de ses actions.";
        }

        return { tip, fact };
    }

    function inferLabContextHint(moduleId, title, courseId) {
        const label = normalizeLabel(`${courseId} ${moduleId} ${title}`);
        if (/rl|q_learning|policy|actor|critic/.test(label)) return "Lis la courbe comme evolution de valeur/politique face au bruit d'exploration.";
        if (/vision|cnn|yolo|segment/.test(label)) return "Lis la courbe comme une qualite de detection sensible au bruit et au niveau de detail.";
        if (/transformer|nlp|attention|bert|gpt/.test(label)) return "Lis la courbe comme un score de pertinence contextuelle selon complexite et perturbation.";
        if (/stats|proba|bayes|bootstrap/.test(label)) return "Lis la courbe comme signal statistique + variance d'echantillonnage.";
        if (/quantum|qubit|schrodinger|hilbert|gate/.test(label)) return "Lis la courbe comme amplitude ideale + decoherence/bruit experimental.";
        return "Lis la courbe comme comportement d'un modele sous variation de complexite, bruit et vitesse d'ajustement.";
    }

    function getToolkit(moduleId, courseId, title) {
        const courseToolkit = COURSE_TOOLKITS[courseId] || COURSE_TOOLKITS.analysis;
        const moduleToolkit = MODULE_TOOLKITS[moduleId] || {};
        const inferredToolkit = inferToolkitFromLabel(moduleId, title);
        const equation = moduleToolkit.equation || inferredToolkit.equation || courseToolkit.equation;
        const extras = inferTipsAndFact(moduleId, title, courseId);

        return {
            analogy: moduleToolkit.analogy || inferredToolkit.analogy || courseToolkit.analogy,
            equation,
            equationTerms: moduleToolkit.equationTerms || inferEquationTerms(equation),
            breakdown: moduleToolkit.breakdown || courseToolkit.breakdown,
            why: moduleToolkit.why || courseToolkit.why,
            example: moduleToolkit.example || inferredToolkit.example || courseToolkit.example || "Relie le concept a un mini cas concret puis valide visuellement dans le labo.",
            tip: moduleToolkit.tip || extras.tip,
            didYouKnow: moduleToolkit.didYouKnow || extras.fact,
            labHint: moduleToolkit.labHint || inferLabContextHint(moduleId, title, courseId)
        };
    }

    function renderBreakdown(items) {
        return items.map(item => `<li class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"><span class="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-indigo-500"></span><span>${item}</span></li>`).join('');
    }

    function renderEquationTerms(items) {
        return (items || []).map(item => `
            <li class="rounded-lg border border-indigo-200/70 dark:border-indigo-800/70 bg-white/70 dark:bg-slate-900/40 px-3 py-2">
                <div class="text-xs font-bold text-indigo-700 dark:text-indigo-300">${item.term}</div>
                <div class="text-sm text-slate-700 dark:text-slate-200">${item.meaning}</div>
            </li>
        `).join('');
    }

    function renderToolkitHTML(moduleId, title, toolkit, interactive) {
        const interactiveHint = interactive
            ? `<div class="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-100">
                    <strong>Check animation :</strong> ${toolkit.labHint}
               </div>`
            : '';

        return `
            <section data-pedagogy-toolkit="${moduleId}" class="dma-toolkit-card rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-6 shadow-sm dark:border-indigo-900/60 dark:from-slate-900 dark:to-slate-800">
                <h3 class="text-xl font-extrabold text-indigo-900 dark:text-indigo-200">Boite a outils pedagogique : ${title}</h3>
                <p class="mt-2 text-sm text-slate-700 dark:text-slate-200"><strong>Analogie :</strong> ${toolkit.analogy}</p>
                <div class="mt-4 rounded-xl border border-indigo-200 bg-white/80 p-4 dark:border-indigo-800 dark:bg-slate-900/60">
                    <div class="text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Equation cle</div>
                    <div class="mt-2 text-slate-900 dark:text-slate-100">${renderEquationWithEye(toolkit.equation)}</div>
                </div>
                <div class="mt-4">
                    <div class="text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Equation decortiquee</div>
                    <ul class="mt-2 space-y-2">${renderBreakdown(toolkit.breakdown)}</ul>
                </div>
                <div class="mt-4">
                    <div class="text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Terme par terme</div>
                    <ul class="mt-2 grid gap-2">${renderEquationTerms(toolkit.equationTerms)}</ul>
                </div>
                <p class="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900 dark:border-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-100"><strong>Exemple d'application :</strong> ${toolkit.example}</p>
                <p class="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"><strong>Pourquoi c'est utile en IA :</strong> ${toolkit.why}</p>
                <div class="mt-4 grid gap-3 md:grid-cols-2">
                    <div class="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-sm text-amber-900 dark:text-amber-100"><strong>Tip :</strong> ${toolkit.tip}</div>
                    <div class="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 px-4 py-3 text-sm text-sky-900 dark:text-sky-100"><strong>Le saviez-vous ?</strong> ${toolkit.didYouKnow}</div>
                </div>
                ${interactiveHint}
            </section>
        `;
    }

    window.improveInteractiveVisibility = function (root) {
        const area = root || document.getElementById('content-area');
        if (!area) return;

        area.querySelectorAll('.bg-gray-900, .bg-black').forEach(panel => {
            panel.classList.add('dma-interactive-panel');
        });

        const nodes = area.querySelectorAll('canvas, [id$="-viz"], [id$="Canvas"], #network-canvas');
        nodes.forEach(node => {
            if (node.tagName === 'CANVAS') {
                node.classList.add('dma-viz-canvas');
                return;
            }

            node.classList.add('dma-viz-host');
            const canvas = node.querySelector('canvas');
            if (canvas) {
                canvas.classList.add('dma-viz-canvas');
            }
        });

        if (!document.body.classList.contains('dark-mode')) return;

        const parseRgb = (value) => {
            const match = String(value || '').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
            if (!match) return null;
            return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
        };

        const luminance = (rgb) => {
            if (!rgb) return null;
            const [r, g, b] = rgb.map(v => {
                const s = v / 255;
                return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };

        const getNearestSolidBackground = (el) => {
            let current = el;
            while (current && current !== area.parentElement) {
                const bg = getComputedStyle(current).backgroundColor;
                if (bg && bg !== 'transparent' && !/rgba\(\s*\d+,\s*\d+,\s*\d+,\s*0\s*\)/i.test(bg)) {
                    return bg;
                }
                current = current.parentElement;
            }
            return 'rgb(2, 6, 23)';
        };

        const textNodes = area.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,label,span,a,button,small,strong,em,code,td,th');
        textNodes.forEach(node => {
            if (!node || node.closest('#sidebar')) return;
            const styles = getComputedStyle(node);
            const fgLum = luminance(parseRgb(styles.color));
            const bgLum = luminance(parseRgb(getNearestSolidBackground(node)));
            if (fgLum === null || bgLum === null) return;

            const contrastTooLow = Math.abs(fgLum - bgLum) < 0.35;
            const onDarkSurface = bgLum < 0.25;
            if (!contrastTooLow || !onDarkSurface) return;

            if (/^h[1-6]$/i.test(node.tagName)) {
                node.style.setProperty('color', '#f8fbff', 'important');
            } else if (node.tagName === 'A') {
                node.style.setProperty('color', '#7dd3fc', 'important');
            } else if (node.tagName === 'BUTTON') {
                node.style.setProperty('color', '#f8fbff', 'important');
            } else {
                node.style.setProperty('color', '#dbe7ff', 'important');
            }
        });
    };

    function renderLearningFooter(moduleId, courseId, title) {
        const safeTitle = title || moduleId || 'module';
        return `
            <section data-learning-footer="${moduleId}" class="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-sm">
                <p class="text-slate-700 dark:text-slate-200"><strong>Synthese:</strong> ${safeTitle} relie intuition, equation et verification interactive.</p>
                <p class="mt-1 text-slate-600 dark:text-slate-300"><strong>Conseil:</strong> valide un point: \"ce que je vois dans l'animation\" = \"ce que dit la formule\".</p>
                <p class="mt-1 text-slate-500 dark:text-slate-400 text-xs">Contexte: ${courseId}/${moduleId}</p>
            </section>
        `;
    }

    window.enhanceModulePedagogy = function ({ moduleId, courseId, title, interactive }) {
        const area = document.getElementById('content-area');
        if (!area || !moduleId) return;
        const toolkit = getToolkit(moduleId, courseId, title || moduleId);

        const existing = area.querySelector(`[data-pedagogy-toolkit="${moduleId}"]`);
        if (!existing) {
            area.insertAdjacentHTML('beforeend', renderToolkitHTML(moduleId, title || moduleId, toolkit, Boolean(interactive)));
        }

        if (typeof window.bindLatexEyeInteractions === 'function') {
            window.bindLatexEyeInteractions(area);
        }

        const footer = area.querySelector(`[data-learning-footer="${moduleId}"]`);
        if (!footer) {
            area.insertAdjacentHTML('beforeend', renderLearningFooter(moduleId, courseId, title));
        }
    };
})();














