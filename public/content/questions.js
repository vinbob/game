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
        question: "Welke stelling is waar?"},
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
        question: "Hoe zorgen broeikasgassen voor klimaatverandering?"}, 
    3:{
        video: "", 
        bonusrole: [1,3,5,2,4,6], 
        answers: [
            "Dat kost (bijna) geen energie.",
            "!Ongeveer 3 Wattuur, evenveel als een gloeilamp die 3 minuten aan staat.", //https://www.klimaathelpdesk.org/answers/wat-is-de-klimaatimpact-van-chatgpt-hoeveel-co-kost-het-om-chatgpt-een-essay-over-klimaatverandering-te-laten-schrijven/
            "Ongeveer 30 Wattuur, evenveel als een magnetron die 3 minuten aan staat.",
            "Ongeveer 40 Wattuur, evenveel als een airconditioning die 3 minuten aan staat." //https://ecozo.nl/verbruik-per-type-apparaat/
        ],
        category: "Technologie" ,
        question: "Hoeveel energie kost elk bericht (prompt) van ChatGPT?"}, 
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
        question: "Hoe warm of koud zou de aarde zijn als de atmosfeer helemaal geen broeikasgassen zo bevatten?"},
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
        question: "Wat zijn de waarschijnlijke gevolgen als we komende dertig jaar niet genoeg tegen klimaatverandering doen?"},
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
        question: "Hoe kunnen we wetenschappers eigenlijk vertrouwen dat ze de waarheid spreken?"},
    8:{ 
        video: "", 
        bonusrole: [2,3,1,4,5,6], 
        answers: [
            "0 %, voedsel veroorzaakt geen uitstoot van broeikasgassen",
            "1 %, er is wel uitstoot vanwege voedsel, maar die is klein", 
            "10 %, voedsel veroorzaakt veel uitstoot, maar het is niet een van de belangrijkste oorzaken",
            "!25 %, een kwart van alle uitstoot is vanwege voedsel" 
        ],
        category: "Voedsel" ,
        question: "Hoeveel procent van alle broeikasgasuitstoot is vanwege het maken en eten van voedsel?"},
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
        question: "Welk van onderstaande uitspraken over duurzaamheid en voedsel is juist?"}, 
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
        question: "Hoeveel dragen koeien bij aan de wereldwijde uitstoot van broeikasgassen?"}, 
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
        question: "Welk drankje heeft de kleinste broeikasgasuitstoot van boer tot bord?"}, 
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
        question: "Wat is de belangrijkste factor voor het verminderen van de klimaatimpact van voedsel?"},
    13:{
        video: "", 
        bonusrole: [3,1,4,2,5,6], 
        answers: [
            "...het hele jaar door hoger zijn dan nu.",
            "...het hele jaar door lager zijn dan nu.", 
            "!...in de winter hoger en in de zomer lager zijn dan nu.",//https://www.klimaathelpdesk.org/answers/wat-is-de-verwachte-waterstand-van-de-rivieren-over-50-jaar/
            "...in de winter lager en in de zomer hoger zijn dan nu." 
        ],
        category: "Water", 
        question: "Over 50 jaar zal de waterstand in de Rijn in Nederland..."},
    14:{
        video: "", 
        bonusrole: [3,1,5,2,4,6], 
        answers: [
            "Tijdens het verkrijgen van de materialen om de smartphone te maken.", 
            "!Tijdens het produceren van de onderdelen voor de smartphone.",
            "Tijdens het gebruik van de smartphone.",//https://www.klimaathelpdesk.org/answers/wat-is-de-impact-van-onze-elektronische-apparaten-op-het-klimaat/
            "Nadat de smartphone is weggebracht naar een afvalpunt (recycling en afvalverwerking)." 
        ],
        category: "Technologie", 
        question: "Wanneer hebben smartphones de grootste impact op het klimaat?"},
    15:{
        video: "", 
        bonusrole: [3,1,5,2,4,6], 
        answers: [
            "Tijdens het verkrijgen van de materialen om de wasmachine te maken.", 
            "Tijdens het produceren van de onderdelen voor de wasmachine.",
            "!Tijdens het gebruik van de wasmachine.",//https://www.klimaathelpdesk.org/answers/wat-is-de-impact-van-onze-elektronische-apparaten-op-het-klimaat/
            "Nadat de wasmachine is weggebracht naar een afvalpunt (recycling en afvalverwerking)." 
        ],
        category: "Technologie", 
        question: "Wanneer hebben wasmachines de grootste impact op het klimaat?"},
    16:{
        video: "", 
        bonusrole: [6,4,2,5,1,3], 
        answers: [
            "Nee, rijke mensen stoten gemiddeld juist minder CO2 uit.",
            "Nee, de uitstoot is gemiddeld ongeveer hetzelfde.",
            "!Ja, omdat ze meer autorijden. ",//https://www.klimaathelpdesk.org/answers/hoe-is-de-uitstoot-in-nederland-verdeeld-tussen-rijk-en-arm/
            "Ja, omdat ze vaker uit eten gaan." 
        ],
        category: "Maatschappij", 
        question: "Stoten rijke Nederlanders gemiddeld meer CO2 uit dan arme Nederlanders?"},
    17:{
        video: "", 
        bonusrole: [5,2,3,1,4,6], 
        answers: [
            "!Alleen tweedehands kleren kopen.",//Uit: Hoe kleed ik me sexy maar toch milieubewust?
            "Bij de aankoop van kleding kiezen voor de duurzaamste materialen.",
            "Je kleren 10 graden kouder wassen.",
            "De stof van je oude kleren hergebruiken voor Andere doeleinden."
        ],
        category: "Kleding", 
        question: "Welk van deze keuzes is het meest milieubewust? "},
    18:{
        video: "", 
        bonusrole: [3,4,5,6,1,2], 
        answers: [
            "Ja, de energie die vrijkomt blijft in de atmosfeer, dus zorgt voor opwarming",
            "Ja, alle rook die vrijkomt houdt warmte van de zon vast",
            "!Nee, het heeft juist een verkoelend effect", //https://www.klimaathelpdesk.org/answers/wat-is-de-invloed-van-een-vulkaanuitbarsting-op-het-klimaat/ 
            "Nee, de hitte die vrijkomt is verwaarloosbaar"
        ],
        category: "Natuur", 
        question: "Dragen grote vulkaanuitbarstingen bij aan de opwarming van de aarde?"},
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
        question: "Waarom is het warmer worden van de aarde met een paar graden zo’n probleem?"},
    20:{
        video: "", 
        bonusrole: [5,2,3,6,1,4], 
        answers: [
            "Dierlijk leer is altijd beter.",
            "Dierlijk leer, als je het zo lang mogelijk gebruikt.",
            "Veganistisch leer is altijd beter.",
            "!Veganistisch leer, als je het zo lang mogelijk gebruikt." //https://www.klimaathelpdesk.org/answers/veganistisch-of-dierlijk-leer-wat-is-duurzamer/
        ],
        category: "Kleding", 
        question: "Wat is beter voor het milieu, een tas van dierlijk of veganistisch leer?"},
    21:{
        video: "", 
        bonusrole: [6,4,5,2,3,1], 
        answers: [
            "10%",
            "30%",
            "50%",
            "!70%" //https://www.klimaathelpdesk.org/answers/hoe-beinvloedt-klimaatverandering-het-leven-van-een-kind-dat-de-komende-tien-jaar-opgroeit-in-nederland/
        ],
        category: "Zorg", 
        question: "Hoeveel procent van de Nederlandse kinderen voelt zich bang, somber of boos over klimaatverandering?"},
    22:{
        video: "", 
        bonusrole: [6,4,5,2,3,1], 
        answers: [
            "Kinderen en jongeren verwachten actie van de overheid en het bedrijfsleven om de problemen aan te pakken.",
            "!Eén op de drie kinderen en jongeren slaapt niet goed vanwege zorgen over klimaatverandering.", //Het is tussen de 5-30%, https://www.klimaathelpdesk.org/answers/hoe-beinvloedt-klimaatverandering-het-leven-van-een-kind-dat-de-komende-tien-jaar-opgroeit-in-nederland/
            "De meeste kinderen en jongeren willen er zelf iets tegen doen, maar weten vaak niet hoe.", //https://www.nji.nl/klimaatverandering/feiten-en-cijfers
            "Kinderen en jongeren lijken ouders te stimuleren om meer te letten op hun impact op het klimaat." 
        ],
        category: "Zorg", 
        question: "Welke uitspraak over de Nederlandse jeugd en klimaatverandering is NIET waar?"},
    23:{
        video: "", 
        bonusrole: [1,2,5,3,4,6], 
        answers: [
            "100 woningen per jaar.",
            "!1.900 woningen per jaar.", //https://www.klimaathelpdesk.org/answers/produceren-we-in-nl-genoeg-hout-om-voortaan-alle-huizen-van-hout-te-bouwen/
            "10.000 woningen per jaar.",
            "50.000 woningen per jaar." 

        ],
        category: "Bouw", 
        question: "Hoeveel woningen kunnen er per jaar worden gebouwd met het naaldhout dat in Nederland wordt geproduceerd?"},
    24:{
        video: "", 
        bonusrole: [1,3,5,2,4,6], 
        answers: [
            "Het is goedkoop.",
            "Het is gemakkelijk te recyclen.", //https://www.klimaathelpdesk.org/answers/produceren-we-in-nl-genoeg-hout-om-voortaan-alle-huizen-van-hout-te-bouwen/
            "!Het helpt CO2 uitstoot te verminderen.", 
            "Het is bestand tegen brand." 
        ],
        category: "Bouw", 
        question: "Wat is een belangrijke reden om hout te gebruiken bij het bouwen van huizen?"},
    25:{
        video: "", 
        bonusrole: [2,1,4,3,5,6], 
        answers: [
            "!10%",
            "20%", //https://www.klimaathelpdesk.org/answers/produceren-we-in-nl-genoeg-hout-om-voortaan-alle-huizen-van-hout-te-bouwen/
            "50%", 
            "80%" 
        ],
        category: "Bouw", 
        question: "Hoeveel procent van het jaarlijkse houtgebruik in Nederland wordt momenteel geproduceerd in eigen land?"},
    26:{
        video: "", 
        bonusrole: [1,3,2,4,5,6], 
        answers: [
            "Plastic",
            "Baksteen", //https://www.klimaathelpdesk.org/answers/Hoe-lossen-we-het-woningbouwprobleem-op-een-klimaatvriendelijke-manier-op/
            "Naaldhout", 
            "Aluminium" 
        ],
        category: "Bouw", 
        question: "Welk materiaal is het meest klimaatvriendelijke alternatief voor beton en staal bij de bouw van woningen?"},
    27:{
        video: "", 
        bonusrole: [3,1,2,4,5,6], 
        answers: [
            "Vliegtuig",
            "!Trein", //https://www.klimaathelpdesk.org/answers/hoe-milieuonvriendelijk-is-vliegen-tegenover-trein-of-bus-met-aanleg-en-onderhoud-van-infrastructuur-meegerekend/
            "Auto", 
            "Bus" 
        ],
        category: "Technologie", 
        question: "Welke van de volgende vervoersmiddelen heeft de laagste CO2-uitstoot per gereisde kilometer per pasagier?"},
    28:{
        video: "", 
        bonusrole: [2,4,6,5,3,1], 
        answers: [
            "De trein is duurder dan het vliegtuig.",
            "!Het vliegtuig is sneller dan de trein.", //https://www.klimaathelpdesk.org/answers/hoe-milieuonvriendelijk-is-vliegen-tegenover-trein-of-bus-met-aanleg-en-onderhoud-van-infrastructuur-meegerekend/
            "Het vliegtuig is milieuvriendelijker dan de trein.", 
            "Het vliegtuig heeft meer comfortabele zitplaatsen dan de trein." 
        ],
        category: "Technologie", 
        question: "Wat is een van de belangrijkste redenen waarom mensen het vliegtuig in plaats van de trein kiezen voor lange reizen?"},
    29:{
        video: "", 
        bonusrole: [2,3,1,5,6,4], 
        answers: [
            "Windmolens kunnen geen elektriciteit opwekken bij harde wind.",
            "!Windmolens produceren veel geluid en dat is slecht voor de gezondheid van omwonenden.", //https://www.klimaathelpdesk.org/answers/zijn-windmolens-%C3%A9cht-wel-zo-duurzaam/
            "Er zijn zeldzame aardmetalen nodig voor de productie van windmolens.", 
            "Windmolens zorgen voor een daling van de verkoopprijs van huizen in de omgeving." 
        ],
        category: "Technologie", 
        question: "Wat is het grootste probleem met betrekking tot windenergie?"},
    30:{
        video: "", 
        bonusrole: [2,3,1,5,6,4], 
        answers: [
            "!De industrie.",
            "Gebouwen en woningen.", //https://www.klimaathelpdesk.org/answers/hoeveel-energie-gebruiken-we-en-wat-doen-we-er-mee/
            "Vervoer en transport.", 
            "De landbouw." 
        ],
        category: "Technologie", 
        question: "Welke sector in Nederland gebruikt de meeste energie?"},
    31:{
        video: "", 
        bonusrole: [1,3,5,2,4,6], 
        answers: [
            "Verlichting",
            "!Verwarming van ruimtes", //https://www.klimaathelpdesk.org/answers/hoeveel-energie-gebruiken-we-en-wat-doen-we-er-mee/
            "Elektriciteitsgebruik voor apparaten", 
            "Airconditioning" 
        ],
        category: "Technologie", 
        question: "Wat zorgt voor eht meeste energieverbruik in Nederlandse huizen?"},
    32:{
        video: "", 
        bonusrole: [1,2,3,4,5,6], 
        answers: [
            "!Het groeiseizoen wordt korter.", //https://www.klimaathelpdesk.org/answers/kunnen-we-straks-wel-10-miljard-monden-voeden/
            "Het groeiseizoen wordt langer.", 
            "Het groeiseizoen blijft hetzelfde.", 
            "Het groeiseizoen wordt voorspelbaarder." 
        ],
        category: "Landbouw", 
        question: " Hoe beïnvloedt klimaatverandering de lengte van het groeiseizoen van gewassen?"},
    33:{
        video: "", 
        bonusrole: [1,2,3,4,5,6], 
        answers: [
            "Kunstmest is goedkoper dan dierlijke mest.", 
            "Dierlijke mest levert te weinig stikstof in verhouding tot fosfaat.", 
            "Kunstmest is minder efficiënt in het laten groeien van gewassen.", 
            "!Dierlijke mest laat de voedingsstoffen te langzaam los voor de behoeften van groeiende gewassen." //https://www.klimaathelpdesk.org/answers/waarom-gebruiken-we-nog-kunstmest-terwijl-we-in-nederland-een-mestoverschot-hebben/ 
        ],
        category: "Landbouw", 
        question: "Waarom wordt er nog kunstmest gebruikt in Nederland, ondanks het mestoverschot?"},
    34:{
        video: "", 
        bonusrole: [3,2,1,4,5,6], 
        answers: [
            "Bosbranden leiden altijd tot een afkoeling van het klimaat.", 
            "Bosbranden verminderen de hoeveelheid CO₂ in de atmosfeer.", 
            "!Bosbranden kunnen zowel opwarmende als afkoelende effecten hebben op het klimaat.", //https://www.klimaathelpdesk.org/answers/wat-is-de-invloed-van-bosbranden-op-klimaatverandering/
            "Bosbranden hebben geen invloed op het klimaat." 
        ],
        category: "Natuur", 
        question: "Wat is een effect van bosbranden op het klimaat?"},
    35:{
        video: "", 
        bonusrole: [3,2,1,4,5,6], 
        answers: [
            "Veranderingen in de luchtvochtigheid.", 
            "!Zachte winters.", //https://www.klimaathelpdesk.org/answers/krijgen-we-door-klimaatverandering-steeds-meer-last-van-insectenplagen-zoals-bijvoorbeeld-de-eikenprocessierups/
            "Toename van bosbranden.", 
            "Vermindering van CO2-niveaus." 
        ],
        category: "Natuur", 
        question: "Welke factor heeft invloed op de timing van insectenactiviteit en kan leiden tot verstoringen in het ecosysteem?"},
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
        question: "Greta Thunberg is wereldberoemd geworden als klimaatactivist. Met welke actie is zij zo bekend geworden?"},
    37:{
        video: "", 
        bonusrole: [5,2,3,6,4,1] ,
        answers: [
            "!Je probeert de koop van een nieuwe spijkerbroek zo lang mogelijk uit te stellen door hem te repareren.", 
            "Je koopt een nieuwe spijkerbroek, maar kiest een milieuvriendelijke variant.", 
            "Je koopt een normale spijkerbroek, maar laat je oude broek recyclen.", 
            "Ja koopt een normale spijkerbroek en laat je oude broek composteren." 
        ],
        category: "Kleding", 
        question: "Wat is het beste voor het milieu om te doen als je spijkerbroek begint te slijten?"},
    38:{
        video: "", 
        bonusrole: [4,2,6,1,3,5], 
        answers: [
            "De landelijke regering in Den Haag bepaalt dit aan de hand van de vraag naar energie.", 
            "!De locatie voor windmolens moet goedgekeurd worden door de gemeentes of provincies.", //https://www.klimaathelpdesk.org/answers/hoe-wordt-in-nederland-bepaald-waar-windmolens-komen-te-staan/
            "Energiebedrijven maken deze keuze, met toestemming van de omwonenden.", 
            "Wetenschappers berekenen de beste locaties en daarna moet het kabinet daarmee instemmen." 
        ],
        category: "Maatschappij", 
        question: "Hoe wordt in Nederland bepaald waar windmolens komen te staan?"},
    39:{
            video: "", 
            bonusrole: [4,5,2,3,6,1], 
            answers: [
                "Een jaar lang één keer per week vlees in plaats van elke dag.", //530kgCO2 
                "Eén keer heen en weer naar Berlijn met de bus of trein in plaats van het vliegtuig.", //400 kgCO2 https://www.milieucentraal.nl/klimaat-en-aarde/klimaatverandering/klimaatklappers/
                "!Een jaar lang gebruik je de auto maar voor de helft, en de rest doe je met het OV of de fiets.", //1000 kgCO2 
                "Een jaar lang geen nieuwe spullen kopen, maar alleen dingen lenen (indien mogelijk)." //350 kgCO2 
            ],
            category: "Diversen", 
            question: "Waarmee bespaar je gemiddeld de meeste CO2 uitstoot?"},
    40:{
        video: "", 
        bonusrole: [4,5,2,3,6,1], 
        answers: [
            "20", 
            "103", 
            "287",  
            "!925" // 4 hectare -> 8 voetbalvelden https://www.milieucentraal.nl/klimaat-en-aarde/klimaatverandering/klimaatklappers/350  
        ],
        category: "Diversen", 
        question: "Hoeveel bomen heb je nodig om de hoeveelheid CO2 op te nemen die een Nederlands gezin gemiddeld uitstoot?"}
    
    };
    var rolenames = {1:"Bouwer",2:"Ondernemer",3:"Uitvinder",4:"Coach",5:"Designer",6:"Hulpverlener"};