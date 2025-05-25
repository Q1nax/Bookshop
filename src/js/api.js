import bannerImg1 from '../img/slider/banner.jpg';
import bannerImg2 from '../img/slider/banner-2.jpg';
import bannerImg3 from '../img/slider/banner-3.jpg';

export let images = [{
  url: bannerImg1
}, {
  url: bannerImg2
}, {
  url: bannerImg3
}];

export const url = 'https://www.googleapis.com/books/v1/volumes';
export const apiKey = 'AIzaSyCn02SeAjNpdS15dWxdix9eUhRNCXTDyps';
export const httpRequestParam = {
  category: 'Architecture',
  startIndex: 0,
  maxResults: 6,
  langRestrict: 'en',
};

export const selectCategory = (category) => {
  let currentCategoryNode = document.querySelector('.categories__item_selected');
  let newCategoryNode = category;

  currentCategoryNode.classList.remove('categories__item_selected');
  newCategoryNode.classList.add('categories__item_selected');
};

export const getHttpRequestParam = (resetStartIndex) => {
  let currentCategoryNode = document.querySelector('.categories__item_selected');
  let currentCategoryName = currentCategoryNode.dataset.category;

  httpRequestParam.category = currentCategoryName;

  if (resetStartIndex === true) {
    httpRequestParam.startIndex = 0;
  }

  return httpRequestParam;
};

export const useRequest = (url, getParam, callback, clearNode) => {
  let link = `${url}?q="subject:${httpRequestParam.category}"&${apiKey}&printType=books&startIndex=${httpRequestParam.startIndex}&maxResults=${httpRequestParam.maxResults}&langRestrict=${httpRequestParam.langRestrict}`;

  fetch(link)
  .then(response => response.json())
  .then((data) => {
    callback(data, clearNode);
  })
  .catch(err => console.log(err.message));
};