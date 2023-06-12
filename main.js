const menuEmail = document.querySelector('.navbar-email');
const desktopMenu = document.querySelector('.desktop-menu');
const shoppingCarIcon = document.querySelector('.navbar-shopping-cart')
const burgerMenu = document.querySelector('.menu')
const mobileMenu = document.querySelector('.mobile-menu');
const aside = document.querySelector('.product-detail');
const cardsContainer = document.querySelector('.cards-container')

menuEmail.addEventListener('click', toggleDesktopMenu)
burgerMenu.addEventListener('click', toggleMobileMenu)
shoppingCarIcon.addEventListener('click', toggleAside)

function toggleDesktopMenu() {
    const isAsideClose = aside.classList.contains('inactive')

    if(!isAsideClose) {
        aside.classList.add('inactive')
    }

    desktopMenu.classList.toggle('inactive')
}

function toggleMobileMenu() {
    const isAsideClose = aside.classList.contains('inactive')

    if(!isAsideClose) {
        aside.classList.add('inactive')
    }

    
    mobileMenu.classList.toggle('inactive')
}

function toggleAside() {
    const isMobileMenuClose = mobileMenu.classList.contains('inactive')
    const isdesktopMenuClose = desktopMenu.classList.contains('inactive')
    
    if(!isMobileMenuClose) {
        mobileMenu.classList.add('inactive')
    }

    if(!isdesktopMenuClose) {
        desktopMenu.classList.add('inactive')
    }


    aside.classList.toggle('inactive')
}

const productList = [];
productList.push({
  name: 'Bike',
  price: 120,
  image: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
});
productList.push({
  name: 'Pantalla',
  price: 220,
  image: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
});
productList.push({
  name: 'Compu',
  price: 620,
  image: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
});
productList.push({
  name: 'Headsets',
  price: 120,
  image: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
});

function renderProducts(arr) {
    for (product of arr) {
        html = `
        <div class="product-card">
            <img src="${product.image}" alt="">
            <div class="product-info">
            <div>
                <p>$${product.price}</p>
                <p>${product.name}</p>
            </div>
            <figure>
                <img src="./icons/bt_add_to_cart.svg" alt="">
            </figure>
            </div>
        </div>
        `
        cardsContainer.innerHTML += html;
    }
}

renderProducts(productList)