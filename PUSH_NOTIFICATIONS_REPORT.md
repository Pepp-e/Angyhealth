# AngyHealth — Notifiche giornaliere

## Correzione 30/10/2026 — causa del mancato invio

- Causa: sul server pubblicato l’invio usava `fetch(..., { redirect: "error" })`, opzione rifiutata dal runtime del sito pubblicato. La pianificazione partiva (risposte 200), il dispositivo veniva prenotato per il giorno, ma l’invio falliva prima di raggiungere il servizio push (`last_status = failed` del 29/10) e non veniva ripetuto.
- Corretto: `redirect: "manual"`, log dell’errore reale, un nuovo tentativo immediato su errori temporanei (rete, 429, 5xx).
- Pianificazione: ora due esecuzioni al giorno, 14:00 e 15:00 UTC; invia solo quando a Europe/Rome sono le 16:00 (ora solare e legale).
- Test immediato (dal sandbox, stessa libreria e chiavi): sottoscrizione recuperata, messaggio cifrato, servizio push Google ha risposto 201 (accettato). La visualizzazione sul telefono non è verificabile da qui.
- Invio di prova on demand: richiamo autenticato con corpo `{"kind":"test"}`; non consuma l’invio delle 16:00.
- Da fare: pubblicare il sito, altrimenti il server pubblicato continua a usare la versione difettosa.

## Stato: implementazione predisposta, consegna reale NON ancora verificata

Il progetto esistente non è stato ricreato. Sono stati aggiunti il controllo “Notifiche” sotto “Feedback tattile”, la richiesta esplicita del consenso e l’infrastruttura Web Push. PIN, navigazione, grafica generale, traduzioni esistenti, cookie di consenso, Google Analytics, SEO e contenuti non sono stati modificati.

Non dichiaro completata la funzionalità: l’ambiente di prova ha rifiutato la registrazione push reale (`Registration failed - permission denied`). Nessuna notifica è stata effettivamente consegnata a un dispositivo. Occorre pubblicare e completare il test su un dispositivo autorizzato.

## Servizi configurati

- Lovable Cloud già presente; nuova tabella privata `push_subscriptions`, accessibile soltanto al servizio server. Nessun nuovo account o accesso richiesto agli utenti.
- Chiavi VAPID derivate da un segreto generato e custodito in Cloud. Solo la chiave pubblica arriva al browser; nessuna credenziale da fornire o account Firebase necessario.
- Identità dispositivo tramite cookie cifrato HttpOnly/Secure/SameSite=Strict, separato dai PIN.
- Funzione atomica `claim_push_reminder`: un solo tentativo per sottoscrizione e data locale, anche con chiamate concorrenti. I tentativi falliti non vengono ripetuti nello stesso giorno: privilegia l’assenza di duplicati rispetto alla consegna garantita.
- Richiamo server autenticato `/api/public/jobs/daily-reminders`.
- Pianificazione gestita `angyhealth-daily-reminders`, ogni 15 minuti (96 controlli/giorno). Il server invia solo quando nel fuso IANA registrato sono le 16:00–16:04; il controllo trimestrale d’ora copre anche offset di mezz’ora e 45 minuti. La frequenza può aumentare il consumo Cloud.
- Worker dedicato esclusivamente ai messaggi: nessuna cache delle pagine, nessun funzionamento offline aggiunto.
- Titolo `AngyHealth`, testo `Come stai oggi?`, logo esistente `/icon-512.png`.
- Scadenza breve di cinque minuti e verifica della scadenza anche nel ricevitore; promemoria vecchi vengono scartati. L’app offline non può aggiornare immediatamente il server: il ricevitore viene disattivato localmente, si tenta di annullare la sottoscrizione e si mostra la necessità di riconfermare online.

## Verifiche effettivamente eseguite

### Browser Chromium locale, applicazione esistente

- Accesso alla versione 0000 esistente e schermata Impostazioni reale.
- Controllo Notifiche inizialmente attivo, mentre il permesso browser rimane `default`: nessun consenso simulato.
- “Non adesso”: nessuna nuova richiesta dopo ricaricamento.
- Disattivazione e persistenza dopo ricaricamento.
- Riattivazione: torna la richiesta esplicita, senza avviare automaticamente il prompt nativo.
- Tentativo di registrazione con permesso accordato mediante strumenti del browser: worker creato, ma sottoscrizione push negata dall’ambiente. Non costituisce prova di consenso reale o consegna.
- Messaggio di permesso negato/revocato verificato con stato `Notification.permission` simulato. Il tentativo di imporre il permesso tramite strumenti Chromium non cambiava realmente tale stato: questo controllo NON dimostra revoca su dispositivo fisico.
- Controllo ricevitore server senza credenziale: risposta 401.
- Richiamo autenticato reale al server: risposta 200. Non erano presenti dispositivi registrati: verifica dell’autenticazione e accesso ai dati, non della consegna.
- Nessun errore di pagina rilevato; nessun allargamento orizzontale a 390×844. Schermata verificata visivamente anche a 1280×1800.

