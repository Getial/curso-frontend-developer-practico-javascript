const menuEmail = document.querySelector('.navbar-email');
const desktopMenu = document.querySelector('.desktop-menu');
const shoppingCarIcon = document.querySelector('.navbar-shopping-cart')
const arrowBackIcon = document.querySelector('.arrow-left-shopping-cart')
const productDetailClose = document.querySelector('.product-detail-close')
const burgerMenu = document.querySelector('.menu')
const mobileMenu = document.querySelector('.mobile-menu');
const shoppingCartContainer = document.querySelector('.order-detail');
const productDetailContainer = document.querySelector('#productDetail');
const cardsContainer = document.querySelector('.cards-container')
const categoriesContainer = document.querySelector('.navbar-categories')

menuEmail.addEventListener('click', toggleDesktopMenu)
burgerMenu.addEventListener('click', toggleMobileMenu)
shoppingCarIcon.addEventListener('click', toggleshoppingCartContainer)
productDetailClose.addEventListener('click', closeProductDetail)
arrowBackIcon.addEventListener('click', toggleshoppingCartContainer)

const API_PRODUCTS = 'https://api.escuelajs.co/api/v1/products?offset=0&limit=10';
const API_CATEGORIES = 'https://api.escuelajs.co/api/v1/categories'

let productList = [];
let categories = [];
let loading = true;
let offset = 0;

function toggleDesktopMenu() {
    const isShoppingCartContainerClose = shoppingCartContainer.classList.contains('inactive')

    if(!isShoppingCartContainerClose) {
        shoppingCartContainer.classList.add('inactive')
    }

    desktopMenu.classList.toggle('inactive')
}

function toggleMobileMenu() {
    const isShoppingCartContainerClose = shoppingCartContainer.classList.contains('inactive')

    if(!isShoppingCartContainerClose) {
        shoppingCartContainer.classList.add('inactive')
    }


    productDetailContainer.classList.add('inactive')
    
    mobileMenu.classList.toggle('inactive')
}

function toggleshoppingCartContainer() {
    const isMobileMenuClose = mobileMenu.classList.contains('inactive')
    const isdesktopMenuClose = desktopMenu.classList.contains('inactive')
    const isProductDetailContainerClose = productDetailContainer.classList.contains('inactive')

    
    if(!isMobileMenuClose) {
        mobileMenu.classList.add('inactive')
    }

    if(!isdesktopMenuClose) {
        desktopMenu.classList.add('inactive')
    }

    if(!isProductDetailContainerClose) {
        productDetailContainer.classList.add('inactive')
    }


    shoppingCartContainer.classList.toggle('inactive')
}

function openProductDetail(product) {
    shoppingCartContainer.classList.add('inactive')
    productDetailContainer.classList.remove('inactive')

}

function closeProductDetail() {
    productDetailContainer.classList.add('inactive')
}

const  renderProducts = (arr) => {
    for (product of arr) {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
    
      // product= {name, price, image} -> product.image
      const productImg = document.createElement('img');
      productImg.setAttribute('src', product.images[0]);
      productImg.addEventListener('click', openProductDetail);
    
      const productInfo = document.createElement('div');
      productInfo.classList.add('product-info');
    
      const productInfoDiv = document.createElement('div');
    
      const productPrice = document.createElement('p');
      productPrice.innerText = '$' + product.price;
      const productName = document.createElement('p');
      productName.innerText = product.title;
    
      productInfoDiv.appendChild(productPrice);
      productInfoDiv.appendChild(productName);
    
      const productInfoFigure = document.createElement('figure');
      const productImgCart = document.createElement('img');
      productImgCart.setAttribute('src', './icons/bt_add_to_cart.svg');
    
      productInfoFigure.appendChild(productImgCart);
    
      productInfo.appendChild(productInfoDiv);
      productInfo.appendChild(productInfoFigure);
    
      productCard.appendChild(productImg);
      productCard.appendChild(productInfo);
    
      cardsContainer.appendChild(productCard);
    }
  }

const renderCategories = (arr) => {
    for (category of arr) {
        const item = document.createElement('li');

        const ancla = document.createElement('a');
        ancla.setAttribute('href', '/')
        ancla.innerText = category.name

        item.appendChild(ancla)

        categoriesContainer.appendChild(item)
    }
}

const getProducts = (url) => {
    loading = true
    fetch(url)
        .then(response => response.json())
        .then(data => {
            productList = [
                ...productList,
                ...data
            ]
            loading = false;
            renderProducts(productList)
        })
}

const getCategories = (url) => {
    loading = true
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // categories = data
            renderCategories(data)
            loading = false;
        })
}

getProducts(API_PRODUCTS) //llamado al API cuando el usuario ingresa a la pagina
getCategories(API_CATEGORIES)

const onScroll = () => {
    if (document.body.scrollHeight - window.innerHeight <= window.scrollY) {
        while(!loading) {
            offset += 10;
            const API = `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=10`
            getProducts(API)
            console.log('estoy en el final del scroll')
        }
    }
}
    
// llamamos a onScroll cuando el usuario hace scroll
window.addEventListener('scroll', onScroll) 