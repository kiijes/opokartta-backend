# Opokartta-backend

Backend opokarttasovellukseen.

## Mitä tarvitaan

- Node.js + npm
- MongoDB ja Mongoose
- Express
- bcrypt
- jsonwebtoken
- (lisää sitä mukaa kun riippuvaisuuksia tulee)

## Miten ajetaan

1. Asenna tarvittavat ohjelmat (Node.js, MongoDB, editori muokkaukseen)
2. Konfiguroi MongoDB:
    - Aja MongoDB ilman autentikaatiota (Windowsilla mongod ilman --auth flagia).
    - Luo kanta, jonne sovellus tallentaa tiedot. Onnistuu mongo-shellissä komennolla `use kannanNimi`.
    - Luo haluamaasi autentikaatiokantaan (esim. admin) käyttäjä, joka saa luku- ja kirjoitusoikeudet sovellukselle luomaasi kantaan. Kirjaudu mongo-shelliin, ota haluamasi autentikaatiotietokanta käyttöön komennolla `use autentikaatiokannanNimi` ja luo sinne käyttäjä komennolla
    `db.createUser( { user: "kayttajanimi", pwd: "salasana", roles: [ { role: "readWrite", db: "sovelluskannanNimi" } ] } )`
    - Ota autentikaatio käyttöön. Jos ajat mongod:n konfiguraatiotiedoston avulla, lisää konfiguraatiotiedostoon seuraavat rivit:
    ```
    security:
        authorization: enabled
    ```
    - Jos taasen ajat mongod:n komentoriviltä, aja se `--auth` flagin kanssa, esim. `mongod --auth`.

3. Kloonaa repositorio komennolla `git clone https://github.com/kiijes/opokartta-backend.git`
4. Asenna tarvittavat riippuvaisuudet ajamalla kansion juuressa komento `npm install`
5. Nimeä *.config.template.js-nimiset tiedostot *.config.js, eli poista template-osio. Esim. auth.config.template.js -> auth.config.js
6. Lisää db.configiin ja auth.configiin tarvittavat tiedot.
7. Käynnistä sovellus ajamalla index.js komennolla `node index.js` (tai jollain haluamallasi monitorointiskriptillä tms. esim. nodemon).