### 16 test automatici superati

- 16:00 in Europe/Rome in inverno ed estate; esclusione prima delle 16:00.
- Fusi Asia/Kolkata e Asia/Kathmandu.
- Scadenza dopo cinque minuti.
- Contenuto e logo esatti.
- Blocco destinazioni arbitrarie o non sicure.
- Derivazione VAPID stabile e valida; creazione richiesta cifrata RFC8291/aes128gcm con autenticazione VAPID.
- Ricevitore: visualizzazione, eliminazione duplicati, disattivazione, riattivazione, scadenza. API di notifica simulate, non notifiche di sistema reali.
- Invio server alle 16:00 in un test controllato; secondo richiamo senza secondo invio; sottoscrizione disattivata non inviata; registrazione scaduta disattivata dopo risposta 410. Dati e servizio push simulati.

Build e controllo dei tipi automatici: ultimo risultato OK.

## File aggiunti/modificati

- `src/routes/schermata-6.tsx`: montaggio del solo nuovo controllo.
- `src/components/NotificationsSettings.tsx`: preferenza, richiesta, attivazione/disattivazione, messaggi.
- `src/lib/push-browser.ts`: compatibilità, persistenza, registrazione e stato ricevitore.
- `src/lib/push.functions.ts`: configurazione pubblica e gestione autorizzata del dispositivo.
- `src/lib/push-keys.server.ts`: chiavi VAPID.
- `src/lib/push-rules.ts`: contenuto, fuso, finestra di invio e destinazioni ammesse.
- `src/lib/push-sender.server.ts`: invio server e protezione duplicati.
- `src/routes/api/public/jobs/daily-reminders.ts`: richiamo pianificato autenticato.
- `public/angyhealth-push-sw.js`: ricezione e apertura app.
- `src/styles.css`: sole superfici del nuovo interruttore, coerenti con quelle esistenti.
- `drizzle/migrations/0000_daily_push_subscriptions.sql`: schema applicato; metadati delle migrazioni e tipi Cloud rigenerati automaticamente.
- `src/lib/push-rules.test.ts`, `push-worker.test.ts`, `push-sender.test.ts`: verifiche mantenute nel progetto.
- `package.json`, `bun.lock`: dipendenze.
- `AGENTS.md`, `roadmap.md`, questo rapporto: documentazione.

Dipendenze aggiunte: `@block65/webcrypto-web-push` 2.0.0, `@noble/curves` 2.4.0; `vitest` 5.0.5 per i test. Nessuna nuova libreria PWA o cache delle pagine.

## Azioni manuali e rischi residui

1. Pubblicare AngyHealth: il richiamo pianificato usa il sito pubblicato e non può trovare questa nuova funzione prima della pubblicazione. Anche i nuovi segreti devono essere inclusi nella pubblicazione.
2. Android/Chrome: aprire il sito pubblicato, entrare nelle Impostazioni, premere “Attiva notifiche” e concedere il permesso.
3. iPhone/iPad: iOS/iPadOS 16.4 o successivo; aprire in Safari, Condividi → Aggiungi alla schermata Home; aprire l’app installata e autorizzare dalle Impostazioni. Safari in una normale scheda iPhone non basta.
4. Verificare su dispositivo reale una notifica, poi chiudere la pagina/app e ripetere il test; verificare anche riavvio, disattivazione/riattivazione e revoca dalle impostazioni del sistema.
5. Verificare l’orario locale sul dispositivo. Il fuso viene aggiornato quando si riaprono le Impostazioni: se si cambia fuso senza riaprire l’app, il server conserva l’ultimo fuso registrato.

Non sono stati eseguiti test su iPhone/Safari reale, Android fisico, desktop con browser chiuso o dopo riavvio. La ricezione a pagina chiusa è prevista dal protocollo, non dimostrata in questo ambiente. Il sistema operativo può ritardare, scartare o non consegnare una notifica; nessuna garanzia di consegna al minuto esatto. Una notifica già passata al servizio push non può essere richiamata dal server; il ricevitore locale tenta di impedirne la visualizzazione dopo la disattivazione. Per grandi volumi il richiamo unico andrà suddiviso: non è stato eseguito un test di carico.

La guida PWA ha delimitato l’intervento al worker di messaggistica, lasciando invariata l’installazione e senza introdurre cache offline.