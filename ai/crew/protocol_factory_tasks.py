from crewai import Task
from .protocol_factory_agents import medical_expert, developer, integrator, auditor

# Tâche 1 – Recherche médicale & JSON clinique
medical_research_task = Task(
    name="MedicalResearchTask",
    description=(
        "Pour le protocole courant (`protocol_name`), produire une spécification clinique "
        "JSON-like stricte.\n\n"
        "Contraintes :\n"
        "- Zéro invention : si donnée absente ou incertaine => "
        "'Donnée indisponible dans les recommandations officielles.'.\n"
        "- Utiliser uniquement des sources officielles : HAS, SFAR, SRLF, SFMP, SPLF, "
        "AHA/PALS, ERC, NICE, AAP.\n"
        "- Posologies complètes : mg/kg, concentration, dose maximale, voie d’administration.\n"
        "- Aucun volume non nul ne peut être arrondi à 0 mL.\n"
        "- Le format de sortie doit respecter exactement la structure définie dans "
        "le document `protocol-factory-full.md` (meta, physiopathologie, diagnostic, "
        "prise_en_charge, calculs, orientation, arbre_decisionnel).\n\n"
        "La sortie doit être un UNIQUE bloc JSON-like, sans texte ni commentaires autour, "
        "prêt à être consommé par le DeveloperAgent."
    ),
    expected_output=(
        "Un bloc JSON-like unique avec les clés : meta, physiopathologie, diagnostic, "
        "prise_en_charge, calculs, orientation, arbre_decisionnel."
    ),
    agent=medical_expert,
)

# Tâche 2 – Génération du composant React/TSX
component_impl_task = Task(
    name="ComponentImplementationTask",
    description=(
        "À partir du JSON clinique généré par MedicalResearchTask, produire le code complet "
        "du composant React/TSX `src/components/ProtocolFlow[Slug].tsx` pour le protocole courant.\n\n"
        "Contraintes techniques (adaptées au repo PediaGo) :\n"
        "- Suivre la structure, les patterns et les conventions de "
        "`src/components/ProtocolFlowComa.tsx` et des autres `ProtocolFlow*.tsx`.\n"
        "- Utiliser les composants : AgeWeightPicker, FlowBlock, FlowRibbon, FlowChevron "
        "(depuis `src/components`).\n"
        "- Récupérer poids et âge via le store global Zustand `useAppStore` dans "
        "`src/store/useAppStore.ts` (importable via `@/store/useAppStore`).\n"
        "- Définir un helper local `clampWeight` pour borner le poids dans la plage de sécurité.\n"
        "- Effectuer tous les calculs de doses et volumes AVANT le `return` JSX ; "
        "aucun calcul complexe ne doit être présent directement dans le JSX.\n"
        "- Utiliser les helpers d’unités / posologie existants "
        "(par ex. `computeDose` depuis `@/lib/dosing`, et les fonctions de formatage "
        "depuis le module utilitaire correspondant si présent dans le repo).\n"
        "- TypeScript strict : aucun type `any`.\n"
        "- Aucune posologie modifiée par rapport au JSON clinique.\n"
        "- Pas de CSS custom : uniquement des classes Tailwind comme dans les autres flows.\n\n"
        "La sortie doit être le CONTENU COMPLET du fichier `ProtocolFlow[Slug].tsx`, "
        "prêt à être collé dans `src/components`."
    ),
    expected_output=(
        "Le contenu complet du fichier `ProtocolFlow[Slug].tsx` avec imports, logique, "
        "JSX et types, conforme aux patterns PediaGo."
    ),
    agent=developer,
)

# Tâche 3 – Intégration dans l’app
integration_task = Task(
    name="IntegrationTask",
    description=(
        "Proposer le code à ajouter pour intégrer le nouveau protocole dans PediaGo.\n\n"
        "Sorties attendues :\n"
        "- Un objet conforme au type `Protocol` à insérer dans l’array `PROTOCOLS` "
        "de `src/data/protocols.ts`, avec :\n"
        "  * slug: string (identifiant unique, kebab-case),\n"
        "  * title: string (titre complet du protocole),\n"
        "  * version?: string (ex: 'V0.1'),\n"
        "  * tags?: string[] (domaines ex: ['neuro', 'urgence']),\n"
        "  * icon: string (emoji),\n"
        "  * accentColor: string (code hex ex: '#6366f1'),\n"
        "  * accessLevel: 'free' | 'premium',\n"
        "  * sources?: { label: string; url?: string }[].\n"
        "- Un bloc de code pour `src/app/protocols/[slug]/ProtocolClientPage.tsx` montrant :\n"
        "  * l'import du nouveau composant `ProtocolFlow[Slug]` depuis `@/components/ProtocolFlow[Slug]`,\n"
        "  * l’ajout dans la map `FlowBySlug` avec comme clé le `slug` et comme valeur le composant.\n\n"
        "Ne pas modifier d’autres aspects de l’architecture ou des types."
    ),
    expected_output=(
        "Deux extraits de code : un objet `Protocol` pour `protocols.ts` et "
        "un patch pour `ProtocolClientPage.tsx` (import + FlowBySlug)."
    ),
    agent=integrator,
)

# Tâche 4 – Audit final
audit_task = Task(
    name="AuditTask",
    description=(
        "Relire la spécification JSON, le composant TSX et les extraits d’intégration "
        "et rendre un verdict de sécurité.\n\n"
        "Vérifications médicales :\n"
        "- Cohérence des posologies avec les recommandations officielles.\n"
        "- Présence de sources et mention explicite des données indisponibles.\n"
        "- Aucun volume non nul n’est affiché comme 0 mL.\n\n"
        "Vérifications techniques :\n"
        "- Aucun type `any`.\n"
        "- Pas de duplication de logique de calcul de dose dans le JSX.\n"
        "- Utilisation correcte de `useAppStore` (src/store/useAppStore.ts) pour âge/poids.\n"
        "- Utilisation correcte des helpers de doses/units (`dosing.ts`, helpers de formatage).\n"
        "- Structure similaire aux autres `ProtocolFlow*.tsx`.\n\n"
        "Si tout est conforme : renvoyer la phrase EXACTE "
        "'Protocol [Name] is ready for deployment.'\n"
        "Sinon : renvoyer 'Issues found: ...' suivi d’une liste claire des problèmes détectés."
    ),
    expected_output=(
        "Un verdict court : soit 'Protocol [Name] is ready for deployment.' soit "
        "'Issues found: ...' avec les points à corriger."
    ),
    agent=auditor,
)
