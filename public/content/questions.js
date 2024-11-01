var questions = {
    1:{ 
         
        video: "frankrijk.mp4", 
        bonusrole: [3,1,2,5,4,6], 
        answers: [
            "De temperatuur in Nederland is tegenwoordig hetzelfde als dat het 50 jaar geleden in het midden van Frankrijk was.",
            "Noorwegen wekt bijna al haar energie op een duurzame, schone manier op.",
            "De CO2 die mensen uitademen draagt niet bij aan klimaatverandering.",
            "!Alle bovenstaande antwoorden zijn juist"
        ], 
        category: "Basis" ,
        question: "Welke stelling is waar?",
        source: ""},
    2:{ 
        video: "broeikaseffect.mp4", 
        bonusrole: [3,5,1,2,4,6], 
        answers: [
            "Ze zitten in de lucht en weerkaatsen zonlicht terug de ruimte in",
            "!Ze zitten in de lucht en kaatsen warmte terug naar de aarde",
            "Ze zorgen ervoor dat planten minder goed groeien",
            "Ze bevatten veel energie en warmen daarmee de lucht op"
        ],
        category: "Basis" ,
        question: "Hoe zorgen broeikasgassen, zoals CO2, voor klimaatverandering?",
        source: ""}, 
    3:{
        video: "", 
        bonusrole: [1,3,5,2,4,6], 
        answers: [
            "Dat kost (bijna) geen energie.",
            "!Ongeveer 3 Wattuur, evenveel als een gloeilamp die 3 minuten aan staat.", 
            "Ongeveer 30 Wattuur, evenveel als een magnetron die 3 minuten aan staat.",
            "Ongeveer 40 Wattuur, evenveel als een airconditioning die 3 minuten aan staat."
        ],
        category: "Technologie" ,
        question: "Hoeveel energie kost elk bericht (prompt) van ChatGPT?",
        source: "https://www.klimaathelpdesk.org/answers/wat-is-de-klimaatimpact-van-chatgpt-hoeveel-co-kost-het-om-chatgpt-een-essay-over-klimaatverandering-te-laten-schrijven/ & https://ecozo.nl/verbruik-per-type-apparaat/"}, 
    4:{ 
        video: "min18.mp4", 
        bonusrole: [3,1,2,4,5,6], 
        answers: [
            "!Ongeveer 30 graden kouder, namelijk -18 graden",
            "Ongeveer 20 graden kouder, namelijk -8 graden", 
            "Ongeveer 10 graden warmer, namelijk 25 graden",
            "Ongeveer gelijk aan nu, namelijk 15 graden" 
        ],
        category: "Basis" ,
        question: "Hoe warm of koud zou de aarde zijn als de atmosfeer helemaal geen broeikasgassen zou bevatten?",
        source: ""}, 
    5:{ 
        video: "", 
        bonusrole: [3,2,6,1,5,4], 
        answers: [
            "Doordat delen van de aarde onleefbaar worden zal het aantal klimaatvluchtelingen toenemen",
            "Ecosystemen kunnen omvallen (“kaartenhuis-effect/tipping point”) en klimaatgerelateerde ziektes zullen meer voorkomen", 
            "Extreem weer zal vaker en krachtiger voorkomen en slachtoffers maken",
            "!Alle bovenstaande zijn waar" 
        ],
        category: "Basis" ,
        question: "Wat zijn de waarschijnlijke gevolgen als we komende dertig jaar niet genoeg tegen klimaatverandering doen?",
        source: ""},
    6:{ 
        video: "wetenschappers.mp4", 
        bonusrole: [3,5,2,4,6,1], 
        answers: [
            "Wetenschappers leggen een eed af als ze beginnen aan hun carriere",
            "Wetenschappers mogen niet stemmen", 
            "!Bij al het werk wat ze doen kijken collega’s mee",
            "Wetenschappers moeten al hun privégegevens delen, zoals telefoon en computer" 
        ],
        category: "Basis" ,
        question: "Hoe kunnen we wetenschappers eigenlijk vertrouwen dat ze de waarheid spreken?",
        source: ""},
    8:{ 
        video: "", 
        bonusrole: [2,3,1,4,5,6], 
        answers: [
            "0 %, voedsel veroorzaakt geen uitstoot van broeikasgassen",
            "1 %, er is wel uitstoot vanwege voedsel, maar die is klein", 
            "10 %, voedsel veroorzaakt veel uitstoot, maar het is niet een van de belangrijkste oorzaken",
            "!25 %, een kwart van alle uitstoot kan gelinkt worden aan voedsel" 
        ],
        category: "Voedsel" ,
        question: "Hoeveel procent van alle broeikasgasuitstoot is vanwege het maken en eten van voedsel?",
        source: ""},
    9:{
        video: "", 
        bonusrole: [5,3,2,1,6,4], 
        answers: [
            "Bijna 80% van de wereldwijde sojaproductie wordt gebruikt voor vegaproducten, de rest voor veevoer.",
            "Het eten van kaas is duurzamer dan ei of kip.", 
            "!Wereldwijd kunnen we 10 miljard mensen op een duurzame manier van voedsel voorzien.",
            "In een duurzaam voedselsysteem is geen plek voor dierlijk voedsel." 
        ],
        category: "Voedsel" ,
        question: "Welk van onderstaande uitspraken over duurzaamheid en voedsel is juist?",
        source: ""}, 
    10:{
        video: "", 
        bonusrole: [3,2,5,6,4,1], 
        answers: [
            "0 %, koeien dragen niet bij aan de opwarming van de aarde",
            "1 %, de bijdrage van koeien is niet zo groot", 
            "6 %, net zoveel als alle fabrieken in de hele wereld",
            "!10 %, net zoveel als alle vervoersmiddelen" 
        ],
        category: "Voedsel" ,
        question: "Hoeveel dragen koeien bij aan de wereldwijde uitstoot van broeikasgassen?",
        source: ""}, 
    11:{
        video: "", 
        bonusrole: [2,3,1,4,5,6], 
        answers: [
            "!Thee",
            "Cappuccino", 
            "Appelsap",
            "Halfvolle melk" 
        ],
        category: "Voedsel" ,
        question: "Welk drankje heeft de kleinste broeikasgasuitstoot van boer tot bord?",
        source: ""}, 
    12:{ 
        video: "", 
        bonusrole: [5,4,6,2,1,3], 
        answers: [
            "Het gebruiken van biologisch voedsel.",
            "!Het verminderen van voedselverspilling.", 
            "Het kopen van alleen lokaal geproduceerd voedsel.",
            "Het verhogen van de transportafstand van voedsel." 
        ],
        category: "Voedsel", 
        question: "Wat is de belangrijkste factor voor het verminderen van de klimaatimpact van voedsel?",
        source: ""},
    13:{
        video: "", 
        bonusrole: [3,1,4,2,5,6], 
        answers: [
            "...het hele jaar door hoger zijn dan nu.",
            "...het hele jaar door lager zijn dan nu.", 
            "!...in de winter hoger en in de zomer lager zijn dan nu.",
            "...in de winter lager en in de zomer hoger zijn dan nu." 
        ],
        category: "Water", 
        question: "Over 50 jaar zal de waterstand in de Rijn in Nederland...",
        source: "https://www.klimaathelpdesk.org/answers/wat-is-de-verwachte-waterstand-van-de-rivieren-over-50-jaar/"},
    14:{
        video: "", 
        bonusrole: [3,1,5,2,4,6], 
        answers: [
            "Tijdens het verkrijgen van de materialen om de smartphone te maken.", 
            "!Tijdens het produceren van de onderdelen voor de smartphone.",
            "Tijdens het gebruik van de smartphone.",
            "Nadat de smartphone is weggebracht naar een afvalpunt (recycling en afvalverwerking)." 
        ],
        category: "Technologie", 
        question: "Wanneer hebben smartphones de grootste impact op het klimaat?",
        source: "https://www.klimaathelpdesk.org/answers/wat-is-de-impact-van-onze-elektronische-apparaten-op-het-klimaat/"},
    15:{
        video: "", 
        bonusrole: [3,1,5,2,4,6], 
        answers: [
            "Tijdens het verkrijgen van de materialen om de wasmachine te maken.", 
            "Tijdens het produceren van de onderdelen voor de wasmachine.",
            "!Tijdens het gebruik van de wasmachine.",//
            "Nadat de wasmachine is weggebracht naar een afvalpunt (recycling en afvalverwerking)." 
        ],
        category: "Technologie", 
        question: "Wanneer hebben wasmachines de grootste impact op het klimaat?",
        source: "https://www.klimaathelpdesk.org/answers/wat-is-de-impact-van-onze-elektronische-apparaten-op-het-klimaat/"},
    16:{
        video: "", 
        bonusrole: [6,4,2,5,1,3], 
        answers: [
            "Nee, rijke mensen stoten gemiddeld juist minder CO2 uit.",
            "Nee, de uitstoot is gemiddeld ongeveer hetzelfde.",
            "!Ja, omdat ze meer autorijden. ",//
            "Ja, omdat ze vaker uit eten gaan." 
        ],
        category: "Maatschappij", 
        question: "Stoten rijke Nederlanders gemiddeld meer CO2 uit dan arme Nederlanders?",
        source: "https://www.klimaathelpdesk.org/answers/hoe-is-de-uitstoot-in-nederland-verdeeld-tussen-rijk-en-arm/"},
    17:{
        video: "", 
        bonusrole: [5,2,3,1,4,6], 
        answers: [
            "!Alleen tweedehands kleren kopen.",
            "Bij de aankoop van kleding kiezen voor de duurzaamste materialen.",
            "Je kleren 10 graden kouder wassen.",
            "De stof van je oude kleren hergebruiken voor andere doeleinden."
        ],
        category: "Kleding", 
        question: "Welk van deze keuzes is het meest milieubewust? ",
        source: "Uit: Hoe kleed ik me sexy maar toch milieubewust?"},
    18:{
        video: "", 
        bonusrole: [3,4,5,6,1,2], 
        answers: [
            "Ja, de energie die vrijkomt blijft in de atmosfeer, dus zorgt voor opwarming",
            "Ja, alle rook die vrijkomt houdt warmte van de zon vast",
            "!Nee, het heeft juist een verkoelend effect", //
            "Nee, de hitte die vrijkomt is verwaarloosbaar en de temperatuur verandert dus niet"
        ],
        category: "Natuur", 
        question: "Dragen grote vulkaanuitbarstingen bij aan de opwarming van de aarde?",
        source: "https://www.klimaathelpdesk.org/answers/wat-is-de-invloed-van-een-vulkaanuitbarsting-op-het-klimaat/ "},
    19:{
        video: "", 
        bonusrole: [3,4,5,6,1,2], 
        answers: [
            "Het weer wordt extremer en zal zorgen voor hittegolven, droogte en bosbranden.",
            "Het opwarmen gaat zo snel dat heel veel planten en dieren zich niet kunnen aanpassen, en zullen uitsterven.",
            "De zeespiegel stijgt zodat veel steden aan de kust straks onder water staan. ",
            "!Alledrie de antwoorden zijn waar."
        ],
        category: "Basis", 
        question: "Waarom is het warmer worden van de aarde met een paar graden zo’n probleem?",
        source: ""},
    20:{
        video: "", 
        bonusrole: [5,2,3,6,1,4], 
        answers: [
            "Dierlijk leer is altijd beter.",
            "Dierlijk leer, als je het zo lang mogelijk gebruikt.",
            "Veganistisch leer is altijd beter.",
            "!Veganistisch leer, als je het zo lang mogelijk gebruikt." //
        ],
        category: "Kleding", 
        question: "Wat is beter voor het milieu, een tas van dierlijk of veganistisch leer?",
        source: "https://www.klimaathelpdesk.org/answers/veganistisch-of-dierlijk-leer-wat-is-duurzamer/"},
    21:{
        video: "", 
        bonusrole: [6,4,5,2,3,1], 
        answers: [
            "10%",
            "30%",
            "50%",
            "!70%" //
        ],
        category: "Zorg", 
        question: "Hoeveel procent van de Nederlandse kinderen voelt zich bang, somber of boos over klimaatverandering?",
        source: "https://www.klimaathelpdesk.org/answers/hoe-beinvloedt-klimaatverandering-het-leven-van-een-kind-dat-de-komende-tien-jaar-opgroeit-in-nederland/"},
    22:{
        video: "", 
        bonusrole: [6,4,5,2,3,1], 
        answers: [
            "Kinderen en jongeren verwachten actie van de overheid en het bedrijfsleven om de problemen aan te pakken.",
            "!Eén op de drie kinderen en jongeren slaapt niet goed vanwege zorgen over klimaatverandering.", //
            "De meeste kinderen en jongeren willen er zelf iets tegen doen, maar weten vaak niet hoe.", //
            "Kinderen en jongeren lijken ouders te stimuleren om meer te letten op hun impact op het klimaat." 
        ],
        category: "Zorg", 
        question: "Welke uitspraak over de Nederlandse jeugd en klimaatverandering is NIET waar?",
        source: "Het is tussen de 5-30%, https://www.klimaathelpdesk.org/answers/hoe-beinvloedt-klimaatverandering-het-leven-van-een-kind-dat-de-komende-tien-jaar-opgroeit-in-nederland/ & https://www.nji.nl/klimaatverandering/feiten-en-cijfers"},
    23:{
        video: "", 
        bonusrole: [1,2,5,3,4,6], 
        answers: [
            "100 woningen per jaar.",
            "!1.900 woningen per jaar.", //
            "10.000 woningen per jaar.",
            "50.000 woningen per jaar." 

        ],
        category: "Bouw", 
        question: "Hoeveel woningen kunnen er per jaar worden gebouwd met het naaldhout dat in Nederland wordt geproduceerd?",
        source: "https://www.klimaathelpdesk.org/answers/produceren-we-in-nl-genoeg-hout-om-voortaan-alle-huizen-van-hout-te-bouwen/"},
    24:{
        video: "", 
        bonusrole: [1,3,5,2,4,6], 
        answers: [
            "Het is goedkoop.",
            "Het is gemakkelijk te recyclen.", //
            "!Het helpt CO2 uitstoot te verminderen.", 
            "Het is bestand tegen brand." 
        ],
        category: "Bouw", 
        question: "Wat is een belangrijke reden om hout te gebruiken bij het bouwen van huizen?",
        source: "https://www.klimaathelpdesk.org/answers/produceren-we-in-nl-genoeg-hout-om-voortaan-alle-huizen-van-hout-te-bouwen/"},
    25:{
        video: "", 
        bonusrole: [2,1,4,3,5,6], 
        answers: [
            "!10%",
            "20%", //
            "50%", 
            "80%" 
        ],
        category: "Bouw", 
        question: "Hoeveel procent van het jaarlijkse houtgebruik in Nederland wordt momenteel geproduceerd in eigen land?",
        source: "https://www.klimaathelpdesk.org/answers/produceren-we-in-nl-genoeg-hout-om-voortaan-alle-huizen-van-hout-te-bouwen/"},
    26:{
        video: "", 
        bonusrole: [1,3,2,4,5,6], 
        answers: [
            "Plastic",
            "Baksteen", //
            "Naaldhout", 
            "Aluminium" 
        ],
        category: "Bouw", 
        question: "Welk materiaal is het meest klimaatvriendelijke alternatief voor beton en staal bij de bouw van woningen?",
        source: "https://www.klimaathelpdesk.org/answers/Hoe-lossen-we-het-woningbouwprobleem-op-een-klimaatvriendelijke-manier-op/"},
    27:{
        video: "", 
        bonusrole: [3,1,2,4,5,6], 
        answers: [
            "Vliegtuig",
            "!Trein", 
            "Auto", 
            "Bus" 
        ],
        category: "Technologie", 
        question: "Welke van de volgende vervoersmiddelen heeft de laagste CO2-uitstoot per gereisde kilometer per pasagier?",
        source: "https://www.klimaathelpdesk.org/answers/hoe-milieuonvriendelijk-is-vliegen-tegenover-trein-of-bus-met-aanleg-en-onderhoud-van-infrastructuur-meegerekend/"},
    28:{
        video: "", 
        bonusrole: [2,4,6,5,3,1], 
        answers: [
            "De trein is duurder dan het vliegtuig.",
            "!Het vliegtuig is sneller dan de trein.", //
            "Het vliegtuig is milieuvriendelijker dan de trein.", 
            "Het vliegtuig heeft meer comfortabele zitplaatsen dan de trein." 
        ],
        category: "Technologie", 
        question: "Wat is een van de belangrijkste redenen waarom mensen het vliegtuig in plaats van de trein kiezen voor lange reizen?",
        source: "https://www.klimaathelpdesk.org/answers/hoe-milieuonvriendelijk-is-vliegen-tegenover-trein-of-bus-met-aanleg-en-onderhoud-van-infrastructuur-meegerekend/"},
    29:{
        video: "", 
        bonusrole: [2,3,1,5,6,4], 
        answers: [
            "Windmolens kunnen geen elektriciteit opwekken bij harde wind.",
            "!Windmolens produceren veel geluid en dat is slecht voor de gezondheid van omwonenden.", //
            "Er zijn zeldzame aardmetalen nodig voor de productie van windmolens.", 
            "Windmolens zorgen voor een daling van de verkoopprijs van huizen in de omgeving." 
        ],
        category: "Technologie", 
        question: "Wat is het grootste probleem met betrekking tot windenergie?",
        source: "https://www.klimaathelpdesk.org/answers/zijn-windmolens-%C3%A9cht-wel-zo-duurzaam/"},
    30:{
        video: "", 
        bonusrole: [2,3,1,5,6,4], 
        answers: [
            "!De industrie.",
            "Gebouwen en woningen.", //
            "Vervoer en transport.", 
            "De landbouw." 
        ],
        category: "Technologie", 
        question: "Welke sector in Nederland gebruikt de meeste energie?",
        source: "https://www.klimaathelpdesk.org/answers/hoeveel-energie-gebruiken-we-en-wat-doen-we-er-mee/"},
    31:{
        video: "", 
        bonusrole: [1,3,5,2,4,6], 
        answers: [
            "Verlichting",
            "!Verwarming van ruimtes", //
            "Elektriciteitsgebruik voor apparaten", 
            "Airconditioning" 
        ],
        category: "Technologie", 
        question: "Wat zorgt voor eht meeste energieverbruik in Nederlandse huizen?",
        source: "https://www.klimaathelpdesk.org/answers/hoeveel-energie-gebruiken-we-en-wat-doen-we-er-mee/"},
    32:{
        video: "", 
        bonusrole: [1,2,3,4,5,6], 
        answers: [
            "!Het groeiseizoen wordt korter.", //
            "Het groeiseizoen wordt langer.", 
            "Het groeiseizoen blijft hetzelfde.", 
            "Het groeiseizoen wordt voorspelbaarder." 
        ],
        category: "Landbouw", 
        question: " Hoe beïnvloedt klimaatverandering de lengte van het groeiseizoen van gewassen?",
        source: "https://www.klimaathelpdesk.org/answers/kunnen-we-straks-wel-10-miljard-monden-voeden/"},
    33:{
        video: "", 
        bonusrole: [1,2,3,4,5,6], 
        answers: [
            "Kunstmest is goedkoper dan dierlijke mest.", 
            "Dierlijke mest levert te weinig stikstof in verhouding tot fosfaat.", 
            "Kunstmest is minder efficiënt in het laten groeien van gewassen.", 
            "!Dierlijke mest laat de voedingsstoffen te langzaam los voor de behoeften van groeiende gewassen." //
        ],
        category: "Landbouw", 
        question: "Waarom wordt er nog kunstmest gebruikt in Nederland, ondanks het mestoverschot?",
        source: "https://www.klimaathelpdesk.org/answers/waarom-gebruiken-we-nog-kunstmest-terwijl-we-in-nederland-een-mestoverschot-hebben/ "},
    34:{
        video: "", 
        bonusrole: [3,2,1,4,5,6], 
        answers: [
            "Bosbranden leiden altijd tot een afkoeling van het klimaat.", 
            "Bosbranden verminderen de hoeveelheid CO₂ in de atmosfeer.", 
            "!Bosbranden kunnen zowel opwarmende als afkoelende effecten hebben op het klimaat.", //
            "Bosbranden hebben geen invloed op het klimaat." 
        ],
        category: "Natuur", 
        question: "Wat is een effect van bosbranden op het klimaat?",
        source: "https://www.klimaathelpdesk.org/answers/wat-is-de-invloed-van-bosbranden-op-klimaatverandering/"},
    35:{
        video: "", 
        bonusrole: [3,2,1,4,5,6], 
        answers: [
            "Veranderingen in de luchtvochtigheid.", 
            "!Zachte winters.", //
            "Toename van bosbranden.", 
            "Vermindering van CO2-niveaus." 
        ],
        category: "Natuur", 
        question: "Welke factor heeft invloed op de timing van insectenactiviteit en kan leiden tot verstoringen in het ecosysteem?",
        source: "https://www.klimaathelpdesk.org/answers/krijgen-we-door-klimaatverandering-steeds-meer-last-van-insectenplagen-zoals-bijvoorbeeld-de-eikenprocessierups/"},
    36:{
        video: "", 
        bonusrole: [4,6,2,5,3,1], 
        answers: [
            "Ze ging in hongerstaking.", 
            "Ze ging op de fiets van huis naar een klimaatconferentie.", 
            "!Ze ging spijbelen van school om te demonstreren.", 
            "Ze heeft een bekend liedje geschreven." 
        ],
        category: "Maatschappij", 
        question: "Greta Thunberg is wereldberoemd geworden als klimaatactivist. Met welke actie is zij zo bekend geworden?",
        source: ""},
    37:{
        video: "", 
        bonusrole: [5,2,3,6,4,1] ,
        answers: [
            "!Je probeert de koop van een nieuwe spijkerbroek zo lang mogelijk uit te stellen door hem te repareren.", 
            "Je koopt een nieuwe spijkerbroek, maar kiest een milieuvriendelijke variant.", 
            "Je koopt een normale spijkerbroek, maar laat je oude broek recyclen.", 
            "Je koopt een normale spijkerbroek en laat je oude broek composteren." 
        ],
        category: "Kleding", 
        question: "Wat is het beste voor het milieu om te doen als je spijkerbroek begint te slijten?",
        source: ""},
    38:{
        video: "", 
        bonusrole: [4,2,6,1,3,5], 
        answers: [
            "De landelijke regering in Den Haag bepaalt dit aan de hand van de vraag naar energie.", 
            "!De locatie voor windmolens moet goedgekeurd worden door de gemeentes of provincies.", //
            "Energiebedrijven maken deze keuze, met toestemming van de omwonenden.", 
            "Wetenschappers berekenen de beste locaties en daarna moet het kabinet daarmee instemmen." 
        ],
        category: "Maatschappij", 
        question: "Hoe wordt in Nederland bepaald waar windmolens komen te staan?",
        source: "https://www.klimaathelpdesk.org/answers/hoe-wordt-in-nederland-bepaald-waar-windmolens-komen-te-staan/"},
    39:{
            video: "", 
            bonusrole: [4,5,2,3,6,1], 
            answers: [
                "Een jaar lang één keer per week vlees in plaats van elke dag.", //530kgCO2 
                "Eén keer heen en weer naar Berlijn met de bus of trein in plaats van het vliegtuig.", //400 kgCO2 
                "!Een jaar lang gebruik je de auto maar voor de helft, en de rest doe je met het OV of de fiets.", //1000 kgCO2 
                "Een jaar lang geen nieuwe spullen kopen, maar alleen dingen lenen (indien mogelijk)." //350 kgCO2 
            ],
            category: "Diversen", 
            question: "Waarmee bespaar je gemiddeld de meeste CO2 uitstoot?",
            source: "https://www.milieucentraal.nl/klimaat-en-aarde/klimaatverandering/klimaatklappers/"},
    40:{
        video: "", 
        bonusrole: [4,5,2,3,6,1], 
        answers: [
            "20", 
            "103", 
            "287",  
            "!925" // 
        ],
        category: "Natuur", 
        question: "Hoeveel bomen moet je planten om de hoeveelheid CO2 op te nemen die een Nederlands gezin gemiddeld uitstoot?",
        source: "4 hectare -> 8 voetbalvelden https://www.milieucentraal.nl/klimaat-en-aarde/klimaatverandering/klimaatklappers/350  "},
    41:{
        video: "", 
        bonusrole: [1,3,2,4,5,6], 
        answers: [
            "!Benzine auto", //
            "Elektrische auto", 
            "Diesel auto",  
            "Hybride auto (elektrisch en benzine)" 
        ],
        category: "Technologie", 
        question: "Welke auto stoot het meeste CO2 uit per kilometer?",
        source: "https://www.milieucentraal.nl/duurzaam-vervoer/co2-uitstoot-fiets-ov-en-auto/"},
    41:{
        video: "", 
        bonusrole: [2,1,3,4,5,6], 
        answers: [
            "Van elke 80 auto's is er 1 elektrisch of hybride.", 
            "Van elke 34 auto's is er 1 elektrisch of hybride.", 
            "!Van elke 7 auto's is er 1 elektrisch of hybride.", //
            "Van elke 3 auto's is er 1 elektrisch of hybride." 
        ],
        category: "Technologie", 
        question: "Hoeveel van de auto's in Nederland zijn elektrische of hybride?",
        source: "https://www.cbs.nl/nl-nl/visualisaties/verkeer-en-vervoer/vervoermiddelen-en-infrastructuur/personenautos#:~:text=Van%20alle%20personenauto's%20reed%2076,nu%20een%20tweede%20plek%20in. "},
    42:{
        video: "", 
        bonusrole: [3,5,1,2,4,6], 
        answers: [
            "Geen shampoo of zeep gebruiken.", 
            "In plaats van 15 minuten, slechts 10 minuten douchen.", 
            "!De warmte van het water dat door het doucheputje stroomt hergebruiken.", //
            "Warm douchen met regenwater dat je bij je eigen huis hebt opgevangen." 
        ],
        category: "Diversen", 
        question: "Waarmee kun je het meeste energie besparen bij het douchen?",
        source: "https://www.milieucentraal.nl/energie-besparen/duurzaam-warm-water/douche-wtw/"},
    43:{
        video: "", 
        bonusrole: [3,2,1,4,2,6], 
        answers: [
            "Door de kolencentrales te behouden zodat we ze op die momenten aan kunnen zetten.", 
            "!Door samen te werken met andere landen en daar energie vandaan te halen.",  
            "Door op die momenten energie te halen uit het verbranden van afval.", 
            "Dat is niet mogelijk, dus we zullen nieuwe energiebronnen moeten vinden." 
        ],
        category: "Diversen", 
        question: "Hoe krijgen we in de toekomst energie als de zon niet schijnt en de wind niet waait?",
        source: ""},
    44:{
        video: "", 
        bonusrole: [4,6,2,5,1,3], 
        answers: [
            "De afspraken zijn vrijwillig, dus het land kan niet gestraft worden.",  
            "Het land kan dan uit de Verenigde Naties worden gezet.", 
            "Het land zal een geldboete krijgen van de Verenigde Naties.", 
            "!Burgers in het land kunnen de regering aanklagen omdat zij zich niet aan het verdrag houden." //
        ],
        category: "Politiek", 
        question: "Wat gebeurt er als een land zich niet houdt aan de afspraken van het klimaatverdrag van Parijs?",
        source: "https://www.klimaathelpdesk.org/answers/wat-is-het-akkoord-van-parijs-en-wat-hebben-we-er-aan/ (Urgenda) "},
    45:{
        video: "", 
        bonusrole: [4,6,2,5,1,3], 
        answers: [
            "Een internationaal politieteam dat overtreders van milieuwetten oppakt.",  
            "!Een jaarlijkse bijeenkomst van wereldleiders over het tegengaan van klimaatverandering.", 
            "Het Nederlandse plan om te voldoen aan de klimaatdoelstellingen in 2030 en 2050.", 
            "Een internationale groep van wetenschappers dat onderzoek over klimaatverandering publiceert." 
        ],
        category: "Politiek", 
        question: "Wat is de COP?",
        source: ""},
    46:{
        video: "", 
        bonusrole: [4,6,2,5,1,3], 
        answers: [
            "Een internationaal politieteam dat overtreders van milieuwetten oppakt.",  
            "Een jaarlijkse bijeenkomst van wereldleiders over het tegengaan van klimaatverandering.", 
            "Het Nederlandse plan om te voldoen aan de klimaatdoelstellingen in 2030 en 2050.", 
            "!Een internationale groep van wetenschappers dat onderzoek over klimaatverandering publiceert." 
        ],
        category: "Politiek", 
        question: "Wat is het IPCC?",
        source: ""},
    47:{
        video: "", 
        bonusrole: [6,4,2,5,1,3], 
        answers: [
            "!De kans op hittegolven neemt toe waardoor ouderen kunnen overlijden.",  //
            "Ziekteverwekkende muggen zullen in de toekomst vaker in Nederland voorkomen.", 
            "Door de warmere zomers neemt de kans op huidkanker door UV straling toe.", 
            "De luchtkwaliteit wordt slechter doordat er meer smog zal zijn." 
        ],
        category: "Zorg", 
        question: "Wat is een gevolg van klimaatverandering in Nederland die vooral ouderen treft?",
        source: "https://klimaatadaptatienederland.nl/kennisdossiers/gezondheid/"},
    48:{
        video: "", 
        bonusrole: [6,4,2,5,1,3], 
        answers: [
            "Doordat het grondwater zouter wordt vanwege het stijgende zeewater.",  
            "Doordat de grondwaterstanden in de zomer lager zullen zijn en de bodem droger.", 
            "Doordat het in de winter minder koud is.", 
            "!Door hogere temperaturen en hogere luchtvochtigheid." //
        ],
        category: "Zorg", 
        question: "Waarom zullen virussen en infecties vaker in Nederland voorkomen door klimaatverandering?",
        source: "https://klimaatadaptatienederland.nl/kennisdossiers/gezondheid/"},
    49:{
        video: "", 
        bonusrole: [6,4,2,5,1,3], 
        answers: [
            "Een plotselinge omslag in het weer waardoor er warme lucht aangevoerd wordt.",  
            "!Een verhoogde lichaamstemperatuur en hartslag die levensbedreigend kan zijn.", 
            "Hevig zweten en flauwvallen vanwege de hitte.", 
            "Depressiviteit vanwege langdurige hitte, waarbij slaapgebrek een grote rol speelt." //
        ],
        category: "Zorg", 
        question: "Wat is een hitteberoerte?",
        source: "https://www.rivm.nl/hitte/documenten/hitte-herken-klachten#:~:text=Hitteberoerte%3B,Een%20hitteberoerte%20is%20levensbedreigend!"},
    50:{
        video: "", 
        bonusrole: [6,4,2,5,1,3], 
        answers: [
            "!18 tot 25 jaar.",  //
            "35 tot 45 jaar.", 
            "55 tot 65 jaar.", 
            "75 jaar en ouder." 
        ],
        category: "Maatschappij", 
        question: "Welke leeftijdsgroep in Nederland is het meest hoopvol dat we klimaatverandering tegen kunnen gaan?",
        source: "https://www.cbs.nl/nl-nl/publicatie/2021/22/klimaatverandering-en-energietransitie tabel H2"},
    51:{
        video: "", 
        bonusrole: [6,4,2,5,1,3], 
        answers: [
            "1 op de 80 Nederlanders.",  //
            "1 op de 30 Nederlanders.", 
            "!1 op de 5 Nederlanders", 
            "1 op de 3 Nederlanders." 
        ],
        category: "Voedsel", 
        question: "Hoeveel Nederlanders zijn de afgelopen jaren minder vlees gaan eten om klimaatverandering tegen te gaan?",
        source: "https://www.cbs.nl/nl-nl/publicatie/2021/22/klimaatverandering-en-energietransitie tabel H6"},
    52:{
        video: "", 
        bonusrole: [4,6,2,5,1,3], 
        answers: [
            "De helft van alle Nederlanders doet dit.",  //
            "Jonge mensen doen dit vaker dan oude mensen.", 
            "De rijke Nederlanders doen dit vaker dan de armere.", 
            "!Vrouwen doen dit vaker dan mannen." 
        ],
        category: "Consumentengedrag", 
        question: "Welk deel van de Nederlanders doet eerst een warme trui aan voordat ze de verwarming hoger zetten?",
        source: "https://www.cbs.nl/nl-nl/publicatie/2021/22/klimaatverandering-en-energietransitie tabel H7"},
    53:{
        video: "", 
        bonusrole: [4,6,2,5,1,3], 
        answers: [
            "Mannen doen dit vaker dan vrouwen.",  //
            "De helft van alle Nederlanders doet dit.", 
            "Mensen op het platteland doen dit vaker dan mensen in steden.", 
            "!65-plussers doen dit vaker dan jongeren van 18 tot 25 jaar." 
        ],
        category: "Consumentengedrag", 
        question: "Wie doet altijd het licht uit in kamers waar niemand is?",
        source: "https://www.cbs.nl/nl-nl/publicatie/2021/22/klimaatverandering-en-energietransitie tabel H7"},
    54:{
        video: "", 
        bonusrole: [4,6,2,5,1,3], 
        answers: [
            "Van de 65-plussers in Nederland doen 2 op de 5 mensen dit.",  //
            "Slechts 1 op de 25 Nederlandse jongeren doet dit (18 - 25 jaar).", 
            "Er zijn evenveel mannen als vrouwen die dit doen.", 
            "!Alle bovenstaande antwoorden zijn waar." 
        ],
        category: "Consumentengedrag", 
        question: "Wie doucht er altijd korter dan 5 minuten?",
        source: "https://www.cbs.nl/nl-nl/publicatie/2021/22/klimaatverandering-en-energietransitie tabel H7"},
    56:{
        video: "", 
        bonusrole: [4,2,6,5,1,3], 
        answers: [
            "!Rijke Nederlanders doen dit twee keer zo vaak als arme Nederlanders.",  //
            "Jongeren doen dit vaker dan ouderen.", 
            "Mensen in de stad doen dit vaker dan mensen op het platteland.", 
            "Alle bovenstaande antwoorden zijn waar." 
        ],
        category: "Consumentengedrag", 
        question: "Wie neemt de auto voor afstanden van minder dan 5 km?",
        source: "https://www.cbs.nl/nl-nl/publicatie/2021/22/klimaatverandering-en-energietransitie tabel H7"},
    57:{
        video: "", 
        bonusrole: [5,2,4,6,1,3], 
        answers: [
            "Mensen van 75 jaar en ouder.",  //
            "!Vrouwen dragen vaker tweedehandskleding dan mannen.", 
            "Mensen op het platteland doen dit vaker dan mensen in de stad.", 
            "Alle bovenstaande antwoorden zijn waar." 
        ],
        category: "Kleding", 
        question: "Wie draagt het vaakst tweedehandskleding in Nederland?",
        source: "https://www.cbs.nl/nl-nl/publicatie/2021/22/klimaatverandering-en-energietransitie tabel H7"},
    58:{
        video: "", 
        bonusrole: [5,2,4,6,1,3], 
        answers: [
            "waterkracht",  //
            "aardenergie", 
            "aardwarmte", 
            "getijde" ,
            "getijde energie",
            "eb en vloed"
        ],
        category: "Basis", 
        type: 'open',
        question: "Vul naast zonne- en windenergie nog een vorm van duurzame energie in.",
        source: ""},
    59:{
        video: "", 
        bonusrole: [5,2,4,6,1,3], 
        answers: [
            "kolen",  //
            "turf", 
            "steenkolen" 
        ],
        category: "Basis", 
        type: 'open',
        question: "Vul naast olie en gas nog een vorm van fossiele brandstoffen in.",
        source: ""},
    60:{
        video: "", 
        bonusrole: [5,3,1,6,2,4], 
        answers: [
            "1 tot 2 graden Celcius",  //
            "2 tot 4 graden Celcius", 
            "!5 tot 10 graden Celcius"
        ],
        category: "Natuur", 
        question: "Met hoeveel graden kan de gevoelstemperatuur afnemen in een tuin met veel bomen ten opzichte van een tuin met alleen tegels?",
        source: "https://www.klimaathelpdesk.org/answers/wat-zijn-de-klimaateffecten-van-een-betegelde-of-groene-tuin/"},
    61:{
        video: "", 
        bonusrole: [5,3,1,6,2,4], 
        answers: [
            "1 tot 2 graden Celcius",  //
            "2 tot 4 graden Celcius", 
            "!5 tot 10 graden Celcius"
        ],
        category: "Test", 
        question: "Met hoeveel graden kan de gevoelstemperatuur afnemen in een tuin met veel bomen ten opzichte van een tuin met alleen tegels?",
        source: "https://www.klimaathelpdesk.org/answers/wat-zijn-de-klimaateffecten-van-een-betegelde-of-groene-tuin/"},
    };

    
    var rolenames = {1:"Bouwer",2:"Ondernemer",3:"Uitvinder",4:"Coach",5:"Designer",6:"Hulpverlener"};

