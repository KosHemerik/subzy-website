# Subzy Website

## Lokale setup

1. Installeer dependencies:

```bash
npm install
```

2. Maak een lokale env file op basis van het voorbeeld:

```bash
cp .env.local.example .env.local
```

3. Vul in `.env.local` je Supabase projectgegevens in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<jouw-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<jouw-anon-key>
```

4. Start de app:

```bash
npm run dev
```

Of start app + lokale Supabase server samen:

```bash
npm run dev:local
```

5. Open `http://localhost:3000`.

## Controle of Supabase werkt

- Dien een testformulier in via:
	- `/subsidie/aanvragen`
	- `/energiebelasting/aanvragen`
- Controleer in Supabase of de records verschijnen in:
	- `subsidie_aanvragen`
	- `energiebelasting_aanvragen`

## Opmerking

Als de env variabelen ontbreken, geeft de app nu een duidelijke foutmelding dat Supabase nog niet geconfigureerd is.

Voor `npm run dev:local` heb je Docker en de Supabase CLI nodig.
