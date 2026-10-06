/* ======================================================================
   VITAL Laboratoires — catalogue partagé (index.html + producto.html)
   Pour ajouter une gamme : l'ajouter dans CATEGORIES, puis ses produits
   dans PRODUCTS avec category: '<clé>'. Photos : assets/produits/<slug>.jpg
   ====================================================================== */
(function () {
  var CATEGORIES = [
    { key: 'ms',  label: 'MS — IDP Medical Skin', short: 'MS',       desc: 'Soins dermatologiques de la peau',   bg: '#ECEFF4', color: '#2F4A6B', image: 'assets/produits/ms-atopic-lotion.jpg' },
    { key: 'awa', label: 'AWA',                    short: 'AWA',      desc: 'Peaux grasses et obstruées',         bg: '#EDF3F6', color: '#3A5A94', image: 'assets/produits/awa-mousse-purifiante.jpg' },
    { key: 'vip', label: 'VIP Skin — Equilibrium', short: 'VIP Skin', desc: 'Soins visage et protection solaire', bg: '#F1F0F2', color: '#5E6470', image: 'assets/produits/vip-skin-green-cream.jpg' }
  ];

  var TYPE_LABELS = {
    hydratation: 'Hydratation',
    grasses: 'Peaux grasses',
    sensibles: 'Peaux sensibles',
    nettoyant: 'Nettoyant',
    solaire: 'Solaire',
    cheveux: 'Cheveux & cuir chevelu',
    antiage: 'Anti-âge'
  };

  /* Avertissements réutilisables */
  var W_STD = [
    'Exclusivement pour usage externe, ne pas ingérer.',
    'Éviter le contact avec le contour des yeux, les plaies et les muqueuses.',
    'Tenir hors de portée des enfants.',
    'En cas de réaction indésirable, interrompre l’utilisation ; si elle persiste, consulter un médecin.',
    'Testé dermatologiquement.'
  ];
  var W_STD_ENFANTS = W_STD.concat([
    'Moins de 12 ans : consulter un médecin ou un pharmacien.',
    'Ne pas utiliser chez les enfants de moins de 3 ans.'
  ]);
  var W_AWA = [
    'Exclusivement pour usage externe.',
    'Éviter le contact avec le contour des yeux, les plaies et les muqueuses.'
  ];

  var PRODUCTS = [
    {
      slug: 'ms-atopic-lotion', name: 'MS Atopic Lotion', sub: 'Hydratation · Peau sensible', size: '400 ml',
      category: 'ms', types: ['hydratation', 'sensibles'], price: 21.10, code: '184272',
      short: 'Émulsion fluide spécialement conçue pour le <b>soin délicat de la peau atopique</b>.',
      desc: [
        'Émulsion fluide conçue pour le soin de la peau atopique.',
        'Régule la kératinisation de la peau en éliminant la rugosité et la sécheresse, et en atténuant les démangeaisons et les sensations de brûlure.'
      ],
      usage: 'Appliquer une petite quantité, de préférence après le bain ou la douche, en massant doucement jusqu’à absorption complète. Le produit contient un traceur qui laisse un film blanc sur la peau pour visualiser l’application : étaler sans lacunes, en massant doucement, jusqu’à disparition du film blanc.',
      indications: 'Apporte lubrification et hydratation aux peaux présentant une xérose, une atopie ou des altérations cutanées avec desquamation. Testé dermatologiquement.',
      actifs: ['Acide glycyrrhétinique', 'Huile de babassu'],
      compo: 'AQUA, BUTYROSPERMUM PARKII (SHEA) BUTTER, HYDROGENATED ETHYLHEXYL OLIVATE, ORBIGNYA OLEIFERA SEED OIL, CETEARYL ETHYLHEXANOATE, CETEARYL ALCOHOL, GLYCERIN, CETEARYL WHEAT STRAW GLYCOSIDES, ISOSTEARYL ISOSTEARATE, HYDROGENATED OLIVE OIL UNSAPONIFIABLES, LAURETH-9, GLYCYRRHETINIC ACID, PHENETHYL ALCOHOL, CAPRYLYL GLYCOL, XANTHAN GUM, PARFUM (LINALOOL).',
      warnings: W_STD,
      info: [['Poids', '0,48 kg'], ['Dimensions', '7 × 7 × 22 cm'], ['Format', '400 ml'], ['Types de peau', 'Peau sèche, peau sensible'], ['Usage', 'Soin de la peau'], ['Indications', 'Corps, visage, hydratants']]
    },
    {
      slug: 'ms-fotocontrol-familial', name: 'MS Fotocontrol Familial', sub: 'Protection solaire SPF 50+', size: '400 ml',
      category: 'ms', types: ['solaire'], price: 40.70, code: '176361',
      short: '<b>Protection de la peau</b> contre le rayonnement ultraviolet solaire.',
      desc: [
        'Gel-émulsion fluide hydratant qui protège la peau du rayonnement ultraviolet solaire. Non comédogène, il absorbe et réfléchit les UVA, les UVB et les infrarouges, et protège l’immunité cutanée.'
      ],
      usage: 'Appliquer sur une peau parfaitement sèche en massant doucement, 30 minutes avant l’exposition au soleil. Renouveler l’application au moins toutes les deux heures en cas d’exposition prolongée.',
      indications: 'Prévient les dommages solaires aigus (érythème, coup de soleil) et chroniques (photovieillissement, lésions dégénératives). Convient à tous les types de peau : enfants, adultes, personnes âgées, et cuir chevelu.',
      actifs: ['Méthoxycinnamate', 'Phényl benzimidazole'],
      compo: 'AQUA, OCTOCRYLENE, CYCLOHEXASILOXANE, METHYLENE BIS-BENZOTRIAZOLYL TETRAMETHYLBUTYLPHENOL, DIETHYLAMINO HYDROXYBENZOYL HEXYL BENZOATE, ISOAMYL P-METHOXYCINNAMATE, STEARETH-2, PENTYLENE GLYCOL, BUTYLENE GLYCOL COCOATE, PHENYLBENZIMIDAZOLE SULFONIC ACID, GLYCERIN, STEARETH-21, ETHYLHEXYL TRIAZONE, DISODIUM PHENYL DIBENZIMIDAZOLE TETRASULFONATE, DEHYDROXANTHAN GUM, ASCORBYL PALMITATE, TOCOPHEROL, HYDROGENATED VEGETABLE GLYCERIDES CITRATE, LECITHIN, ETHYLHEXYLGLYCERIN, SQUALANE, PPG-15 STEARYL ETHER, PARFUM, PEG/PPG-20/6 DIMETHICONE, PROPYLENE GLYCOL, BETA-SITOSTEROL, DISODIUM EDTA, BHT, SODIUM HYDROXIDE, LINALOOL.',
      warnings: W_STD,
      info: [['Poids', '0,49 kg'], ['Dimensions', '7 × 7 × 22 cm'], ['Format', '400 ml'], ['Types de peau', 'Peau grasse, mixte, normale, sèche, sensible'], ['Usage', 'Soin de la peau'], ['Indications', 'Anti-taches, corps, visage, hydratants, solaire']]
    },
    {
      slug: 'ms-gel-nettoyant-purifiant', name: 'MS Gel Nettoyant Purifiant', sub: 'Hygiène faciale délicate', size: '250 ml',
      category: 'ms', types: ['nettoyant'], price: 20.45, code: '166537',
      short: 'Gel nettoyant purifiant pour le <b>nettoyage tensioactif de la peau du visage</b>.',
      desc: [
        'Gel transparent pour le nettoyage de la peau du visage, aux tensioactifs exclusifs qui régulent le contenu lipidique et la flore bactérienne de la peau, avec un léger effet exfoliant sans irritation.'
      ],
      usage: 'Appliquer sur la peau du visage en massant doucement jusqu’à formation d’une légère mousse, rincer et répéter l’opération en laissant agir quelques minutes. Rincer enfin à l’eau tiède.',
      indications: 'Hygiène quotidienne non irritante des peaux à tendance séborrhéique, acnéiforme et/ou atopiforme.',
      actifs: ['Acide lactique', 'Acétate de zinc', 'Sel marin', 'Acide salicylique'],
      compo: 'AQUA, COCAMIDOPROPYL BETAINE, SODIUM LAURETH SULFATE, PROPYLENE GLYCOL, SODIUM LAUROYL SARCOSINATE, SODIUM CHLORIDE (SEA SALT), DISODIUM LAURETH SULFOSUCCINATE, ZINC ACETATE, SODIUM LAURYL SULFOACETATE, PHENOXYETHANOL, SALICYLIC ACID, LACTIC ACID, PEG/PPG-20/6 DIMETHICONE, SORBIC ACID, DEHYDROACETIC ACID, DISODIUM EDTA, PARFUM, BHT, SODIUM BENZOATE.',
      warnings: W_STD_ENFANTS,
      info: [['Poids', '0,28 kg'], ['Dimensions', '5,5 × 5,5 × 14 cm'], ['Format', '250 ml'], ['Usage', 'Soin de la peau'], ['Types de peau', 'Peau grasse, mixte, normale, sèche, sensible'], ['Indications', 'Antiseptique, corps, visage']]
    },
    {
      slug: 'ms-shampooing-sebo-regulateur', name: 'MS Shampooing Sébo-régulateur', sub: 'Cuir chevelu séborrhéique', size: '250 ml',
      category: 'ms', types: ['cheveux'], price: 19.35, code: '166543',
      short: 'Shampooing pour l’<b>hygiène et le soin des cheveux et du cuir chevelu gras</b>.',
      desc: [
        'Shampooing pour l’hygiène et le soin des cheveux et du cuir chevelu gras. Sa base douce et démêlante régule progressivement les sécrétions sébacées et évite l’effet rebond, ce qui permet d’espacer les lavages.'
      ],
      usage: 'Appliquer sur les cheveux et le cuir chevelu humides en massant doucement jusqu’à formation d’une légère mousse. Répéter l’opération et laisser agir quelques minutes, puis rincer à l’eau tiède. Peut s’utiliser quotidiennement.',
      indications: 'Hygiène fréquente du cuir chevelu séborrhéique ou gras, avec pellicules et irrité, qu’il normalise tout en lui redonnant son état naturel, avec brillance et volume. Testé dermatologiquement.',
      actifs: ['Acide salicylique', 'Cocamidopropyl bétaïne'],
      compo: 'AQUA, SODIUM LAURETH SULFATE, COCAMIDOPROPYL BETAINE, SODIUM CHLORIDE (SEA SALT), ACETUM, SALICYLIC ACID, GLYCOL DISTEARATE, PHENOXYETHANOL, DISODIUM LAURETH SULFOSUCCINATE, COCAMIDOPROPYL BETAINAMIDE MEA CHLORIDE, SODIUM LAURYL SULFOACETATE, CLIMBAZOLE, PIROCTONE OLAMINE, SORBIC ACID, DEHYDROACETIC ACID, POLYQUATERNIUM 10, DISODIUM EDTA, PARFUM, QUATERNIUM-80, PROPYLENE GLYCOL, COCAMIDOPROPYL DIMETHYLAMINE, LACTIC ACID.',
      warnings: W_STD_ENFANTS,
      info: [['Poids', '0,28 kg'], ['Dimensions', '5,5 × 5,5 × 14 cm'], ['Format', '250 ml'], ['Usage', 'Soin des cheveux']]
    },
    {
      slug: 'ms-shampooing-vinaigre', name: 'MS Shampooing au Vinaigre', sub: 'Usage fréquent', size: '250 ml',
      category: 'ms', types: ['cheveux'], price: 18.85, code: '159700.7',
      short: 'Shampooing pour l’<b>hygiène fréquente des cheveux et du cuir chevelu</b>.',
      desc: [
        'Shampooing pour le nettoyage fréquent des cheveux et du cuir chevelu, formulé sans sulfates, parabènes ni silicones, d’origine naturelle et vegan, élaboré avec du vinaigre de Xérès.'
      ],
      usage: 'Appliquer sur les cheveux et le cuir chevelu mouillés en massant doucement pour former une légère mousse. Répéter l’opération et laisser agir quelques minutes. Rincer à l’eau tiède.',
      indications: 'Hygiène fréquente des cheveux et du cuir chevelu : maintient le pH, réduit l’irritation et la sécheresse grâce à l’acidité naturelle du vinaigre, facilite le démêlage, referme la cuticule pour apporter brillance et volume, et limite la perte de couleur des cheveux colorés.',
      actifs: ['Acide acétique', 'Chlorhydrate d’arginine', 'Éthylènediamine disuccinate'],
      compo: 'AQUA, COCAMIDOPROPYL BETAINE, LAURYL GLUCOSIDE, SODIUM LAUROYL METHYL ISETHIONATE, DISODIUM LAURETH SULFOSUCCINATE, SODIUM LAURYL SULFOACETATE, GLYCERIN, VINEGAR, PHENETHYL ALCOHOL, DEHYDROACETIC ACID, PARFUM, CAPRYLYL GLYCOL, SODIUM BENZOATE, ARGININE HCL, TRISODIUM ETHYLENEDIAMINE DISUCCINATE, SODIUM CHLORIDE.',
      warnings: ['Conserver à l’abri de la lumière, de l’humidité et des températures élevées.'].concat(W_STD),
      info: [['Poids', '0,27 kg'], ['Dimensions', '5,5 × 5,4 × 14 cm'], ['Format', '250 ml'], ['Usage', 'Soin des cheveux']]
    },
    {
      slug: 'awa-complexe-equilibrant', name: 'AWA Complexe Équilibrant', sub: 'Gel normalisateur de la sécrétion sébacée', size: '100 ml',
      category: 'awa', types: ['grasses'], price: 14.90, code: '195100.7',
      short: '<b>Gel normalisateur de la sécrétion sébacée.</b> Complexe antiseptique et équilibrant dont les composants évitent la dilatation des pores.',
      desc: [
        'Gel normalisateur de la sécrétion sébacée. Prévient la dilatation des pores et les impuretés, apaise les peaux obstruées et évite l’apparition de nouvelles imperfections.',
        'Renouvellement antioxydant qui favorise l’élimination des points noirs ; la silice naturelle absorbe l’excès de sébum et réduit les brillances ; le composé polyglycérolé apporte hydratation et confort.'
      ],
      usage: 'Appliquer matin et soir, après la solution purifiante AWA, en massant doucement jusqu’à absorption. Usage externe : éviter le contour des yeux, les plaies et les muqueuses.',
      indications: 'Traitement dermatologique des peaux grasses, mixtes et à tendance acnéique : aide à récupérer et à freiner l’évolution des lésions d’acné, en rétablissant la flore bactérienne et fongique altérée.',
      actifs: ['Glycereth-26', 'Acide salicylique', 'Acide lactique', 'Extrait de Chlorella vulgaris', 'Silice', 'Glycérine'],
      compo: 'AQUA, GLYCERETH-26, SILICA, LACTIC ACID, SALICYLIC ACID, DEHYDROXANTHAN GUM, CHLORELLA VULGARIS EXTRACT, BENZYL ALCOHOL, GLYCERIN, SORBIC ACID, DISODIUM EDTA, PARFUM, LIMONENE, LINALOOL.',
      warnings: W_AWA,
      info: [['Poids', '0,174 kg'], ['Dimensions', '4,5 × 4,5 × 16 cm'], ['Format', '100 ml'], ['Indications', 'Anti-acné, antiseptique, visage, hydratants'], ['Types de peau', 'Peau grasse, normale'], ['Usage', 'Soin de la peau']]
    },
    {
      slug: 'awa-mousse-purifiante', name: 'AWA Mousse Purifiante', sub: 'Hygiène quotidienne · Peaux grasses et obstruées', size: '150 ml',
      category: 'awa', types: ['nettoyant', 'grasses'], price: 15.65, code: '195098.7',
      short: '<b>Mousse nettoyante purifiante.</b> Assure une hygiène correcte des peaux grasses et à impuretés.',
      desc: [
        'Mousse nettoyante purifiante qui assure une hygiène correcte des peaux grasses et à impuretés.'
      ],
      usage: 'Appliquer matin et soir sur le visage préalablement humidifié. Masser doucement sur le visage et le cou, puis rincer abondamment à l’eau. Usage externe : éviter le contour des yeux, les plaies et les muqueuses.',
      indications: 'Recommandée pour le nettoyage quotidien des peaux mixtes, grasses, acnéiques et congestionnées. Elle élimine correctement le maquillage tout en restituant éclat et hydratation. Son complexe séborégulateur normalise progressivement la production de sébum et évite l’obstruction des pores, laissant la peau propre et prête pour le traitement.',
      actifs: ['Acide salicylique', 'Extrait de Chlorella vulgaris', 'Soufre', 'Glycérine'],
      compo: 'AQUA, GLYCERETH-26, COCAMIDOPROPYL BETAINE, SODIUM LAUROYL METHYL ISETHIONATE, LAURYL GLUCOSIDE, BENZYL ALCOHOL, CHLORELLA VULGARIS EXTRACT, DISODIUM EDTA, SODIUM CHLORIDE, SULFUR, GLYCERIN, SORBIC ACID, PARFUM, LIMONENE, LINALOOL.',
      warnings: W_AWA,
      info: [['Poids', '0,200 kg'], ['Dimensions', '4,5 × 4,5 × 16,2 cm'], ['Format', '150 ml'], ['Indications', 'Anti-acné, antiseptique, visage, nettoyage'], ['Types de peau', 'Peau grasse, normale'], ['Usage', 'Soin de la peau']]
    },
    {
      slug: 'awa-gel-matifiant', name: 'AWA Gel Matifiant', sub: 'Gel hydratant teinté oil free SPF 50+', size: '50 ml',
      category: 'awa', types: ['grasses', 'solaire'], price: null, code: '',
      short: '<b>Gel hydratant teinté oil free</b> SPF 50+.',
      desc: [
        'Gel hydratant matifiant teinté, sans huile (oil free), SPF 50+.'
      ],
      usage: '', indications: '', actifs: [], compo: '', warnings: [],
      info: [['Format', '50 ml']]
    },
    {
      slug: 'vip-skin-filtre-solaire', name: 'VIP Skin Filtre Solaire SPF 50+', sub: 'Haute protection UVB/UVA', size: '50 ml',
      category: 'vip', types: ['solaire'], price: 32.90, code: '184897',
      short: 'Lipogel <b>photoprotecteur</b> à absorption rapide et non comédogène.',
      desc: [
        'Lipogel photoprotecteur à absorption rapide, non comédogène. Il maintient la souplesse et la lubrification de la peau tout en prévenant le photovieillissement et les dommages solaires dégénératifs. Il filtre les rayonnements UVA, UVB et infrarouges et protège l’immunité cutanée.'
      ],
      usage: 'Appliquer une fine couche 30 minutes avant l’exposition au soleil, en massant doucement sur le visage et le cou jusqu’à absorption complète. Renouveler toutes les 2 heures en cas d’exposition prolongée et après la baignade. En association avec d’autres cosmétiques : appliquer d’abord le filtre solaire, attendre l’absorption, puis appliquer les autres produits.',
      indications: 'Prévient les dommages solaires aigus (érythème, coup de soleil) et chroniques (vieillissement, dégénérescence). Testé dermatologiquement.',
      actifs: ['Méthoxycinnamate', 'Octocrylène', 'Vinyl diméthicone', 'Dioxyde de titane'],
      compo: 'CYCLOPENTASILOXANE, DIETHYLAMINO HYDROXYBENZOYL HEXYL BENZOATE, C12-C15 ALKYL BENZOATE, ISOAMYL P-METHOXYCINNAMATE, OCTOCRYLENE, DIMETHICONE / VINYL DIMETHICONE CROSSPOLYMER, TITANIUM DIOXIDE, CETEARYL ETHYLHEXANOATE, ETHYLHEXYL TRIAZONE, TOCOPHEROL (MIXED), ASCORBYL PALMITATE, LECITHIN, PROPYLENE GLYCOL, HYDROGENATED VEGETABLE GLYCERIDES CITRATE, BETASITOSTEROL, SQUALANE, PPG-15 STEARYL ETHER, ALUMINA, ALUMINIUM STEARATE, PEG/PPG-18/18 DIMETHICONE, BHT, POLYHYDROXYSTEARIC ACID, CYCLOHEXASILOXANE, PARFUM, CINNAMAL, CITRAL, GERANIOL, D-LIMONENE, BENZYL ALCOHOL, LINALOOL, CITRONELLOL, CINNAMYL ALCOHOL.',
      warnings: [],
      info: [['Poids', '0,17 kg'], ['Dimensions', '4,5 × 4,5 × 16,8 cm'], ['Format', '50 ml'], ['Usage', 'Soin de la peau'], ['Types de peau', 'Peau grasse, mixte, normale, sèche, sensible'], ['Indications', 'Anti-âge, anti-taches, visage, hydratants, solaire']]
    },
    {
      slug: 'vip-skin-gel-hydratation-active', name: 'VIP Skin Gel Hydratation Active', sub: 'Hydratation active', size: '50 ml',
      category: 'vip', types: ['hydratation'], price: 34.90, code: '184273',
      short: '<b>Émulsion hydratante de dernière génération</b> pour le visage et le cou.',
      desc: [
        'Émulsion hydratante de dernière génération pour le visage et le cou, à la sensation de fraîcheur marquée et à absorption rapide. Elle renforce la barrière cutanée, protège tout au long de la journée et peut servir de base de maquillage.'
      ],
      usage: 'Après le nettoyage et la tonification de la peau, appliquer une fine couche en massant jusqu’à absorption complète. Attendre quelques minutes avant d’appliquer le maquillage ou la protection solaire. À utiliser matin et soir.',
      indications: 'Soin hydratant quotidien de la peau du visage et du cou pour tous les types de peau, y compris sensibles ou à tendance séborrhéique. Testé dermatologiquement.',
      actifs: ['Forte concentration d’agents humectants', 'AHS (acide alpha-hydroxylé issu du raisin)'],
      compo: 'PROPYLENE GLYCOL, AQUA, CYCLOPENTASILOXANE, PENTYLENE GLYCOL, DIMETHICONE, CYCLOHEXASILOXANE, ETHYLHEXYLGLYCERIN, POTASSIUM BITARTRATE, CALCIUM TARTRATE, TARTARIC ACID, PHYTIC ACID, TOCOPHEROL (MIXED), ASCORBYL PALMITATE, LECITHIN, HYDROGENATED VEGETABLE GLYCERIDES CITRATE, BETA-SITOSTEROL, SQUALANE, PEG/PPG-18/18 DIMETHICONE, DIMETHICONE/VINYL DIMETHICONE CROSSPOLYMER, SODIUM HYDROXIDE, SODIUM CHLORIDE, PARFUM, CINNAMAL, CITRAL, GERANIOL, D-LIMONENE, BENZYL ALCOHOL, LINALOOL, CITRONELLOL, CINNAMYL ALCOHOL.',
      warnings: [],
      info: [['Dimensions', '4,5 × 4,5 × 16,8 cm'], ['Format', '50 ml'], ['Types de peau', 'Peau grasse, mixte, normale, sèche, sensible'], ['Indications', 'Visage, hydratants'], ['Usage', 'Soin de la peau']]
    },
    {
      slug: 'vip-skin-green-cream', name: 'VIP Skin Green Cream', sub: 'Crème visage équilibrante', size: '50 ml',
      category: 'vip', types: ['sensibles'], price: 48.90, code: '207205.3',
      short: 'Émulsion H/E à la texture douce et confortable, conçue pour les <b>peaux nécessitant une tolérance maximale</b> et une action apaisante continue.',
      desc: [
        'Green Cream est une émulsion huile-dans-eau à la texture douce et confortable, conçue pour les peaux nécessitant une tolérance maximale et une action apaisante continue. Sa formule associe des actifs lipidiques restaurateurs, des osmoprotecteurs cellulaires et des facteurs naturels d’hydratation, favorisant une peau plus équilibrée, souple et mieux armée face au stress environnemental.'
      ],
      usage: 'Appliquer une à deux fois par jour sur la peau propre et sèche du visage et/ou des zones à traiter. Étaler doucement jusqu’à absorption complète.',
      indications: 'Crème visage apaisante, protectrice et équilibrante, formulée pour le soin quotidien des peaux sensibles, réactives, sujettes aux rougeurs, à l’inconfort cutané et à l’altération de la fonction barrière.',
      actifs: ['Huile de graines de Carthamus tinctorius (riche en acide linoléique)', 'Ectoïne (osmoprotecteur cellulaire)', 'Alpha-hydroxyacides à faible concentration (glycolique, malique, tartrique)', 'Agents hydratants physiologiques (lactate de sodium, urée, saccharose, glycérine)'],
      compo: 'AQUA; DICAPRYLYL CARBONATE; CETEARYL ALCOHOL; CARTHAMUS TINCTORIUS SEED OIL; CETEARYL ETHYLHEXANOATE; GLYCERYL STEARATE; PENTYLENE GLYCOL; CAPRYLIC/CAPRIC TRIGLYCERIDE; CETEARYL GLUCOSIDE; ECTOIN; SODIUM MYRISTOYL GLUTAMATE; GLYCERIN; SODIUM LACTATE; GLYCOLIC ACID; TOCOPHERYL ACETATE; SUCROSE; UREA; SODIUM CITRATE; MALIC ACID; TARTARIC ACID; STEARIC ACID; SODIUM LAUROYL GLUTAMATE; XANTHAN GUM; ETHYLHEXYLGLYCERIN; PHENOXYETHANOL; ARGININE; PARFUM; CITRUS AURANTIUM PEEL OIL; GERANIOL; LIMONENE; LINALOOL; TERPINEOL; CI 61570; CI 18965.',
      warnings: W_STD,
      info: [['Poids', '0,17 kg'], ['Dimensions', '4,5 × 4,5 × 16,8 cm'], ['Format', '50 ml'], ['Indications', 'Anti-âge, visage, hydratants'], ['Types de peau', 'Peau grasse, mixte, normale, sèche, sensible'], ['Usage', 'Soin de la peau']]
    },
    {
      slug: 'vip-skin-serum', name: 'VIP Skin Sérum', sub: 'Rénovateur cellulaire', size: '30 ml',
      category: 'vip', types: ['antiage'], price: 39.90, code: '171258',
      short: 'Concentré d’AHS et de tartrates de raisin micro-encapsulés qui <b>stimule le renouvellement des cellules superficielles</b> de la peau.',
      desc: [
        'Traitement concentré associant AHS et tartrates de raisin micro-encapsulés, qui stimule le renouvellement des cellules superficielles de la peau avec une action antioxydante et préventive du vieillissement.'
      ],
      usage: 'Après le nettoyage et la tonification de la peau, appliquer une fine couche en massant jusqu’à absorption complète. À utiliser dans la routine du soir.',
      indications: 'Traitement antirides intensif du visage et du cou pour tous les types de peau, y compris sensibles. Réduit visiblement les rides superficielles et renouvelle l’aspect de la peau à court terme.',
      actifs: ['AHS (acide alpha-hydroxylé issu du raisin)', 'Rétinol', 'Acide ascorbique', 'Tocophérols'],
      compo: 'Aqua, cetearyl ethylhexanoate, cyclohexasiloxane, cyclopentasiloxane, pentylene glycol, propylene glycol, glycerin, steareth-2, steareth-21, tartaric acid, potassium bitartrate, calcium tartrate, dimethicone/vinyl dimethicone, retinol, ascorbyl tetraisopalmitate, polymethyl methacrylate, apricot kernel oil peg-6 esters, tricaprylin, caprylic/capric triglyceride, ethylhexylglycerin, ppg-15 stearyl ether, disodium edta, bht, tocopherol (mixed), betasitosterol, squalane, ascorbyl palmitate, lecithin, hydrogenated vegetable glycerides citrate, parfum, benzyl alcohol, limonene, linalool, geraniol, cinnamyl alcohol, citronellol, citral, cinnamal.',
      warnings: ['Ce produit contient de la vitamine A (rétinol) : tenir compte de votre apport quotidien en vitamine A avant utilisation.'].concat(W_STD),
      info: [['Poids', '0,12 kg'], ['Dimensions', '3,5 × 3,5 × 15,5 cm'], ['Format', '30 ml'], ['Types de peau', 'Peau grasse, mixte, normale, sèche, sensible'], ['Usage', 'Soin de la peau'], ['Indications', 'Anti-âge, anti-taches, visage, hydratants']]
    }
  ];

  PRODUCTS.forEach(function (p, i) {
    p.id = i + 1;
    p.image = 'assets/produits/' + p.slug + '.jpg';
  });

  /* ---------- Utilitaires ---------- */
  function catByKey(key) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].key === key) return CATEGORIES[i];
    return null;
  }
  function productBySlug(slug) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].slug === slug) return PRODUCTS[i];
    return null;
  }
  function fmtPrice(p) {
    if (p.price === null || p.price === undefined) return '[Prix]';
    return p.price.toFixed(2).replace('.', ',') + ' €';
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Panier (localStorage) ---------- */
  var CART_KEY = 'vital_cart';
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveCart(c) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {}
  }
  function cartCount() {
    var c = getCart(), n = 0;
    for (var k in c) n += c[k];
    return n;
  }
  function updateBadge() {
    var els = document.querySelectorAll('.cart-badge');
    for (var i = 0; i < els.length; i++) els[i].textContent = cartCount();
  }
  var toastTimer = null;
  function toast(msg) {
    var t = document.getElementById('vital-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'vital-toast';
      t.setAttribute('role', 'status');
      t.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(20px);background:#363B42;color:#fff;padding:12px 20px;border-radius:999px;font:600 13px Manrope,sans-serif;opacity:0;pointer-events:none;transition:all .25s ease;z-index:100;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(20px)';
    }, 1800);
  }
  function addToCart(id, qty) {
    var c = getCart();
    c[id] = (c[id] || 0) + (qty || 1);
    saveCart(c);
    updateBadge();
    toast('Ajouté au panier');
  }

  window.VITAL = {
    CATEGORIES: CATEGORIES, TYPE_LABELS: TYPE_LABELS, PRODUCTS: PRODUCTS,
    catByKey: catByKey, productBySlug: productBySlug, fmtPrice: fmtPrice, escapeHtml: escapeHtml,
    getCart: getCart, cartCount: cartCount, updateBadge: updateBadge, addToCart: addToCart, toast: toast
  };
})();
