# Medium29 — premium podstranice po djelatnostima

## Što je dodano

- `/rjesenja/` — glavna stranica s dostupnim rješenjima.
- `/rjesenja/taxi-transferi/` — prva cjelovita podstranica za taxi i transfer firme, s Daytrip-inspiriranim rasporedom galerije, karticama, modalima, „digitalnom rutom”, stvarnim referencama i obrascem.
- `/uvjeti-koristenja` — informativni uvjeti korištenja web stranice.
- Stavka „Rješenja” u navigaciji i podnožju hrvatskih stranica.
- SEO: vlastiti title/description, canonical, Open Graph/Twitter, strukturirani podaci (Service + BreadcrumbList), H1/H2/H3, interne poveznice i tri nova zapisa u sitemap.xml.
- `assets/industry/taxi-hero.avif` i `taxi-og.jpg` — originalni, lokalni vizuali; postojeći portfolio materijali ponovno su korišteni iz originalnog sajta.

## Kako izraditi sljedeću branšu bez novog programiranja

1. Kopiraj direktorij `rjesenja/taxi-transferi/` u npr. `rjesenja/apartmani/`.
2. U novoj kopiji `index.html` izmijeni sve tekstove, naslove, reference, fotografije, canonical, title, description, OG, strukturirane podatke, breadcrumb i ciljnu djelatnost u formi.
3. Dupliciraj datoteku `config.js` unutar nove branše, izmijeni galeriju te podatke za modale i usluge. U HTML-u promijeni putanju konfiguracije na `/rjesenja/apartmani/config.js`.
4. Postavi odgovarajuće vlastite slike u `assets/industry/`, optimiziraj ih i pripremi jedinstven Open Graph vizual.
5. Zadrži zajedničke `assets/industry/industry.css` i `assets/industry/industry.js` — nema potrebe za njihovim dupliciranjem.
6. Dodaj novu branšu na `/rjesenja/`, poveži je s relevantnim uslugama i portfolijem, te upiši URL u `sitemap.xml`.
7. Ako objavljuješ EN/DE prijevod, napravi **potpune** zasebne jezične verzije, s odgovarajućim `lang`, canonical i recipročno postavljenim `hreflang` oznakama. Dok prijevodi ne postoje, ne dodaj lažne jezične alternative.
8. Za svaku djelatnost sadržaj mora biti originalan; nemoj samo zamijeniti riječ „taxi” nazivom nove branše.

## Tehnička struktura

- Čisti statički HTML/CSS/JS. Bez frameworka, bundlera i dodatnog buildu.
- Client-First-inspirirana struktura: `padding-global`, `container-large`, `section-space`, komponente `gallery-*`, `route-*`, `solution-*`, `inquiry-*`. Dizajn je izoliran na `.industry-page`.
- GSAP je **opcionalno** učitan s CDN-a samo na industrijskoj podstranici i poboljšava diskretne prijelaze. Bez GSAP-a rade galerija, ruta, modali i forme. Nema Lenis smooth-scroll dependencyja.
- Brzina: lokalni AVIF vizuali, lazy loading ne-hero slika, prikaz sadržaja bez čekanja na JavaScript, `prefers-reduced-motion` podrška.
- Obrazac koristi postojeći Medium29 Web3Forms `access_key`, postojeći hCaptcha sustav i antispam `botcheck`. Nova forma prenosi polje `djelatnost` i `izvor_upita`.
- Cookie banner, politika privatnosti i zajednička navigacija koriste postojeći kod sajta.

## Važno prije objave

- Provjeri live zaprimanje barem jednog stvarnog **kontroliranog** upita i hCaptcha na javnoj domeni. U lokalnoj provjeri provjeren je samo korisnički tijek slanja uz simulirani uspješan odgovor; stvarni Web3Forms endpoint nije pozivan.
- Nakon objave potvrdi canonical URL, sitemap, Search Console indeksiranje i Core Web Vitals/PageSpeed na stvarnoj domeni. Rezultat 90+ nije unaprijed zajamčen niti je izmjeren na javnom serveru.
- Provjeri postojeće Google/Meta konverzijske događaje i postavljaj ih samo uz odgovarajuću privolu, ako su potrebni.
- `rjesenja/taxi-transferi/` je namjerno **samo na hrvatskom** dok se ne pripreme potpuni prijevodi.
- Generirana fotografija vozila ilustrativna je; ne predstavlja vozilo pojedinog klijenta.

## Instalacija

Ovaj ZIP ima datoteke web sajta izravno u korijenu. Prekopiraj sadržaj u GitHub repozitorij Medium29 (zadrži svoje Git podatke) i objavi putem postojećeg Cloudflare Pages procesa. Izvorni web, EN/DE stranice i postojeći kontaktni mehanizmi nisu zamijenjeni.
