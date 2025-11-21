# Architecture de PediaGo

Ce document décrit l’architecture applicative de PediaGo ainsi que les principaux flux techniques. Il s’appuie sur la documentation interne et les fichiers du projet pour présenter une vue d’ensemble claire à destination des développeurs et des IA.

## Présentation générale

PediaGo est un assistant de prise en charge pour les urgences pédiatriques. Il fournit des **protocoles séquentiels** et des **calculs de posologie** en fonction du poids ou de l’âge de l’enfant afin de réduire les risques d’erreurs et de faciliter la prise de décision. L’application s’adresse aux médecins, infirmiers et internes en pédiatrie ou en médecine d’urgence.

### Vision produit

L’objectif de PediaGo est de proposer un outil fiable et toujours à jour pour les situations d’urgence. Les algorithmes s’appuient sur les recommandations professionnelles et adaptent les procédures et dosages à l’âge et au poids du patient. L’application vise à diminuer la charge mentale, à normaliser les posologies et à guider les séquences thérapeutiques de manière sécurisée.

### Répertoires principaux

| Dossier | Rôle |
|--------|------|
| `src/app` | Pages de l’application en App Router. Contient les routes `/`, `/subscribe`, `/mon-compte`, `/protocols/[slug]`, etc. |
| `src/components` | Composants React réutilisables : `AgeWeightPicker`, `SearchBar`, `ProtocolCard`, `PremiumAccessDialog`, `PosologySections`, etc. |
| `src/data` | Données statiques et métadonnées : `protocols.ts` (liste des protocoles), `drugs.ts` (catalogue de médicaments et règles), `posology_normalized.json` (posologies par poids), `posology.ts` (helpers), `overrides/*` (overrides de dose par poids), `protocolDetails.ts` et `protocolFlows`. |
| `src/hooks` | Hooks personnalisés comme `useUserEntitlements` pour récupérer les droits premium. |
| `src/store` | Store global client via Zustand (`useAppStore`) pour l’âge et le poids. Les valeurs sont persistées dans le navigateur. |
| `src/lib` | Fonctions utilitaires : `supabaseClient.ts`/`supabaseAdmin.ts` (communication avec Supabase), `dosing.ts` (calculs de doses), `posologyClient.ts` (chargement des posologies), `stripeServer.ts` (création de sessions Stripe) et `stripeWebhook.ts` (vérification des webhooks). |
| `src/types` | Déclarations de types TypeScript pour la base de données et les structures de données métier. |

### Schéma simplifié

```
Utilisateur → Supabase Auth (connexion par e‑mail/mot de passe ou magic link)
         → App Router Next.js
           → Page d’accueil : liste des protocoles
           → Page protocole : flow interactif + onglet Posologie + sources
         → Supabase REST API (fetchCardsList/fetchCardBySlug)
         → Stripe Checkout (create-checkout-session)
Stripe → Webhook → API route `/api/stripe/webhook` → supabaseAdmin (mise à jour des tables `subscriptions` et `profiles`)
Supabase → Vue `user_entitlements` → Hook `useUserEntitlements`
```

## Fonctionnement détaillé

### Authentification et profils

L’utilisateur se connecte via Supabase Auth (identifiant/mot de passe ou magic link). Le contexte de session est fourni par `SessionContextProvider`. Des actions serveur (par ex. `login/actions.ts`) créent un client Supabase via `createServerActionClient`, appellent `supabase.auth.signInWithPassword` et revalident les chemins à l’aide de `revalidatePath`.

### Abonnement premium

La page `/subscribe` présente les offres et déclenche un appel POST vers `/api/stripe/create-checkout-session`. Ce handler crée une session de paiement avec les variables d’environnement Stripe. À la fin du paiement, Stripe envoie un webhook vers `/api/stripe/webhook`, qui vérifie la signature et met à jour les tables `subscriptions` et `profiles` dans Supabase. La vue `user_entitlements` expose ensuite les droits premium, consultés via le hook `useUserEntitlements`.

### Chargement des protocoles

La page d’accueil charge la liste des protocoles via `fetchCardsList` (client Supabase). Chaque protocole a un slug (`aag`, `anaphylaxie`, `bronchiolite`, etc.), des tags et un niveau d’accès (gratuit ou premium). Lorsqu’un utilisateur sélectionne un protocole, la page dynamique `/protocols/[slug]` charge les détails via `fetchCardBySlug`. Si l’utilisateur n’a pas accès au protocole premium, il est redirigé vers `/subscribe`.

### Posologie et calcul des doses

Pour chaque protocole, un onglet « Posologie » affiche des sections colorées provenant de `posology_normalized.json`. Le composant `PosologySections` utilise le poids issu du store (`useAppStore`), récupère les valeurs via `findPosoByWeight` et affiche les sous‑sections (constantes, IOT, ISR, etc.).

Les protocoles interactifs (ex. asthme aigu grave, anaphylaxie, bronchiolite, hypoglycémie, choc hémorragique, sepsis/purpura, acidocétose, FAST, TSV) calculent les doses en fonction du poids à l’aide de `computeDose` dans `dosing.ts`. Des overrides par poids sont définis dans `drugs.ts` pour certains médicaments (par ex. adrénaline IM 0,01 mg/kg de 3 à 50 kg).

### Interface utilisateur

L’interface utilise des composants modulaires (cards, toggles, boîtes de dialogue) et des animations (`IntersectionObserver`). Les pages sont rendues côté serveur ou générées statiquement avec transitions client afin de garantir une bonne performance. Toutes les chaînes sont en français et la distinction entre contenu gratuit et premium est explicite.

## Variables d’environnement

Certaines fonctionnalités requièrent des variables d’environnement :

- `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` pour connecter le client Supabase côté client.
- `SUPABASE_SERVICE_ROLE_KEY` pour les actions serveur nécessitant un rôle de service (non exposée côté client).
- `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` pour les paiements et la validation des webhooks.
- `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_ID` et `NEXT_PUBLIC_STRIPE_PRICE_YEARLY_ID` pour identifier les plans dans Stripe.

Les IA doivent s’assurer que ces variables sont présentes avant de générer du code qui s’appuie sur Stripe ou Supabase.

## Conseils pour les IA

Lorsque vous modifiez ou ajoutez des fonctionnalités :

- Vérifiez l’impact sur la navigation (App Router), l’état global (Zustand), la sécurité (policies Supabase) et la facturation (Stripe).
- Factorisez la logique métier dans `src/lib` afin de favoriser la réutilisabilité et la testabilité.
- Respectez les règles de posologie et de protocole : toute modification doit être justifiée par une source médicale et clairement documentée.
- Mettez à jour les tests et proposez-en de nouveaux pour couvrir les cas d’usage critiques.

Cette architecture a été pensée pour concilier performance, maintenabilité et respect des exigences médicales. Toute contribution doit préserver ces objectifs.