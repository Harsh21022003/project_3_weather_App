const tabcontainer=document.querySelector(".tab-container");
const usertab=document.querySelector("[data-yourWeather]");
const searchweather=document.querySelector("[data-searchWeather]");
const grantaccess=document.querySelector("[data-grantAccess]");
const searchform=document.querySelector("[data-searchform]");
const searchinput=document.querySelector("[data-searchInput]");
const usercontainer=document.querySelector(".user-information");
const grantlocationcontainer=document.querySelector(".grant-location-container");
const formcontainer=document.querySelector(".form-container");
const loadingcontainer=document.querySelector(".loading-container");
const userinfocontainer=document.querySelector(".user-info-conatiner");
const searchbtn = document.querySelector("[data-searchbtn]");

let currentTab = usertab;
const API_KEY="3b7a2eca0427888fee184b3ab2ba3b47";
currentTab.classList.add("current-tab");
getfromsessionstorage();

function switchtab(clickedtab){
    if(clickedtab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedtab;
        currentTab.classList.add("current-tab");
        if(!searchform.classList.contains("active")){
            userinfocontainer.classList.remove("active");
            grantlocationcontainer.classList.remove("active");
            searchform.classList.add("active");
        }
        else{
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active");
            getfromsessionstorage();
        }

    }
}

usertab.addEventListener('click',()=>{
    switchtab(usertab);
});
searchweather.addEventListener('click',()=>{
    switchtab(searchweather);
});

function getfromsessionstorage(){
    const localcoordinates = sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        grantlocationcontainer.classList.add("active");
    }
    else{
        const coordinates= JSON.parse(localcoordinates);
        fetchuserweatherinfo(coordinates);
    }
}
async function fetchuserweatherinfo(coordinates){
    const {lat,lon}=coordinates;
    grantlocationcontainer.classList.remove("active");
    loadingcontainer.classList.add("active");
    try{
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
          const data = await res.json();
          loadingcontainer.classList.remove("active");
          userinfocontainer.classList.add("active");
          renderweatherinfo(data);
    }
    catch(err){
          loadingcontainer.classList.add("active");
          //or bhi kuch karege
    }
}

function renderweatherinfo(weatherinfo){
    const cityname = document.querySelector("[data-cityName]");
    const countryicon = document.querySelector("[data-countryicon]");
    const weatherdescription = document.querySelector("[data-weatherdescription]");
    const weathericon = document.querySelector("[data-weathericon]");
    const temperatur = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");
    

    cityname.innerText = weatherinfo?.name;
    countryicon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    weatherdescription.innerText = weatherinfo?.weather?.[0]?.description;
    weathericon.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    temperatur.innerText = `${weatherinfo?.main?.temp}°C`;
    windspeed.innerText = weatherinfo?.wind?.speed;
    humidity.innerText = weatherinfo?.main?.humidity;
    cloudiness.innerText = weatherinfo?.clouds?.all;

}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('No location found !!');
    }
}

function showPosition(position){
    const usercoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates));
    fetchuserweatherinfo(usercoordinates);
}

grantaccess.addEventListener("click",getLocation);


searchbtn.addEventListener("click",(e)=>{
    e.preventDefault();
    let city = searchinput.value;
    
    if(city===""){
        return;
    }
    else{
        fetchsearchweatherinfo(city);
    }
    
})
async function fetchsearchweatherinfo(city){
    loadingcontainer.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantlocationcontainer.classList.remove("active");
    try{
        const res =await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        loadingcontainer.classList.remove("active");
        userinfocontainer.classList.add("active");
        grantlocationcontainer.classList.remove("active");
        renderweatherinfo(data);
    }
    catch(err){
        alert("NO SUCH CITY FOUND!!");
    }
    
}
// fetchsearchweatherinfo('goa');


