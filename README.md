# Boka Morbror

En varm och gullig webbapp for familjen - dar Sandra, Lukas och Bim kan boka Morbror Christoffer for hjalp med barnpassning, lekstunder och mycket mer!

## Funktioner

### For Mamma och Pappa (Sandra & Lukas)
- **Snabbknappar** for vanliga bokningstyper (Barnpassning, Lekstund, Promenad, etc.)
- **Bokningsflode** med datum, tid, langd och packlista
- **Morbrors tider** - se foreslagna tider for bokningar
- **Packlistor** - mallar for varje bokningstyp som kan redigeras
- **Minnen** - spara fina stunder fran morbror-pass
- **Admin-panel** - godkann/avboj bokningar (simulerar morbrors svar)

### For Bim (Barnlage)
- **Stora knappar** for att valja vad hon vill gora
- **Enkelt flode** - tryck pa "Traffa morbror!" for att skapa en forfragan
- **Matchningsspel** - para ihop bilder med ord (hund, tomte, morbror, mamma, pappa, apa)

## Bokningstyper
1. **Barnpassning** - langre pass med full packlista
2. **Bim nar inte** - hjalp med saker hogt upp
3. **Lekstund** - lek och bus
4. **Promenad med vagn** - frisk luft
5. **Bygga/Montera** - fixa saker
6. **Akuthjalp idag** - nar det brannar

## Teknisk setup

### Krav
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Starta utvecklingsserver
```bash
npm run dev
```

### Bygga for produktion
```bash
npm run build
```

## Inloggningar (Demo)
Appen anvander demo-inloggningar som sparas i localStorage:

- **Sandra (Mamma)**: mamma@bokamorbror.se
- **Lukas (Pappa)**: pappa@bokamorbror.se  
- **Bim (Barnlage)**: bim@bokamorbror.se

## Supabase (Valfritt)
For att anvanda riktig databas och auth, skapa en `.env` fil:

```
VITE_SUPABASE_URL=din_supabase_url
VITE_SUPABASE_ANON_KEY=din_supabase_anon_key
```

## Tekniker
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router
- Supabase (forberett)
- Lucide React (ikoner)

---

*En julklapp fran Morbror Christoffer*
