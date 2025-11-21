# Standards d’ingénierie PediaGo

Ce document rassemble les règles et conventions à respecter lors du développement de PediaGo. Il complète le fichier `ia-context.md` en détaillant les pratiques de qualité et de sécurité qui s’appliquent à tout changement du code.

## TypeScript strict

- **Typage explicite :** toutes les fonctions, props de composants, hooks et retours d’API doivent être typés. Utiliser `src/types` pour importer des types existants plutôt que d’en redéfinir.
- **StrictNullChecks activé :** vérifier les cas `undefined`/`null` et prévoir des fallback explicites. Ne pas supposer qu’une valeur existe sans vérification.
- **Readonly et const :** utiliser `readonly` sur les propriétés immuables et préférer `const` à `let` lorsque les valeurs ne changent pas.

## Organisation du code

- **App Router** : placer les pages dans `src/app` en suivant l’arborescence dynamique (`[slug]`) et en utilisant `page.tsx` et `layout.tsx`. Les composants qui nécessitent un rendu client doivent commencer par la directive `"use client"`.
- **Composants réutilisables** : stockés dans `src/components`. Factoriser les éléments d’interface (boutons, cartes, modales) pour maintenir une cohérence visuelle.
- **Logique métier** : isolée dans `src/lib` ou des helpers. Les calculs de doses, conversions, formatages et interactions avec Supabase/Stripe doivent vivre hors des composants UI.
- **Données et configuration** : les données statiques (protocoles, médicaments, posologies) vivent dans `src/data`. Les clés et secrets se trouvent dans le système d’environnement (variables `.env`).

## Gestion d’état

- **Zustand** : utilisé pour l’état global (âge et poids de l’enfant). Tous les composants se référant à ces valeurs doivent passer par le hook `useAppStore`.
- **Pas de stores multiples** : ne pas introduire d’autres solutions d’état global sans justification majeure (réduire la complexité et éviter les conflits).
- **Persist :** l’âge et le poids doivent être persistés côté client pour conserver la sélection de l’utilisateur entre les sessions.

## UI/UX et internationalisation

- **Langue** : toute chaîne affichée est en français. Les messages d’erreur, labels, placeholders et contenus des pages doivent être traduits. Ne pas intégrer de texte en anglais dans l’interface.
- **Design** : utiliser Tailwind CSS. Les composants doivent avoir des coins arrondis, des ombrages doux et des espacements généreux pour une meilleure lisibilité. Le design doit être sobre et compréhensible en situation d’urgence.
- **Accessibilité** : privilégier une hiérarchie de titres claire, des contrastes suffisants et des descriptions pour les boutons ou icônes lorsque nécessaire.
- **Premium vs gratuit** : indiquer clairement ce qui est accessible gratuitement et ce qui nécessite un abonnement premium (badges, verrous, redirections vers `/subscribe`).

## Sécurité et responsabilité médicale

- **Exactitude des posologies** : les dosages et volumes doivent être calculés avec précision. Ne jamais arrondir un volume non nul à 0. Les volumes faibles (ex. 0,03 mL) doivent être affichés tels quels.
- **Override de doses** : certains médicaments requièrent des overrides selon le poids (définis dans `drugs.ts`). Lors de l’ajout d’un médicament ou d’un protocole, vérifier si un override est nécessaire.
- **Sources médicales** : toute modification des posologies ou protocoles doit être justifiée par une référence médicale ou une recommandation officielle. Mentionner la source dans le code ou la documentation.
- **Données sensibles** : PediaGo ne collecte pas de données identifiantes. Les soignants restent responsables de leurs actes et doivent valider la pertinence des informations fournies.

## Qualité de code et revues

- **Lisibilité :** noms de variables et fonctions explicites. Pas d’abréviations obscures. Ajout de commentaires lorsque la logique est complexe.
- **ESLint/Prettier :** respecter la configuration du projet. Corriger les warnings et erreurs avant de soumettre des modifications.
- **Tests :** fournir des tests unitaires pour la logique métier (calculs de doses, helpers). Pour les pages et composants, envisager des tests de rendu avec des outils comme React Testing Library ou Playwright.
- **Pull requests** : décrire les changements, lister les fichiers modifiés, expliquer la logique et inclure des idées de tests. Ne pas accepter de modifications sans revue humaine (qu’elles soient proposées par un développeur ou une IA).

