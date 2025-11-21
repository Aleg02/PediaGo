# Contexte et directives pour l'intelligence artificielle – PediaGo

Ce document sert de **base permanente** pour toute IA de développement qui travaille sur PediaGo. Il décrit l'architecture du projet, les règles d'ingénierie, les pratiques de qualité et les responsabilités réglementaires. Il doit être consulté avant toute intervention automatisée (génération de code, documentation, tests, migrations). Les IA doivent adapter leurs réponses aux contraintes décrites ci‑dessous et signaler toute incohérence ou danger potentiel.

## 1. Contexte du projet

PediaGo est une application d’aide à la décision destinée aux équipes d’urgence pédiatrique (SMUR, réanimation, urgences). Elle fournit des **protocoles d’urgences pédiatriques** et calcule automatiquement les **posologies** en fonction de l’âge et du poids de l’enfant afin de réduire les erreurs et la charge cognitive des soignants. Les algorithmes s’appuient sur des recommandations professionnelles et s’adaptent au contexte du patient.

### Architecture technique

- **Frontend :** Next.js 16 (App Router) avec TypeScript et React. L’interface est stylisée avec Tailwind CSS et doit rester claire, en français et accessible dans des contextes d’urgence. Toutes les pages résident dans `src/app` et utilisent le système d’App Router (`page.tsx`, `layout.tsx`).
- **Backend :** Supabase fournit l’authentification (Supabase Auth) et la base de données Postgres. Les profils, abonnements et entitlements sont stockés dans cette base via des vues et policies sécurisées.
- **Paiement :** l’abonnement premium (**PediaGo +**) est géré via Stripe Checkout. Les webhooks Stripe sont consommés côté serveur pour mettre à jour les tables `subscriptions` et `profiles`.
- **Données métier :**
  - Protocoles d’urgences dans `src/data/protocols.ts` et composants de flux dans `src/app/protocols/[slug]` ou `src/components/ProtocolFlow*.tsx`.
  - Posologies par poids dans `posology_normalized.json` ainsi que des helpers (`posology.ts`, `dosing.ts`, `drugs.ts`).
  - Calculs de doses dans `src/lib/dosing.ts`, avec des overrides dans `src/data/drugs.ts` pour gérer les cas particuliers.
- **État global :** âge et poids de l’enfant sont gérés via Zustand (`useAppStore`) et persistés côté client. L’accès premium est fourni par le hook `useUserEntitlements` qui s’appuie sur la vue `user_entitlements` de Supabase.

## 2. Standards d’ingénierie

Les IA doivent respecter les pratiques suivantes lorsqu’elles génèrent ou modifient du code :

1. **TypeScript strict** : toujours typer explicitement les fonctions, props, hooks et retours d’API. Réutiliser les types définis dans `src/types` afin d’éviter les duplications.
2. **Respect de l’App Router Next.js** : limiter l’usage de `"use client"` aux composants nécessitant un rendu client. Placer la logique sensible (authentification, Stripe, Supabase avec service role) dans des actions serveur ou des routes API afin d’éviter toute exposition côté client.
3. **Factorisation de la logique métier** : isoler les calculs de doses, conversions et formatages dans `src/lib` ou des modules dédiés. Ne jamais dupliquer des fonctions existantes comme `computeDose`, `maintenance421` ou les helpers de posologie.
4. **Gestion d’état unifiée** : utiliser `useAppStore` pour l’âge et le poids et éviter d’introduire d’autres stores globaux sans raison valable.
5. **UI/UX** : l’interface est en français, utilise Tailwind CSS (cartes, sections, badges) et doit clairement différencier les contenus gratuits et premium. Les vues doivent être lisibles pour des soignants en situation d’urgence : titres clairs, sections bien délimitées et bullet points.
6. **Sécurité et responsabilité médicale** :
   - Ne jamais modifier de manière arbitraire une posologie ou un protocole médical. Les modifications doivent se baser sur des sources scientifiques ou des recommandations officielles et être documentées.
   - Si une IA modifie un calcul de dose, elle doit expliquer la justification, vérifier les limites (min/max) et s’assurer que les volumes non nuls ne soient jamais arrondis à 0. Les volumes doivent apparaître même s’ils sont très faibles (par ex. 0,03 mL au lieu de 0 mL).
   - Ne jamais stocker ni manipuler de données patient identifiantes : respecter le RGPD et limiter les données traitées à l’âge, au poids et à l’état d’abonnement de l’utilisateur.
7. **Qualité de code** : produire un code lisible, avec un nommage explicite et sans abréviations obscures. Respecter la configuration ESLint du projet. Lors de modifications significatives, fournir un résumé des changements, la liste des fichiers impactés et des idées de tests (unitaires et E2E).

## 3. Format attendu des réponses des IA

Pour chaque demande, l’IA doit :

1. **Commencer par un court résumé** de la tâche à réaliser.
2. **Lister les fichiers impactés** en indiquant pour chacun :
   - `=== FILE: chemin/du/fichier.tsx ===`
   - Le contenu complet et final du fichier (pas d’ellipses).
3. Préciser lorsqu’il s’agit d’un nouveau fichier.
4. Expliquer brièvement la logique implémentée, les points de sécurité et les impacts éventuels sur Supabase/Stripe.
5. Ne pas produire de pseudo‑code : fournir du code fonctionnel, prêt à être copié/collé dans le projet.

## 4. Règles spécifiques à PediaGo

- **Langue** : toutes les chaînes visibles par l’utilisateur sont en français (labels, messages d’erreur, placeholders, etc.).
- **Protocoles et posologie** : utiliser la structure existante des `ProtocolFlow*` et des données. Pour tout nouveau protocole, suivre l’organisation actuelle (sélecteur d’âge/poids, étapes, posologie, sources). Indiquer si le protocole est gratuit ou premium et mettre à jour `src/data/protocols.ts` en conséquence. Vérifier que les utilisateurs ont les droits nécessaires via `useUserEntitlements`.
- **Composants interactifs** : l’âge et le poids doivent toujours être récupérés via `useAppStore`. Les calculs doivent passer par `computeDose` ou les helpers de posologie afin de respecter la logique médicale et les overrides.

## 5. Procédure de réponse recommandée

Avant de générer du code ou de la documentation, l’IA doit :

1. **Analyser la demande** et identifier les impacts potentiels sur l’UI/UX, le store Zustand, le schéma Supabase, les webhooks Stripe et les calculs médicaux.
2. **S’appuyer sur la documentation technique** présente dans ce dépôt (notamment `architecture.md` et `standards.md`) pour comprendre l’existant.
3. **Proposer une solution complète** : code final, scripts de migration SQL si nécessaire, instructions (ex. `supabase db push`) et remarques sur la sécurité.
4. **Signaler** toute modification qui pourrait introduire un risque pour la cohérence médicale ou la sécurité des données, et suggérer une alternative plus sûre si nécessaire.

En suivant ces consignes, les IA pourront contribuer de manière cohérente et responsable au développement de PediaGo tout en respectant les contraintes légales et médicales propres à ce domaine sensible.