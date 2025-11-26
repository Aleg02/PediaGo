// Contenu résumé (sections + puces). Tu pourras enrichir au fur et à mesure.
export type ProtocolSection = { title: string; bullets: string[] };
export const PROTOCOL_DETAILS: Record<string, ProtocolSection[]> = {
  "anaphylaxie": [
    { title: "Priorités", bullets: [
      "O2, scope, VVP, ECG",
      "Position demi-assise si détresse respi, Trendelenburg si hypotension",
      "Éviction de l'allergène"
    ]},
    { title: "Traitement initial", bullets: [
      "Adrénaline IM 0,01 mg/kg (max 0,5 mg) face latéro-externe cuisse",
      "Remplissage : NaCl 0,9% 20 mL/kg si hypoTA",
      "Aérosol adrénaline 0,1 mg/kg (max 5 mg) si atteinte VAS"
    ]},
    { title: "Si échec / aggravation", bullets: [
      "Adrénaline IVSE 0,1 µg/kg/min (monitorée) ou bolus 1 µg/kg dilué",
      "Solumédrol 1–2 mg/kg + Polaramine 0,1 mg/kg",
      "Glucagon si bêta-bloquant",
      "Surveillance 6–24h (biphasique)"
    ]},
  ],
  "choc-hemorragique": [
    { title: "Prise en charge initiale", bullets: [
      "Libération VA, O2 MHC (sat>95%), 2 VVP gros calibre ± IO",
      "Bilan biologique complet, E-FAST",
    ]},
    { title: "Traitements", bullets: [
      "Remplissage : cristalloïdes 10–20 mL/kg ± colloïdes",
      "Noradrénaline si échec (objectifs PAS/PAM selon âge/TC)",
      "Exacyl < 3h",
      "Transfusions PFC:CGR (1:2 à 1:1), plaquettes, fibrinogène",
      "Triade létale : réchauffer, Ca2+ ionisé >0,9, pH>7,2"
    ]},
    { title: "Contrôle du saignement", bullets: [
      "Garrot, pansement hémostatique, ceinture pelvienne",
      "Chirurgie / endoscopie / embolisation"
    ]},
  ],
  "aag": [
    { title: "Mesures initiales", bullets: [
      "Demi-assis, O2 titrée (sat 94–98%), scope",
      "AE salbutamol continu 1h + ipratropium",
      "Solumédrol IV 2 mg/kg"
    ]},
    { title: "Si échec / sévérité", bullets: [
      "MgSO4 IV (≥20 mg/kg/30') puis 10 mg/kg/h",
      "VNI / IOT (ISR si besoin), réglages protecteurs",
      "Réévaluation rapprochée"
    ]},
  ],
  "acr-enfant": [
    { title: "Réanimation de base", bullets: [
      "Appel aide, RCP, défibrillation si indiqué",
      "Voies aériennes, oxygène, accès vasculaire",
    ]},
    { title: "Réanimation avancée", bullets: [
      "Adrénaline IV/IO 0,01 mg/kg à intervalles recommandés",
      "Traiter les causes réversibles (H & T)"
    ]},
  ],
  "eme": [
    { title: "Critères", bullets: [
      "Convulsions ≥ 5 min ou répétées sans reprise de conscience",
    ]},
    { title: "Traitement", bullets: [
      "Clonazépam 0,015 mg/kg IVD ou Diazépam 0,5 mg/kg IR ou Midazolam 0,3 mg/kg VB",
      "Si persistance : répéter, puis 2ème ligne (phénytoïne/levetiracétam/PHB)",
      "EME réfractaire : coma thérapeutique (hypnovel/propofol) 24 h"
    ]},
  ],
  "convulsion-febrile-simple": [
    {
      title: "Objectif",
      bullets: [
        "Standardiser la PEC des convulsions fébriles simples (6 mois – 5 ans) pour sécuriser gestes et calculs.",
        "Limiter les examens inutiles tout en dépistant les formes compliquées / infections du SNC.",
      ],
    },
    {
      title: "Définition",
      bullets: [
        "Crise généralisée tonico-clonique < 15 min, unique en 24 h, examen neuro normal ensuite.",
        "Pas d'antécédent neurologique significatif, pas d'argument pour infection du SNC.",
      ],
    },
    {
      title: "Arbre décisionnel",
      bullets: [
        "Crise en cours ? → ABC + benzodiazépine si ≥ 5 min.",
        "Tous les critères CFS réunis ? → PEC simple + surveillance courte.",
        "Sinon → convulsion fébrile compliquée / autre protocole.",
      ],
    },
    {
      title: "ABC initial",
      bullets: [
        "PLS, libération des VAS, O₂ titré (94–98 %), VVP si crise prolongée.",
        "TA, TRC, glycémie systématique (corriger si < 0,7 g/L par glucose 10 % 2 mL/kg).",
        "Recherche foyer infectieux, T°, signes méningés ou purpura.",
      ],
    },
    {
      title: "Traitement crise",
      bullets: [
        "Midazolam IN 0,2 mg/kg (max 10 mg) ou buccal 0,3 mg/kg.",
        "Si VVP : midazolam IV 0,1 mg/kg (max 4 mg). Répéter une fois à 5 min.",
        "Échec x2 → protocole statut convulsif.",
      ],
    },
    {
      title: "Post-critique",
      bullets: [
        "Pas d'examens systématiques si clinique rassurante (pas de scanner, EEG ou biologie).",
        "PL si suspicion méningite, ionogramme si troubles hydroélectrolytiques.",
        "Traiter la fièvre : paracétamol 15 mg/kg, pas d’alternance systématique.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitaliser si < 1 an, crise avant 6 mois, critères complexes, mauvaise tolérance ou surveillance impossible.",
        "Sortie si examen neuro redevenu normal, fièvre contrôlée, parents rassurés + consignes écrites.",
      ],
    },
  ],
  "hypoglycemie": [
    {
      title: "Objectif",
      bullets: [
        "Stabiliser rapidement toute glycémie < 0,7 g/L et sécuriser la correction du glucose.",
        "Limiter les erreurs de calcul grâce aux volumes/grammages pondérés et orienter l'enfant selon la gravité.",
      ],
    },
    {
      title: "Définition",
      bullets: [
        "Hypoglycémie pédiatrique : glycémie plasmatique < 0,7 g/L (3,9 mmol/L).",
        "Hypoglycémie sévère si < 0,4 g/L ou présence de signes neurologiques.",
      ],
    },
    {
      title: "Arbre décisionnel",
      bullets: [
        "Confirmer la glycémie capillaire → si doute, recontrôler sur gaz/veineux.",
        "Signes de gravité ou glycémie < 0,4 g/L → voie IV urgente (bolus G10 %).",
        "Enfant conscient, 0,4–0,7 g/L → resucrage oral 0,3 g/kg + contrôle à 15 min.",
        "Identifier la cause (jeûne, infection, intoxication) et planifier la surveillance.",
      ],
    },
    {
      title: "Évaluation initiale",
      bullets: [
        "ABCDE : PLS si inconscient, aspiration si encombrement, O₂ titré (94–98 %).",
        "SpO₂ < 94 % → O₂ 10 L/min, pose VVP/IO si signes de gravité.",
        "GCS/AVPU, recherche signes neuro (tremblements, convulsions, coma).",
        "Inspection complète : déshydratation, foyer infectieux, toxiques.",
      ],
    },
    {
      title: "Signes de gravité",
      bullets: [
        "Glycémie < 0,4 g/L ou évolution rapide malgré resucrage.",
        "Convulsions, troubles de conscience, hypotonie, incapacité à boire.",
        "Suspicion intoxication (insuline, bêtabloquant, alcool) ou trouble neuro persistant.",
      ],
    },
    {
      title: "Traitement sévère",
      bullets: [
        "Bolus G10 % 2 mL/kg IV suivi d'une perfusion 6–8 mg/kg/min.",
        "Si IV impossible : glucagon IM 0,5 mg (< 25 kg) ou 1 mg (≥ 25 kg).",
        "Convulsions : midazolam IN 0,2 mg/kg ou IV 0,1 mg/kg.",
        "Surveillance glycémique toutes les 15 min + recherche de cause.",
      ],
    },
    {
      title: "Traitement modéré / léger",
      bullets: [
        "Resucrage oral 0,3 g/kg (gel glucosé, jus, sucre) + recontrôle à 15 min.",
        "Si glycémie toujours < 0,7 g/L ou symptômes persistants → répétition ou voie IV.",
        "Hypoglycémie légère asymptomatique : même correction orale + surveillance 1–2 h.",
      ],
    },
    {
      title: "Situations particulières",
      bullets: [
        "Nourrisson < 1 an ou suspicion EIIM → hospitalisation + perfusion continue.",
        "Déshydratation / gastroentérite : réhydratation + glucose.",
        "Suspicion intoxication → avis centre antipoison, monitoring continu.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation : hypoglycémie sévère, convulsions, perfusion continue, intoxication, terrain à risque.",
        "Sortie : glycémie > 0,7 g/L stable ≥ 4 h, asymptomatique, cause identifiée, parents formés.",
      ],
    },
  ],
  "acidocetose-diabetique": [
    {
      title: "Objectif",
      bullets: [
        "Standardiser la PEC de l'ACD pédiatrique pour limiter les variations d'hydratation et sécuriser les calculs d'insuline.",
        "Prévenir l'œdème cérébral en assurant un remplissage raisonné et une correction lente de la glycémie.",
      ],
    },
    {
      title: "Définition & gravité",
      bullets: [
        "ACD = glycémie > 11 mmol/L + cétonémie ≥ 3 mmol/L (ou cétonurie ++/+++) + acidose pH < 7,3 ou HCO₃⁻ < 15 mmol/L.",
        "Gravité modérée si pH 7,1–7,3 ; sévère si pH < 7,1 ; risque majeur d'œdème cérébral.",
      ],
    },
    {
      title: "Arbre décisionnel",
      bullets: [
        "Confirmer l'ACD et éliminer les diagnostics différentiels.",
        "Réhydratation prudente ± bolus NaCl 0,9 % si choc.",
        "Insuline IV continue 0,05–0,1 U/kg/h (pas de bolus).",
        "Ajouter glucose quand glycémie < 2,5 g/L, corriger le potassium systématiquement.",
        "Surveiller neuro + biologique rapproché, hospitaliser en réanimation si pH < 7,1 ou signes neurologiques.",
      ],
    },
    {
      title: "Surveillance",
      bullets: [
        "Glycémie toutes les 30 min puis 1 h, ionogramme toutes les 2–4 h.",
        "Scope continu, diurèse horaire, recherche signes d'œdème cérébral.",
        "Hospitalisation systématique avec transition vers insuline SC après correction de la cétose.",
      ],
    },
  ],
  "pneumopathie-communautaire-bacterienne": [
    {
      title: "Objectif",
      bullets: [
        "PEC standardisée d'une pneumopathie communautaire bactérienne selon HAS/SFP/SPLF/NICE/AAP.",
        "Aider à titrer l'oxygène, choisir l'antibiothérapie pondérée et sécuriser la réévaluation à 48 h.",
      ],
    },
    {
      title: "Définition succincte",
      bullets: [
        "Infection aiguë du parenchyme pulmonaire hors milieu hospitalier, souvent Streptococcus pneumoniae.",
        "Clinique évocatrice : fièvre élevée, polypnée, tirage, crépitants / souffle tubaire, altération de l'état général.",
      ],
    },
    {
      title: "Résumé décisionnel",
      bullets: [
        "Évaluer la sévérité (légère, modérée, sévère) puis initier ABCDE + O₂ si SpO₂ < 94 %.",
        "Amoxicilline PO en 1ère intention, macrolides si allergie, IV si gravité, contrôle à 48 h.",
        "Hospitaliser si critères de gravité, sortie si amélioration clinique et SpO₂ ≥ 94 %.",
      ],
    },
    {
      title: "Évaluation initiale",
      bullets: [
        "A – VAS libres, position confortable, désobstruction rhinopharyngée.",
        "B – FR selon âge, tirage, geignement, SpO₂, auscultation (crépitants, MV diminué).",
        "C – FC, TRC, recherche de déshydratation.",
        "D – Vigilance, tonus, score AVPU.",
        "E – Température, recherche de signes extra-respiratoires / comorbidités.",
      ],
    },
    {
      title: "Signes de gravité",
      bullets: [
        "SpO₂ < 92–94 %, besoin d'O₂ élevé.",
        "Tirage marqué, polypnée sévère, geignement.",
        "Déshydratation, incapacité à s'alimenter, vomissements.",
        "Âge < 3 mois ou comorbidités respiratoires / immunitaires.",
        "Altération de l'état général ou suspicion de complication (SDRA, sepsis).",
      ],
    },
    {
      title: "Examens",
      bullets: [
        "Radiographie thoracique si doute diagnostique, gravité ou non-amélioration à 48 h.",
        "Biologie ciblée (NFS, CRP, hémocultures) si hospitalisation ou complication.",
        "Gaz du sang si hypoxémie, suspicion SDRA.",
      ],
    },
    {
      title: "Antibiothérapie",
      bullets: [
        "Amoxicilline PO 80–100 mg/kg/j en 3 prises (1ère intention).",
        "Allergie β-lactamines : azithromycine (10 mg/kg J1 puis 5 mg/kg J2–J5) ou clarithromycine 15 mg/kg/j en 2 prises.",
        "Formes sévères : amoxicilline IV 100 mg/kg/j (3–4 inj) ou céfotaxime 100–150 mg/kg/j ou ceftriaxone 50–75 mg/kg/j.",
      ],
    },
    {
      title: "Traitements associés",
      bullets: [
        "O₂ si SpO₂ < 94 % (objectif 94–98 %).",
        "Paracétamol 15 mg/kg/dose, hydratation IV NaCl 0,9 % 10–20 mL/kg si déshydratation.",
        "Pas de β2 ni de corticoïdes systémiques hors terrain asthmatique, pas de kiné systématique.",
      ],
    },
    {
      title: "Hospitalisation / sortie",
      bullets: [
        "Critères : SpO₂ < 94 %, détresse respi, difficulté d'hydratation, < 3 mois, comorbidités, absence d'amélioration 48 h.",
        "Sortie si amélioration clinique, apyréxie ou fièvre décroissante, SpO₂ ≥ 94 % en air ambiant, alimentation correcte.",
      ],
    },
  ],
  "pneumopathie-atypique-mycoplasma": [
    {
      title: "Objectif",
      bullets: [
        "Décrire une PEC immédiate, pondérée au poids, pour les pneumopathies atypiques à Mycoplasma (HAS/SFP/SPLF/NICE/AAP).",
        "Focus sur enfants ≥ 5 ans : titrer l’O₂, sécuriser l’antibiothérapie par macrolide et la réévaluation à 48 h.",
      ],
    },
    {
      title: "Définition succincte",
      bullets: [
        "Toux sèche prolongée, fièvre modérée, céphalées/myalgies, auscultation souvent pauvre, atteinte interstitielle à la radio.",
        "Principal germe : Mycoplasma pneumoniae, sensible aux macrolides.",
      ],
    },
    {
      title: "Résumé décisionnel",
      bullets: [
        "Identifier la sévérité (léger / modéré / sévère) puis réaliser ABCDE.",
        "SpO₂ < 94 % → O₂ 1–2 L/min ; antibiothérapie par azithromycine ou clarithromycine adaptée au poids.",
        "Réévaluation clinique à 48 h, hospitalisation si critères de gravité ou évolution défavorable.",
      ],
    },
    {
      title: "ABCDE",
      bullets: [
        "A – Désobstruction rhinopharyngée, VAS libres.",
        "B – FR selon l’âge, auscultation discrète (MV ↓, rares sibilants), SpO₂ continue.",
        "C – FC, TRC, TA, rechercher signes de déshydratation.",
        "D – Évaluer état général, vigilance, signes neuro.",
        "E – Température, recherche autres foyers infectieux.",
      ],
    },
    {
      title: "Signes de gravité",
      bullets: [
        "SpO₂ < 94 %, tirage ou polypnée nette.",
        "Altération de l’état général, asthénie majeure.",
        "Vomissements empêchant la prise orale.",
        "Âge < 5 ans avec forte suspicion, ou comorbidités / immunodépression.",
        "Suspicion atteinte extrapulmonaire (myocardite, neurologique).",
      ],
    },
    {
      title: "Examens",
      bullets: [
        "Radio thoracique si gravité, fièvre prolongée (> 72 h) ou absence d’amélioration.",
        "Biologie ciblée : CRP modérée, PCR Mycoplasma si doute.",
        "Gaz du sang si hypoxémie ou détresse respiratoire.",
      ],
    },
    {
      title: "Antibiothérapie",
      bullets: [
        "Azithromycine : 10 mg/kg J1 puis 5 mg/kg J2–J5.",
        "Clarithromycine : 15 mg/kg/j en 2 prises.",
        "Allergie vraie aux macrolides : discussion spécialisée, pas d’alternative simple.",
      ],
    },
    {
      title: "Traitements associés",
      bullets: [
        "Paracétamol 15 mg/kg/dose en cas de fièvre ou inconfort.",
        "Hydratation IV NaCl 0,9 % 10–20 mL/kg si intolérance orale.",
        "O₂ lunettes 1–2 L/min si SpO₂ < 94 %, objectif 94–98 %.",
        "Pas de β2, corticoïdes ou β-lactamines seuls en routine.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Léger : traitement PO + surveillance à domicile, contrôle 48 h.",
        "Modéré : réévaluation 24–48 h, O₂ si besoin, imagerie si complication.",
        "Sévère : O₂, VVP, hydratation IV, hospitalisation.",
        "Sortie si amélioration clinique, SpO₂ ≥ 94 %, alimentation possible, parents aptes.",
      ],
    },
  ],
  "laryngite-aigue": [
    {
      title: "Objectif",
      bullets: [
        "PEC rapide de la laryngite aiguë virale (croup) avec calcul immédiat des posologies et guidance clinique.",
        "Limiter les stimulations, rassurer l'enfant et suivre les recommandations HAS/SFP/SPLF/NICE/AAP.",
      ],
    },
    {
      title: "Définition rapide",
      bullets: [
        "Inflammation laryngo-trachéale virale (parainfluenza majoritaire) → toux aboyante, enrouement, stridor.",
        "Signes de gravité : stridor au repos, tirage, agitation, hypoxémie, balancement thoraco-abdominal, épuisement.",
      ],
    },
    {
      title: "Évaluation initiale ABCDE",
      bullets: [
        "A : installer l'enfant calmement dans les bras du parent, éviter toute agitation inutile.",
        "B : monitorer SpO₂ ; O₂ haut débit si < 94 % (objectif 94–98 %).",
        "C : FC, TRC, TA ; rechercher signes de choc ou déshydratation.",
        "D : état de vigilance, agitation, signes d'épuisement.",
        "E : température, écoute des VAS, rechercher corps étranger / épiglottite.",
      ],
    },
    {
      title: "Classer la sévérité",
      bullets: [
        "Légère : stridor uniquement à l'effort, pas de tirage ni d'agitation.",
        "Modérée : stridor au repos, tirage modéré, +/- agitation, SpO₂ ≥ 94 %.",
        "Sévère / menace vitale : stridor très bruyant voire silence, tirage marqué, SpO₂ < 94 %, cyanose, obnubilation.",
      ],
    },
    {
      title: "Traitements essentiels",
      bullets: [
        "Dexaméthasone PO ou IV 0,6 mg/kg (0,15–0,6 mg/kg possibles) dose unique, max 10 mg.",
        "Adrénaline nébulisée si modéré à sévère : 5 mL L(+) 1 mg/mL (ou racémique 0,5 mL + NaCl).",
        "Budesonide nébulisé 2 mg si corticoïde inhalé préféré, surveillance 2 h post-adrénaline.",
        "Paracétamol 15 mg/kg si fièvre / inconfort, hydratation orale si possible.",
      ],
    },
    {
      title: "Orientation & surveillance",
      bullets: [
        "Légère : dexaméthasone PO, observation 1–2 h, sortie avec consignes si disparition du stridor.",
        "Modérée : dexaméthasone + adrénaline, surveillance 2–4 h, répéter nébulisation si reprise des signes.",
        "Sévère : O₂ 10 L/min, adrénaline immédiate, corticoïde IV si besoin, préparation VAS difficile, appel réanimation.",
        "Hospitalisation si < 6 mois, SpO₂ < 94 %, stridor au repos persistant, multiples nébulisations, terrain fragile ou surveillance parentale difficile.",
      ],
    },
  ],
  "inhalation-fumees-co": [
    {
      title: "Objectif",
      bullets: [
        "Prise en charge standardisée des inhalations de fumées / intoxications au CO pédiatriques avec calculs pondérés.",
        "Appliquer immédiatement O₂ 100 %, repérer les critères d’hyperbarie et l’intoxication aux cyanures associée.",
      ],
    },
    {
      title: "Définition & particularités",
      bullets: [
        "Inhalation de fumées = gaz chauds + toxiques de combustion (CO, cyanures, irritants) avec risque de brûlures VAS.",
        "CO : formation de COHb altérant le transport d’O₂ → hypoxie cellulaire ; enfants plus sensibles (décompensation rapide).",
      ],
    },
    {
      title: "Arbre décisionnel simplifié",
      bullets: [
        "ABCDE immédiat. Détresse vitale ? → O₂ 100 %, VVP/IO, intubation si critères, monitorage.",
        "O₂ 100 % non titré pour tous, puis rechercher critères de gravité : COHb ≥ 25 % (≥ 20 % enfant), signes neuro/cardio, grossesse.",
        "Critère sévère → avis centre hyperbare + transfert ; suspicion cyanures (incendie clos + coma/choc + lactate > 8) → hydroxocobalamine.",
        "Hospitalisation si exposition significative, symptômes ou COHb élevée ; sortie si résolution complète et COHb < 3 %.",
      ],
    },
    {
      title: "Oxygénothérapie & hyperbarie",
      bullets: [
        "O₂ 100 % au masque haute concentration 12–15 L/min, ne pas titrer (objectif = élimination CO).",
        "Demi-vie COHb : 4–6 h air ambiant ; 60–90 min sous O₂ 100 % ; 20–30 min en hyperbarie 2,5 ATA.",
        "Indications hyperbares (SFAR/SFMU/consensus) : COHb ≥ 25 % (≥ 20 % enfant), grossesse dès 15 %, coma/convulsions/confusion sévère, ischémie/arythmie/collapsus, acidose métabolique sévère.",
      ],
    },
    {
      title: "Cyanures associés (incendie clos)",
      bullets: [
        "Signes évocateurs : coma + collapsus, lactate > 8–10 mmol/L, suies oropharyngées, incendie d’appartement/pièce fermée.",
        "Traitement : Hydroxocobalamine 70 mg/kg IV (max 5 g) en 15 min, renouvelable 1× si choc persistant, avec remplissage et avis réanimation.",
      ],
    },
    {
      title: "Hospitalisation / sortie",
      bullets: [
        "Hospitalisation pédiatrique : symptômes persistants, COHb initial ≥ 10 %, brûlures associées, suspicion inhalation (œdème VAS possible 24 h), critères sociaux.",
        "Réanimation : détresse respi, GCS < 13, signes cardiaques, lactate > 8 mmol/L, besoin d’intubation ou d’hydroxocobalamine.",
        "Sortie si TOUT : symptômes résolus, COHb < 3 %, examens rassurants, aucune inhalation VAS, étiologie maîtrisée, surveillance parentale fiable + contrôle programmé.",
        "Situations particulières : nourrisson (hypoxie rapide, intubation précoce), grossesse (hyperbarie dès 15 %), comorbidités cardiaques (ECG systématique).",
      ],
    },
  ],
  "noyade-submersion": [
    {
      title: "Objectif",
      bullets: [
        "Uniformiser la PEC des noyades/submersions pédiatriques selon HAS/SFP/SFAR/SPLF/ERC/AAP.",
        "Limiter les erreurs de calcul (intubation, remplissage, nébulisations) grâce aux doses pondérées.",
      ],
    },
    {
      title: "Définition & sévérité",
      bullets: [
        "Noyade = détresse respiratoire aiguë post immersion, du simple réflexe tussigène à l’ACR.",
        "Classification : légère (SpO₂ > 94 %), modérée (SpO₂ < 94 %, signes respi), sévère/ACR (troubles conscience, apnée).",
      ],
    },
    {
      title: "Arbre décisionnel",
      bullets: [
        "ACR ? → RCP immédiate, O₂ 100 %, BAVU, adrénaline IV/IO 0,01 mg/kg.",
        "Détresse sévère ? → Intubation séquence rapide, ventilation protectrice, réchauffement actif.",
        "Symptômes modérés ? → O₂ titré, monitorage, radio thorax, nébulisations ciblées.",
        "Forme légère ? → Surveillance 6–8 h et critères de sortie stricts.",
      ],
    },
    {
      title: "ABCDE initial",
      bullets: [
        "A : aspiration des VAS, PLS si inconscient, collier si suspicion traumatique.",
        "B : SpO₂ 94–98 %, O₂ 10–15 L/min si &lt; 94 %, BAVU si apnée ; intubation si GCS &lt; 8.",
        "C : TA/FC/TRC, 1–2 VVP, NaCl 0,9 % 20 mL/kg (max 40 mL/kg), adrénaline ACR.",
        "D : GCS, pupilles, glycémie (Glucose 10 % 2 mL/kg si &lt; 0,7 g/L).",
        "E : retirer vêtements mouillés, réchauffer activement, rechercher hypothermie/traumatismes.",
      ],
    },
    {
      title: "Traitements spécifiques",
      bullets: [
        "ISR : kétamine 2 mg/kg + rocuronium 1 mg/kg IV.",
        "Ventilation protectrice : Vt 6–8 mL/kg, PEEP 5–8 cmH₂O, FiO₂ titrée.",
        "Laryngospasme : adrénaline 1 mg/mL 0,5 mL/kg (max 5 mL) en nébulisation.",
        "Bronchospasme : salbutamol 0,15 mg/kg (min 2,5 mg, max 5 mg) ± ipratropium.",
        "Pas d’antibiotique/corticoïde systématique sauf indication, réévaluer SDRA/hypothermie.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitaliser si SpO₂ &lt; 95 % après 1 h, signes respiratoires, radio anormale, hypothermie, GCS &lt; 15, réanimation initiale.",
        "Surveillance 6–8 h pour formes légères asymptomatiques, consignes parentales et réchauffement.",
        "Pas de différence eau douce/salée dans la PEC ; signalement si suspicion maltraitance (&lt; 2 ans).",
      ],
    },
  ],
  "antalgiques": [
    { title: "Évaluation", bullets: [
      "Identifier le palier adapté à la douleur (EVA/EVENDOL)",
      "Réévaluer systématiquement après chaque étape"
    ]},
    { title: "Palier 1", bullets: [
      "Solutions sucrées pour nourrisson, MEOPA/EMLA pour gestes douloureux",
      "Antalgiques de base : paracétamol ± AINS si absence de contre-indications"
    ]},
    { title: "Palier 2", bullets: [
      "Tramadol PO/IV 1 mg/kg/6 h (>3 ans) en complément du palier 1"
    ]},
    { title: "Palier 3", bullets: [
      "Morphine titrée IV/PO ± perfusion continue",
      "Nalbuphine ou kétamine selon contexte, prévoir antagonistes"
    ]},
  ],
  "bronchiolite": [
    { title: "Évaluation initiale", bullets: [
      "DRP douce + installation avant toute mesure",
      "FR/FC/SpO₂, état général, signes de lutte, apports sur 3 prises",
      "Classer légère/modérée/grave selon critères HAS"
    ]},
    { title: "Vulnérabilités", bullets: [
      "Prématurité < 36 SA, âge < 2 mois, cardiopathie, DBP",
      "Immunodépression, neuro-musculaire, polyhandicap, trisomie 21",
      "Environnement défavorable : accès aux soins, précarité, tabagisme"
    ]},
    { title: "Orientation", bullets: [
      "Grave : hospitalisation USC/réa, transport médicalisé",
      "Modérée : UHCD/conventionnel si SpO₂ ≤ 92 %, apports < 50 %, vulnérabilité ou contexte défavorable",
      "Légère : domicile + surveillance si environnement favorable"
    ]},
    { title: "Traitements", bullets: [
      "Oxygène si SpO₂ ≤ 92 % (cible > 92 % à l'éveil)",
      "Support nutritionnel entéral prioritaire si apports < 50 %",
      "HFNC 2 L/kg/min ou CPAP si échec O₂ bas débit"
    ]},
    { title: "À éviter", bullets: [
      "Bronchodilatateurs, adrénaline, corticoïdes, antibiotiques systématiques",
      "Caféine, fluidifiants, antitussifs, anti-reflux systématiques",
      "Kinésithérapie respiratoire hors DRP douce"
    ]},
  ],
  "bronchospasme-nourrisson": [
    {
      title: "Objectif",
      bullets: [
        "Standardiser la PEC d'un bronchospasme aigu non asthmatique chez le nourrisson en situation d'urgence.",
        "Fournir un support dynamique pour les posologies (O₂, salbutamol, corticoïdes, remplissage) et l'orientation clinique.",
      ],
    },
    {
      title: "Définition",
      bullets: [
        "Obstruction bronchique aiguë liée le plus souvent à une infection virale type bronchiolite, sans asthme connu.",
        "Tableau associant sibilants expiratoires, polypnée, tirage, toux et difficultés alimentaires (diagnostic clinique).",
      ],
    },
    {
      title: "ABCDE initial",
      bullets: [
        "A : position semi-assise, désobstruction rhinopharyngée systématique.",
        "B : FR, tirage, geignement, SpO₂ continue ; O₂ 1–2 L/min si SpO₂ < 94 % (objectif 94–98 %).",
        "C : FC, TRC, évaluer la déshydratation et les apports.",
        "D : tonus, éveil, signes de fatigue ou hypotonie.",
        "E : température, contexte infectieux, comorbidités / terrain fragile.",
      ],
    },
    {
      title: "Classer la sévérité",
      bullets: [
        "Léger : polypnée modérée, peu ou pas de tirage, alimentation conservée, SpO₂ ≥ 94 %.",
        "Modéré : tirage intercostal, sibilants audibles, difficultés alimentaires, SpO₂ 92–94 %.",
        "Sévère : GEU/tirage marqué, fatigue, cyanose, SpO₂ < 92 %, hypotonie ou apnées.",
      ],
    },
    {
      title: "Traitements essentiels",
      bullets: [
        "Désobstruction rhinopharyngée avant tout geste, hydratation fractionnée.",
        "Oxygène bas débit 1–2 L/min si SpO₂ < 94 % (objectif 94–98 %).",
        "Test thérapeutique salbutamol ≥ 6 mois : 2–4 bouffées (100 µg/bouffée) ×3 max toutes les 20 min.",
        "Corticoïdes systémiques (prednisone/prednisolone 1–2 mg/kg, max 40 mg) si ≥ 12 mois ou suspicion asthme débutant.",
        "Adrénaline nébulisée 5 mL (1 mg/mL) si forme sévère ou composante laryngée, support ventilatoire (HFNC/CPAP) si échec O₂.",
        "Remplissage NaCl 0,9 % 10 mL/kg IV si déshydratation.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Léger : désobstruction + hydratation, retour à domicile si surveillance parentale fiable.",
        "Modéré : O₂, test salbutamol, réévaluation 20–30 min ; hospitalisation si SpO₂ < 94 %, apports < 50 % ou terrain fragile.",
        "Sévère : O₂ immédiat, adrénaline, HFNC/CPAP, appel réanimateur et hospitalisation systématique.",
      ],
    },
    {
      title: "Critères d'hospitalisation / sortie",
      bullets: [
        "Hospitaliser si SpO₂ < 94 %, apports < 50 %, détresse respiratoire, < 6 mois, terrain à risque ou échec du test thérapeutique.",
        "Sortie si SpO₂ ≥ 94 % en air ambiant, apports corrects, tirage minime et parents aptes à surveiller.",
      ],
    },
    {
      title: "Situations particulières",
      bullets: [
        "< 6 mois ou prématurés : seuil d'hospitalisation abaissé (risque d'apnées).",
        "Pathologies pulmonaires chroniques / cardiopathies : avis spécialisé, monitorage prolongé.",
      ],
    },
    {
      title: "Non recommandés",
      bullets: [
        "Antibiotiques (hors surinfection avérée), antitussifs/mucolytiques, bronchodilatateurs IV.",
        "Kinésithérapie respiratoire systématique et corticoïdes inhalés en phase aiguë.",
      ],
    },
  ],
  "fievre-nourrisson-moins-3-mois": [
    {
      title: "Objectif",
      bullets: [
        "Standardiser l'évaluation d'un nourrisson fébrile < 90 jours pour détecter IBS et décider bilan/ATB/hospitalisation.",
        "Assurer un calcul automatique des posologies IV/PO selon le poids.",
      ],
    },
    {
      title: "Critères de gravité immédiate",
      bullets: [
        "Altération de conscience, hypotonie, gémissements persistants, TRC > 3 s, marbrures, détresse respi, convulsions.",
        "< 28 jours fébrile = haut risque automatique → ATB IV + hospitalisation sans délai.",
      ],
    },
    {
      title: "Conduite selon l'âge",
      bullets: [
        "< 21 j : bilan complet (hémoc, BU/ECBU, CRP/PCT, iono, GDS, LCR obligatoire) + ATB systématiques + hospitalisation.",
        "22–28 j : bilan complet incluant LCR ; ATB si CRP/PCT élevées, anomalies FNS/EFRI ou clinique douteuse ; hospitalisation quasi systématique.",
        "29–60 j : bilan orienté (ECBU systématique, CRP ± PCT, FNS, ± LCR) ; ATB si haut risque, surveillance si bas risque.",
      ],
    },
    {
      title: "Antibiothérapie empirique",
      bullets: [
        "< 28 j ou sepsis sévère : Ampicilline 100 mg/kg/8 h + Céfotaxime 50 mg/kg/8 h.",
        "29–60 j à risque : Ceftriaxone 50 mg/kg/j (max 2 g) ; éviter si ictère < 1 mois (préférer Céfotaxime).",
        "Suspicion méningite : Ampicilline + Céfotaxime ± Acyclovir 20 mg/kg/8 h.",
      ],
    },
    {
      title: "Risque AAP 2021",
      bullets: [
        "Haut risque : < 21 j ou < 28 j symptomatique, CRP/PCT élevées, FNS/LCR anormaux, signes de gravité → ATB + hospitalisation.",
        "Risque intermédiaire : 22–60 j, examen rassurant mais CRP modérée ou BU anormale stable → examens ciblés ± ATB.",
        "Bas risque : ≥ 29 j, examen normal, CRP < 20, PCT < 0,5, leucocytes 5–15 G/L, BU normale, famille fiable → surveillance 48 h sans ATB.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation systématique si < 28 j, sepsis probable/confirmé, bilan anormal, famille incertaine ou suspicion méningite.",
        "Sortie uniquement si ≥ 29 j, groupe bas risque, examens normaux, famille fiable et surveillance médicale < 12 h.",
      ],
    },
  ],
  "fievre-sepsis-purpura": [
    { title: "Objectif", bullets: [
      "Reconnaître très tôt les sepsis/purpuras fulminans, déclencher l'ATB IV sans délai",
      "Standardiser l'évaluation ABC + peau + contexte à risque",
      "Transport médicalisé rapide si signe de gravité"
    ]},
    { title: "Évaluation initiale ≤ 5 min", bullets: [
      "Constantes vitales complètes (FC, FR, SpO₂, TA ≥1 an, T°, TRC)",
      "Examen cutané systématique : purpura non blanchissant, extension, nécrose",
      "Examen neurologique : AVPU, convulsions, irritabilité",
      "Contexte : <3 mois, asplénie/drépanocytose, immunodépression, vaccins méningocoque/pneumocoque"
    ]},
    { title: "Signes de gravité", bullets: [
      "Perfusion altérée : TRC >3s, marbrures, extrémités froides, hypotension tardive",
      "Tachycardie persistante, polypnée sévère, SpO₂ <92 %",
      "Altération neurologique (AVPU = P/U, convulsions)",
      "Diurèse <1 mL/kg/h",
      "Purpura extensif ou nécrotique → purpura fulminans"
    ]},
    { title: "Mesures immédiates", bullets: [
      "Oxygénothérapie : cible SpO₂ 94–98 %",
      "VVP/IO en <90 s",
      "Remplissage NaCl 0,9 % 10–20 mL/kg, répéter jusqu'à 40–60 mL/kg",
      "Antibiothérapie IV dans l'heure, jamais retardée",
      "Vasopresseur (noradrénaline/adrénaline) si hypotension persistante"
    ]},
    { title: "Antibiothérapie", bullets: [
      "Purpura fulminans : Ceftriaxone 100 mg/kg (max 1–2 g) IV dose unique",
      "Alternative : Céfotaxime 150–200 mg/kg/j en 3–4 doses",
      "Sepsis sévère sans purpura : Céfotaxime 150 mg/kg/j ou Amox + Ac. clav selon foyer",
      "Nourrisson <3 mois : protocole spécifique élargi",
      "Notification obligatoire si méningocoque + prophylaxie des contacts"
    ]},
    { title: "Hospitalisation / réanimation", bullets: [
      "Tous purpuras et sepsis suspect/confirmé",
      "Réa directe si choc septique, besoin vaso-actif, polypnée sévère, apnées",
      "Autres critères : remplissage >20 mL/kg, SpO₂ <94 % malgré O₂, TRC >3s, tachycardie >2 SDS, âge <3 mois",
      "Sortie seulement après 24 h de stabilité, apyrésie, hémodynamique stable sans O₂, absence d'extension du purpura"
    ]},
    { title: "Situations particulières", bullets: [
      "<3 mois : hospitalisation systématique et bilan complet",
      "Asplénie / drépanocytose : risque fulminant pneumocoque → ATB immédiate",
      "Immunodépression : adapter l'ATB selon protocole d'hémato-oncologie"
    ]},
  ],
  "sepsis-neonatal-precoce": [
    {
      title: "Objectif",
      bullets: [
        "Standardiser la prise en charge du sepsis néonatal précoce jusqu'au traitement empirique.",
        "Limiter les retards d'antibiothérapie et assurer la stabilisation ABCDE.",
      ],
    },
    {
      title: "Définition et germes principaux",
      bullets: [
        "Sepsis < 72 h de vie, transmission materno-fœtale.",
        "Germes : Streptocoque B (le plus fréquent), E. coli, autres Gram −, Listeria (rare).",
      ],
    },
    {
      title: "Facteurs de risque maternels (HAS 2020)",
      bullets: [
        "Chorioamniotite, fièvre maternelle ≥ 38 °C.",
        "SGB maternel non couvert ou ATB inadaptés.",
        "RPM ≥ 18 h, prématurité < 37 SA, infection urinaire à entérobactéries non traitée.",
      ],
    },
    {
      title: "Signes cliniques évocateurs (HAS/SFN)",
      bullets: [
        "Respiratoire : tachypnée, tirage, geignement, apnées.",
        "Neurologique : irritabilité, convulsions, léthargie.",
        "Cardio : tachycardie, TRC > 3 s, marbrures, instabilité thermique, pâleur/ictère précoce.",
        "Digestif : vomissements, ballonnement, mauvaise succion.",
      ],
    },
    {
      title: "Stratification du risque",
      bullets: [
        "Symptomatique : ATB IV immédiate + bilan complet (hémoc, FNS/CRP, gaz, glycémie, ± LCR stable).",
        "Haut risque maternel : hémoculture + FNS/CRP + ATB sans délai, surveillance hospitalière.",
        "À risque asymptomatique : hémoculture, FNS/CRP à 12–24 h, surveillance 48 h.",
        "Faible risque : surveillance clinique rapprochée ≥ 48 h sans ATB systématique.",
      ],
    },
    {
      title: "Bilan diagnostique",
      bullets: [
        "Symptômes : hémoculture, FNS/CRP, ionogramme, gaz, glycémie; ± LCR si stable, ± Rx thorax.",
        "À risque asymptomatique : hémoculture immédiate, biologie différée.",
        "Faible risque : surveillance clinique seule si évolution favorable.",
      ],
    },
    {
      title: "Antibiothérapie empirique",
      bullets: [
        "Ampicilline/Amoxicilline 100 mg/kg/12 h (200 mg/kg/j) ; méningite : 200–300 mg/kg/j en 3–4 injections.",
        "Gentamicine 4–5 mg/kg/24 h en dose unique quotidienne.",
        "Si E. coli sévère ou choc septique : Céfotaxime 50 mg/kg/8 h (150 mg/kg/j).",
        "Risque Listeria : Ampicilline 200–300 mg/kg/j + gentamicine.",
      ],
    },
    {
      title: "Autres mesures thérapeutiques",
      bullets: [
        "Oxygène titré SpO₂ 94–98 %.",
        "Remplissage : NaCl 0,9 % 10 mL/kg, répéter 1 fois si choc septique.",
        "Adrénaline 0,05–0,3 µg/kg/min si besoin (réanimation).",
        "Hypoglycémie : G10 % 2 mL/kg si < 2,5 mmol/L ; thermorégulation incubateur/peau à peau.",
      ],
    },
    {
      title: "Hospitalisation / sortie",
      bullets: [
        "Hospitalisation systématique si symptômes, facteurs majeurs, instabilité thermique ou ATB débutés.",
        "Réanimation si choc, détresse respiratoire, convulsions, acidose sévère ou méningite probable.",
        "Sortie uniquement si asymptomatique après 48 h de surveillance, examens normaux et environnement fiable.",
      ],
    },
  ],
  "traumatisme-cranien": [
    {
      title: "Objectif",
      bullets: [
        "Stabiliser l’enfant selon ABCDE, évaluer le Glasgow et repérer les signes menaçants.",
        "Appliquer les règles PECARN pour l’imagerie et adapter la conduite au niveau de gravité.",
      ],
    },
    {
      title: "Évaluation initiale",
      bullets: [
        "A : VA + immobilisation ; GCS ≤ 8 → intubation.",
        "B : SpO₂ 94–98 %, O₂ MHC 10–15 L/min si détresse.",
        "C : prévenir hypotension, remplissage 20 mL/kg si choc.",
        "D : GCS, pupilles, convulsions (midazolam 0,1 mg/kg IV).",
        "E : examen complet, glycémie, température.",
      ],
    },
    {
      title: "Signes imposant scanner / avis neurochir",
      bullets: [
        "GCS < 15 persistant ou ≤ 13 d’emblée.",
        "Déficit focal, anisocorie/mydriase, convulsions post-traumatiques.",
        "Vomissements incoercibles, altération de conscience > 2 h, mécanisme violent, fracture ouverte/embarrure.",
      ],
    },
    {
      title: "Conduite selon la sévérité",
      bullets: [
        "Léger : PECARN, surveillance 3–6 h, paracétamol 15 mg/kg (max 1 g).",
        "Modéré : scanner en urgence, O₂, VVP, transferts spécialisés.",
        "Sévère : intubation (kétamine 2 mg/kg + rocuronium 1 mg/kg), ventilation normocapnique, double VVP, scanner prioritaire.",
      ],
    },
    {
      title: "Prévention HTIC & orientation",
      bullets: [
        "Buste 30°, normothermie, osmothérapie : mannitol 0,5–1 g/kg ou NaCl 3 % 5 mL/kg.",
        "< 1 an, trouble coagulation, polytrauma : imagerie systématique + avis spé.",
        "Hospitalisation si GCS < 15, facteurs PECARN ou lésion ; sortie seulement si examen normal + parents informés.",
      ],
    },
  ],
  "meningite-bacterienne-purulente": [
    {
      title: "Objectif",
      bullets: [
        "Méningite purulente = urgence vitale : ATB IV immédiate + hospitalisation spécialisée.",
        "Identifier rapidement l’âge (< 3 mois vs ≥ 3 mois) pour adapter l’antibiothérapie.",
      ],
    },
    {
      title: "Diagnostic express",
      bullets: [
        "Fièvre + céphalées/vomissements, raideur méningée, altération de conscience, purpura fulminans si méningococcémie.",
        "ABCDE, glycémie capillaire, monitorage SpO₂, recherche convulsions (Midazolam si nécessaire).",
      ],
    },
    {
      title: "Signes de gravité (ATB sans attendre la PL)",
      bullets: [
        "Purpura, choc, instabilité hémodynamique, Glasgow < 11, convulsions persistantes, détresse respiratoire.",
        "Remplissage NaCl 0,9 % 20 mL/kg si choc, O₂ 10–15 L/min si SpO₂ < 94 %.",
      ],
    },
    {
      title: "Ponction lombaire",
      bullets: [
        "Possible seulement si patient stable, sans signe d’HTIC ni trouble de coagulation.",
        "CI : instabilité, purpura, crise convulsive persistante, signes d’engagement, trouble hémostase.",
      ],
    },
    {
      title: "Antibiothérapie IV",
      bullets: [
        "< 3 mois : Cefotaxime 200 mg/kg/j + Amoxicilline 200 mg/kg/j en 3–4 injections.",
        "≥ 3 mois : Cefotaxime 200 mg/kg/j (3–4 inj) ou Ceftriaxone 100 mg/kg/j (max 4 g). Ajouter Vancomycine 60 mg/kg/j si pneumocoque à CMI élevée, Amoxicilline si suspicion Listeria.",
      ],
    },
    {
      title: "Corticothérapie",
      bullets: [
        "Dexaméthasone 0,15 mg/kg IV toutes les 6 h pendant 48 h si suspicion pneumocoque ≥ 3 mois (avant/avec 1ère dose d’ATB).",
      ],
    },
    {
      title: "Traitements associés",
      bullets: [
        "Antipyrétiques (Paracétamol 15 mg/kg), remplissage, monitorage neurologique.",
        "Convulsions : Midazolam 0,1 mg/kg IV ou 0,2 mg/kg IN, puis protocole EME si échec.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation obligatoire. Réanimation si choc, SpO₂ < 94 %, altération de conscience, purpura fulminans ou convulsions réfractaires.",
        "Sortie uniquement après hospitalisation complète : apyrexie, amélioration neuro, relais ATB défini.",
      ],
    },
  ],
  "meningo-encephalite-aigue": [
    {
      title: "Objectif",
      bullets: [
        "Urgence neuro-infectieuse : sécuriser ABCDE, identifier la gravité et débuter ATB/antiviral sans délai.",
        "Adapter l’antibiothérapie à l’âge (< 3 mois vs ≥ 3 mois) et prévoir la réanimation si besoin.",
      ],
    },
    {
      title: "Signes de gravité / PL",
      bullets: [
        "Conscience altérée, convulsions prolongées, purpura, instabilité hémodynamique, détresse respi, fontanelle bombée.",
        "PL uniquement si enfant stable sans signe d’HTIC ni choc ; CI → ATB + aciclovir avant imagerie.",
      ],
    },
    {
      title: "Examens et traitements",
      bullets: [
        "Bilan initial : hémocultures, NFS, CRP/PCT, ionogramme, glycémie, GDS, lactates, PCR méningite/encéphalite si dispo.",
        "≥ 3 mois : Céfotaxime 50 mg/kg/8 h ou Ceftriaxone 50–75 mg/kg/j (max 2 g) + Vancomycine 15 mg/kg/6 h si risque pneumocoque C3G-R.",
        "< 3 mois : Ampicilline 75–100 mg/kg/6 h + Céfotaxime 50 mg/kg/8 h. Aciclovir 20 mg/kg/8 h si HSV suspect.",
        "Dexaméthasone 0,15 mg/kg/6 h si suspicion pneumocoque ≥ 3 mois (avant/avec 1ère dose).",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation systématique ; réanimation si coma, convulsions réfractaires, choc, détresse respiratoire ou purpura.",
        "Sortie seulement après confirmation étiologie non bactérienne, amélioration clinique et suivi fiable.",
      ],
    },
  ],
  "tachycardie-supraventriculaire": [
    {
      title: "Objectif",
      bullets: [
        "Identifier rapidement la TSV pédiatrique et sécuriser la réversion du rythme sans erreur de calcul.",
        "Limiter l'escalade thérapeutique aux situations nécessaires et anticiper l'orientation cardiopédiatrique.",
      ],
    },
    {
      title: "Diagnostic",
      bullets: [
        "Tachycardie régulière à QRS fins (< 80 ms), FC > 220 bpm nourrisson / > 180 bpm enfant.",
        "Onde P rétrograde ± masquée, démarrage/arrêt abrupt, exclusion tachycardie sinusale.",
      ],
    },
    {
      title: "Instabilité",
      bullets: [
        "Hypotension, altération conscience, signes de choc ou insuffisance cardiaque.",
        "Cardioversion synchronisée immédiate 0,5–2 J/kg (sédation si conscience).",
      ],
    },
    {
      title: "Enfant stable",
      bullets: [
        "Manœuvres vagales adaptées à l'âge (immersion eau glacée, Valsalva modifié).",
        "Adénosine 0,1 mg/kg puis 0,2 mg/kg IV rapide (max 6/12 mg) avant antiarythmiques.",
        "Amiodarone 5 mg/kg ou procaïnamide 10–15 mg/kg si échec, puis cardioversion.",
      ],
    },
    {
      title: "Surveillance & orientation",
      bullets: [
        "Monitoring ECG continu, correction facteurs déclenchants, traitement de la fièvre.",
        "Hospitalisation pour toute TSV traitée, cardiopathie congénitale, suspicion WPW ou récidive.",
      ],
    },
  ],
  "traumatisme-thoraco-abdominal-fast": [
    {
      title: "Objectif",
      bullets: [
        "Prise en charge standardisée des traumatismes thoraciques et/ou abdominaux graves avec intégration systématique du FAST.",
        "Limiter les erreurs de calcul sur les bolus de remplissage, transfusions et agents d'induction pédiatriques.",
      ],
    },
    {
      title: "ABCDE",
      bullets: [
        "Immobilisation tête-cou, aspiration PRN, O₂ 10–15 L/min si SpO₂ < 94 %.",
        "2 VVP larges ± IO, NaCl 0,9 % 20 mL/kg avant transfusion équilibrée.",
        "Glycémie systématique : G10 % 2 mL/kg si < 0,7 g/L.",
      ],
    },
    {
      title: "Airway/Breathing",
      bullets: [
        "Induction séquence rapide : kétamine 2 mg/kg IV + rocuronium 1 mg/kg (immobilisation cervicale maintenue).",
        "Décompression immédiate des pneumothorax suffocants, drain thoracique si hémothorax massif.",
        "Morphine 0,1 mg/kg IV puis titration 0,025 mg/kg toutes les 5 min selon EVA.",
      ],
    },
    {
      title: "Circulation",
      bullets: [
        "Transfusion damage control : CGR 10–15 mL/kg, PFC 10–15 mL/kg, plaquettes 10–20 mL/kg.",
        "Objectifs : PAM ≥ 60–70 mmHg selon âge, température > 36 °C, calcium ionisé > 0,9 mmol/L.",
        "Adjoints : acide tranexamique < 3 h, ceinture pelvienne, contrôle mécanique du saignement.",
      ],
    },
    {
      title: "FAST pédiatrique",
      bullets: [
        "Fenêtres : péricarde, hépatique droite, splénique gauche, cul-de-sac de Douglas.",
        "FAST + instable → bloc opératoire immédiat / damage control ; FAST + stable → scanner TAP.",
        "FAST − mais instable → rechercher autre cause (tamponnade, hémorragie thoracique, fracture de bassin).",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Thorax : O₂ haut débit, drains, ventilation assistée si volet thoracique.",
        "Abdomen : chirurgie si instabilité persistante, PEC conservatrice si lésions hépatiques/spléniques stables.",
        "Situations particulières (nourrisson, pénétrant, polytrauma) → damage control resuscitation et transfusion précoce.",
      ],
    },
  ],
  "plaie-penetrante-thoraco-abdominale": [
    {
      title: "Objectif",
      bullets: [
        "Stabiliser toute plaie pénétrante thoracique ou abdominale pédiatrique et identifier les urgences opératoires.",
        "Limiter la contamination viscérale et la décompensation hémodynamique rapide chez l'enfant.",
      ],
    },
    {
      title: "Signes de gravité",
      bullets: [
        "Thorax : plaie soufflante, pneumothorax compressif, hémothorax avec choc, respiration paradoxale.",
        "Abdomen : défense/contracture, eviscération, hémorragie active, tachycardie avec TRC > 3 s.",
      ],
    },
    {
      title: "Gestes prioritaires",
      bullets: [
        "Pansement occlusif 3 côtés, exsufflation puis drain si pneumothorax compressif.",
        "Eviscération couverte de compresses humides; jamais réintégrer ni retirer un objet empalé.",
        "Bolus NaCl 0,9 % 20 mL/kg; chirurgie immédiate si instabilité ou saignement massif.",
      ],
    },
  ],
  "polytraumatisme-pediatrique": [
    {
      title: "Objectif",
      bullets: [
        "PEC opérationnelle du polytrauma pédiatrique avec ABCDE systématique et décisions rapides bloc / imagerie / transfert.",
        "Garantir les calculs pondérés des bolus, transfusions et drogues d’induction pour éviter toute règle de trois au lit du patient.",
      ],
    },
    {
      title: "Définition & triage",
      bullets: [
        "Atteinte d’au moins deux régions dont une engage potentiellement le pronostic vital : traiter comme urgence vitale.",
        "Activation de la filière polytrauma, FAST immédiat si instabilité, imagerie ciblée si stable.",
      ],
    },
    {
      title: "ABCDE",
      bullets: [
        "A : immobilisation tête–cou, aspiration, oxygène 10–15 L/min, IOT si GCS ≤ 8 ou détresse respiratoire.",
        "B : recherche pneumothorax suffocant, décompression 14–18G, drainage thoracique si hémothorax massif.",
        "C : NaCl 0,9 % 20 mL/kg avant transfusion (CGR/PFC 10–15 mL/kg, plaquettes 10–20 mL/kg).",
        "D : GCS, pupilles, convulsions → midazolam 0,1 mg/kg IV ou 0,2 mg/kg IN, glycémie → G10 % 2 mL/kg.",
        "E : déshabillage complet, prévention hypothermie, recherche hémorragie externe.",
      ],
    },
    {
      title: "Imagerie & orientation",
      bullets: [
        "FAST + instable → bloc immédiat ; FAST + stable → scanner TAP ; FAST − instable → chercher thorax / bassin / neuro.",
        "Scanner corps entier si mécanisme violent, sinon ciblé ; patient instable → pas de scanner avant geste vital.",
        "Décision conjointe réa/chirurgie/transfert + surveillance continue.",
      ],
    },
    {
      title: "Situations particulières",
      bullets: [
        "Nourrisson : choc masqué, transfusion précoce ; prématuré ou pathologie chronique : adapter volumes.",
        "Traumatisme pénétrant : forte probabilité de geste chirurgical ; suspicion maltraitance < 2 ans → imagerie systématique.",
        "Hospitalisation en soins intensifs pour tout polytrauma, sortie uniquement si trauma mineur confirmé après 4–6 h d’observation.",
      ],
    },
  ],
  "brulures-thermiques-etendues": [
    {
      title: "Objectif",
      bullets: [
        "Brûlures thermiques ≥ 10 % SCB (≥ 5 % nourrisson) hors 1er degré : standardiser la stabilisation préhospitalière/SAU selon GFRUP, SFAR/SFMU/CTB.",
        "Sécuriser les calculs de remplissage RL et l’analgésie pondérée en prévenant l’hypothermie.",
      ],
    },
    {
      title: "Évaluation initiale",
      bullets: [
        "ABCDE complet + estimation SCB (Lund & Browder pédiatrique ou règle de la paume ~1 %).",
        "IOT précoce si brûlure cervico-faciale avec suspicion inhalation, voix rauque/stridor/tirage, GCS < 9, détresse respiratoire ou choc.",
      ],
    },
    {
      title: "Mesures immédiates",
      bullets: [
        "Arrêt du processus thermique, retrait vêtements/bijoux ; cooling 15–20 min à 15–20 °C si < 20 % SCB et < 15 min après brûlure, stopper si hypothermie/instabilité.",
        "Prévention hypothermie (couverture isotherme, réchauffer ambulance/salle), O₂ MHC si inhalation suspectée, analgésie (paracétamol, morphine titrée ± kétamine, MEOPA).",
      ],
    },
    {
      title: "Remplissage RL",
      bullets: [
        "Indication : ≥ 10 % SCB enfant ou ≥ 5 % nourrisson, ou tout signe de choc.",
        "0–2 h : 20 mL/kg puis 10 mL/kg RL ; 2–24 h : Parkland 4 mL × poids × %SCB (50 % sur 8 h depuis l’accident, 50 % sur 16 h) en soustrayant ce qui a déjà été perfusé ; ajouter besoins 4-2-1 G5 % + électrolytes ; cible diurèse ≥ 1 mL/kg/h (≥ 0,5 mL/kg/h).",
      ],
    },
    {
      title: "Orientation / transfert",
      bullets: [
        "Hospitalisation au minimum : nourrisson 5–10 %, enfant 10–20 %, ou brûlure < 10 % avec localisation fonctionnelle, 3ᵉ degré, lésions associées ou suspicion maltraitance.",
        "Transfert CTB/réanimation : nourrisson > 10 %, enfant > 20 %, face/mains/pieds/périnée/articulations ou brûlures circulaires, inhalation de fumées ou défaillance vitale ; sortie domicile non recommandée si ≥ 10 %.",
      ],
    },
    {
      title: "À éviter",
      bullets: [
        "Pas d’antibioprophylaxie systémique ni de corticoïdes de routine pour la brûlure cutanée isolée.",
        "Pas de cooling prolongé/eau glacée ; pas de topiques gras type Biafine® ou tulle gras sur grandes surfaces ; pas d’infiltration lidocaïne étendue ; prudence avec les AINS.",
      ],
    },
  ],
  "brulures-chimiques-pediatriques": [
    {
      title: "Objectif",
      bullets: [
        "PEC immédiate d’une brûlure chimique cutanée ou oculaire chez l’enfant, avec décontamination précoce et décision d’orientation.",
        "Garantir les calculs pondérés d’antalgiques et rappeler les critères de gravité (localisation, surface, agent toxique).",
      ],
    },
    {
      title: "Évaluation initiale et gravité",
      bullets: [
        "ABCDE + identification de l’agent (acide/base/solvant), conserver l’emballage et appeler le centre antipoison si besoin.",
        "Signes de gravité : visage/œil, mains/pieds/articulations/périnée, inhalation ou ingestion chimique, agent hautement corrosif, surface même faible mais profonde.",
      ],
    },
    {
      title: "Mesures immédiates et traitement",
      bullets: [
        "Sécuriser le soignant, retirer vêtements/bijoux contaminés, couvrir ensuite par pansement stérile non adhérent.",
        "Rinçage abondant à l’eau tiède ou NaCl 0,9 % pendant au moins 15–30 min (oculaire idem, paupières maintenues ouvertes) ; solution amphotère type Diphoterine® si disponible.",
        "Acide fluorhydrique : après début du rinçage, gel de gluconate de calcium 2,5 % appliqué précocement, renouvelable toutes ~2 h, surveiller Ca2+/K+/ECG.",
        "Antalgie : paracétamol 10–15 mg/kg toutes 6 h (max 60 mg/kg/j), morphine IV 0,05–0,1 mg/kg lente puis bolus 0,01 mg/kg toutes 5–7 min selon douleur et tolérance.",
        "Éviter eau glacée, neutralisation empirique acide/base, graisses ou pommades non validées (Biafine®, huiles…).",
      ],
    },
    {
      title: "Hospitalisation / sortie",
      bullets: [
        "Hospitaliser/CTB si brûlure chimique étendue (> 10 % SCB enfant ou > 5 % nourrisson), localisation critique, agent toxique, inhalation/ingestion ou signe systémique.",
        "Sortie uniquement si brûlure limitée superficielle, non critique, sans agent toxique, douleur contrôlée et suivi organisé.",
      ],
    },
  ],
  "traumatisme-rachis-cervical": [
    {
      title: "Objectif",
      bullets: [
        "PEC sécurisée et standardisée d’un traumatisme cervical pédiatrique, de l’immobilisation à l’imagerie et l’orientation.",
        "Limiter toute mobilisation rachidienne et sécuriser les calculs antalgiques.",
      ],
    },
    {
      title: "Points clés",
      bullets: [
        "Entorses, subluxations, instabilité ligamentaire, fractures, lésions médullaires; SCIWORA fréquent chez l’enfant.",
        "Vulnérabilité : tête lourde, hyperlaxité et rachis très mobile → lésion médullaire possible même avec imagerie normale.",
      ],
    },
    {
      title: "Imagerie selon le risque",
      bullets: [
        "Faible risque PECARN/NICE : pas d’imagerie, minerve retirée après examen complet.",
        "Risque intermédiaire : radiographies (face/profil/transbouche) puis scanner si doute.",
        "Haut risque : scanner rachis cervical d’emblée; IRM si suspicion ligamentaire ou SCIWORA (déficit neuro + scanner normal).",
      ],
    },
    {
      title: "Mesures thérapeutiques",
      bullets: [
        "Immobilisation en ligne tête–cou–tronc, minerve rigide ou maintien manuel; intubation en maintien axial si nécessaire.",
        "Analgésie pondérée : paracétamol 15 mg/kg, morphine IV 0,05 mg/kg puis 0,01 mg/kg, kétamine 0,25–0,5 mg/kg.",
        "Pas de corticoïdes, pas de traction crânienne sans avis spécialisé, pas de retrait de minerve hors critères.",
      ],
    },
    {
      title: "Orientation / sortie",
      bullets: [
        "Hospitalisation si lésion stable douloureuse ou besoin de surveillance; réanimation si déficit neurologique, lésion instable, atteinte respiratoire ou polytrauma.",
        "Sortie seulement si mécanisme faible énergie, examen neuro et mobilité normaux, imagerie normale si réalisée, minerve retirée en sécurité et reconsultation < 24 h.",
      ],
    },
  ],
  "deshydratation-aigue-severe": [
    {
      title: "Objectif",
      bullets: [
        "Prise en charge immédiate et standardisée d’une déshydratation aiguë sévère chez nourrisson/enfant.",
        "Sécuriser l’évaluation, le remplissage et les calculs de réhydratation IV adaptés au poids.",
      ],
    },
    {
      title: "Définition / critères",
      bullets: [
        "Perte hydrique menaçant le pronostic vital : léthargie, TRC > 3 s, marbrures, extrémités froides, hypotension tardive.",
        "Pli cutané très lent, yeux cernés, oligurie/anurie, perte pondérale > 10 %, refus de boire.",
      ],
    },
    {
      title: "Mesures immédiates",
      bullets: [
        "ABCDE rapide, O₂ titré si SpO₂ < 94 % (MHC si choc).",
        "VVP ou IO, glycémie systématique et correction si < 3 mmol/L (G10 % 2 mL/kg).",
        "Isolation digestive, surveillance continue (TA, TRC, diurèse).",
      ],
    },
    {
      title: "Réhydratation",
      bullets: [
        "Choc/hypoperfusion : bolus NaCl 0,9 % ou RL 20 mL/kg en 15–30 min, à répéter une fois si besoin.",
        "Déficit = poids × % déshydratation × 10 ; corriger 50 % en 4 h avec NaCl 0,9 % ou RL (jamais G5 % seul).",
        "Après 4 h : besoins 4-2-1 + déficit restant sur 24 h ; ajout de KCl 0,5–1 mEq/kg/j dès reprise diurèse.",
      ],
    },
    {
      title: "Traitements associés / orientation",
      bullets: [
        "Ondansétron ≥ 2 ans 0,15 mg/kg (max 8 mg), probiotiques (Lactobacillus GG, S. boulardii), zinc < 5 ans.",
        "Pas de lopéramide ni d’AINS en contexte de déshydratation ; antibiotiques uniquement si suspicion bactérienne.",
        "Hospitalisation si déshydratation sévère, âge < 3 mois, vomissements incoercibles, troubles neuro ou comorbidités ; sortie si réhydratation clinique, tolérance orale et parents informés (contrôle 24–48 h).",
      ],
    },
  ],
  "deshydratation-aigue-sans-choc": [
    {
      title: "Objectif",
      bullets: [
        "Standardiser la PEC d’une déshydratation modérée (hypovolémie sans choc) due à vomissements/diarrhées.",
        "Prévenir l’évolution vers le choc hypovolémique, sécuriser les calculs de réhydratation orale ou IV et l’orientation.",
      ],
    },
    {
      title: "Évaluation initiale",
      bullets: [
        "ABCDE complet, TA normale, TRC < 3 s, conscience préservée = pas de choc franc.",
        "Signes de déshydratation modérée : soif, muqueuses sèches, pli cutané lent, tachycardie modérée, oligurie.",
      ],
    },
    {
      title: "Réhydratation orale (si possible)",
      bullets: [
        "SRO OMS/ESPGHAN 50–100 mL/kg sur 4 h, en petites prises régulières.",
        "Ondansétron ≥ 2 ans 0,15 mg/kg (max 8 mg) si vomissements ; éviter métoclopramide, AINS, lopéramide.",
      ],
    },
    {
      title: "Réhydratation IV (si incapacité à boire)",
      bullets: [
        "NaCl 0,9 % ou Ringer Lactate.",
        "Déficit = poids × % × 10 ; corriger 50 % en 4 h puis besoins 4-2-1 ; KCl 0,5–1 mEq/kg/j après diurèse.",
        "G10 % 2 mL/kg si glycémie < 3 mmol/L.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation : incapacité à boire, vomissements incoercibles, ionogramme perturbé, âge < 3 mois, pathologie sévère, environnement incertain ou déshydratation sévère.",
        "Sortie : hydratation clinique normale, diurèse reprise, tolérance orale, ionogramme normal, parents fiables, contrôle < 24–48 h.",
      ],
    },
  ],
  "coup-de-chaleur": [
    {
      title: "Objectif",
      bullets: [
        "Identifier un coup de chaleur (hyperthermie ≥ 40 °C + atteinte neurologique) et initier un refroidissement immédiat < 30 min.",
        "Prévenir les défaillances multiviscérales et déterminer l’orientation (hospitalisation / réanimation).",
      ],
    },
    {
      title: "Évaluation initiale",
      bullets: [
        "ABCDE, température centrale rectale; TA normale vs hypotension tardive, TRC > 3 s = gravité.",
        "Atteinte neuro (confusion, convulsions, coma) impose activation immédiate du protocole.",
      ],
    },
    {
      title: "Refroidissement",
      bullets: [
        "Immersion eau glacée 1–15 °C 10–20 min sous surveillance, arrêt à 39 °C.",
        "Ou méthode évaporative + ventilation ; poches de glace aisselles/aine/cou/flancs.",
        "Pas d’antipyrétiques/AINS, pas d’alcool cutané, prudence immersion nourrisson < 1 an.",
      ],
    },
    {
      title: "Traitements associés",
      bullets: [
        "Hydratation si hypovolémie : NaCl 0,9 % 10–20 mL/kg; éviter G5 % d’emblée.",
        "Convulsions : midazolam 0,1–0,2 mg/kg IV/IN ou clonazépam 0,05 mg/kg IV.",
        "Hypoglycémie : G10 % 2 mL/kg; surveiller électrolytes, fonction rénale/hépatique, CPK.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation : T ≥ 40 °C, trouble neuro, rhabdomyolyse (CPK > 1000), déshydratation sévère, troubles ioniques, nourrisson < 1 an, suspicion coup de chaleur d’effort.",
        "Réanimation si coma/convulsions, échec refroidissement, acidose sévère, IRA, instabilité hémodynamique; sortie rare seulement si T < 38 °C stable 6–8 h, examen neuro normal, iono/CPK normaux et famille fiable.",
      ],
    },
  ],
  "hypothermie-accidentelle": [
    {
      title: "Objectif",
      bullets: [
        "PEC immédiate de l’hypothermie accidentelle pédiatrique : classer (32–35 / 28–32 / < 28 °C), réchauffer sans traumatisme et orienter (hospitalisation/réanimation).",
        "Prévenir FV, corriger hypoglycémie et adapter les bolus IV chauffés selon la perfusion.",
      ],
    },
    {
      title: "Évaluation initiale",
      bullets: [
        "ABCDE, mesure T° centrale rectale/sonde/œsophagienne (pas tympanique). Manipulation minimale (risque FV).",
        "Bradypnée, bradycardie physiologique, TRC prolongé, conscience altérée possible.",
      ],
    },
    {
      title: "Réchauffement selon sévérité",
      bullets: [
        "Légère 32–35 °C : réchauffement externe passif/actif léger (couvertures, air chaud), boissons chaudes si conscience.",
        "Modérée 28–32 °C : réchauffement externe actif + perfusions chauffées 38–42 °C (NaCl/RL), bolus 10 mL/kg si hypovolémie modérée, 20 mL/kg si hypoperfusion.",
        "Sévère < 28 °C : réchauffement interne actif (lavages chauds, air chaud humidifié), ECMO/CEC si arrêt cardiaque/instabilité.",
      ],
    },
    {
      title: "Gestes associés",
      bullets: [
        "O₂ titré 94–98 %, monitorage ECG (QT long), TA, SpO₂, T° centrale continue.",
        "Hypoglycémie fréquente : G10 % 2 mL/kg IV. Convulsions : midazolam 0,1–0,2 mg/kg ou clonazépam 0,05 mg/kg.",
        "Hyperkaliémie fréquente en hypothermie sévère : corriger après réchauffement sauf menace vitale.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation : T° < 32 °C, troubles neuro ou cardiaques, hypoglycémie persistante, vulnérabilité/maltraitance, submersion.",
        "Réanimation : < 28 °C, coma, arythmies sévères, instabilité hémodynamique, besoin de réchauffement interne actif.",
        "Sortie seulement si T° ≥ 36 °C stabilisée 2–3 h, examen neuro normal, iono/glycémie normaux, cause corrigée, environnement fiable (reconsultation 24–48 h).",
      ],
    },
  ],
  "intoxication-paracetamol": [
    {
      title: "Objectif",
      bullets: [
        "Standardiser la prise en charge de l’intoxication au paracétamol : évaluation, nomogramme, NAC IV pondérée, hospitalisation/réa.",
        "Ne pas retarder la NAC si dose toxique, paracétamolémie toxique ou dose inconnue suspecte.",
      ],
    },
    {
      title: "Évaluation initiale",
      bullets: [
        "ABCDE ; dose ingérée (mg/kg), heure exacte, forme (LP ?), co-intoxications.",
        "Paracétamolémie à H4 (et H8 si LP) + bilan hépatique (ASAT/ALAT, TP/INR, bilirubine), ionogramme, glycémie, créatinine, lactate.",
      ],
    },
    {
      title: "Seuils décisionnels",
      bullets: [
        "Aiguë : > 150 mg/kg = NAC immédiate ; > 200 mg/kg très toxique ; dose inconnue → prudence.",
        "Répétée : > 90 mg/kg/j ou cytolyse/vomissements → NAC ; nomogramme valable seulement en aiguë.",
      ],
    },
    {
      title: "NAC IV (21 h)",
      bullets: [
        "150 mg/kg/1 h (charge) ; 50 mg/kg/4 h ; 100 mg/kg/16 h. Alternative 12 h sur avis centre antipoison.",
        "Vomissements : ralentir la perfusion, ondansétron ≥ 2 ans 0,15 mg/kg.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation : NAC démarrée, paracétamolémie toxique, cytolyse, co-intoxications, vomissements persistants, adolescent.",
        "Réanimation : TP < 50 %, hypoglycémie persistante, encéphalopathie hépatique, lactates élevés, IRA.",
        "Sortie si bilan hépatique normal, paracétamolémie < 10 mg/L, pas de vomissements, conscience normale, suivi 48–72 h, contexte social fiable.",
      ],
    },
  ],
  "intoxication-benzodiazepines": [
    {
      title: "Objectif",
      bullets: [
        "Identifier rapidement une intoxication aux benzodiazépines, traiter la dépression respiratoire, encadrer l’usage du flumazénil et orienter.",
      ],
    },
    {
      title: "Signes de gravité",
      bullets: [
        "FR < 10/min, SpO₂ < 92 % malgré O₂, GCS < 12, hypotension, co-ingestion dangereuse (tricycliques, opioïdes, alcool).",
        "Convulsions, âge < 2 ans symptomatique, BZD LP, tentative de suicide.",
      ],
    },
    {
      title: "Symptomatique",
      bullets: [
        "O₂ titré 94–98 %, ventilation assistée si hypoventilation/SpO₂ < 90 % ou épuisement.",
        "VVP/IO si conscience altérée ; NaCl 0,9 % 10 mL/kg si hypotension (rare).",
      ],
    },
    {
      title: "Flumazénil",
      bullets: [
        "Indications strictes : ingestion accidentelle isolée sans épilepsie ni co-ingestion pro-convulsivante ni sevrage.",
        "Contre-indications : tricycliques, épilepsie/anticonvulsivants, sevrage BZD, doute de co-ingestion, tentative de suicide.",
        "< 5 ans : 0,01 mg/kg (max 0,2 mg) puis 0,01 mg/kg/min (max 0,05 mg/kg ou 1 mg). ≥ 5 ans : 0,1 mg répété (max 1 mg).",
        "Risque de re-sédation, surveillance ≥ 2 h post-réveil.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation : dépression respi, âge < 2 ans symptomatique, co-ingestion, BZD LP, flumazénil, coma, suicide.",
        "Réanimation : intubation/ventilation, hypoventilation sévère, acidose respiratoire, instabilité hémodynamique.",
        "Sortie : enfant réveillé, paramètres normaux, tolérance alimentaire, pas de BZD LP, surveillance post-flumazénil ≥ 2–3 h, famille fiable.",
      ],
    },
  ],
  "intoxication-opioides": [
    {
      title: "Objectif",
      bullets: [
        "Standardiser la prise en charge des intoxications opioïdes pédiatriques : ventilation prioritaire, naloxone titrée, surveillance prolongée des formes LP/tramadol.",
      ],
    },
    {
      title: "Signes / examens",
      bullets: [
        "Triade opioïde : dépression respiratoire + myosis serré + coma ; bradycardie/hypotension possibles.",
        "Bilans si modéré/sévère : glycémie, GDS, ionogramme, NFS, fonction rénale, ECG (tramadol/méthadone).",
      ],
    },
    {
      title: "Ventilation / perfusion",
      bullets: [
        "O₂ 94–98 %, ventilation assistée si SpO₂ < 92 %, FR très basse ou apnées.",
        "VVP/IO ; NaCl 0,9 % 10 mL/kg si hypotension (rare).",
      ],
    },
    {
      title: "Naloxone",
      bullets: [
        "Indications : dépression respi, SpO₂ < 94 % malgré O₂, hypoventilation/apnée, coma opioïde, intoxication accidentelle.",
        "Titration IV : 0,01 mg/kg puis 0,02 mg/kg, puis 0,1 mg/kg si besoin ; max 2 mg cumulés.",
        "Re-sédation : perfusion = 2/3 de la dose efficace cumulée/h ; voies IM/IN 0,1 mg/kg si IV impossible (surveillance longue).",
      ],
    },
    {
      title: "Tramadol",
      bullets: [
        "Naloxone si dépression respi sévère ; convulsions → midazolam 0,1–0,2 mg/kg.",
        "ECG systématique (QT long), surveillance prolongée si forme LP.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation : naloxone administrée, dépression respi, opioïde LP (méthadone/oxycodone), coma, co-ingestion, contexte douteux ou volontaire.",
        "Réanimation : intubation/ventilation, naloxone en perfusion, hypotension persistante, convulsions récurrentes.",
        "Sortie : réveil complet, FR/SpO₂ normales sans O₂, pas de naloxone depuis ≥ 6 h, pas d’opioïde LP, famille fiable, prévention/ suivi 24–48 h.",
      ],
    },
  ],
  "ingestion-caustiques": [
    {
      title: "Objectif",
      bullets: [
        "PEC sécurisée d’une ingestion de caustique (acides/bases fortes) chez l’enfant : protéger VAS, éviter tout geste aggravant, planifier endoscopie 12–24 h et orienter.",
      ],
    },
    {
      title: "Mesures immédiates",
      bullets: [
        "Appel CAPTV immédiat, retirer vêtements souillés, irrigation peau/yeux si projection.",
        "Rien par la bouche, O₂ 94–98 %, VVP, antalgiques (paracétamol/morphine) et hydratation prudente.",
      ],
    },
    {
      title: "Interdits",
      bullets: [
        "Pas de vomissements provoqués, pas de boisson ni neutralisation, pas de charbon activé, pas de sondage NG préhospitalier, pas de lavage gastrique.",
      ],
    },
    {
      title: "Examens / endoscopie",
      bullets: [
        "Biologie : NFS, CRP, ionogramme, fonction rénale, bilan hépatique, gaz sanguin.",
        "Imagerie (TDM thoraco-abdo) si suspicion perforation ; OGD 12–24 h si symptomatique, ingestion base > 5 %/acide concentré/intentionnelle, non recommandée après 48 h.",
      ],
    },
    {
      title: "Traitement médical",
      bullets: [
        "IPP chez symptomatiques (oméprazole IV 1 mg/kg/j).",
        "NaCl 0,9 % 10–20 mL/kg si déshydratation ; surveillance glycémie.",
        "Corticoïdes seulement si œdème laryngé menaçant (méthylpred 1–2 mg/kg). Antibiotiques seulement si perforation/fièvre/inhalation/médiastinite.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation : tout symptôme, ingestion forte, douleur thoracique/abdo, vomissements, hypersialorrhée, lésions buccales, anomalies radio, ingestion volontaire, < 3 ans.",
        "Réanimation : détresse respi, suspicion perforation, acidose métabolique, instabilité hémodynamique, stades 2b–3.",
        "Sortie : asymptomatique > 6 h, ingestion mineure < 5 %, pas de signes ORL/vomissements ni lésions buccales, pas d’indication endoscopie, famille fiable + prévention accidents.",
      ],
    },
  ],
  "ingestion-pile-bouton": [
    {
      title: "Objectif",
      bullets: [
        "Urger la prise en charge des piles boutons : neutraliser pH (miel/sucralfate), localiser par radios, extraire en < 2 h si œsophage, prévenir les complications (fistule aorto-œsophagienne).",
      ],
    },
    {
      title: "Mesures immédiates",
      bullets: [
        "Ne pas faire vomir/boire, pas de charbon ni sondage ; miel 10 mL/10 min ≤ 6 doses si > 12 mois, sucralfate 10 mL (tous âges) si dispo.",
        "Radios face + profil cou/thorax/abdomen d’emblée pour localiser et vérifier double contour.",
      ],
    },
    {
      title: "Localisation",
      bullets: [
        "Œsophage : endoscopie < 2 h, O₂, VVP, IPP IV, hospitalisation.",
        "Gastrique : < 6 ans + ≥ 20 mm → endoscopie 24–48 h ; symptômes → endoscopie ; asymptomatique → radio 48 h, endoscopie si non évacuée.",
        "Post-pylorique : surveillance clinique + radio 48–72 h, endoscopie/TDM si symptômes.",
      ],
    },
    {
      title: "Traitements associés",
      bullets: [
        "Antalgiques (paracétamol 15 mg/kg, morphine 0,05–0,1 mg/kg).",
        "IPP si lésions œsophagiennes (oméprazole IV 1 mg/kg/j).",
        "Antibiotiques seulement si fièvre/perforation/inhalation/médiastinite ; NaCl 0,9 % 20 mL/kg si choc.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation : pile œsophagienne, symptômes, pile ≥ 20 mm, < 6 ans avec pile gastrique, co-ingestion, famille peu fiable, ingestion volontaire.",
        "Réanimation : détresse respi, perforation suspecte, hématémèse, instabilité hémodynamique.",
        "Sortie : pile gastrique < 15 mm chez > 6 ans, asymptomatique, radio satisfaisante, parents fiables + consignes retour immédiat (fièvre, vomissements, douleur thoracique, hématémèse, hypersialorrhée).",
      ],
    },
  ],
  "intoxication-bb-ic": [
    {
      title: "Objectif",
      bullets: [
        "Prise en charge urgente des intoxications BB/IC : bradycardie/hypotension, corriger glycémie, antidotes (glucagon/calcium), insuline haute dose, vasopresseurs, HIET, orientation réa.",
      ],
    },
    {
      title: "Signes / examens",
      bullets: [
        "Bradycardie, hypotension, troubles conductifs, hypo (BB) ou hyperglycémie (IC), convulsions (propranolol).",
        "Biologie : glycémie, iono, Ca/Mg, gaz, lactate, fonction rénale ; ECG (BAV/blocs/QRS/QT).",
      ],
    },
    {
      title: "Traitements BB",
      bullets: [
        "O₂, 2 VVP, remplissage 10–20 mL/kg.",
        "Glucagon : bolus 50 µg/kg (max 5 mg) → perf 50 µg/kg/h (1–5 mg/h).",
        "Insuline haute dose (HIET) : bolus 1 U/kg (si glycémie > 6 mmol/L), perf 0,5–1 U/kg/h (max 10) + glucose (G30 %) et cible glycémie 6–10 mmol/L, K+ 3,5–4,5.",
      ],
    },
    {
      title: "Traitements IC",
      bullets: [
        "Calcium : CaCl2 10 % 20 mg/kg (0,2 mL/kg) central, répétable ; gluconate 10 % 50 mg/kg (0,5 mL/kg) périphérique, répétable puis perf 50 mg/kg/h.",
        "HIET = première ligne IC sévère.",
        "Vasopresseurs : adrénaline/noradrénaline 0,05–1 µg/kg/min.",
        "Intralipides : bolus 1,5 mL/kg 20 %, perf 0,25 mL/kg/min 30–60 min (max 10 mL/kg) si choc réfractaire (propranolol, vérapamil, diltiazem).",
      ],
    },
    {
      title: "Autres / orientation",
      bullets: [
        "Atropine 0,02 mg/kg (efficacité limitée), charbon si < 1 h et conscient.",
        "Formes LP : surveillance ≥ 24–36 h ; nourrisson < 2 ans : risque hypoglycémie ; ado : évaluation psy.",
        "Hospitalisation si brady/hypotension, ECG anormal, LP, besoin antidotes IV, ingestion volontaire/co-intox ; réa si HIET/vasopresseurs/ventilation ou choc.",
        "Sortie : FC/PA normales sans support, ECG normal, glycémie stable, asymptomatique ≥ 12 h (24 h si LP), suivi psy si besoin, parents fiables.",
      ],
    },
  ],
  "corps-etranger-inhale": [
    {
      title: "Objectif",
      bullets: [
        "Reconnaître obstruction totale/partielle, appliquer les manœuvres adaptées à l’âge, organiser l’endoscopie et l’hospitalisation.",
      ],
    },
    {
      title: "Gravité",
      bullets: [
        "Obstruction partielle : toux efficace, entrée d’air conservée ; obstruction totale : silence respiratoire, incapacité parler/pleurer, cyanose, tirage extrême, perte de conscience rapide.",
        "Ne pas faire de manœuvres si toux efficace.",
      ],
    },
    {
      title: "Conduite immédiate",
      bullets: [
        "< 1 an : 5 claques + 5 compressions thoraciques (2 doigts), alterner.",
        "≥ 1 an : 5 claques dorsales + 5 compressions abdominales (Heimlich), alterner.",
        "Enfant inconscient : appel secours, RCP 30 compressions, visualisation CE si visible, 2 insufflations, poursuivre jusqu’aux secours.",
      ],
    },
    {
      title: "Post-extraction",
      bullets: [
        "O₂ titré 94–98 %, rechercher stridor/dyspnée, hémoptysie, pneumothorax (manœuvres intenses).",
        "Radiographie thorax PA + profil systématique.",
        "Endoscopie rigide si suspicion persistante même radios normales, CE végétal/arachide, symptômes persistants.",
      ],
    },
    {
      title: "Traitements",
      bullets: [
        "Bronchodilatateurs non recommandés (obstruction mécanique).",
        "Corticothérapie seulement si œdème laryngé post-manœuvres : dexaméthasone 0,15–0,6 mg/kg.",
        "Antibiotiques uniquement si pneumopathie secondaire ; antalgiques (paracétamol 15 mg/kg), éviter morphiniques si FR altérée.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation : extraction endoscopique, symptômes persistants, radio anormale, suspicion persistante, CE végétal, comorbidité respi, post-manœuvres traumatiques.",
        "Réanimation : intubation/ventilation, hypoxie persistante, ACR initial, œdème laryngé sévère, pneumothorax sous tension.",
        "Sortie : clinique et radio normales, asymptomatique ≥ 4 h, famille fiable + prévention (éducation CE).",
      ],
    },
  ],
  "corps-etranger-oesophagien": [
    {
      title: "Objectif",
      bullets: [
        "PEC d’un corps étranger œsophagien (hors pile) : identifier gravité, typer le CE (pointu/aimants/aliments/objet arrondi), prioriser l’endoscopie et orienter.",
      ],
    },
    {
      title: "Signes de gravité",
      bullets: [
        "Hypersialorrhée, incapacité à avaler salive, douleur thoracique, vomissements incoercibles, dyspnée/toux, fièvre/suspicion perforation, CE pointu/aimants multiples.",
      ],
    },
    {
      title: "Examens",
      bullets: [
        "Radiographie face+profil cou-thorax-abdomen pour tout CE ; rechercher localisation, forme, pneumomédiastin, niveaux.",
        "CE non radio-opaque : endoscopie si symptômes persistants ; TDM si suspicion perforation (emphysème médiastinal, douleur, fièvre, dyspnée, CRP élevée).",
      ],
    },
    {
      title: "Conduite",
      bullets: [
        "Pointu/tranchant : endoscopie < 2 h ; ne pas faire avaler pain/eau.",
        "Aimants : un aimant < 12–24 h ; multiples ou aimant+ métal → urgence < 2 h.",
        "Aliment bloqué : extraction < 12 h, pas de vomissements induits ni boissons ; objet arrondi : extraction < 24 h si œsophage ; objet long (>5–6 cm) : extraction.",
        "Objet passé estomac : surveillance + contrôle.",
      ],
    },
    {
      title: "Traitements",
      bullets: [
        "O₂ titré 94–98 % ; antalgiques (paracétamol 15 mg/kg, morphine 0,05–0,1 mg/kg).",
        "Corticoïdes seulement si œdème laryngé/détresse respi (dexaméthasone 0,15–0,6 mg/kg).",
        "ATB si perforation/fièvre/mediastinite/pneumopathie d’inhalation ; interdits : boissons, vomissements provoqués, gestes externes.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation : CE pointu/aimants, symptômes, extraction endoscopique, comorbidité respi, suspicion perforation, douleur/fièvre, < 3 ans, problème social.",
        "Réanimation : instabilité hémodynamique, détresse respi, perforation/mediastinite, post-anesthésie complexe.",
        "Sortie : examen/radio normaux ou CE évacué, asymptomatique ≥ 4–6 h, parents fiables + consignes retour.",
      ],
    },
  ],
  "malaise-grave-nourrisson": [
    {
      title: "Objectif",
      bullets: [
        "Identifier un BRUE faible risque versus ALTE haut risque, sécuriser ABCDE et éliminer les causes graves, définir hospitalisation vs sortie.",
      ],
    },
    {
      title: "Critères haut risque",
      bullets: [
        "Âge < 60 j, prématurité < 32 SA (ou âge corrigé < 45 SA), événement > 1 min, récidive, ventilation nécessaire, hypotonie persistante, suspicion maltraitance, signes vitaux anormaux, nourrisson malade (fièvre, vomissements bilieux), terrain à risque.",
      ],
    },
    {
      title: "BRUE faible risque",
      bullets: [
        "Événement résolu unique, aucun critère haut risque.",
        "Observation 1–2 h, monitorage SpO₂/FR, pas d’examens ni imagerie, pas de traitements respiratoires, sortie avec éducation parents si tout est normal.",
      ],
    },
    {
      title: "ALTE / haut risque",
      bullets: [
        "Hospitalisation systématique.",
        "Bilans selon clinique : glycémie, iono, gaz si malaise important, ECG, monitorage 24 h, NFS/CRP/PCT, ECBU, PCR virales (coqueluche/VRS) selon contexte, Rx thorax si signes respi, avis neuro/social si besoin.",
      ],
    },
    {
      title: "Traitements",
      bullets: [
        "O₂ 94–98 %, glucose IV si glycémie < 3 mmol/L (G10 % 2 mL/kg), midazolam 0,1–0,2 mg/kg si convulsion, paracétamol 15 mg/kg si fièvre/douleur.",
        "Pas d’antiémétiques systématiques < 6 mois, caféine uniquement en service spécialisé (prématurés).",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation dès un critère haut risque, anomalies persistantes, comorbidités, suspicion coqueluche/intoxication/maltraitance, épisode réanimé.",
        "Sortie (BRUE faible risque) si asymptomatique ≥ 1–2 h, examen normal, parents rassurés/formés, accès urgent facilité, document d’alerte remis.",
      ],
    },
  ],
  "troubles-rythme-ventriculaire": [
    {
      title: "Objectif",
      bullets: [
        "Prendre en charge les TV/FV/torsades pédiatriques : défibrillation 4 J/kg, cardioversion si TV instable, MgSO4 torsades, antiarythmiques adaptés, orientation réanimation.",
      ],
    },
    {
      title: "Rythme choquable (pVT/FV)",
      bullets: [
        "RCP + O₂ + défibrillateur : 4 J/kg biphasique (2–4 J/kg autorisé). Chocs successifs avec RCP 2 min.",
        "Après 3ᵉ choc : adrénaline 0,01 mg/kg toutes 3–5 min + amiodarone 5 mg/kg (ou lidocaïne 1 mg/kg).",
        "Chocs ultérieurs jusqu’à ~8–10 J/kg max selon appareil.",
      ],
    },
    {
      title: "TV avec pouls",
      bullets: [
        "Instable : cardioversion synchronisée 1 J/kg puis 2 J/kg (jusqu’à 4 J/kg), + amiodarone 5 mg/kg si persistance, avis cardio.",
        "Stable : O₂, monitorage, bilan ionique, amiodarone 5 mg/kg sur 20–60 min (jusqu’à 15 mg/kg/j selon avis spécialisé).",
      ],
    },
    {
      title: "Torsades de pointes (QT long)",
      bullets: [
        "Magnésium 25–50 mg/kg IV (max 2 g) perf 15–20 min si pouls, bolus IV/IO en RCP si sans pouls.",
        "Corriger K+/Ca2+, arrêter médicaments allongeant le QT ; pacing/isoprénaline si récidives.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation réa/USC/cardiologie après FV, TV sans pouls, TV soutenue ou torsades : monitorage continu, bilan étiologique complet, plan secondaire (β-bloquants, DAI…).",
        "Éviter vasopressine de routine, défibrillation > 10 J/kg hors protocole expert, antiarythmiques non validés sans avis spécialisé.",
      ],
    },
  ],
  "bradycardie-extreme": [
    {
      title: "Objectif",
      bullets: [
        "Gérer une bradycardie pédiatrique grave avec signes de choc : ventilation/oxygénation, RCP + adrénaline si FC < 60/min, atropine ciblée, pacing si réfractaire, orientation réanimation.",
      ],
    },
    {
      title: "Signes de gravité",
      bullets: [
        "FC très basse (< 60/min ou < 5e centile) malgré ventilation, hypotension, altération de conscience, TRC > 3 s, marbrures, oligurie.",
        "Risque arrêt cardiorespiratoire imminent.",
      ],
    },
    {
      title: "Mesures initiales",
      bullets: [
        "O₂ haut débit, ventilation assistée si besoin ; corriger 4 H/4 T (hypoxie, hypovolémie, hypo/hyperkaliémie, hypothermie, tamponnade, pneumothorax, thrombose, toxiques).",
        "Monitorage ECG, TA, SpO₂ ; accès IV/IO, glycémie, gaz/iono.",
      ],
    },
    {
      title: "Traitement actif",
      bullets: [
        "FC < 60/min + choc malgré ventilation → RCP + adrénaline 0,01 mg/kg IV/IO toutes 3–5 min (0,1 mL/kg 1:10 000).",
        "Atropine 0,02 mg/kg (min 0,1 mg, max 0,5 mg/bolus) si cause vagale/bloc AV, peut répéter une fois.",
        "Pacing externe/transveineux si réfractaire (avis cardio).",
      ],
    },
    {
      title: "Bradycardie avec pouls (choc modéré)",
      bullets: [
        "O₂, IV/IO, monitorage, correction causes ; atropine si cause vagale/bloc AV, préparer pacing si détérioration.",
        "Avis cardiologie, transfert en unité spécialisée.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation USC/réanimation pédiatrique obligatoire, monitorage continu, bilan étiologique (ECG, écho, iono, métabolique), avis cardio.",
        "Stabilisation aiguë : FC adaptée, pas de récidive, causes corrigées/planifiées, suivi cardio en place.",
      ],
    },
  ],
  "hyperkaliemie-severe": [
    {
      title: "Objectif",
      bullets: [
        "Reconnaître et traiter rapidement une hyperkaliémie sévère pédiatrique (K⁺ élevé + signes ECG/clinique) : protection cardiaque, translocation du K⁺, élimination et préparation dialyse.",
      ],
    },
    {
      title: "Signes de gravité",
      bullets: [
        "K⁺ ≥ ~6–6,5 mmol/L ou signes ECG : ondes T pointues, QRS élargi, absence P, rythme sinusoïdal.",
        "Clinique : faiblesse, arythmies, bradycardie, hypotension, risque arrêt.",
      ],
    },
    {
      title: "Mesures initiales",
      bullets: [
        "O₂ haut débit, monitorage ECG continu, accès IV/IO, TA, bilans (iono, gaz, créat/urée, CK…).",
        "Corriger causes (hypoxie, hypovolémie, acidose, rhabdomyolyse), arrêter médicaments hyperkaliémiants.",
      ],
    },
    {
      title: "Traitement aigu",
      bullets: [
        "Protection cardiaque : gluconate de calcium 10 % 0,2 mL/kg IV (min 1 mL, cap protocole local).",
        "Translocation : insuline 0,1 U/kg + glucose 50 % 2 mL/kg; bicarbonate 1–2 mEq/kg si acidose; salbutamol néb 0,15 mg/kg (2,5–5 mg, max 10).",
        "Élimination : arrêter apports, diurétiques si possible, résines rarement en urgence, dialyse/épuration si anurie/IRA ou hyperK persistante.",
      ],
    },
    {
      title: "Situations particulières",
      bullets: [
        "Nouveau-né/prématuré : plages normales plus hautes (≤ 6 mmol/L), volumes adaptés, avis néonat/néphro.",
        "IRA/anurie : indication agressive, dialyse rapide.",
        "Rhabdomyolyse/lyse/intoxication : surveillance K⁺ 15–30 min initialement, bilan spécifique.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation soins intensifs/réa : monitorage continu, bilans répétés, préparation épuration.",
        "Stabilisation : K⁺ < 5,5–6 mmol/L, ECG/clinique normalisés, pas de récidive 12–24 h, cause corrigée/planifiée, suivi néphro-cardio.",
      ],
    },
  ],
  "hyponatremie-severe": [
    {
      title: "Objectif",
      bullets: [
        "Prise en charge urgente de l’hyponatrémie aiguë sévère : bolus NaCl 3 % pour stopper l’œdème cérébral, puis correction lente et étiologique.",
      ],
    },
    {
      title: "Gravité",
      bullets: [
        "Na⁺ < 125 mmol/L ou hyponatrémie aiguë (< 48 h) avec symptômes neurologiques (convulsions, troubles conscience, HTIC, arrêt respi).",
      ],
    },
    {
      title: "Traitement d’attaque",
      bullets: [
        "NaCl 3 % 2 mL/kg sur 10 min (max 100 mL), répéter jusqu’à 3 fois si absence d’amélioration ; contrôle Na⁺ 15–30 min après chaque bolus.",
        "Objectif court terme : +4 à +6 mmol/L.",
      ],
    },
    {
      title: "Correction lente",
      bullets: [
        "Cible +6 à +8 mmol/L/24 h, jamais > 10 mmol/L/24 h.",
        "Adapter à la cause : restriction hydrique SIADH, NaCl 0,9 % si pertes digestives/rénales/déshydratation, avis néphro/cardio pour IC/IR.",
        "Surveillance Na⁺ q2h, neuro rapprochée, TA/FC/Sat, diurèse.",
      ],
    },
    {
      title: "À éviter",
      bullets: [
        "Surcorrection rapide, perfusions hypotoniques, diurétiques sans indication, vaptans en urgence pédiatrique.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation (USC/réa) pour toute hyponatrémie sévère/symptomatique ou aiguë, besoin NaCl 3 %, ou contexte SIADH/IRA/intox.",
        "Stabilisation phase aiguë : Na⁺ > 125–130 mmol/L, correction ≤ 8 mmol/L/24 h, symptômes résolus, cause prise en charge, plan de surveillance établi.",
      ],
    },
  ],
  "kawasaki-choc": [
    {
      title: "Objectif",
      bullets: [
        "PEC Kawasaki aigu et KDSS : détecter le choc, IVIG + AAS, gérer la myocardite/vasoplégie, prévenir coronarites, plan de suivi cardio.",
      ],
    },
    {
      title: "Signes de choc",
      bullets: [
        "Hypotension (âge), TRC > 3 s, marbrures, tachycardie, pouls filants, lactates > 2, oligurie, altération conscience.",
      ],
    },
    {
      title: "Mesures immédiates",
      bullets: [
        "O₂ 94–98 %, écho cardiaque urgente, remplissage prudent NaCl 0,9 % 10 mL/kg (x1 si besoin, surveiller œdème pulmonaire/myocardite).",
        "Vasoactifs : vasoplégie → noradrénaline 0,05–0,5 µg/kg/min ; cardiogénique → dobutamine 5–10 µg/kg/min ou épinéphrine 0,05–0,3 µg/kg/min ; milrinone 0,25–0,75 µg/kg/min si PAS ok.",
      ],
    },
    {
      title: "Traitement étiologique",
      bullets: [
        "IVIG 2 g/kg sur 10–12 h ; AAS 30–50 mg/kg/j en 4–6 prises puis 3–5 mg/kg/j après apyrexie 48–72 h.",
        "Corticothérapie formes sévères/choc : Méthylpred 2 mg/kg/j ou pulses 30 mg/kg/j ×1–3 j (avis sénior).",
        "Anticoagulation si coronaires Z ≥ 10 : héparine/HBPM selon cardio.",
      ],
    },
    {
      title: "Situations particulières",
      bullets: [
        "Nourrisson < 1 an : risque coronarites ++, IVIG précoce même formes incomplètes.",
        "Myocardite sévère : pas de sur-remplissage ; catécholamines cardiosélectives, milrinone CI si PAS basse.",
        "COVID/PIMS : immunomodulation renforcée (cortico systématique, 2ᵉ IVIG possible), anticoagulation fréquente.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation systématique ; réanimation si choc, myocardite, vasoactifs.",
        "Transfert hors réa si stable sans vasopresseurs, perfusion correcte, écho rassurante/stable, apyrexie > 48 h, inflammation décroissante, AAS anti-agrégante relayée, suivi cardio programmé (J7, J14, J30, 6 mois).",
      ],
    },
  ],  "reanimation-neonatale-salle-de-naissance": [
    {
      title: "Objectif",
      bullets: [
        "Ventilation efficace en priorite, prevention de l'hypothermie, reperage rapide des situations a risque (FC < 100, respiration absente/gasping, tonus faible).",
      ],
    },
    {
      title: "Sequence initiale",
      bullets: [
        "Naissance -> sechage -> stimulation -> position neutre puis VPP 30 s si respiration absente/gasping ou FC < 100.",
        "Apres 30 s : FC >= 100 -> sevrage/CPAP ; FC 60-99 -> optimisation ventilation ; FC < 60 -> massage + O2 100 % puis adrenaline si persistance.",
      ],
    },
    {
      title: "Medicaments / volumes",
      bullets: [
        "Adrenaline IV/IO 0,01-0,03 mg/kg (0,1-0,3 mL/kg 1:10 000) toutes les 3-5 min si FC < 60 ; voie tracheale 0,05-0,1 mg/kg.",
        "Remplissage NaCl 0,9 % 10 mL/kg si hypovolemie suspectee ; bolus glucose 10 % 2 mL/kg si suspicion hypoglycemie severe.",
      ],
    },
    {
      title: "Airway / orientation",
      bullets: [
        "Intubation si epuisement, hypoxemie, baisse du stridor, troubles conscience, < 2 ans severe ou massage necessaire.",
        "Hospitalisation specialisee systematique ; reanimation si detresse respiratoire ou instabilite.",
      ],
    },
  ],
  "epiglottite-aigue": [
    {
      title: "Alerte et mesures immediates",
      bullets: [
        "Hyperthermie, hypersialorrhee, voix etouffee, stridor inspiratoire, position en tripode.",
        "NE PAS coucher ni examiner la gorge a l'abaisse-langue ; parent present, O2 humidifie 5-10 L/min (SpO2 94-98 %).",
      ],
    },
    {
      title: "Conduite selon severite",
      bullets: [
        "Detresse/epuisement : airway immediat en bloc (ORL + anesthesie + rea).",
        "Stridor stable : O2, VVP, ATB IV debutee, transfert protege vers bloc ORL.",
        "Stabilite relative : transfert medicalise vers centre avec plateau ORL/anesthesie.",
      ],
    },
    {
      title: "Antibiotherapie",
      bullets: [
        "Ceftriaxone 100 mg/kg/j (max 2 g/j).",
        "Alternatives : Cefotaxime 150-200 mg/kg/j ; Vancomycine 40-60 mg/kg/j si allergie severe.",
        "Choc septique : ajouter Amikacine 15 mg/kg/j ; remplissage NaCl 0,9 % 10 mL/kg.",
      ],
    },
    {
      title: "Airway / orientation",
      bullets: [
        "Indications d'intubation : epuisement, hypoxemie malgre O2, baisse du stridor, troubles conscience, < 2 ans severe.",
        "Hospitalisation specialisee systematique ; reanimation si detresse respiratoire.",
      ],
    },
  ],
  "crise-vaso-occlusive": [
    {
      title: "Objectif",
      bullets: [
        "Controler la douleur, prevenir le syndrome thoracique aigu et l'infection, hydrater sans surcharger (1-1,5 x entretien).",
      ],
    },
    {
      title: "Mesures initiales",
      bullets: [
        "SpO2, FC/FR/PA/T°, EVA/EVENDOL, recherche signes de gravite (SpO2 < 94 %, douleur thoracique, fievre >= 38,5, deficit neuro, priapisme, choc).",
        "O2 si SpO2 < 94 % (objectif 94-98 %), VVP si douleur moderee/severe ou gravite.",
        "Hydratation 1-1,5 x 4-2-1; ne pas depasser 1,5 x (risque oedeme/STA).",
      ],
    },
    {
      title: "Antalgie",
      bullets: [
        "Paracetamol 15 mg/kg/prise (max 60 mg/kg/j).",
        "Ibuprofene 10 mg/kg/prise (max 30 mg/kg/j) si pas de deshydratation/infection severe.",
        "Morphine IV 0,05-0,1 mg/kg initial puis bolus 0,025-0,05 mg/kg q10min; alternatives morphine SC ou ketamine faible dose (specialiste).",
        "Eviter codeine, tramadol, AINS si IRA/deshydratation, pas de corticoides (risque rebond).",
      ],
    },
    {
      title: "ATB / complications",
      bullets: [
        "Fièvre/infection/STA : Ceftriaxone 50-75 mg/kg/j (<= 2 g/j); si meningite suspectee : Cefotaxime 150-200 mg/kg/j + Vancomycine 40-60 mg/kg/j.",
        "STA : Rx thorax, O2 si <94 %, kiné respi, transfusion simple si anemie, echange si severe.",
        "Transfusion si STA moderee/severe, Hb <7 g/dL symptomatique, AVC/AIT, priapisme prolongé.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation si douleur non controlee a 2-3 h, fièvre >= 38,5, suspicion STA/infection, SpO2 <94 %, anemie, deshydratation, comorbidites, <3 ans.",
        "Sortie si douleur controlee par PO, apyrexie, pas de signe respiratoire, famille fiable + RDV J2-J3.",
      ],
    },
  ],
  "fracture-ouverte-membre": [
    {
      title: "Objectif",
      bullets: [
        "Stabiliser (ABCDE), prévenir choc/infection, antalgie rapide, transfert ortho < 6 h idéal.",
      ],
    },
    {
      title: "Mesures initiales",
      bullets: [
        "O2 titré SpO2 94-98 %, VVP, prévenir hypothermie, rechercher hémorragie/ischémie distale.",
        "Signes gravité : hémorragie incontrôlable, ischémie, Gustilo III, polytrauma, douleur non contrôlée, choc, syndrome de loges.",
      ],
    },
    {
      title: "Antalgie",
      bullets: [
        "Paracétamol 15 mg/kg/prise (max 60 mg/kg/j).",
        "Ibuprofène 10 mg/kg/prise (max 30 mg/kg/j) si ≥ 3 mois et pas de choc/IRA.",
        "Morphine IV 0,05-0,1 mg/kg puis bolus 0,025-0,05 mg/kg q10min si douleur sévère.",
        "Éviter codéine, tramadol, AINS si déshydratation/choc/chirurgie majeure imminente.",
      ],
    },
    {
      title: "ATB précoce (< 1 h)",
      bullets: [
        "Gustilo I-II : Cefazoline 30 mg/kg IV q8h (max 2 g/dose).",
        "Gustilo III : + Amikacine 15 mg/kg/j.",
        "Allergie : Clindamycine 10 mg/kg q8h + Amikacine 15 mg/kg/j.",
        "Vaccin + immunoglobulines tétanos si doute et plaie contaminée.",
      ],
    },
    {
      title: "Plaie / immobilisation",
      bullets: [
        "Irrigation abondante NaCl 0,9 %, débris superficiels, pansement stérile humide.",
        "Ne pas sonder/explorer, ne pas retirer corps étrangers profonds.",
        "Attelle adaptée (articulations sus/sous-jacentes), alignement doux si déformation.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation systématique ; chirurgie urgente (lavage/débridement < 6 h idéal).",
        "Critères de sortie après chirurgie (24-48 h) : plaie propre, apyrétique, antalgie orale efficace, pas de déficit neurovasculaire, radios OK, RDV ortho/kiné.",
      ],
    },
  ],
  "syndrome-de-loge": [
    {
      title: "Objectif",
      bullets: [
        "Identifier précocement un syndrome de loge, lever les compressions, analgésie, préparer fasciotomie urgente (<6 h).",
      ],
    },
    {
      title: "Signes & mesures immédiates",
      bullets: [
        "Douleur disproportionnée + douleur à l’étirement, pâleur, parésie/faiblesse, paresthésies (tardif), tension « bois dur ». Pouls aboli = ischémie tardive.",
        "O2 SpO2 94-98 %, ne pas surélever le membre, fendre/bivalver plâtre ou bandage serré.",
        "Analgésie : Paracétamol 15 mg/kg, Ibuprofène 10 mg/kg si pas de choc/IRA, Morphine IV 0,05-0,1 mg/kg puis bolus 0,025-0,05 mg/kg q10min.",
        "Perfusion 4-2-1, viser 1,25 x si rhabdomyolyse suspectée.",
      ],
    },
    {
      title: "Décision",
      bullets: [
        "Mesure de pression si doute/enfant non communicant : PIC >=30 mmHg ou ΔP<30 mmHg.",
        "Suspicion faible : surveillance q30min, antalgie, retrait compressions, éviter AINS si chirurgie probable.",
        "Suspicion forte : urgence chirurgicale, appel orthopédiste pédiatrique, préparation bloc.",
        "Signes de gravité (ischémie/déficit/pouls faible) : fasciotomie immédiate.",
      ],
    },
    {
      title: "Examens / situations particulières",
      bullets: [
        "Biologie : CPK, ionogramme/fonction rénale, lactates, Hb si saignement.",
        "Imagerie seulement pour fractures associées.",
        "Polytrauma : ATLS ; post-op : surveillance rapprochée ; brûlures circonférentielles : risque loge/éventuelle escarrotomie.",
      ],
    },
    {
      title: "Orientation",
      bullets: [
        "Hospitalisation si suspicion forte, douleur incoercible, post-fasciotomie, polytrauma, <3 ans, rhabdomyolyse/IRA suspectée.",
        "Sortie seulement après plusieurs heures de surveillance sans suspicion, douleur contrôlée, examen vasculo-neuro normal, parents formés + suivi programmé.",
      ],
    },
  ],
  "appendicite-aigue-enfant": [
    {
      title: "Objectif",
      bullets: [
        "Identifier simple vs compliquée, sécuriser antalgie/hydratation, imagerie adaptée, antibiothérapie selon statut, parcours chirurgical.",
      ],
    },
    {
      title: "Évaluation",
      bullets: [
        "Douleur FID (migration péri-ombilicale), fièvre, vomissements tardifs, défense locale ; scores PAS/Alvarado/AIR en aide.",
        "Gravité : fièvre >38,5 persistante, défense généralisée/contracture, masse FID, sepsis/déshydratation sévère, diarrhée suspectant perforation.",
      ],
    },
    {
      title: "Mesures immédiates",
      bullets: [
        "O2 SpO2 94-98 % si sepsis, VVP.",
        "Antalgie : Paracétamol 15 mg/kg, Ibuprofène 10 mg/kg si hydratation ok, Morphine IV 0,05-0,1 mg/kg (bolus 0,025-0,05 mg/kg q10min).",
        "Hydratation entretien 4-2-1 (éviter surhydratation si péritonite).",
      ],
    },
    {
      title: "Imagerie / biologie",
      bullets: [
        "NFS, CRP, ionogramme, β-hCG si adolescente, hémocultures si sepsis.",
        "Échographie 1ère intention; scanner basse dose seulement si écho non concluante + tableau atypique.",
      ],
    },
    {
      title: "Conduite",
      bullets: [
        "Appendicite simple : appendicectomie <24 h, prophylaxie IV mono-dose (Cefazoline 30 mg/kg + Métronidazole 15 mg/kg).",
        "Appendicite compliquée : ATB IV immédiate (Cefotaxime 150 mg/kg/j + Métronidazole 20-30 mg/kg/j; alternative Amox-Clav 80-100 mg/kg/j), chirurgie urgente ou drainage+chir différée si plastron/abcès.",
      ],
    },
    {
      title: "Post-op / orientation",
      bullets: [
        "Simple : pas d'ATB postop, sortie si apyrexie, alimentation reprise, douleur contrôlée, transit OK, parents fiables.",
        "Compliquée : ATB 5-7 j (IV puis PO), surveillance fièvre/CRP/transit ; hospitalisation obligatoire pour toute appendicite.",
      ],
    },
  ],
  "syndrome-bebe-secoue": [
    {
      title: "Objectif",
      bullets: [
        "Stabiliser (ABCDE), imagerie urgente, traiter convulsions/HTIC, protéger l'enfant et signaler immédiatement (procureur + CRIP).",
      ],
    },
    {
      title: "Signes & gravité",
      bullets: [
        "Suspicion AHT si coma, convulsions, anomalies pupillaires, irritabilité majeure, apnées/bradycardie, fontanelle bombée, ecchymoses multiples.",
        "→ Appel neurochirurgie + réanimation pédiatrique.",
      ],
    },
    {
      title: "Imagerie et traitements",
      bullets: [
        "Scanner cérébral sans injection en urgence (hémorragies sous-durales, œdème, fractures). IRM 24-72 h pour lésions axonales/prognostic.",
        "Convulsions : Midazolam 0,1 mg/kg IV (x1), puis Lévétiracétam 20-40 mg/kg IV si persistance. Phénytoïne 20 mg/kg selon protocole.",
        "HTIC : Mannitol 0,5-1 g/kg ou NaCl 3 % 2-5 mL/kg.",
        "Perfusion entretien 4-2-1 (viser 1,25 x si rhabdomyolyse), paracétamol 15 mg/kg si fièvre (pas d’ibuprofène).",
      ],
    },
    {
      title: "Bilan lésionnel",
      bullets: [
        "Fond d'œil 24-48 h (hémorragies rétiniennes), skeletal survey < 48 h (côtes postérieures, métaphyses), biologie (NFS, coag, ionogramme).",
      ],
    },
    {
      title: "Orientation / médico-légal",
      bullets: [
        "Hospitalisation systématique (surveillance neuro, réa/neurochirurgie, protection).",
        "Signalement procureur + IP CRIP, documenter, ne pas confronter les parents.",
        "Sortie seulement si AHT formellement exclu et domicile sécurisé ; si AHT confirmé : pas de retour domicile dangereux.",
      ],
    },
  ],
  "detresse-respiratoire-nouveau-ne": [
    {
      title: "Objectif",
      bullets: [
        "Reconnaître et stabiliser la DRNN, titrer l'O2, initier CPAP/ventilation, surfactant si besoin, orienter en néonatalogie/réanimation.",
      ],
    },
    {
      title: "Signes / gravité",
      bullets: [
        "FR > 60, tirage, geignement, battement des ailes du nez, cyanose, discordance thoraco-abdominale.",
        "Gravité : apnées, SpO2 < 90 % malgré O2, FC < 100, hypotonie, suspicion pneumothorax, SDR sévère prématuré.",
      ],
    },
    {
      title: "Mesures immédiates",
      bullets: [
        "O2 titré : objectif SpO2 <10 min (courbes ILCOR), puis 94-98 % ; lunettes 1-2 L/min, masque 5-10 L/min.",
        "Position neutre, thermorégulation (incubateur si prématuré), limiter manipulations.",
        "VVP si détresse ; glycémie capillaire : si <0,45 g/L → G10 % 2 mL/kg.",
      ],
    },
    {
      title: "Ventilation / traitements",
      bullets: [
        "CPAP 5-6 cmH2O (jusqu'à 8) si SpO2 insuffisante ou tirage modéré/sévère (SDR, TTN).",
        "Intubation si apnées, échec CPAP, FR <30 avec lutte, pH<7,20 ou pCO2>65, pneumothorax instable, Silverman>6.",
        "Surfactant (SDR prématuré) : 200 mg/kg initial, 100 mg/kg seconde dose.",
        "ATB si infection suspectée : Ampicilline 50 mg/kg q12h + Gentamicine 4-5 mg/kg q24-36h.",
      ],
    },
    {
      title: "Situations particulières / orientation",
      bullets: [
        "Prématuré <32 SA : CPAP précoce, surfactant si FiO2 >30 %, surveillance hypothermie.",
        "Inhalation méconiale : pas d'aspiration systématique ; intubation seulement si obstruction.",
        "Hernie diaphragmatique : ne pas ventiler au masque, intubation immédiate + sonde gastrique.",
        "Hospitalisation si DRNN modérée à sévère (CPAP, FiO2>0,30, infection, pneumothorax, SDR, apnées…).",
        "Sortie si SpO2 >94 % en air, FR<60 sans tirage, thermo et alimentation stables, étiologie bénigne résolue.",
      ],
    },
  ],
  "invagination-intestinale-aigue": [
    {
      title: "Objectif",
      bullets: [
        "Diagnostiquer tôt l'IIA, différencier formes non compliquées vs compliquées, choisir lavement thérapeutique ou chirurgie, réanimer et surveiller.",
      ],
    },
    {
      title: "Signes / gravité",
      bullets: [
        "Pleurs paroxystiques + jambes fléchies, vomissements (bilieux si grave), pâleur/léthargie, masse FID, rectorragies tardives.",
        "Gravité : choc, vomissements bilieux, défense/douleur continue, rectorragies profuses, fièvre/péritonisme, trouble conscience/sepsis.",
      ],
    },
    {
      title: "Mesures immédiates",
      bullets: [
        "O2 SpO2 94-98 % ; VVP, perf 4-2-1 ; remplissage NaCl 0,9 % 10-20 mL/kg si choc.",
        "Antalgie : Paracétamol 15 mg/kg, Morphine IV 0,05-0,1 mg/kg (bolus 0,025-0,05 mg/kg q10min), pas d'AINS.",
        "Sonde gastrique si vomissements répétés.",
      ],
    },
    {
      title: "Imagerie / thérapeutique",
      bullets: [
        "Échographie de référence (cocarde/pseudorein, Doppler, épanchement).",
        "Lavement air/CO2 si non compliquée ; contre-indiqué si gravité/perforation/choc non stabilisé.",
        "Chirurgie si compliquée, échec ou récidive immédiate.",
        "ATB si compliquée : Cefotaxime 100-150 mg/kg/j + Métronidazole 20-30 mg/kg/j.",
      ],
    },
    {
      title: "Orientation / sortie",
      bullets: [
        "Hospitalisation systématique (surveillance 12-24 h post-lavement). Réa/USI si choc, déshydratation sévère, IIA compliquée ou échec lavement.",
        "Sortie si réduction confirmée, pas de douleur, transit/alimentation OK, pas de vomissements, examen normal, pas de récidive.",
      ],
    },
  ],
  "coma-pediatrique-non-traumatique": [
    {
      title: "Objectif",
      bullets: [
        "Stabiliser ABCDE, traiter causes r�versibles (hypoglyc�mie, convulsions, sepsis, intoxication), prot�ger l'enc�phale et orienter en r�animation.",
      ],
    },
    {
      title: "Signes de gravit�",
      bullets: [
        "GCS = 8, convulsions persistantes, choc/sepsis, bradypn�e, hypotension, hypothermie <35 �C ou hyperthermie >40 �C, pupilles anormales, vomissements en jet, suspicion m�ningite/purpura.",
      ],
    },
    {
      title: "Traitements initiaux",
      bullets: [
        "O� SpO� 94�98 %, intubation si GCS = 8 ; remplissage NaCl 0,9 % 10�20 mL/kg si choc.",
        "Hypoglyc�mie : G10 % 2 mL/kg puis perfusion glucose 5�8 mg/kg/min.",
        "Convulsions : Midazolam 0,1 mg/kg IV (0,2 mg/kg IN/BU), puis L�v�tirac�tam 20�40 mg/kg ; Ph�nyto�ne 20 mg/kg si besoin.",
        "HTIC : NaCl 3 % 3�5 mL/kg ou Mannitol 0,5�1 g/kg ; t�te 30�, PaCO� 35�45.",
        "Infection grave : Cefotaxime 200 mg/kg/j ou Ceftriaxone 80�100 mg/kg/j � Amikacine 15 mg/kg/j; Vancomycine 40�60 mg/kg/j si m�ningite.",
        "Intoxication : Naloxone 0,01 mg/kg (opiac�s), NAC si parac�taml; Flumaz�nil non recommand� en routine.",
      ],
    },
    {
      title: "Examens / orientation",
      bullets: [
        "Biologie : NFS, CRP, ionogramme, calc�mie, GDS, h�mocultures, toxiques si suspicion. Scanner c�r�bral si signes focaux/HTIC/coma inexpliqu�.",
        "Hospitalisation r�animation si GCS = 12, HTIC, convulsions persistantes, sepsis, d�faillance respi/h�mo, intoxication s�v�re.",
        "Sortie seulement si cause r�solue, examen neuro normal, pas de convulsions >24 h, glyc�mie stable, parents fiables, suivi programm�.",
      ],
    },
  ],
  "reaction-transfusionnelle-aigue-grave": [
    {
      title: "Objectif",
      bullets: [
        "Stopper la transfusion, traiter anaphylaxie/hemolyse/TRALI/TACO/sepsis, assurer hemovigilance et tra?abilite.",
      ],
    },
    {
      title: "Signes et gravite",
      bullets: [
        "Hypotension/choc, dyspnee severe, cyanose, tachycardie majeure, fievre >39, douleurs lombaires/thoraciques, hemoglobinurie, purpura/coag, troubles conscience.",
      ],
    },
    {
      title: "Traitement",
      bullets: [
        "Arret transfusion, O2 94-98 %, perfusion NaCl 0,9 %, conserver produit/tubulure.",
        "Anaphylaxie : Adrenaline IM 0,01 mg/kg (max 0,5 mg), NaCl 10-20 mL/kg si hypoTA, cetirizine 0,25 mg/kg, methylpred 1-2 mg/kg.",
        "Hemolyse aigue : O2, NaCl 10-20 mL/kg, furos?mide 1 mg/kg si oligurie, bilans hemolyse/CIVD.",
        "TRALI : O2/VNI, pas de diuretique. TACO : O2, position assise, furos?mide 1 mg/kg, ralentir transfusions.",
        "Sepsis transfusionnel : ATB iv (Cefotaxime 100-150 mg/kg/j ou Ceftriaxone 80-100 mg/kg/j) +/- Amikacine 15 mg/kg/j si choc ; prelevements tubulure + hemocs avant ATB.",
      ],
    },
    {
      title: "Orientation / sortie",
      bullets: [
        "Hospitalisation systematique; rea si choc, detresse respi, TRALI/TACO severe, RAIH, sepsis.",
        "Sortie si asymptomatique >24 h, bilans rassurants, SpO2 stable air, examen normal, avis hemobiologiste + plan transfusionnel securise.",
      ],
    },
  ],
};
