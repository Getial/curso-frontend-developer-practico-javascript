const menuUser = document.querySelector('.navbar-user');
const desktopMenu = document.querySelector('.desktop-menu');
const shoppingCarIcon = document.querySelector('.navbar-shopping-cart')
const arrowBackIcon = document.querySelector('.arrow-left-shopping-cart')
const burgerMenu = document.querySelector('.menu')
const mobileMenu = document.querySelector('.mobile-menu');
const shoppingCartContainer = document.querySelector('.order-detail');
const productDetailContainer = document.querySelector('#productDetail');
const cardsContainer = document.querySelector('.cards-container');
const shoppingListContainer = document.querySelector('.shopping-cart-list');
const categoriesContainer = document.querySelector('.navbar-categories');
const categoriesMobileContainer = document.querySelector('.navbar-categories-mobile');
const itemsShoppignCartText = document.querySelector('.items_shoppingcart');
const totalPriceText = document.querySelector('.total-price');
const btnLogin = document.querySelector('#btn-login');
const btnSingUp = document.querySelector('.signup-button')
const emailLogin = document.querySelector('#email');
const passwordLogin = document.querySelector('#password');
const loginContainer = document.querySelector('.login-container');
const signupContainer = document.querySelector('.sign-up-container');
const footerMobileMenu = document.querySelector('.footer-mobile-menu')
const textError = document.querySelector('.container-error');

menuUser.addEventListener('click', toggleDesktopMenu)
burgerMenu.addEventListener('click', toggleMobileMenu)
shoppingCarIcon.addEventListener('click', toggleshoppingCartContainer)
arrowBackIcon.addEventListener('click', toggleshoppingCartContainer)
btnLogin.addEventListener('click', submitLogin)
btnSingUp.addEventListener('click', showFormRegister)

const API_BASE_ALL = 'https://api.escuelajs.co/api/v1/products'
const API_CATEGORYS = 'https://api.escuelajs.co/api/v1/categories/'
let API_BASE = API_BASE_ALL; 

let productList = [];
let shoppingList = [];
let loading = true;
let isLogin = false;
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
let usuarios = [
    {
        name: 'admin',
        email: 'admin@example.com',
        password: 'admin123'
    }
]
let usuarioActivo = {};
let error = ''


function comprobarInformacion () {
    if(localStorage.getItem('isLogin') == 'true') {
        isLogin = localStorage.getItem('isLogin')
        usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'))
    }
    
    if(localStorage.getItem('usuarios')) {
        usuarios = JSON.parse(localStorage.getItem('usuarios'))
    }
    
    if(isLogin == true || isLogin == 'true') {
        menuUser.innerHTML = ''
        footerMobileMenu.innerHTML = ''
        
        const nameUserText = document.createElement('p')
        nameUserText.innerText = usuarioActivo.name
        menuUser.appendChild(nameUserText)
        
        const infoLoginUser = `
        <ul>
            <li>
                <a href="#">My orders</a>
            </li>
            <li>
                <a href="#">My account</a>
            </li>
        </ul>
        
        <ul>
            <li>
                <a href="#" class="email">${usuarioActivo.name}</a>
            </li>
            <li>
                <a href="#" class="sign-out" onclick="signout()">Sign out</a>
            </li>
        </ul>
        `
        
        footerMobileMenu.innerHTML = infoLoginUser
        
        
    } else {
        menuUser.innerHTML = ''
        footerMobileMenu.innerHTML = ''
        
        const btnLoginNav = document.createElement('button')
        btnLoginNav.classList.add('primary-button')
        btnLoginNav.classList.add('login-button')
        btnLoginNav.innerText = 'Login'
        menuUser.appendChild(btnLoginNav)
        
        const btnLoginMobile = document.createElement('button')
        btnLoginMobile.classList.add('primary-button')
        btnLoginMobile.classList.add('login-button')
        btnLoginMobile.innerText = 'Login'
        btnLoginMobile.addEventListener('click', () => toggleDesktopMenu())
        footerMobileMenu.appendChild(btnLoginMobile)
    }
    desktopMenu.classList.add('inactive')
}


function toggleDesktopMenu() {
    if(isLogin == true || isLogin == 'true') {
        const isShoppingCartContainerClose = shoppingCartContainer.classList.contains('inactive')
    
        if(!isShoppingCartContainerClose) {
            shoppingCartContainer.classList.add('inactive')
        }
    
        desktopMenu.classList.toggle('inactive')
    } else {
        loginContainer.classList.remove('inactive')
        renderProducts([])
    }
    
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

function submitLogin(ev) {

    const userEmail = emailLogin.value;
    const userPassword = passwordLogin.value;

    //buscar usuario 
    const isExistUser = usuarios.find(user => user.email === userEmail)

    if(isExistUser) {
        if(userPassword === isExistUser.password) {
            getProducts(API_BASE_ALL + '?offset=0&limit=10'); //llamado al API cuando el usuario ingresa a la pagina
            isLogin = true;
            usuarioActivo = isExistUser

            localStorage.setItem('isLogin', isLogin)
            localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo))
            loginContainer.classList.add('inactive');

            emailLogin.value = ''
            passwordLogin.value = ''
            error = ''
            
            comprobarInformacion();
        } else {
            error = "contraseña incorrecta"
        }
    } else {
        error = "el usuario no existe"
    }
    textError.innerText = error

}

function showFormRegister() {
    loginContainer.classList.add('inactive')
    signupContainer.classList.remove('inactive')
}

function closeLoginContainer() {
    emailLogin.value = ''
    passwordLogin.value = ''
    error = ''
    textError.innerText = error;
    loginContainer.classList.add('inactive')
    renderProducts(productList)
}

function closeSignUpContainer() {
    error = ''
    textError.innerText = error;
    loginContainer.classList.remove('inactive')
    signupContainer.classList.add('inactive')
}

function createAcount(ev) {
    ev.preventDefault();
    const newUserName = ev.target.form[0].value;
    const newUserEmail = ev.target.form[1].value;
    const newUserPassword = ev.target.form[2].value;
    const newConfirmPassword = ev.target.form[3].value;

    //comprobar que el correo no este en uso ya
    const isExistUser = usuarios.find(user => user.email === newUserEmail)

    if(isExistUser) {
        error = "Este correo ya esta siendo usado en otra cuenta"
    } 
    else if (newUserPassword !== newConfirmPassword) {
        error = "La contraseña no coincide"
    }
    else {
        for(i = 0; i < 4; i++) {
            console.log(ev.target.form[i].value );
            ev.target.form[i].value = ''
        }
        const newUser = {
            name: newUserName,
            email: newUserEmail,
            password: newUserPassword
        }
        usuarios.push(newUser)
        usuarioActivo = newUser;

        isLogin = true;
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo))
        localStorage.setItem('usuarios', JSON.stringify(usuarios))
        localStorage.setItem('isLogin', isLogin)

        error = ''
        signupContainer.classList.add('inactive')
        renderProducts(productList)
        comprobarInformacion()
    }
    textError.innerText = error

}

function signout() {
    isLogin = false;
    localStorage.setItem('isLogin', isLogin)
    localStorage.removeItem('usuarioActivo')
    comprobarInformacion()
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
comprobarInformacion()

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