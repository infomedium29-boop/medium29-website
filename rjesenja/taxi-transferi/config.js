/* Medium29 / Taxi & transferi content configuration.
   Duplicate and edit THIS file for a new industry, keeping shared industry.js unchanged. */
(() => {
  'use strict';
  const gallery = [
    {
      img:'/assets/industry/taxi-hero.avif', alt:'Ilustrativna fotografija premium transfer vozila na jadranskoj obali', title:'Vaš posao zaslužuje profesionalnu prezentaciju',
      description:'Dobro osmišljena web stranica putniku daje jasan pregled usluga, relacija i načina rezervacije, a fotografije naglašavaju kvalitetu iskustva.',
      points:['Velika galerija prilagođena mobilnim uređajima','Prikaz usluga bez nepotrebnog traženja informacija','Pozivi na upit na pravim mjestima'],fit:'cover'
    },
    {
      img:'/assets/portfolio/auto153-web.svg',alt:'Prikaz izrađene web stranice AUTO153',title:'AUTO153 — web projekt',
      description:'Primjer web projekta za prijevoznika s višejezičnim sadržajem i rezervacijskim obrascem. Prikaz je iz portfolija Medium29.',
      points:['Jasno predstavljene usluge i transferi','Višejezični sadržaj','Povezani tok slanja upita'],fit:'contain'
    },
    {
      img:'/assets/portfolio/auto153-app-journey.avif',alt:'Ekran aplikacije AUTO153 za unos podataka o putovanju',title:'AUTO153 — rezervacija na mobitelu',
      description:'Dio stvarnog projekta mobilne aplikacije AUTO153. Mobilno iskustvo posebno je važno kada putnik traži prijevoz tijekom putovanja.',
      points:['Koraci prilagođeni manjim ekranima','Unos podataka o vožnji','Pregledna interakcija'],fit:'contain'
    }
  ];
  const solutions = {
    website:{img:'/assets/portfolio/auto153-web.svg',alt:'Prikaz web projekta AUTO153',title:'Web stranice za taxi i transfer firme',description:'Dizajn i sadržaj planiramo oko stvarnih pitanja vaših putnika: kamo vozite, kako rezervirati, koje jezike podržavate i kako stupiti u kontakt.',points:['Responzivni prikaz na svim uređajima','Stranice usluga, relacija i područja prijevoza','Tehnički SEO, brza izvedba i jasni pozivi na akciju'],fit:'contain'},
    booking:{img:'/assets/portfolio/auto153-app-journey.avif',alt:'Primjer procesa rezervacije u aplikaciji AUTO153',title:'Online upiti i rezervacijski obrasci',description:'Obrazac možemo prilagoditi vašem poslovanju, od jednostavnog upita do složenijeg izračuna relacije. Potvrdu rezervacije dogovaramo prema stvarnom načinu rada tvrtke.',points:['Datum, vrijeme, polazište i odredište','Broj putnika i dodatni zahtjevi','Potvrda, obavijesti i mogućnosti integracije prema dogovoru'],fit:'contain'},
    ads:{img:'/assets/industry/taxi-hero.avif',alt:'Ilustrativni vizual za kampanju privatnih transfera',title:'Google i Meta oglašavanje za transfere',description:'Umjesto širokog oglašavanja bez fokusa, kampanje organiziramo prema destinacijama, relacijama, jezicima i ciljanim tržištima. Mjerimo upite gdje je to tehnički moguće.',points:['Plan kampanje i raspodjela budžeta','Oglasne poruke povezane s relevantnim odredištima','Praćenje rezultata uz odgovarajuću privolu za analitiku'],fit:'cover'},
    seo:{img:'/assets/portfolio/taxi-transfers-krk.svg',alt:'Projekt Taxi & Transfers Krk kao primjer višejezičnog web sadržaja',title:'SEO i sadržaj za taxi i transfer usluge',description:'Planiramo strukturu stranica prema temama koje traže putnici, ali bez gomilanja gotovo identičnih stranica. Svaka relacija dobiva korisne informacije za stvarnog posjetitelja.',points:['Smisleni H1, H2 i H3 naslovi te originalni opisi','Meta podaci, canonical, sitemap i interni linkovi','Višejezične stranice s odgovarajućim jezičnim oznakama'],fit:'contain'}
  };
  const solutionOrder = ['website','booking','ads','seo'];
  window.Medium29IndustryConfig = { gallery, solutions, solutionOrder };
})();
