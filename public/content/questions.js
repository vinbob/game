var rolenames = {1:"Bouwer",2:"Ondernemer",3:"Uitvinder",4:"Coach",5:"Designer",6:"Hulpverlener"};
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
        bonusrole: [5,4,6,2,1,3], 
        answers: [
            "...het hele jaar door hoger zijn dan nu.",
            "...het hele jaar door lager zijn dan nu.", 
            "!...in de winter hoger en in de zomer lager zijn dan nu.",//https://www.klimaathelpdesk.org/answers/wat-is-de-verwachte-waterstand-van-de-rivieren-over-50-jaar/
            "...in de winter lager en in de zomer hoger zijn dan nu." 
        ],
        category: "Water", 
        question: "Over 50 jaar zal de waterstand in de Rijn in Nederland..."}
    };