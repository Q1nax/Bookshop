import noImage from "../img/no_photo.png";
import ratingStarFilled from "../img/icons/star-filled.svg";
import ratingStar from "../img/icons/star.svg";
import { images } from './api.js';

const cart = document.querySelector('.cart-count');

export const setCartIcon = (count) => {
  if (localStorage.length) {
    cart.classList.remove('cart-btn__count_empty');
    cart.textContent = count;
  }
};

const addInCart = (target, count) => {
  target.innerHTML = 'In the cart';
  target.classList.add('btn_in-cart');
  cart.classList.remove('cart-btn__count_empty');
  cart.textContent = count;
};

const deleteFromCart = (target, count) => {
  target.innerHTML = 'Buy now';
  target.classList.remove('btn_in-cart');
  if (count === 0) {
    cart.classList.add('cart-btn__count_empty');
  }
  cart.textContent = count;
};

const checkCartContents = (button) => {
  if (localStorage.length) {
    for(let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key === button.dataset.bookid) {
        button.innerHTML = 'In the cart';
        button.classList.add('btn_in-cart');
      }
    }
  }
};

export const initCartHandlers = () => {
  const targetNode = document.querySelector('.product-list');
  
  targetNode.addEventListener('click', (event) => {
    if (!event.target.classList.contains('buy-button')) return;
    
    const targetBook = event.target.parentElement.parentElement;
    const bookInfo = {
      id: '',
      thumbnail: '',
      author: '',
      title: '',
      description: '',
      price: '',
    };

    for (let key in bookInfo) {
      let node = targetBook.querySelector(`[data-book-info = "${key}"]`);

      if (node && key === 'id') {
        bookInfo[key] = node.dataset.bookid;
      } else if (node && key === 'thumbnail') {
        bookInfo[key] = node.getAttribute('src');
      } else if (node) {
        bookInfo[key] = node.textContent;
      }
    }

    if (event.target.classList.contains('btn_in-cart')) {
      const bookId = targetBook.querySelector('[data-book-info="id"]').dataset.bookid;
      localStorage.removeItem(bookId);
      deleteFromCart(event.target, localStorage.length);
    } else {
      localStorage.setItem(bookInfo.id, JSON.stringify(bookInfo));
      addInCart(event.target, localStorage.length);
    }
  });
};

