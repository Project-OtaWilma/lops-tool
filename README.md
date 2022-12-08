# Usage

## Create `auth.json` file
The file should contain the `Wilma2SID` field
````json5
{
    "Wilma2SID": "612a3479c875c69839db6cc4388977a0" // Your Wilma2SID goes here
}
````

## Run the parser
### By default the parser will run and fetch all of your current lops content and save it to `./lops.json`.

### install the depencies `npm i` 
### run the parser `node .` 

## Result
### The parser will typically take around 30s to parse the entirety of the lops (including details about every course). The format of the `./lops.json` will be something like this:
````json5
{
    "[ÄI] Äidinkieli ja kirjallisuus, suomen kieli ja kirjallisuus": {
        "ÄI01": {
            "hash": "127945",
            "name": "Tekstien tulkinta ja kirjoittaminen",
            "type": "c-type136",
            "Tyyppi": "Lu21 pakollinen moduuli",
            "Opintoviikkoja": 1,
            "Opintopisteitä": 2,
            "Sisältö": "Keskeiset sisällöt• keskeiset tekstilajit: kertovat, kuvaavat, ohjaavat, kantaa ottavat ja pohtivattekstit sekä niiden yhdistelmät• tekstikokonaisuuden rakentuminen; tekstin tavoitteen, kohderyhmän, kontekstien, sisällön, rakenteen, ilmaisutapojen ja näkökulmien analyysi• erilajisten tekstien tuottamisen prosessi yksin ja yhdessä sekä tekstien pohjalta kirjoittaminen, referointi ja kommentointi• tekstien moniäänisyys ja intertekstuaalisuus• kielen- ja tekstinhuoltoa",
            "Tavoitteet": "TavoitteetModuulin tavoitteena on, että opiskelija• osaa tuottaa, tulkita ja arvioida erilaisia, monimuotoisia tekstejä ja niidenrakenteita ja ilmaisutapoja• rohkaistuu kirjoittajana ja hallitsee kirjoittamisprosessin eri vaiheet• osaa käyttää muita tekstejä oman kirjoittamisen pohjana• syventää käsitystä itsestään tekstien tulkitsijana ja tuottajana sekä palautteenantajana ja vastaanottajana.",
            "OPS huomautus": "LOPS2021"
        },
        //...
    },
    //...
}
````