---
description: Automated pipeline to research, code, and integrate a new medical protocol into PediaGo.
---

# Protocol Factory Workflow

This workflow automates the creation of a new medical protocol for PediaGo. It proceeds in 4 strict steps.

## Step 1: Batch Initialization

**Goal**: Load the list of protocols to create.

**Instructions**:
1.  Read the file `.agent/protocols_to_create.txt`.
2.  **LOOP**: For **EACH** protocol name found in the list, you must perform **Steps 2, 3, 4, and 5** sequentially before moving to the next protocol.
3.  **CRITICAL**: Do not stop until all protocols in the list have been processed.

## Step 2: Medical Research (The Expert)

**Role**: Medical Expert & Clinical Auditor.
**Goal**: Produce a structured JSON-like specification for the **CURRENT PROTOCOL** in the loop.

**Instructions**:
1.  Take the current protocol name from the list.
2.  Execute the following prompt to generate the content:

```markdown
🛑 **RÈGLES IMPÉRATIVES DE SÉCURITÉ MÉDICALE** 🛑
1. **Zéro Invention** : Interdiction formelle d'inventer. Si pas de reco, dire "Donnée indisponible".
2. **Sources Obligatoires** : Chaque affirmation doit être sourcée (HAS, SFP, NICE, AAP).
3. **Primum Non Nocere** : Privilégier la sécurité.

**TÂCHE :**
Générer le contenu structuré pour le protocole : **[NOM DU PROTOCOLE]**

**STRUCTURE DE SORTIE (Optimisée pour React) :**

1. **Méta-données**
   - Titre exact & Sous-titre.
   - Tags (ex: Urgence, Endo).
   - Couleur & Icône.
   - **Sources** : Liste (Label + URL).

2. **Logique de Calcul (Formules Brutes)**
   - Format : `Nom_Variable = Poids_kg * X` (Préciser Max).

3. **Contenu Clinique par Blocs**
   - **Bloc A : Reconnaissance** (Signes clés).
   - **Bloc B : Red Flags** (Gravité).
   - **Bloc C : Prise en charge** (Gestes).
   - **Bloc D : Thérapeutique** (Médicaments, Doses).
   - **Bloc E : Orientation** (Critères Hospit/Réa).

4. **Arbre Décisionnel**
   - Logique : "Si [Condition] ALORS [Action]".
```

## Step 3: Component Implementation (The Developer)

**Role**: Senior React Developer.
**Goal**: Create the `ProtocolFlowX.tsx` component for the **CURRENT PROTOCOL**.

**Instructions**:
1.  Take the output from Step 2.
2.  Create a new file in `src/components/` named `ProtocolFlow[Slug].tsx`.
3.  **Strict Coding Rules**:
    *   Copy structure from `src/components/ProtocolFlowComa.tsx`.
    *   Use `AgeWeightPicker`, `FlowBlock`, `FlowRibbon`, `FlowChevron`.
    *   Implement `clampWeight` and `formatMg`.
    *   **NO Custom CSS**. Use Tailwind classes from the template.

## Step 4: System Integration (The Integrator)

**Role**: System Integrator.
**Goal**: Wire the new component into the app.

**Instructions**:
1.  **Register**: Add the protocol entry in `src/data/protocols.ts` (Slug, Title, Tags, Sources).
2.  **Route**:
    *   Edit `src/app/protocols/[slug]/ProtocolClientPage.tsx`.
    *   Import the new component.
    *   Add it to the `FlowBySlug` map.

## Step 5: Verification (The Auditor)

**Role**: Safety Auditor.
**Goal**: Verify the code before "shipping".

**Instructions**:
1.  **Read** the created file `ProtocolFlow[Slug].tsx`.
2.  **Check**:
    *   Are all doses capped (`Math.min`)?
    *   Is `formatMg` used for display?
    *   Are there any `any` types? (Forbidden).
3.  **Report**: "Protocol [Name] is ready for deployment." or "Issues found: ..."