export const renderBooksList = (data, clearNode) => {
  let targetNode = document.querySelector('.product-list');

  if (clearNode) {
    targetNode.innerHTML = '';
  }

  data.items.forEach(item => {
  
    let thumbnailData = null;
    let bookId = item.id;
  
    let authorsNode ='';
    let titleNode = '';
    let ratingNode = '';
    let descriptionNode = '';
    let priceNode = '';
    let productHtml = '';

    if (item.volumeInfo.imageLinks) {
      thumbnailData = item.volumeInfo.imageLinks.thumbnail;
    } else {
      thumbnailData = noImage;
    }

    if (item.volumeInfo.authors) {
      let authorsListData = item.volumeInfo.authors;
      let output = '';

      authorsListData.forEach((item, index, arr) => {
        if (index === arr.length - 1) {
          output += `${item}`;
        } else {
          output += `${item}, `;
        }
      });

      authorsNode = `<p class="product__author" data-book-info="author">${output}</p>`;
    }

    if (item.volumeInfo.title) {
      let titleData = item.volumeInfo.title;
      titleNode = `<h1 class="product__title" data-book-info="title">${titleData}</h1>`;
    }

    if (item.volumeInfo.averageRating) {
      let ratingsCountData = item.volumeInfo.ratingsCount;
      ratingNode = `<div class="product__rating">
                      <div class="rating__stars">
                        <img src=${ratingStarFilled} alt="Icon" class="star">
                        <img src=${ratingStarFilled} alt="Icon" class="star">
                        <img src=${ratingStarFilled}  alt="Icon" class="star">
                        <img src=${ratingStar}  alt="Icon" class="star">
                        <img src=${ratingStar}  alt="Icon" class="star">
                      </div>
                      <span class="review-nums">${ratingsCountData} review</span>
                    </div>`;
    }

    if (item.volumeInfo.description && item.volumeInfo.description.length > 90) {
      let descriptionData = item.volumeInfo.description;
      let description = descriptionData.slice(0, 91) + '...';
      descriptionNode = `<p class="product__description" data-book-info="description">${description}</p>`;
    } else if (item.volumeInfo.description) {
      let descriptionData = item.volumeInfo.description;
      descriptionNode = `<p class="product__description" data-book-info="description">${descriptionData}</p>`;
    }

    if (item.saleInfo.listPrice) {

      let priceData = item.saleInfo.listPrice.amount;
      const currency = 98;
      let priceValue = Math.floor(priceData * 100 / currency) / 100;

      priceNode = `<div class="product__price">
                    <span class="price__currency">$</span><span class="price__value" data-book-info="price">${priceValue}</span>
                  </div>`;
    }

    productHtml = `<div class="products-list__item product">
                      <img src="${thumbnailData}" alt="Book cover" class="product__img" data-book-info="thumbnail">
                      <div class="product__card">
                        ${authorsNode}
                        ${titleNode}
                        ${ratingNode}
                        ${descriptionNode}
                        ${priceNode}
                        <button class="btn buy-button" data-book-info="id" data-bookid="${bookId}">Buy now</button>
                      </div>
                    </div>`;

    targetNode.insertAdjacentHTML('beforeend', productHtml);
  });

  const buyButtons = document.querySelectorAll('.buy-button');
  buyButtons.forEach(button => checkCartContents(button));
};

export function initSlider(options) {
  if (!images || !images.length) return;

  options = options || {
    titles: true,
    dots: true,
    autoplay: false
  };

  let sliderImages = document.querySelector('.slider__images');
  let sliderDots = document.querySelector('.slider__dots');

  initImages();

  if (options.dots) {
    initDots();
  }

  if (options.titles) {
    initTitles();
  }

  if (options.autoplay) {
    initAutoplay();
  }

  function initImages() {
    images.forEach((image, index) => {
      let imageDiv = `<div class="image n${index} ${index === 0 ? "active" : "" }" style="background-image:url(${images[index].url})" data-index="${index}"></div>`;

      sliderImages.innerHTML += imageDiv;
    });
  }

  function initDots() {
    images.forEach((image, index) => {
      let dotItem = `<div class="slider__dots-item n${index} ${index === 0 ? "active" : ""}" data-index="${index}"></div>`;

      sliderDots.innerHTML += dotItem;
    });

    sliderDots.querySelectorAll('.slider__dots-item').forEach(dot => {
        dot.addEventListener('click', event => {
          let currentDot = event.target.dataset.index;

          moveSlider(currentDot);
        });
    });
  }

  function initTitles() {
    let titleDiv = `<div class="slider__images-title">${images[0].title}</div>`;

    sliderImages.innerHTML += titleDiv;
  }

  function changeTitle(num) {
    if (!images[num].title) return;
    let sliderTitle = sliderImages.querySelector('.slider__images-title');

    sliderTitle.innerText = images[num].title;
  }

  function initAutoplay() {
    setInterval(() => {
      let currentNum = +sliderImages.querySelector('.active').dataset.index;
      let nextNum = currentNum === images.length - 1 ? 0 : currentNum + 1;

      moveSlider(nextNum);
    }, options.autoplayInterval);
  }

  function moveSlider(num) {
    sliderImages.querySelector('.active').classList.remove('active');
    sliderImages.querySelector('.n' + num).classList.add('active');

    if (options.dots) {
      sliderDots.querySelector('.active').classList.remove('active');
      sliderDots.querySelector('.n' + num).classList.add('active');
    }

    if (options.titles) changeTitle(num);
  }
}