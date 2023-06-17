const menuEmail = document.querySelector('.navbar-email');
const desktopMenu = document.querySelector('.desktop-menu');
const shoppingCarIcon = document.querySelector('.navbar-shopping-cart')
const arrowBackIcon = document.querySelector('.arrow-left-shopping-cart')
const burgerMenu = document.querySelector('.menu')
const mobileMenu = document.querySelector('.mobile-menu');
const shoppingCartContainer = document.querySelector('.order-detail');
const productDetailContainer = document.querySelector('#productDetail');
const cardsContainer = document.querySelector('.cards-container');
const shoppingListContainer = document.querySelector('.shopping-cart-list');
const categoriesContainer = document.querySelector('.navbar-categories')
const categoriesMobileContainer = document.querySelector('.navbar-categories-mobile')
const itemsShoppignCartText = document.querySelector('.items_shoppingcart');
const totalPriceText = document.querySelector('.total-price');

menuEmail.addEventListener('click', toggleDesktopMenu)
burgerMenu.addEventListener('click', toggleMobileMenu)
shoppingCarIcon.addEventListener('click', toggleshoppingCartContainer)
arrowBackIcon.addEventListener('click', toggleshoppingCartContainer)

const API_BASE_ALL = 'https://api.escuelajs.co/api/v1/products'
const API_CATEGORYS = 'https://api.escuelajs.co/api/v1/categories/'
let API_BASE = API_BASE_ALL; 

let productList = [];
let shoppingList = [];
let loading = true;
let offset = 0;
let categoriesOfApi = [];
let categories = [
    {
        name: 'All',
        id: 0,
        isActive: true
    },
    {
        name: 'Clothes',
        id: 1,
        isActive: false
    },
    {
        name: 'Electronics',
        id: 2,
        isActive: false
    },
    {
        name: 'Furniture',
        id: 3,
        isActive: false
    },
    {
        name: 'Others',
        id: 5,
        isActive: false
    },
];

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
    productDetailContainer.innerHTML = ''

    const productItem = product;

    const iconCloseContainer = document.createElement('div')
    iconCloseContainer.classList.add('product-detail-close')
    const iconClose = document.createElement('img')
    iconClose.setAttribute('src', './icons/icon_close.png')
    iconCloseContainer.appendChild(iconClose)
    iconCloseContainer.addEventListener('click', () => closeProductDetail())

    const productImage = document.createElement('img')
    productImage.setAttribute('src', product.images[0])

    const productInfoCard = document.createElement('div')
    productInfoCard.classList.add('product-info')
    const productPrice = document.createElement('p')
    productPrice.innerText = '$' + product.price
    const productTitle = document.createElement('p')
    productTitle.innerText = product.title
    const productDescription = document.createElement('p')
    productDescription.innerText = product.description
    const btnAddProduct = document.createElement('button')
    btnAddProduct.classList.add('primary-button')
    btnAddProduct.classList.add('add-to-cart-button')
    const iconAdd = document.createElement('img')
    iconAdd.setAttribute('src', './icons/bt_add_to_cart.svg')
    btnAddProduct.innerText = 'Add to cart'
    btnAddProduct.appendChild(iconAdd)
    btnAddProduct.addEventListener('click', () => addProductToShoppingList(productItem))

    productInfoCard.appendChild(productPrice)
    productInfoCard.appendChild(productTitle)
    productInfoCard.appendChild(productDescription)
    productInfoCard.appendChild(btnAddProduct)

    productDetailContainer.appendChild(iconCloseContainer)
    productDetailContainer.appendChild(productImage)
    productDetailContainer.appendChild(productInfoCard)

    shoppingCartContainer.classList.add('inactive')
    productDetailContainer.classList.remove('inactive')
}

function closeProductDetail() {
    productDetailContainer.classList.add('inactive')
}

