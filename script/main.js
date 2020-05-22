

const BASE_URL = `http://localhost:3000/api/v1`

const Session = {
    create(params) {
        return fetch(`${BASE_URL}/session`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        }).then((res) => {
            return res.json();
        })
    }
}


const Product = {
    index() {
        return fetch(`${BASE_URL}/products`, {
            credentials: 'include'
        }).then(res => {
            return res.json();
        })
    },

    get(id) {
        return fetch(`${BASE_URL}/products/${id}`, {
            credentials: 'include'
        }).then(res => res.json());
    },

    create(params) {
        return fetch(`${BASE_URL}/products`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then(res => res.json());
    },

}

function renderProducts(products) {
    const productsContainer = document.querySelector('ul.product-list');
    
    productsContainer.innerHTML = products
        .map(p => {
            return `
                <li>
                    <a class="product-link" data-id="${p.id}" href="">
                        <span>${p.id} - </span>
                        ${p.title}
                    </a>
                </li>
            `
        }).join('');
}

function renderProductShow(id) {
    const showPage = document.querySelector('#product-show');
    navigateTo(id)   
    Product.get(id)
            .then((product) => {
               
                const productHTML = `
                    <h2>${product.title}</h2>
                      <p>${product.description}</p>
                    <h5>Reviews<h5>
                    ${product.reviews.map(r =>{return `<li>   ${r.body} </li>`}).join('')}
                
                `;
                showPage.innerHTML = productHTML;
                
            })
            
}

function navigateTo(id) {

    document.querySelectorAll('.page').forEach(node => {
        node.classList.remove('active');
    })
    if (id === "product-index") {
        document.querySelector(`#${id}`).classList.add('active')
        Product.index().then(products => renderProducts(products))
    } else if(id === "product-new"){
        document.querySelector(`#${id}`).classList.add('active')
        Product.index().then(products => renderProducts(products))
    }else {
 
    document.querySelector(`.page`).classList.add('active');

    }
}



document.addEventListener('DOMContentLoaded', () => {
    navigateTo('product-index');
    
    const nav = document.querySelector('nav')
    nav.addEventListener('click', (event)=>{
        event.preventDefault();
        const { target } = event;
        const page = target.dataset.target;
        navigateTo(page);
    })
 
    
    
    
    Session.create({ email: 'js@winterfell.gov', password: 'supersecret' })

    Product.index()
        .then(products => {
            renderProducts(products)
        });
    
        // go to show page when product is clicked
    const productsContainer = document.querySelector('ul.product-list');
    productsContainer.addEventListener('click', (e) => {
        e.preventDefault();
       
        const product = e.target.closest('a');
        const id =product.dataset.id;
        // should render the show page
        renderProductShow(id);
    })

        // Add add a new question logic
    const newProductForm = document.querySelector('#new-product-form');
    newProductForm.addEventListener('submit', (event) => {
        // send an ajax to request to POST /api/v1/questions
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newProduct = {
            description: formData.get('description'),
            title: formData.get('title'),
            price: formData.get('price')
        }
        Product.create(newProduct)
            .then(product => {
                if (product.id) {
                    renderProductShow(product.id)
                } else {
                    console.log("Error in creating product")
                }
                // else {
                //     if (question.errors) {
                //         // question.errors is an object that looks like:
                //         /**
                //          * {
                //          *   title: ['error one', 'error two'],
                //          *   body: ['error one']
                //          * }
                //          */
                //         for (const key in question.errors) {
                //             // html input div grabbed using the keys of the error object
                //             const input = newQuestionForm.querySelector(`#${key}`);
                            
                //             // join the array of errors into a nice string
                //             const errorMessages = question.errors[key].join(', ');

                //             // create a p DOM node
                //             const errorMessageNode = document.createElement('p');

                //             // add the errorMessages as text of the p tag
                //             errorMessageNode.innerText = errorMessages;

                //             // prepend a break tag. To seperate the error message from the label
                //             input.parentNode.prepend(document.createElement('br'));

                //             // prepend the error message p tag
                //             input.parentNode.prepend(errorMessages);
                //         }
                //     }
                // }
            });
    })
     

})