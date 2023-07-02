import { el, setChildren } from 'redom';
import { getBanks } from './api.js';

export async function createBanksSection() {
  const script = document.createElement('script');
  script.src = "https://api-maps.yandex.ru/2.1/?apikey=<ваш API-ключ>&lang=ru_RU";
  document.body.appendChild(script);
  const section = el('section.banks');
  const top = el('div.main__top');
  const h2 = el('h2.title', 'Карта банкоматов');
  const map = el('div', { id: 'map', style: "width: 1340px; height: 728px" })


  setChildren(top, h2);
  setChildren(section, [top, map]);

  getBanks().then(banks => {
    ymaps.ready(init);
    function init() {
      // Создание карты.
      var myMap = new ymaps.Map("map", {
        center: [55.7522, 37.6156],
        zoom: 10
      });

      for (let place of banks.payload) {
        let myPlacemark = new ymaps.Placemark([place.lat, place.lon], {}, {
          geometry: {
            type: "Point",
          },
        });
        myMap.geoObjects.add(myPlacemark);
      }

    }
  })
    .catch(error => console.log(error))
  return section;
}



