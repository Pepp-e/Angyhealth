# angyhealth - the mood cloud

Crea un sito web mobile-first progettato per funzionare perfettamente sia su Android sia su iPhone.



L’obiettivo è creare una struttura iniziale semplice, pulita, moderna e facilmente modificabile in futuro. Non aggiungere funzionalità non richieste.



Design generale



- L’interfaccia deve essere ottimizzata principalmente per smartphone.

- Layout responsive compatibile con diverse dimensioni di schermo Android e iPhone.

- Lo sfondo dell’intera applicazione deve essere un cielo azzurro con nuvolette bianche morbide e leggere.

- Usa uno stile moderno, pulito e minimal.

- Utilizza l’effetto Liquid Glass per gli elementi principali dell’interfaccia: trasparenza, sfocatura dello sfondo, bordi leggermente luminosi, riflessi delicati e ombre morbide.

- Mantieni sempre una buona leggibilità e un aspetto elegante senza rendere l’interfaccia troppo complessa.



Schermata principale



Al centro della schermata principale inserisci un elemento principale leggermente sopraelevato rispetto allo sfondo, con effetto Liquid Glass.



All’interno di questo elemento:



- inserisci una grande nuvoletta/pulsante a forma di nuvola;

- la nuvoletta deve avere ombre morbide e un leggero effetto tridimensionale;

- sopra la nuvoletta inserisci una breve scritta/titolo;

- la nuvoletta deve essere cliccabile;

- quando viene premuta, deve portare a una seconda schermata.



La schermata principale deve avere una composizione molto semplice, con l’elemento centrale come punto focale.



Navigazione inferiore



In tutte le schermate, compresa la schermata principale, deve essere sempre visibile nella parte inferiore una barra di navigazione con 5 pulsanti.



La barra deve:



- avere effetto Liquid Glass;

- essere semitrasparente;

- avere sfocatura dello sfondo;

- avere angoli arrotondati;

- avere ombre leggere;

- rimanere ben separata dal bordo inferiore dello schermo;

- adattarsi correttamente sia ad Android sia a iPhone;

- rispettare le aree sicure dello schermo, compresa la zona della gesture bar degli iPhone.



5 pulsanti della barra



La barra deve contenere esattamente 5 pulsanti distribuiti orizzontalmente.



Per ora utilizza icone provvisorie semplici e moderne.



Struttura:



1. Primo pulsante → porta alla prima schermata secondaria.

2. Secondo pulsante → porta alla seconda schermata secondaria.

3. Pulsante centrale → rappresenta la schermata principale e deve utilizzare un'icona a forma di nuvola.

4. Quarto pulsante → porta alla terza schermata secondaria.

5. Quinto pulsante → porta alla quarta schermata secondaria.



Il pulsante centrale deve essere visivamente riconoscibile come quello della schermata principale.



Schermate



Crea inizialmente:



- 1 schermata principale;

- 4 schermate secondarie collegate ai quattro pulsanti laterali della barra di navigazione.



Le quattro schermate secondarie possono contenere per ora solamente una struttura vuota e minimale con un titolo segnaposto, senza aggiungere funzionalità non richieste.



La navigazione tra le schermate deve essere fluida e funzionante.



Requisiti tecnici



- Mobile-first.

- Compatibile con Android e iOS.

- Responsive.

- Codice semplice e facilmente modificabile.

- Componenti riutilizzabili.

- La barra di navigazione deve essere presente in tutte le schermate.

- Mantieni separati i componenti relativi a sfondo, barra di navigazione, pulsante centrale e schermate, così da poterli modificare facilmente in futuro.

- Non aggiungere login, database, API, autenticazione, animazioni complesse o altre funzionalità non richieste.

- Utilizza icone provvisorie facilmente sostituibili in futuro.



Prima di implementare funzionalità aggiuntive, mantieni esattamente questa struttura base.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://angyhealth.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2f772401-010b-4e50-ac76-f2a3aab1729b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
