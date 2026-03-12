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
            analogy: "Un symbole est une instruction compacte: comme une icone d'application qui lance une action precise.",
            equation: "$$\\forall x\\in\\mathbb{R},\\;x^2\\ge 0$$"
        },
        ana_intro: {
            analogy: "Le calcul differentiel et integral, c'est alterner zoom local (derivee) et vue globale (integrale).",
            equation: "$$\\int_a^b f'(x)\\,dx=f(b)-f(a)$$"
        },
        functions: {
            analogy: "Une fonction est une machine: un input entre, un output sort selon une regle stable.",
            equation: "$$f: x\\mapsto f(x)$$"
        },
        derivatives: {
            analogy: "La derivee est le compteur de pente instantanee d'une courbe.",
            equation: "$$f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}$$"
        },
        gradient: {
            analogy: "Le gradient indique la direction de la montee la plus raide; on descend en sens inverse pour optimiser.",
            equation: "$$\\mathbf{x}_{t+1}=\\mathbf{x}_t-\\eta\\nabla f(\\mathbf{x}_t)$$"
        },
        integrals: {
            analogy: "L'integrale additionne des petites tranches d'effet pour obtenir un total.",
            equation: "$$\\int_a^b f(x)\\,dx=\\lim_{n\\to\\infty}\\sum_{k=1}^{n} f(x_k)\\Delta x$$"
        },
        sequences: {
            analogy: "Une suite est un scenario episode par episode; la convergence dit si l'histoire se stabilise.",
            equation: "$$\\lim_{n\\to\\infty}u_n=L$$"
        },
        distances: {
            analogy: "Une distance est une regle de proximite: plus elle est petite, plus deux objets se ressemblent.",
            equation: "$$d(\\mathbf{x},\\mathbf{y})=\\sqrt{\\sum_i(x_i-y_i)^2}$$"
        },
        alg_intro: {
            analogy: "L'algebre lineaire est le systeme de navigation des espaces a grande dimension.",
            equation: "$$\\mathbf{y}=W\\mathbf{x}+\\mathbf{b}$$"
        },
        sets: {
            analogy: "Les ensembles sont des boites de tri: union, intersection et difference organisent l'information.",
            equation: "$$A\\cup B,\\;A\\cap B,\\;A\\setminus B$$"
        },
        vectors: {
            analogy: "Un vecteur, c'est une fleche qui combine direction, sens et intensite.",
            equation: "$$\\lVert\\mathbf{v}\\rVert_2=\\sqrt{\\mathbf{v}^\\top\\mathbf{v}}$$"
        },
        matrices: {
            analogy: "Une matrice est une table de transformation qui agit sur tout un nuage de points.",
            equation: "$$C=AB$$"
        },
        spaces: {
            analogy: "Un espace vectoriel est une scene ou addition et homothetie restent coherentes.",
            equation: "$$\\text{span}(v_1,\\dots,v_k)=\\left\\{\\sum_i\\alpha_i v_i\\right\\}$$"
        },
        linear_map: {
            analogy: "Une application lineaire deforme l'espace sans casser les droites qui passent par l'origine.",
            equation: "$$T(\\alpha u+\\beta v)=\\alpha T(u)+\\beta T(v)$$"
        },
        det_inv: {
            analogy: "Le determinant mesure le facteur d'agrandissement de volume; l'inverse defait la transformation.",
            equation: "$$A^{-1}=\\frac{1}{\\det(A)}\\,\\mathrm{adj}(A)$$"
        },
        eigen: {
            analogy: "Les vecteurs propres sont des directions privilegiees qui ne tournent pas, elles s'etirent seulement.",
            equation: "$$A\\mathbf{v}=\\lambda\\mathbf{v}$$"
        },
        svd: {
            analogy: "La SVD decompose une transformation en rotation, etirement, rotation.",
            equation: "$$A=U\\Sigma V^\\top$$"
        },
        stat_intro: {
            analogy: "Les statistiques transforment des observations bruyantes en decisions quantifiees.",
            equation: "$$\\mathbb{E}[X]=\\sum_x xP(X=x)$$"
        },
        descrip: {
            analogy: "Moyenne, mediane et ecart-type resumment la forme d'un nuage de donnees.",
            equation: "$$\\sigma=\\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(x_i-\\mu)^2}$$"
        },
        correlation: {
            analogy: "La correlation mesure si deux variables dansent ensemble, pas si l'une cause l'autre.",
            equation: "$$\\rho_{X,Y}=\\frac{\\mathrm{Cov}(X,Y)}{\\sigma_X\\sigma_Y}$$"
        },
        proba_fond: {
            analogy: "La proba est une comptabilite de l'incertitude, pas une prediction magique.",
            equation: "$$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$$"
        },
        lois_discretes: {
            analogy: "Les lois discretes comptent des evenements entiers: succes, echecs, categories.",
            equation: "$$P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k}$$"
        },
        lois_continues: {
            analogy: "Les lois continues modelisent une grandeur mesurable sur un continuum.",
            equation: "$$f(x)=\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$$"
        },
        ai_intro: {
            analogy: "Une IA moderne assemble plusieurs boucles specialisees, comme une equipe avec roles complementaires.",
            equation: "$$\\text{Percevoir}\\rightarrow\\text{Predire}\\rightarrow\\text{Corriger}\\rightarrow\\text{Agir}$$"
        },
        transformers: {
            analogy: "Chaque token vote pour les autres selon leur pertinence contextuelle.",
            equation: "$$\\mathrm{Attention}(Q,K,V)=\\mathrm{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V$$"
        },
        backprop: {
            analogy: "On remonte la chaine de fabrication pour attribuer chaque part d'erreur au bon composant.",
            equation: "$$\\frac{\\partial \\mathcal{L}}{\\partial w}=\\frac{\\partial \\mathcal{L}}{\\partial y}\\frac{\\partial y}{\\partial w}$$"
        },
        ml_foundations: {
            analogy: "Le ML cherche une frontiere utile entre classes, sans memoriser le bruit.",
            equation: "$$\\hat{y}=f_\\theta(x),\\quad \\theta^*=\\arg\\min_\\theta\\mathcal{L}(\\theta)$$"
        },
        neural_pde: {
            analogy: "Au lieu de couches fixes, on laisse un champ se transformer comme un fluide.",
            equation: "$$\\partial_t h = D\\nabla^2 h + f_\\theta(h,t)$$"
        },
        free_energy: {
            analogy: "Un agent intelligent reduit son etonnement en ajustant croyances et actions.",
            equation: "$$F \\approx \\text{Complexite} - \\text{Precision}\\times\\text{Ajustement}$$"
        },
        action_flow: {
            analogy: "Parmi plusieurs routes, le systeme choisit la trajectoire au cout global le plus faible.",
            equation: "$$S=\\int L(q,\\dot q,t)\\,dt$$"
        },
        equivariance: {
            analogy: "Tourner l'objet puis predire doit revenir a predire puis tourner la sortie.",
            equation: "$$f(T_g x)=T'_g f(x)$$"
        },
        attractors: {
            analogy: "Deux trajectoires proches peuvent diverger vite tout en restant prisonnieres du meme attracteur.",
            equation: "$$\\dot x=f(x)$$"
        },
        hypergraphs: {
            analogy: "Des regles locales simples peuvent faire emerger des structures globales complexes.",
            equation: "$$G_{t+1}=R(G_t)$$"
        },
        unified_stack: {
            analogy: "Une architecture unifiee orchestre perception, dynamique, inference et action dans une meme boucle.",
            equation: "$$\\pi^*=\\arg\\min_\\pi\\;\\mathbb{E}[\\mathcal{C}(x,\\pi)]$$"
        },
        duality: {
            analogy: "Comme une meme piece vue sous deux eclairages differents, le test choisi revele onde ou particule.",
            equation: "$$I(y)\\propto\\left|\\psi_1(y)+\\psi_2(y)\\right|^2$$"
        },
        postulats: {
            analogy: "Les postulats sont les regles du jeu quantique: etat, evolution, mesure.",
            equation: "$$\\sum_i |c_i|^2=1$$"
        },
        hilbert: {
            analogy: "L'espace de Hilbert est la geometrie des amplitudes quantiques.",
            equation: "$$\\lvert\\psi\\rangle=\\alpha\\lvert0\\rangle+\\beta\\lvert1\\rangle,\\;|\\alpha|^2+|\\beta|^2=1$$"
        },
        operators: {
            analogy: "Un operateur est un bouton qui transforme l'etat avant mesure.",
            equation: "$$\\langle A\\rangle=\\langle\\psi|\\hat A|\\psi\\rangle$$"
        },
        linear_algebra: {
            analogy: "Le produit tensoriel combine deux petits etats en un etat compose plus riche.",
            equation: "$$|ab\\rangle=|a\\rangle\\otimes|b\\rangle$$"
        },
        groups: {
            analogy: "Les groupes capturent les symetries qui laissent les lois physiques intactes.",
            equation: "$$U(\\theta)=e^{-i\\theta\\hat G}$$"
        },
        functional_analysis: {
            analogy: "Un etat peut se decomposer en modes, comme un son en harmoniques.",
            equation: "$$f=\\sum_n c_n\\phi_n$$"
        },
        quantum_probability: {
            analogy: "La probabilite quantique vient d'abord d'une amplitude, puis de son module carre.",
            equation: "$$P(i)=|\\langle i|\\psi\\rangle|^2$$"
        },
        qubits: {
            analogy: "Un qubit est une boussole sur la sphere de Bloch, pas un simple bit flou.",
            equation: "$$|\\psi\\rangle=\\cos\\frac{\\theta}{2}|0\\rangle+e^{i\\phi}\\sin\\frac{\\theta}{2}|1\\rangle$$"
        },
        gates: {
            analogy: "Les gates sont des rotations precises de l'etat quantique.",
            equation: "$$|\\psi'\\rangle=U|\\psi\\rangle,\\;U^\\dagger U=I$$"
        },
        measurement: {
            analogy: "Mesurer revient a projeter un etat riche sur une issue discrete.",
            equation: "$$P(m)=\\langle\\psi|\\Pi_m|\\psi\\rangle$$"
        },
        schrodinger: {
            analogy: "L'hamiltonien joue le role de metronome de l'evolution quantique.",
            equation: "$$i\\hbar\\partial_t|\\psi\\rangle=\\hat H|\\psi\\rangle$$"
        },
        circuits: {
            analogy: "Un circuit quantique est une recette ordonnee de gates et mesures.",
            equation: "$$|\\psi_{out}\\rangle=U_L\\cdots U_2U_1|\\psi_{in}\\rangle$$"
        },
        algorithms: {
            analogy: "Les algorithmes quantiques amplifient les bonnes reponses par interference constructive.",
            equation: "$$\\mathcal{O}(\\sqrt{N})\\;\text{(Grover)}$$"
        },
        qml: {
            analogy: "Le QML apprend des parametres de portes comme un reseau apprend ses poids.",
            equation: "$$\\theta^*=\\arg\\min_\\theta\\,\\mathcal{L}(\\langle O\\rangle_\\theta)$$"
        },
        hybrid_models: {
            analogy: "Le classique prepare, le quantique transforme, le classique decide.",
            equation: "$$y=f_{cl}(U_\\theta(x))$$"
        },
        qft: {
            analogy: "En QFT, on quantifie des champs, pas des billes independantes.",
            equation: "$$[\\hat\\phi(x),\\hat\\pi(y)]=i\\hbar\\delta(x-y)$$"
        },
        stat_mech: {
            analogy: "On relie micro-etats et grandeurs macroscopiques par une moyenne statistique.",
            equation: "$$\\rho=\\frac{e^{-\\beta \\hat H}}{Z},\\quad Z=\\mathrm{Tr}(e^{-\\beta \\hat H})$$"
        },
        spin_su2: {
            analogy: "Le spin suit la symetrie SU(2), comme une rotation interne de l'etat.",
            equation: "$$U(\\mathbf{n},\\theta)=e^{-i\\theta\\mathbf{n}\\cdot\\boldsymbol{\\sigma}/2}$$"
        },
        entropy: {
            analogy: "L'entropie mesure la quantite d'incertitude ou de melange d'information.",
            equation: "$$S(\\rho)=-\\mathrm{Tr}(\\rho\\log\\rho)$$"
        },
        channels: {
            analogy: "Un canal quantique est une transformation bruitee mais physiquement valide.",
            equation: "$$\\mathcal{E}(\\rho)=\\sum_k E_k\\rho E_k^\\dagger$$"
        },
        theorems: {
            analogy: "Les theoremes donnent les limites et possibilites fondamentales de l'information quantique.",
            equation: "$$I(X;Y)\\le \\chi \\quad \text{(borne de Holevo)}$$"
        },
        qec: {
            analogy: "La correction d'erreurs encode l'information sur plusieurs qubits pour detecter sans detruire.",
            equation: "$$d\\ge 2t+1$$"
        },
        networks: {
            analogy: "Un reseau quantique relie des noeuds par intrication distribuee.",
            equation: "$$|\\Phi^+\\rangle_{AB}=\\frac{|00\\rangle+|11\\rangle}{\\sqrt{2}}$$"
        },
        qkd: {
            analogy: "La QKD transforme la physique de la mesure en alarme contre l'espionnage.",
            equation: "$$QBER=\\frac{N_{erreurs}}{N_{bits}}$$"
        },
        commitment: {
            analogy: "Le commitment est un coffre: on verrouille un choix maintenant, on l'ouvre plus tard.",
            equation: "$$\\text{binding} + \\text{hiding}$$"
        },
        randomness: {
            analogy: "Le QRNG extrait de l'alea fondamental au lieu d'un pseudo-hasard algorithmique.",
            equation: "$$H_{min}(X)=-\\log_2\\max_x P(X=x)$$"
        },
        security: {
            analogy: "Une attaque exploite une fuite physique qui trahit un bit meme si le protocole est correct sur le papier.",
            equation: "$$I(\\text{Eve};K)\\to 0$$"
        },
        open_systems: {
            analogy: "Un systeme ouvert echange en permanence energie et information avec son environnement.",
            equation: "$$\\dot\\rho=-\\frac{i}{\\hbar}[H,\\rho]+\\mathcal{D}(\\rho)$$"
        },
        decoherence: {
            analogy: "La decoherence efface progressivement les phases relatives qui portent l'information quantique.",
            equation: "$$\\rho_{01}(t)=\\rho_{01}(0)e^{-t/T_2}$$"
        },
        superconducting: {
            analogy: "Le qubit supraconducteur est un oscillateur non lineaire pilote par micro-ondes.",
            equation: "$$H=4E_C(\\hat n-n_g)^2-E_J\\cos\\hat\\varphi$$"
        },
        trapped_ions: {
            analogy: "Les ions pieges utilisent des vibrations collectives comme bus de couplage quantique.",
            equation: "$$H_{MS}\\propto\\sigma_x^{(i)}\\sigma_x^{(j)}$$"
        },
        photonic: {
            analogy: "En photonique, l'interference controle les probabilites de sortie.",
            equation: "$$P_0=\\cos^2(\\phi/2),\\;P_1=\\sin^2(\\phi/2)$$"
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
            { pattern: /\\theta|\btheta\b|θ/i, term: 'θ (parametres)', meaning: "Les poids internes du modele que l'on ajuste pendant l'apprentissage." },
            { pattern: /\\mathcal\{L\}|\\ell|\bloss\b/i, term: 'L (loss)', meaning: "La mesure d'erreur a minimiser pour mieux predire ou mieux agir." },
            { pattern: /\\nabla|grad/i, term: '∇ (gradient)', meaning: "La direction de variation maximale; en optimisation on descend dans la direction opposee." },
            { pattern: /\\eta|\blr\b|learning/i, term: 'η (learning rate)', meaning: "La taille du pas d'optimisation: trop grand diverge, trop petit ralentit." },
            { pattern: /\\gamma|discount/i, term: 'γ (discount)', meaning: "Le poids donne aux recompenses futures (surtout en RL)." },
            { pattern: /\\alpha/i, term: 'α', meaning: "Un coefficient de controle (pas, regularisation ou melange selon le contexte)." },
            { pattern: /\\beta/i, term: 'β', meaning: "Hyperparametre de ponderation, souvent lie a momentum, prior ou regularisation." },
            { pattern: /\bQ\(|Q\(/, term: 'Q(s,a)', meaning: "La valeur attendue d'une action dans un etat (RL value-based)." },
            { pattern: /softmax/i, term: 'softmax', meaning: "Transforme des scores en probabilites comparables qui somment a 1." },
            { pattern: /\\sum|∑/, term: 'Σ (somme)', meaning: "Accumule des contributions elementaires pour un resultat global." },
            { pattern: /\\int|∫/, term: '∫ (integrale)', meaning: "Addition continue d'un effet local sur un intervalle." },
            { pattern: /\\mathbb\{E\}|expect|\\operatorname\{E\}/i, term: 'E[.] (esperance)', meaning: "La moyenne attendue sur des donnees ou des trajectoires." },
            { pattern: /\\operatorname\{Var\}|\\sigma\^2|variance/i, term: 'Var / σ²', meaning: "Mesure la dispersion du signal autour de sa moyenne." },
            { pattern: /p\(|P\(/, term: 'p(.) / P(.)', meaning: "Probabilite ou densite associee a un evenement ou une observation." },
            { pattern: /W|\\mathbf\{x\}|x_t|x_i/, term: 'x, W', meaning: "x represente l'entree; W represente la transformation apprise." }
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

        let tip = "Fais d'abord varier un parametre dans le mini-lab, puis relis l'equation pour ancrer l'intuition.";
        let fact = "Les meilleurs resultats viennent souvent d'une bonne formulation du probleme avant le choix du modele.";

        if (/rl|q_learning|policy|actor|critic/.test(label)) {
            tip = "Observe toujours la tradeoff exploration/exploitation avant de tuner finement les hyperparametres.";
            fact = "Un agent peut sembler bon a court terme tout en etant sous-optimal sur horizon long si γ est mal regle.";
        } else if (/transformer|nlp|gpt|bert|attention/.test(label)) {
            tip = "Lis la matrice d'attention comme une carte de dependances entre tokens.";
            fact = "Le cout attention standard grandit quadratiquement avec la longueur de contexte.";
        } else if (/vision|cnn|yolo|segment/.test(label)) {
            tip = "Verifie d'abord l'echelle des objets (petits/grands) avant de conclure sur l'architecture.";
            fact = "Une grande partie des gains vision vient du pipeline donnees/augmentation autant que du backbone.";
        } else if (/stats|proba|bayes|bootstrap/.test(label)) {
            tip = "Compare moyenne et mediane pour detecter rapidement des distributions asymetriques.";
            fact = "Un modele bien calibre peut etre plus utile metier qu'un modele legerement plus accurate mais mal calibre.";
        } else if (/quantum|qubit|schrodinger|hilbert|gate/.test(label)) {
            tip = "Distingue toujours amplitude (quantique) et probabilite observee (mesure).";
            fact = "L'intrication ne transmet pas d'information plus vite que la lumiere, mais cree des correlations non classiques.";
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

    function inferContentBoost(moduleId, title, courseId) {
        const label = normalizeLabel(`${courseId} ${moduleId} ${title}`);
        let essentials = [
            "Identifie ce qui est entre (donnees/etat) et ce qui sort (prediction/decision).",
            "Relie chaque symbole de la formule a un objet concret du probleme.",
            "Teste un parametre a la fois pour isoler les effets."
        ];
        let pitfalls = [
            "Confondre performance sur train et generalisation sur donnees nouvelles.",
            "Tuner trop vite les hyperparametres sans diagnostic de base.",
            "Ignorer la qualite des donnees et blamer uniquement le modele."
        ];
        let useCases = [
            "Scoring metier (risque, priorisation, ranking).",
            "Aide a la decision avec explications simples.",
            "Prototype rapide avant industrialisation."
        ];
        let challenge = "Mini-defi: modifie 1 parametre, predis qualitativement l'effet, puis verifie dans le lab.";

        if (/rl|q_learning|policy|actor|critic/.test(label)) {
            essentials = [
                "Distingue policy, value et reward.",
                "Observe l'effet de gamma sur le court vs long terme.",
                "Mesure la stabilite de l'agent sur plusieurs episodes."
            ];
            pitfalls = [
                "Reward mal definie qui pousse a des comportements parasites.",
                "Exploration insuffisante ou trop agressive.",
                "Evaluation sur trop peu de seeds."
            ];
            useCases = [
                "Tarification dynamique.",
                "Ordonnancement/controle.",
                "Robotique et navigation."
            ];
            challenge = "Mini-defi RL: augmente gamma puis observe si l'agent sacrifie le court terme pour une meilleure strategie globale.";
        } else if (/transformer|nlp|gpt|bert|attention|rag|agent/.test(label)) {
            essentials = [
                "Comprends qui 'regarde qui' dans l'attention.",
                "Separer base model, contexte externe (RAG) et outils.",
                "Evaluer factualite, utilite et cout de latence."
            ];
            pitfalls = [
                "Confondre eloquence et veracite.",
                "Contexte trop long et peu pertinent.",
                "Absence de garde-fous sur l'usage des outils."
            ];
            useCases = [
                "Assistant documentaire.",
                "Automatisation support client.",
                "Copilote interne metier."
            ];
            challenge = "Mini-defi NLP: reduis le bruit de contexte (chunking/re-ranking) et compare la pertinence des reponses.";
        } else if (/vision|cnn|yolo|segment|detr/.test(label)) {
            essentials = [
                "Adapter resolution et architecture a la taille des objets.",
                "Verifier precision + recall, pas seulement accuracy.",
                "Controler l'effet des augmentations."
            ];
            pitfalls = [
                "Dataset desequilibre non traite.",
                "Mauvaise qualite d'annotations.",
                "Overfit sur un decor specifique."
            ];
            useCases = [
                "Detection defauts qualite.",
                "Comptage/monitoring video.",
                "Segmentation medicale/industrielle."
            ];
            challenge = "Mini-defi vision: augmente le bruit et teste si le modele reste robuste sur les petits objets.";
        } else if (/stats|proba|bayes|bootstrap|hypoth/.test(label)) {
            essentials = [
                "Distinguer correlation et causalite.",
                "Utiliser des intervalles de confiance.",
                "Verifier calibration des probabilites."
            ];
            pitfalls = [
                "Sur-interpreter un echantillon trop petit.",
                "Choisir une metrique non alignee metier.",
                "Ignorer le drift temporel."
            ];
            useCases = [
                "A/B testing.",
                "Detection d'anomalies.",
                "Prevision probabiliste."
            ];
            challenge = "Mini-defi stats: compare moyenne/mediane et observe l'effet d'outliers sur la conclusion.";
        } else if (/quantum|qubit|schrodinger|hilbert|gate/.test(label)) {
            essentials = [
                "Distinguer amplitude et probabilite mesuree.",
                "Comprendre l'effet des portes sur l'etat.",
                "Relier decoherence et perte d'information."
            ];
            pitfalls = [
                "Transposer intuition classique sans precaution.",
                "Ignorer le bruit materiel.",
                "Confondre intrication et communication instantanee."
            ];
            useCases = [
                "Simulation de systemes physiques.",
                "Cryptographie quantique.",
                "Optimisation exploree en recherche."
            ];
            challenge = "Mini-defi quantique: compare un etat ideal et un etat bruite, puis explique la difference de mesure.";
        }

        return { essentials, pitfalls, useCases, challenge };
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

    function renderContentBoostHTML(moduleId, boost) {
        const list = (items, color) => (items || []).map(item => `
            <li class="text-sm ${color} flex items-start gap-2">
                <span class="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
                <span>${item}</span>
            </li>
        `).join('');

        return `
            <section data-content-boost="${moduleId}" class="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-900 dark:bg-violet-950/25">
                <h3 class="text-lg font-bold text-violet-900 dark:text-violet-100">Boost du theme</h3>
                <p class="mt-1 text-sm text-violet-900 dark:text-violet-100">Approfondissement rapide pour renforcer les chapitres legerement denses.</p>
                <div class="mt-4 grid lg:grid-cols-3 gap-4">
                    <article class="rounded-xl border border-emerald-200 bg-white/80 p-3 dark:border-emerald-900 dark:bg-slate-900/50">
                        <h4 class="text-sm font-bold text-emerald-800 dark:text-emerald-300">Essentiels</h4>
                        <ul class="mt-2 space-y-2">${list(boost.essentials, 'text-emerald-900 dark:text-emerald-100')}</ul>
                    </article>
                    <article class="rounded-xl border border-rose-200 bg-white/80 p-3 dark:border-rose-900 dark:bg-slate-900/50">
                        <h4 class="text-sm font-bold text-rose-800 dark:text-rose-300">Erreurs frequentes</h4>
                        <ul class="mt-2 space-y-2">${list(boost.pitfalls, 'text-rose-900 dark:text-rose-100')}</ul>
                    </article>
                    <article class="rounded-xl border border-sky-200 bg-white/80 p-3 dark:border-sky-900 dark:bg-slate-900/50">
                        <h4 class="text-sm font-bold text-sky-800 dark:text-sky-300">Cas d'usage</h4>
                        <ul class="mt-2 space-y-2">${list(boost.useCases, 'text-sky-900 dark:text-sky-100')}</ul>
                    </article>
                </div>
                <div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
                    <strong>Mini-defi :</strong> ${boost.challenge}
                </div>
            </section>
        `;
    }

    const UNIVERSAL_LAB_STATES = new Map();

    function shouldInjectUniversalLab(courseId, moduleId) {
        const excluded = new Set(['coverage_global']);
        return !excluded.has(moduleId);
    }

    function cleanupUniversalLabs() {
        UNIVERSAL_LAB_STATES.forEach((state, key) => {
            if (!state.canvas || !state.canvas.isConnected) {
                if (state.rafId) cancelAnimationFrame(state.rafId);
                UNIVERSAL_LAB_STATES.delete(key);
            }
        });
    }

    function renderUniversalLabHTML(moduleId, equation, labHint) {
        return `
            <section data-universal-lab="${moduleId}" class="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/30">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <h3 class="text-lg font-bold text-cyan-900 dark:text-cyan-100">Mini labo interactif</h3>
                    <span class="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Version universelle</span>
                </div>
                <p class="mt-2 text-sm text-cyan-900 dark:text-cyan-100">${labHint || "Ajuste les curseurs et observe la courbe: c'est une base commune pour visualiser effet parametres + bruit + stabilite."}</p>
                <div class="mt-3 flex flex-wrap gap-2">
                    <button type="button" data-lab-mode="signal" class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-cyan-300 bg-white/90 text-cyan-900 dark:border-cyan-700 dark:bg-slate-900/60 dark:text-cyan-100">Signal</button>
                    <button type="button" data-lab-mode="optim" class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-cyan-300 bg-white/90 text-cyan-900 dark:border-cyan-700 dark:bg-slate-900/60 dark:text-cyan-100">Optimisation</button>
                    <button type="button" data-lab-mode="decision" class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-cyan-300 bg-white/90 text-cyan-900 dark:border-cyan-700 dark:bg-slate-900/60 dark:text-cyan-100">Decision</button>
                </div>
                <div class="mt-3 rounded-lg border border-cyan-200 bg-white/90 p-3 text-sm text-cyan-900 dark:border-cyan-800 dark:bg-slate-900/60 dark:text-cyan-100">
                    <div class="text-[11px] font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Equation de reference</div>
                    <div class="mt-1">${renderEquationWithEye(equation || '$$y=f_\\theta(x)$$')}</div>
                </div>
                <div class="mt-4 grid lg:grid-cols-3 gap-4">
                    <div class="lg:col-span-2 rounded-xl bg-slate-950 border border-slate-700 p-3">
                        <canvas width="640" height="240" class="w-full h-auto rounded" data-lab-canvas="${moduleId}"></canvas>
                    </div>
                    <div class="space-y-3">
                        <label class="block text-sm text-cyan-900 dark:text-cyan-100">Complexite <span class="font-bold" data-lab-complexity-val>3</span>
                            <input type="range" min="1" max="8" step="1" value="3" data-lab-complexity class="mt-1 w-full accent-cyan-600">
                        </label>
                        <label class="block text-sm text-cyan-900 dark:text-cyan-100">Bruit <span class="font-bold" data-lab-noise-val>0.20</span>
                            <input type="range" min="0" max="0.8" step="0.01" value="0.2" data-lab-noise class="mt-1 w-full accent-cyan-600">
                        </label>
                        <label class="block text-sm text-cyan-900 dark:text-cyan-100">Vitesse <span class="font-bold" data-lab-speed-val>1.00</span>
                            <input type="range" min="0.2" max="2.5" step="0.05" value="1" data-lab-speed class="mt-1 w-full accent-cyan-600">
                        </label>
                        <label class="block text-sm text-cyan-900 dark:text-cyan-100">Seuil / LR <span class="font-bold" data-lab-threshold-val>0.50</span>
                            <input type="range" min="0.05" max="0.95" step="0.01" value="0.5" data-lab-threshold class="mt-1 w-full accent-cyan-600">
                        </label>
                        <button type="button" data-lab-reset class="w-full rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-semibold px-3 py-2 transition">Relancer l'animation</button>
                        <div data-lab-metric class="rounded-lg border border-cyan-300/60 bg-white/80 dark:bg-slate-900/50 px-3 py-2 text-xs text-cyan-900 dark:text-cyan-100">
                            Mode signal: compare la courbe propre et la version bruitée.
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    function bindUniversalLab(area, moduleId, toolkit) {
        cleanupUniversalLabs();

        let host = area.querySelector(`[data-universal-lab="${moduleId}"]`);
        if (!host) {
            area.insertAdjacentHTML('beforeend', renderUniversalLabHTML(moduleId, toolkit.equation, toolkit.labHint));
            host = area.querySelector(`[data-universal-lab="${moduleId}"]`);
        }
        if (!host) return;

        const canvas = host.querySelector(`[data-lab-canvas="${moduleId}"]`);
        const complexityInput = host.querySelector('[data-lab-complexity]');
        const noiseInput = host.querySelector('[data-lab-noise]');
        const speedInput = host.querySelector('[data-lab-speed]');
        const thresholdInput = host.querySelector('[data-lab-threshold]');
        const complexityValue = host.querySelector('[data-lab-complexity-val]');
        const noiseValue = host.querySelector('[data-lab-noise-val]');
        const speedValue = host.querySelector('[data-lab-speed-val]');
        const thresholdValue = host.querySelector('[data-lab-threshold-val]');
        const resetBtn = host.querySelector('[data-lab-reset]');
        const metricEl = host.querySelector('[data-lab-metric]');
        const modeButtons = Array.from(host.querySelectorAll('[data-lab-mode]'));
        if (!canvas || !complexityInput || !noiseInput || !speedInput || !thresholdInput) return;

        let state = UNIVERSAL_LAB_STATES.get(moduleId);
        if (!state) {
            state = {
                canvas,
                ctx: canvas.getContext('2d'),
                phase: 0,
                complexity: parseInt(complexityInput.value, 10) || 3,
                noise: parseFloat(noiseInput.value) || 0.2,
                speed: parseFloat(speedInput.value) || 1,
                threshold: parseFloat(thresholdInput.value) || 0.5,
                mode: 'signal',
                optimX: -1.8 + Math.random() * 3.6,
                optimTrail: [],
                decisionPoints: [],
                rafId: null
            };
            UNIVERSAL_LAB_STATES.set(moduleId, state);
        } else {
            state.canvas = canvas;
            state.ctx = canvas.getContext('2d');
        }

        const gaussian = () => ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) / 6) - 0.5;

        const buildDecisionPoints = () => {
            const points = [];
            const total = 90;
            const separation = 0.12 + state.complexity * 0.035;
            const spread = 0.06 + state.noise * 0.12;
            for (let i = 0; i < total; i += 1) {
                const label = i < total / 2 ? 0 : 1;
                const mean = label === 0 ? (0.5 - separation) : (0.5 + separation);
                const x = Math.max(0.02, Math.min(0.98, mean + gaussian() * spread * 2));
                const yBase = (i % 45) / 44;
                const y = Math.max(0.04, Math.min(0.96, yBase * 0.8 + 0.1 + gaussian() * 0.08));
                points.push({ x, y, label });
            }
            state.decisionPoints = points;
        };

        const syncLabels = () => {
            if (complexityValue) complexityValue.innerText = String(state.complexity);
            if (noiseValue) noiseValue.innerText = state.noise.toFixed(2);
            if (speedValue) speedValue.innerText = state.speed.toFixed(2);
            if (thresholdValue) thresholdValue.innerText = state.threshold.toFixed(2);
        };

        const setMode = (mode) => {
            state.mode = mode;
            modeButtons.forEach(btn => {
                const active = btn.getAttribute('data-lab-mode') === mode;
                btn.classList.toggle('bg-cyan-700', active);
                btn.classList.toggle('text-white', active);
                btn.classList.toggle('border-cyan-700', active);
                btn.classList.toggle('bg-white/90', !active);
                btn.classList.toggle('text-cyan-900', !active);
            });
        };

        const drawSignal = (ctx, w, h) => {
            const mid = h / 2;
            ctx.strokeStyle = 'rgba(148,163,184,0.25)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, mid);
            ctx.lineTo(w, mid);
            ctx.stroke();

            ctx.beginPath();
            for (let x = 0; x < w; x += 1) {
                const t = x / w;
                const y = mid + Math.sin((t * Math.PI * 2 * state.complexity) + state.phase) * (h * 0.22);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            for (let x = 0; x < w; x += 4) {
                const t = x / w;
                const base = Math.sin((t * Math.PI * 2 * state.complexity) + state.phase) * (h * 0.22);
                const jitter = (Math.random() - 0.5) * state.noise * h * 0.35;
                const y = mid + base + jitter;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.9;
            ctx.stroke();
            ctx.globalAlpha = 1;

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '12px Arial';
            ctx.fillText('Signal propre (bleu) + signal bruite (cyan)', 12, 20);
            if (metricEl) {
                metricEl.innerText = `Mode signal: complexite=${state.complexity}, bruit=${state.noise.toFixed(2)}`;
            }
        };

        const drawOptim = (ctx, w, h) => {
            const xmin = -3;
            const xmax = 3;
            const c = 0.25 + state.complexity * 0.08;
            const f = x => c * x * x + 0.18 * Math.sin(2.2 * x) + 0.04 * x;
            const grad = x => 2 * c * x + 0.396 * Math.cos(2.2 * x) + 0.04;

            const samples = [];
            let ymin = Infinity;
            let ymax = -Infinity;
            for (let i = 0; i <= 200; i += 1) {
                const x = xmin + (i / 200) * (xmax - xmin);
                const y = f(x);
                samples.push({ x, y });
                if (y < ymin) ymin = y;
                if (y > ymax) ymax = y;
            }
            ymin -= 0.3;
            ymax += 0.3;

            const toX = x => 24 + ((x - xmin) / (xmax - xmin)) * (w - 48);
            const toY = y => h - 24 - ((y - ymin) / Math.max(1e-9, ymax - ymin)) * (h - 48);

            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            samples.forEach((p, i) => {
                const px = toX(p.x);
                const py = toY(p.y);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            });
            ctx.stroke();

            const lr = 0.01 + state.threshold * 0.09;
            state.optimX -= lr * grad(state.optimX) * state.speed + (Math.random() - 0.5) * state.noise * 0.08;
            state.optimX = Math.max(xmin, Math.min(xmax, state.optimX));
            const pointY = f(state.optimX);
            state.optimTrail.push({ x: state.optimX, y: pointY });
            if (state.optimTrail.length > 80) state.optimTrail.shift();

            ctx.strokeStyle = 'rgba(244,114,182,0.8)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            state.optimTrail.forEach((p, i) => {
                const px = toX(p.x);
                const py = toY(p.y);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            });
            ctx.stroke();

            ctx.fillStyle = '#f472b6';
            ctx.beginPath();
            ctx.arc(toX(state.optimX), toY(pointY), 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '12px Arial';
            ctx.fillText('Paysage de loss + trajectoire de descente', 12, 20);
            if (metricEl) {
                metricEl.innerText = `Mode optimisation: x=${state.optimX.toFixed(3)} | loss=${pointY.toFixed(3)} | lr=${lr.toFixed(3)}`;
            }
        };

        const drawDecision = (ctx, w, h) => {
            if (!state.decisionPoints || !state.decisionPoints.length) buildDecisionPoints();
            const left = 24;
            const top = 24;
            const ww = w - 48;
            const hh = h - 48;

            ctx.strokeStyle = 'rgba(148,163,184,0.35)';
            ctx.strokeRect(left, top, ww, hh);

            const lineX = left + state.threshold * ww;
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(lineX, top);
            ctx.lineTo(lineX, top + hh);
            ctx.stroke();

            let tp = 0; let tn = 0; let fp = 0; let fn = 0;
            state.decisionPoints.forEach((p, i) => {
                const pred = p.x >= state.threshold ? 1 : 0;
                if (pred === 1 && p.label === 1) tp += 1;
                else if (pred === 0 && p.label === 0) tn += 1;
                else if (pred === 1 && p.label === 0) fp += 1;
                else fn += 1;

                const px = left + p.x * ww;
                const py = top + (1 - p.y) * hh;
                const correct = pred === p.label;
                const pulse = 0.8 + 0.2 * Math.sin(state.phase + i * 0.12);
                const r = 3.2 * pulse;

                if (p.label === 1) ctx.fillStyle = correct ? 'rgba(34,197,94,0.95)' : 'rgba(239,68,68,0.95)';
                else ctx.fillStyle = correct ? 'rgba(56,189,248,0.95)' : 'rgba(239,68,68,0.95)';

                ctx.beginPath();
                ctx.arc(px, py, r, 0, Math.PI * 2);
                ctx.fill();
            });

            const total = tp + tn + fp + fn;
            const acc = total ? (tp + tn) / total : 0;
            const precision = (tp + fp) ? tp / (tp + fp) : 0;
            const recall = (tp + fn) ? tp / (tp + fn) : 0;

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '12px Arial';
            ctx.fillText('Frontiere de decision (seuil orange)', 12, 20);
            if (metricEl) {
                metricEl.innerText = `Mode decision: acc=${acc.toFixed(3)} | precision=${precision.toFixed(3)} | recall=${recall.toFixed(3)}`;
            }
        };

        const draw = () => {
            const ctx = state.ctx;
            if (!ctx || !state.canvas || !state.canvas.isConnected) return;

            const w = state.canvas.width;
            const h = state.canvas.height;
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = '#020617';
            ctx.fillRect(0, 0, w, h);

            if (state.mode === 'optim') drawOptim(ctx, w, h);
            else if (state.mode === 'decision') drawDecision(ctx, w, h);
            else drawSignal(ctx, w, h);

            state.phase += 0.03 * state.speed;
            state.rafId = requestAnimationFrame(draw);
        };

        if (state.rafId) cancelAnimationFrame(state.rafId);

        if (host.dataset.labBound !== '1') {
            host.dataset.labBound = '1';
            complexityInput.addEventListener('input', (event) => {
                state.complexity = parseInt(event.target.value, 10) || 3;
                buildDecisionPoints();
                syncLabels();
            });
            noiseInput.addEventListener('input', (event) => {
                state.noise = parseFloat(event.target.value) || 0;
                buildDecisionPoints();
                syncLabels();
            });
            speedInput.addEventListener('input', (event) => {
                state.speed = parseFloat(event.target.value) || 1;
                syncLabels();
            });
            thresholdInput.addEventListener('input', (event) => {
                state.threshold = parseFloat(event.target.value) || 0.5;
                syncLabels();
            });
            modeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const mode = btn.getAttribute('data-lab-mode') || 'signal';
                    setMode(mode);
                });
            });
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    state.phase = 0;
                    state.optimX = -1.8 + Math.random() * 3.6;
                    state.optimTrail = [];
                    buildDecisionPoints();
                });
            }
        }

        if (!state.decisionPoints || !state.decisionPoints.length) buildDecisionPoints();
        setMode(state.mode || 'signal');
        syncLabels();
        draw();
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

            if (shouldInjectUniversalLab(courseId, moduleId)) {
                bindUniversalLab(area, moduleId, toolkit);
            }
        }

        const boost = area.querySelector(`[data-content-boost="${moduleId}"]`);
        if (!boost) {
            const boostPayload = inferContentBoost(moduleId, title || moduleId, courseId);
            area.insertAdjacentHTML('beforeend', renderContentBoostHTML(moduleId, boostPayload));
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














