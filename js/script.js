// Список товаров на случай, если products.json не загрузится.
// Так бывает, когда страницу открыли двойным кликом, без локального сервера.
const FALLBACK = [
  { id: 1, title: "Эфиопия Иргачеффе", farm: "Кооператив Конга, мытая обработка", note: "Лимон, чёрный чай, в остывшем чувствуется абрикос. Самый яркий лот из тех, что сейчас на складе.", category: "Моносорт", weight: "250 г", lot: "Лот 24", altitude: "1900 м", price: 890, left: 12, img: "assets/img/ethiopia.svg" },
  { id: 2, title: "Колумбия Уила", note: "Молочный шоколад, грецкий орех, мягкая кислотность.", category: "Моносорт", weight: "250 г", lot: "Лот 08", altitude: "1750 м", price: 790, left: 7, img: "assets/img/colombia.svg" },
  { id: 3, title: "Бразилия Серрадо", note: "Карамель, фундук, плотное тело. Хорошо держит молоко.", category: "Моносорт", weight: "250 г", lot: "Лот 41", altitude: "1100 м", price: 690, left: 24, img: "assets/img/brazil.svg" },
  { id: 4, title: "Кения Ньери", note: "Чёрная смородина, грейпфрут. Кислотность высокая, на любителя.", category: "Моносорт", weight: "250 г", lot: "Лот 03", altitude: "1850 м", price: 950, left: 3, img: "assets/img/kenya.svg" },
  { id: 5, title: "Гватемала Антигуа", note: "Какао, сухофрукты, немного специй в послевкусии.", category: "Моносорт", weight: "250 г", lot: "Лот 17", altitude: "1600 м", price: 850, left: 0, img: "assets/img/guatemala.svg" },
  { id: 6, title: "Перу Кахамарка", note: "Миндаль, зелёное яблоко. Органика, сертификат на складе.", category: "Моносорт", weight: "250 г", lot: "Лот 12", altitude: "1800 м", price: 740, left: 15, img: "assets/img/peru.svg" },
  { id: 7, title: "Смесь «Утро»", note: "Бразилия и Колумбия поровну. Прощает ошибки в рецепте.", category: "Бленд", weight: "10 дрип-пакетов", lot: "Партия 09", altitude: "", price: 620, left: 31, img: "assets/img/morning.svg" },
  { id: 8, title: "Мексика без кофеина", note: "Обработка водой, без химии и без характерной горечи.", category: "Без кофеина", weight: "200 г", lot: "Лот 05", altitude: "1400 м", price: 700, left: 9, img: "assets/img/decaf.svg" }
];

let products = [];

const catalogTop = document.getElementById("catalogTop");
const catalogBottom = document.getElementById("catalogBottom");

function formatPrice(value) {
  return value.toLocaleString("ru-RU") + " ₽";
}

// Рисуем каталог

function makeFlag(product) {
  if (product.left === 0) {
    return '<span class="flag flag-out">нет в наличии</span>';
  }
  if (product.left <= 5) {
    return '<span class="flag">осталось ' + product.left + "</span>";
  }
  return "";
}

function makeCard(product, big) {
  let cardClass = "card";
  if (big) {
    cardClass += " card-big";
  }
  if (product.left === 0) {
    cardClass += " card-out";
  }

  let specs = product.lot;
  if (product.altitude) {
    specs += " · " + product.altitude;
  }

  let lead = "";
  let farm = "";
  if (big) {
    lead = "Выбор обжарщика · ";
    farm = '<p class="card-farm">' + product.farm + "</p>";
  }

  let button =
    '<button class="button add" type="button" data-id="' +
    product.id +
    '">Добавить в корзину</button>';
  if (product.left === 0) {
    button = '<button class="button button-off" type="button" disabled>Закончился</button>';
  }

  return `
    <li class="${cardClass}">
      <div class="card-media">
        <img class="card-image" src="${product.img}" alt="Пачка кофе ${product.title}">
        ${makeFlag(product)}
      </div>
      <div class="card-body">
        <p class="meta">${lead}${product.category} · ${product.weight}</p>
        <h3 class="card-title">${product.title}</h3>
        ${farm}
        <p class="card-note">${product.note}</p>
        <p class="meta dim">${specs}</p>
        <div class="card-bottom">
          <span class="card-price">${formatPrice(product.price)}</span>
          ${button}
        </div>
      </div>
    </li>
  `;
}

// Первый товар идёт крупной карточкой на две колонки, рядом с ним один обычный.
// Вместе они занимают одну строку сетки, остальные шесть идут ниже.
function showCatalog() {
  let top = "";
  let bottom = "";

  for (let i = 0; i < products.length; i++) {
    if (i === 0) {
      top += makeCard(products[i], true);
    } else if (i === 1) {
      top += makeCard(products[i], false);
    } else {
      bottom += makeCard(products[i], false);
    }
  }

  catalogTop.innerHTML = top;
  catalogBottom.innerHTML = bottom;
}

// Старт

function start() {
  showCatalog();
}

fetch("products.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    products = data;
    start();
  })
  .catch(function () {
    products = FALLBACK;
    start();
  });
