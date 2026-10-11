# ✨ L'AURA PALACE — Écosystème Hôtelier Ultra-Premium (Monorepo)

Plateforme de réservation hôtelière de luxe **White-Label** construite autour d'une architecture **Monorepo** partageant la logique métier, le typage et le state management **Redux Toolkit + RTK Query** entre **Next.js (Web)**, **React Native (Mobile)** et **Express.js + Prisma PostgreSQL (API)**.

---

## 🏗️ Architecture des Dossiers

- **[packages/config/src/index.ts](file:///c:/Users/felic/Videos/Hotels/packages/config/src/index.ts)** : **Centre de personnalisation White-Label** (nom de l'hôtel, devises `EUR`/`USD`/`CHF`, codes privilèges `PALACE10`/`ROYALVIP`, et 3 ambiances complètes : *Palace Parisien*, *Riviera Méditerranée*, *Sanctuaire Alpin*).
- **[packages/types/src/index.ts](file:///c:/Users/felic/Videos/Hotels/packages/types/src/index.ts)** : Interfaces TypeScript et schémas de validation **Zod** partagés.
- **[packages/store/src/index.ts](file:///c:/Users/felic/Videos/Hotels/packages/store/src/index.ts)** : Store **Redux Toolkit** (`bookingSlice`, `filterSlice`, `uiSlice`) et **RTK Query** (`hotelApi`) consommés par le Web et le Mobile.
- **[apps/api/src/index.ts](file:///c:/Users/felic/Videos/Hotels/apps/api/src/index.ts)** : Serveur **Express.js** + **Prisma ORM** ([schema.prisma](file:///c:/Users/felic/Videos/Hotels/apps/api/prisma/schema.prisma)) avec bascule automatique sur son moteur hybride en mémoire si PostgreSQL n'est pas encore lancé.
- **[apps/web/src/app/page.tsx](file:///c:/Users/felic/Videos/Hotels/apps/web/src/app/page.tsx)** : Site Web **Next.js** ultra-premium avec barre de réservation flottante, catalogue filtrable en temps réel, configurateur de séjour en 3 étapes et **Studio White-Label Live**.
- **[apps/mobile/src/App.tsx](file:///c:/Users/felic/Videos/Hotels/apps/mobile/src/App.tsx)** : Architecture **React Native** connectée au même store `@hotel/store`.

---

## 🚀 Démarrage Rapide

```bash
# Lancer simultanément l'API Express (port 4000) et le site Web Next.js (port 3000)
npm run dev
```

- **Site Web Next.js** : `http://localhost:3000`
- **API Express** : `http://localhost:4000/api/health`
- **Référence de réservation de démonstration** (à tester dans *"Ma Réservation"*) : `AURA-2026-8841`
- **Codes Privilèges actifs** (étape 2 du tunnel de réservation) : `PALACE10` (-10%) ou `ROYALVIP` (-15%)
