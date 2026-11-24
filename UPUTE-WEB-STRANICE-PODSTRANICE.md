# Medium29 · Web stranica za Vaš posao (24. 11. 2026.)

## Što je u paketu
- 67 različitih djelatnosti, svaka na HR, EN i DE: 201 statičkih industrijskih podstranica.
- Tri odvojene zbirne stranice: /web-stranice/, /en/websites/, /de/webseiten/.
- Na sve tri postojeće početne dodane kartice (2 u redu na mobitelima, 4 na desktopu).
- Nova grana navigacije "Web stranice" / "Websites" / "Webseiten".
- Jedinstven vizualni jezik na bazi prijašnjeg Daytrip-koncepta, zasebni modalni detalji, pristupačna galerija i obrazac.
- Zadržani postojeći CSS/JS glavnog sajta, Cloudflare Pages redirects, cookies, postojeće pristupno polje Web3Forms.
- Unikatni opis poslovnih potreba, 3 prilagođene funkcionalnosti, scenarij korisnika i konkretno Q&A za svaku djelatnost i svaki jezik.
- Sitemap s jezičnim alternativama, canonical, OG za svaku jezičnu verziju, Schema.org Service i BreadcrumbList.

## Važno prije objave
1. Lokalno provjeriti i na Cloudflare Pages objaviti paket, **zamijeniti cijeli prethodni build**, ne nadopisivati stari.
2. Provjeriti Web3Forms/hCaptcha na stvarnoj domeni i potvrditi da su obavijesti pravilno isporučene (nije moguće dokazati offline).
3. U Search Console poslati /sitemap.xml i nadzirati indeksiranje; ne postoji jamstvo pozicioniranja.
4. Nova početna prikazuje 8 odabranih djelatnosti, a katalog sadrži svih 67.
5. Fotografije za djelatnosti bez portfolija nisu tuđe stock fotografije, već **vlastiti lokalni SVG dizajnerski koncepti**. Po želji ih zamijeniti stvarnim fotografijama koje smijete koristiti; bez AI oznaka i lažnih referenci.
6. Stvarne reference su korištene samo za projekte koji se nalaze u priloženom Medium29 portfoliju.
7. Stranice za medicinske i regulirane djelatnosti koriste informativan sadržaj. Sve konkretne usluge, licence, cijene i pravne tvrdnje potvrdite za stvarnog klijenta.
8. SEO fraze su pažljivo napisani prirodni nazivi djelatnosti, **nisu potvrđeni volumeni pretrage** (bez pristupa Google Keyword Planneru/GSC-u).
9. Savjet: pratite prikaze/upite za nekoliko mjeseci; nekorisne ili gotovo preklapajuće podstranice spojite ili doradite umjesto daljnjeg umnožavanja. Google smjernice ne nagrađuju količinu samu po sebi.
10. Digitalni marketing po djelatnostima nije dio ove grane i ostaje zaseban budući projekt.

## Navigacija
- Stara /rjesenja/ sada trajno vodi na /web-stranice/.
- Stara /rjesenja/taxi-transferi/ vodi na /web-stranice/taxi-firma/.
- Novi sadržaj je pre-rendered HTML; važne informacije nisu sakrivene iza JS-a.

## Napomene o implementaciji
- Client-First pristup: odvojeni reusable `assets/industry/industry.css`/`.js`, `assets/industry-catalog/catalog.css`/`.js` i data-config u `assets/industry-catalog/config/`.
- Izmjene zajedničkih vizualnih komponenti rade se u jednom CSS/JS mjestu.
- Originalni početni web, portfolio i kontakt nisu redizajnirani.
- Dizajnerska referenca Daytrip je inspiracija za raspored; nema kopiranja HTML-a ili zaštićenih vizuala.
- Nakon promjene materijala ažurirati `lastmod` samo na izmijenjenim URL-ovima.
