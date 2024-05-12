document.addEventListener("DOMContentLoaded", function() {
    const productosContainer = document.querySelector(".productos-container");

    const carrito_items = "carritoItems";

    fetch("./js/productos.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("La respuesta de la red no fue exitosa");
            }
            return response.json();
        })
        .then(data => {
            data.forEach(producto => {
                const productoCard = cargarProductoCard(producto);
                productosContainer.appendChild(productoCard);
            });
        })
        .catch(error => console.error("Error al cargar los productos:", error));

    productosContainer.addEventListener("click", function(e) {
        if (e.target.matches(".btn")) {
            const producto = e.target.closest(".producto-card").dataset.producto;
            agregarCarrito(JSON.parse(producto));
        }
    });

    function cargarProductoCard(producto) {
        const card = document.createElement("div");
        card.classList.add("producto-card");
        card.dataset.producto = JSON.stringify(producto);

        const imagen = document.createElement("img");
        imagen.classList.add("producto-imagen");
        imagen.src = "img/" + producto.imagen;
        imagen.alt = producto.nombre;

        const detalles = document.createElement("div");
        detalles.classList.add("producto-detalles");

        const title = document.createElement("h2");
        title.classList.add("producto-titulo");
        title.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.classList.add("producto-precio");
        precio.textContent = "$" + producto.precio;

        const agregarCarritoBtn = document.createElement("button");
        agregarCarritoBtn.classList.add("btn");
        agregarCarritoBtn.textContent = "Agregar al carrito";

        detalles.appendChild(title);
        detalles.appendChild(precio);
        detalles.appendChild(agregarCarritoBtn);

        card.appendChild(imagen);
        card.appendChild(detalles);

        return card;
    }

    function agregarCarrito(producto) {
        let carritoItems = JSON.parse(localStorage.getItem(carrito_items)) || [];

        const productoExistente = carritoItems.find(item => item.nombre === producto.nombre);

        if (productoExistente) {
            productoExistente.cantidad++;
        }else {
            producto.cantidad = 1;
            carritoItems.push(producto);
        }

        localStorage.setItem(carrito_items, JSON.stringify(carritoItems));

        showToast("Producto agregado al carrito");
    }

    function showToast(mensaje) {
        Toastify({
            text: mensaje,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            className: "toastify-custom-background",
            offset: {
                x: '1.5rem',
                y: '1.5rem'
            },
            onClick: function(){}
        }).showToast();
    }
});
