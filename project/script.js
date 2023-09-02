// Az "Access Token" mezőt keresi meg az oldalon és elmenti a változóba.
const accessTokenInput = document.getElementById('accessToken');

// A "Lekérdezés és Letöltés" gombot keresi meg az oldalon és elmenti a változóba.
const fetchAndSaveButton = document.getElementById('fetchAndSavePushes');

// Egy számláló változót hoz létre a lekérések számának nyomon követésére.
let numberOfRequests = 0;

// Az oldalon megjelenő lekérések számát megjelenítő elemet keresi meg és elmenti a változóba.
const requestCounter = document.getElementById('numberOfRequests');

// Ez a függvény hajtja végre a lekérést és a letöltést, amikor a gombot megnyomják.
function fetchAndSavePushes() {
    // Beolvassa az "Access Token" mező értékét és eltávolítja a szóközöket (ha vannak).
    const accessToken = accessTokenInput.value.trim();

    // Ellenőrzi, hogy van-e érvényes "Access Token". Ha nincs, megjelenik egy figyelmeztető ablak, és a függvény leáll.
    if (!accessToken) {
        alert('Kérlek adj meg egy érvényes tokent.');
        return;
    }

    // Az API végpont URL-je, ahonnan lekérdezni fogja az értesítéseket.
    const apiUrl = 'https://api.pushbullet.com/v2/pushes';

    // Az HTTP fejlécek, amiket a kéréshez hozzáad, beleértve az "Access-Token"-t és a "Content-Type"-t.
    const headers = {
        'Access-Token': accessToken,
        'Content-Type': 'application/json',
    };

    // Axios segítségével egy HTTP GET kérést indít az API végpont felé a megadott fejlécekkel.
    // Az axios a html fájból van importálva referenciaként.
    axios.get(apiUrl, { headers })
        .then((response) => {
            // Ha a kérés sikeres, a válaszban kapott értesítéseket JSON formátumban letölti.
            const pushesData = response.data.pushes;
            const jsonBlob = new Blob([JSON.stringify(pushesData, null, 2)], { type: 'application/json' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(jsonBlob);
            downloadLink.download = 'pushes.json';
            downloadLink.click();

        })
        .catch((error) => {
            // Ha hiba történik a lekérdezés során, megjelenik egy hibaüzenet.
            alert('Hiba a lekérdezés során: ' + error.message);
        });

    // Növeli a lekérések számát egy egységgel.
    numberOfRequests++;

    // Frissíti az oldalon megjelenő lekérések számát.
    requestCounter.innerText = numberOfRequests.toString();
}

// Hozzárendeli a "Lekérdezés és Letöltés" gombhoz a függvényt, hogy a gombra kattintva a lekérdezés és letöltés elinduljon.
fetchAndSaveButton.addEventListener('click', fetchAndSavePushes);