function addProductToShoppingList(product) {
    if(shoppingList.some(item => item.id === product.id)) {
        item = shoppingList.find(elemento => elemento.id == product.id)
        item.amount ++
    } else {
        shoppingList.push({
            ...product,
            amount: 1,
        })
    }
    
    renderShoppingList(shoppingList)
}

function subtractProductToShoppingList(product) {

    const item = shoppingList.find(elemento => elemento.id == product.id)
    item.amount --

    if(item.amount <= 0) {
        shoppingList = shoppingList.filter(el => el.id !== item.id)
    }

    renderShoppingList(shoppingList)
}

function selectCategory(categoryId) {

    categories.forEach( category => category.isActive = false)
    const item = categories.find(el => el.id == categoryId)
    item.isActive = true;
    productList = []
    offset = 0

    if(categoryId == 0 ) {
        API_BASE = API_BASE_ALL + '?offset=0&limit=10';
        getProducts(API_BASE)
        API_BASE = API_BASE_ALL
    } else {
        API_BASE = API_CATEGORYS + categoryId + '/products?offset=0&limit=10';
        getProducts(API_BASE)
        API_BASE = API_CATEGORYS + categoryId + '/products';
    }

    toggleMobileMenu()
    renderCategories(categories)
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
    categoriesContainer.innerHTML = ''
    categoriesMobileContainer.innerHTML = ''

    for (category of arr) {
        const categoryId = category.id
        const item = document.createElement('li');

        const ancla = document.createElement('a');
        ancla.setAttribute('href', '#')
        category.isActive ? ancla.classList.add('category-active') : '';
        ancla.innerText = category.name

        item.appendChild(ancla)
        item.addEventListener('click', () => selectCategory(categoryId))

        categoriesContainer.appendChild(item)
    }
    
    for (category of arr) {
        const categoryId = category.id
        const item = document.createElement('li');

        const ancla = document.createElement('a');
        ancla.setAttribute('href', '#')
        category.isActive ? ancla.classList.add('category-active') : '';
        ancla.innerText = category.name

        item.appendChild(ancla)
        item.addEventListener('click', () => selectCategory(categoryId))

        categoriesMobileContainer.appendChild(item)
    }
}

const renderShoppingList = (arr) => {

    shoppingListContainer.innerHTML = ''
    itemsShoppignCartText.innerText = arr.length;
    let totalPrice = 0;

    for (product of arr) {
        const productItem = product;

        totalPrice += product.price * product.amount;

        const itemCard = document.createElement('div');
        itemCard.classList.add('shopping-cart');

        const productFigure = document.createElement('figure');
        const productImg = document.createElement('img');
        productImg.setAttribute('src', product.images[0]);

        productFigure.appendChild(productImg);

        const title = document.createElement('p');
        title.innerText = product.title;

        const amountContainer = document.createElement('div');
        amountContainer.classList.add('amount-order');

        const subtractButton = document.createElement('button');
        subtractButton.innerText = '-';
        subtractButton.addEventListener('click', () => subtractProductToShoppingList(productItem))

        const amountText = document.createElement('p');
        amountText.innerText = product.amount;
        
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
    }

    totalPriceText.innerText = totalPrice;
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
    fetch(url)
        .then(response => response.json())
        .then(data => {
            categoriesOfApi = data
        })
}

if(window.innerWidth >= 1300 ) {
    offset = 10;
    const API = API_BASE + `?offset=${offset}&limit=10`
    getProducts(API)
}

getProducts(API_BASE_ALL + '?offset=0&limit=10') //llamado al API cuando el usuario ingresa a la pagina
renderCategories(categories)
getCategories(API_CATEGORYS)


const onScroll = () => {
    if (document.body.scrollHeight - window.innerHeight <= window.scrollY) {
        while(!loading) {
            offset += 10;
            const API = `${API_BASE}?offset=${offset}&limit=10`
            getProducts(API)
        }
    }
}
    
// llamamos a onScroll cuando el usuario hace scroll
window.addEventListener('scroll', onScroll) 