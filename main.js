const menuEmail = document.querySelector('.navbar-email');
const desktopMenu = document.querySelector('.desktop-menu');
const shoppingCarIcon = document.querySelector('.navbar-shopping-cart')
const arrowBackIcon = document.querySelector('.arrow-left-shopping-cart')
const burgerMenu = document.querySelector('.menu')
const mobileMenu = document.querySelector('.mobile-menu');
const shoppingCartContainer = document.querySelector('.order-detail');
const productDetailContainer = document.querySelector('#productDetail');
const cardsContainer = document.querySelector('.cards-container');
const shoppingListContainer = document.querySelector('.shopping-cart-list')

menuEmail.addEventListener('click', toggleDesktopMenu)
burgerMenu.addEventListener('click', toggleMobileMenu)
shoppingCarIcon.addEventListener('click', toggleshoppingCartContainer)
arrowBackIcon.addEventListener('click', toggleshoppingCartContainer)

const API_PRODUCTS = 'https://api.escuelajs.co/api/v1/products?offset=0&limit=10';

let productList = [];
let shoppingList = [];
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
    const cardHTML = `
    <div class="product-detail-close" onClick="closeProductDetail()">
        <img src="./icons/icon_close.png" alt="close">
    </div>
    <img src="${product.images[0]}" alt="bike">
    <div class="product-info">
        <p>$${product.price}</p>
        <p>${product.title}</p>
        <p>${product.description}</p>
        <button class="primary-button add-to-cart-button">
            <img src="./icons/bt_add_to_cart.svg" alt="add to cart">
            Add to cart
        </button>
    </div>
    `
    productDetailContainer.innerHTML = cardHTML

    shoppingCartContainer.classList.add('inactive')
    productDetailContainer.classList.remove('inactive')
}

function closeProductDetail() {
    productDetailContainer.classList.add('inactive')
}

function addProductToShoppingList(product) {
    console.log(product);
    if(shoppingList.some(item => item.id === product.id)) {
        item = shoppingList.find(elemento => elemento.id == product.id)
        item.amount ++
    } else {
        shoppingList.push({
            ...product,
            amount: 1,
        })
    }
    console.log(shoppingList);
    
    renderShoppingList(shoppingList)
}

function subtractProductToShoppingList(product) {
    item = shoppingList.find(elemento => elemento.id == product.id)
    item.amount --

    renderShoppingList(shoppingList)
}

const  renderProducts = (arr) => {
    cardsContainer.innerHTML = ''
    for (product of arr) {
      const productItem = product;

      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
    
      // product= {name, price, image} -> product.image
      const productImg = document.createElement('img');
      productImg.setAttribute('src', product.images[0]);
      productImg.addEventListener('click', () => openProductDetail(productItem));
    
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
      productInfoFigure.addEventListener('click', () => addProductToShoppingList(productItem))
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

const renderShoppingList = (arr) => {

    shoppingListContainer.innerHTML = ''

    for (product of arr) {
        const productItem = product

        const itemCard = document.createElement('div');
        itemCard.classList.add('shopping-cart')

        const productFigure = document.createElement('figure')
        const productImg = document.createElement('img');
        productImg.setAttribute('src', product.images[0]);

        productFigure.appendChild(productImg)

        const title = document.createElement('p');
        title.innerText = product.title;

        const amountContainer = document.createElement('div');
        amountContainer.classList.add('amount-order');

        const subtractButton = document.createElement('button');
        subtractButton.innerText = '-';
        subtractButton.addEventListener('click', () => subtractProductToShoppingList(productItem))

        const amountText = document.createElement('p');
        amountText.innerText = '$' + product.amount;
        
        const addButton = document.createElement('button');
        addButton.innerText = '+';
        addButton.addEventListener('click', () => addProductToShoppingList(productItem))

        amountContainer.appendChild(subtractButton)
        amountContainer.appendChild(amountText)
        amountContainer.appendChild(addButton)

        const priceText = document.createElement('p')
        priceText.innerText = product.price * product.amount

        itemCard.appendChild(productFigure)
        itemCard.appendChild(title)
        itemCard.appendChild(amountContainer)
        itemCard.appendChild(priceText)

        shoppingListContainer.appendChild(itemCard)

        


        // cardHTML += `
        // <div class="shopping-cart">
        //   <figure>
        //     <img src="${product.images[0]}" alt="">
        //   </figure>
        //   <p>${product.title}</p>
        //   <div class="amount-order">
        //     <button>-</button>
        //     <p>${product.amount}</p>
        //     <button>+</button>
        //   </div>
        //   <p class="price-item">$${product.price * product.amount}</p>
        // </div>
        // `
        // shoppingListContainer.innerHTML = cardHTML
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

if(window.innerWidth >= 1300 ) {
    console.log("pidiendo mas productos");
    offset = 10;
    const API = `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=10`
    getProducts(API)
}

getProducts(API_PRODUCTS) //llamado al API cuando el usuario ingresa a la pagina


const onScroll = () => {
    if (document.body.scrollHeight - window.innerHeight <= window.scrollY) {
        while(!loading) {
            offset += 10;
            const API = `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=10`
            getProducts(API)
        }
    }
}
    
// llamamos a onScroll cuando el usuario hace scroll
window.addEventListener('scroll', onScroll) 