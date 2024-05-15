const regionSelect = document.getElementById('region-select');
const departementSelect = document.getElementById('departement-select');
const displayBtn = document.getElementById('display-btn');
const communeContainer = document.getElementById('commune-container');

const fetchData = async () => {
    try {
        const resRegion = await fetch('https://geo.api.gouv.fr/regions');
        const dataRegion = await resRegion.json();
        const resDepartement = await fetch('https://geo.api.gouv.fr/departements');
        const dataDepartement = await resDepartement.json();

        addToSelect(dataRegion, dataDepartement);

    } catch(err) {
        console.log(err);
    }
};

const addToSelect = (regions, departements) => {
    regions.forEach((region) => {
        const option = document.createElement('option');
        option.value = region.code; 
        option.textContent = region.nom;
        regionSelect.appendChild(option);
    });

    regionSelect.addEventListener('change', () => {
        const selectedRegionCode = regionSelect.value; 
        departementSelect.innerHTML = ''; 

        departements.forEach((depa) => {
            if (depa.codeRegion === selectedRegionCode) {
                const option = document.createElement('option');
                option.value = depa.code;
                option.textContent = depa.nom;
                departementSelect.appendChild(option);
            }
        });
    });
};

fetchData();

displayBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const selectedDepartementCode = departementSelect.value;
    const communeUrl = `https://geo.api.gouv.fr/departements/${selectedDepartementCode}/communes`;
    
    try {
        const resCommune = await fetch(communeUrl);
        const dataCommune = await resCommune.json();
        dataCommune.sort((a, b) => b.population - a.population);
        // Display communes in the communeContainer
        communeContainer.innerHTML = '';
        dataCommune.forEach((commune) => {
            const communeElement = document.createElement('li');
            communeElement.textContent = `${commune.nom} - Population: ${commune.population}`;
            communeContainer.appendChild(communeElement);
        });
    } catch(err) {
        console.log(err);
        alert('Communes non trouvées');
    }
});