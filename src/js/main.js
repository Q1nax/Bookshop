import { url, httpRequestParam, selectCategory, getHttpRequestParam, useRequest } from './api.js';
import { renderBooksList, setCartIcon, initSlider, initCartHandlers } from './ui.js';

const loadButton = document.querySelector('.btn-load');
const categories = document.querySelectorAll('.categories__item');

let sliderOption = {
  titles: false,
  dots: true,
  autoplay: true,
  autoplayInterval: 5000
};

categories.forEach(category => category.addEventListener('click', (event) => {
  event.preventDefault();

  selectCategory(category);

  const getParam = getHttpRequestParam(true);

  useRequest(url, getParam, renderBooksList, true);
}));

loadButton.addEventListener('click', () => {
  const getParam = getHttpRequestParam();

  getParam.startIndex += 6;

  useRequest(url, getParam, renderBooksList, false);
});

document.addEventListener('DOMContentLoaded', function() {
  initSlider(sliderOption);
  setCartIcon(localStorage.length);
  initCartHandlers();
  useRequest(url, httpRequestParam, renderBooksList, false);
});