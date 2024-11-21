let map;
let marker;
let geocoder;
let lng;
let lat;
const API_KEY_SOLAR = "AIzaSyCINviyi8nkumxVcs6vKge4eLKY_1X4D9M"

window.initMap = function () {
    const initialLocation = { lat: -14.235004, lng: -51.92528 };


    map = new google.maps.Map(document.getElementById("map"), {
        center: initialLocation,
        zoom: 5,
    });

    geocoder = new google.maps.Geocoder();

    marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
    });

    setupSearch();
};


function setupSearch() {
    $('#pesquisar-button').on("click", function() {
        const endereco = $("#endereco").val();
        if (endereco) {
            geocoderEndereco(endereco);
        } else {
            alert("Por favor, insira um endereço.");
        }
    });
}


function solarData(lat,lng,API_KEY_SOLAR){
    const url = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${API_KEY_SOLAR}`
    $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        success: function(data){
            console.log("Dados Recebidos",data)
            $("#max-paineis").text(data.solarPotential.maxArrayPanelsCount);
            $("#solar-incidencia").text(Math.floor((data.solarPotential.maxSunshineHoursPerYear * 1000) / 1000) + " hr");
            $("#area-total").text(Math.floor((data.solarPotential.buildingStats.areaMeters2 * 1000) /1000 ) + " m^2");
            const co2SavingsPerMwh = data.solarPotential.carbonOffsetFactorKgPerMwh || 0;
            const solarPanelConfigs = data.solarPotential.solarPanelConfigs;
            const annualEnergy = solarPanelConfigs?.at(-1)?.yearlyEnergyDcKwh || 0; 
            const panelCapacityWatts = data.solarPotential.panelCapacityWatts || 0; // Capacidade de watts do painel
            $("#co2-savings").text(co2SavingsPerMwh.toFixed(2) + " kg"); 
            $("#energia-anual").text(annualEnergy.toFixed(2) + " kWh"); 
            $("#energia-coberta").text(panelCapacityWatts.toFixed(2) + "Watts"); 
        },
        error: function(xhr, status, error) {
            console.log("Erro na requisição:", error);
            console.log("Status HTTP:", xhr.status);
            console.log("Mensagem de erro:", xhr.responseText);
        }
    })
}
function geocoderEndereco(endereco) {
    geocoder.geocode({ address: endereco }, function(results, status) {
        if (status === "OK") {
            const location = results[0].geometry.location;

            lng = location.lng();
            lat = location.lat();
            map.setCenter(location);
            map.setZoom(15);

            marker.setPosition(location);

            solarData(lat,lng,API_KEY_SOLAR);
            alert(`Endereço encontrado: ${results[0].formatted_address}`);
        } else {
            alert("Geocoding falhou: " + status);
        }
    });
}
