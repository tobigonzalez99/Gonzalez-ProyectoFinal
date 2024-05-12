document.addEventListener("DOMContentLoaded", function() {
    const carritoItemsContainer = document.querySelector(".carrito-items-container");

    function renderCarritoItems(items) {
        carritoItemsContainer.innerHTML = '';

        if (items.length > 0) {
            items.forEach(item => {
                const carritoItemElement = createCarritoItemElement(item);
                carritoItemsContainer.appendChild(carritoItemElement);
            });
        } else {
            const mensajeCarritoVacio = document.createElement("p");
            mensajeCarritoVacio.textContent = "Tu carrito está vacío";
            carritoItemsContainer.appendChild(mensajeCarritoVacio);
        }
    }

    function createCarritoItemElement(item) {
        const carritoItem = document.createElement("div");
        carritoItem.classList.add("carrito-item");

        const productoImagen = document.createElement("img");
        productoImagen.src = "img/" + item.imagen;
        productoImagen.alt = item.nombre;
        productoImagen.classList.add("producto-imagen");

        const productoDetalles = document.createElement("div");
        productoDetalles.classList.add("producto-detalles");

        const productoNombre = document.createElement("p");
        productoNombre.textContent = item.nombre;

        const productoPrecio = document.createElement("p");
        productoPrecio.textContent = "$" + item.precio;

        const contadorContainer = document.createElement("div");
        contadorContainer.classList.add("contador-container");

        const btnResta = document.createElement("button");
        btnResta.textContent = "-";
        btnResta.classList.add("btn-contador");
        btnResta.addEventListener("click", () => restaContador(item));

        const contador = document.createElement("p");
        contador.textContent = item.cantidad;

        const btnSuma = document.createElement("button");
        btnSuma.textContent = "+";
        btnSuma.classList.add("btn-contador");
        btnSuma.addEventListener("click", () => sumaContador(item));

        const removerBtn = document.createElement("button");
        removerBtn.classList.add("remover-btn");
        removerBtn.textContent = "Eliminar";
        removerBtn.addEventListener("click", () => removerDelCarrito(item));

        contadorContainer.appendChild(btnResta);
        contadorContainer.appendChild(contador);
        contadorContainer.appendChild(btnSuma);

        productoDetalles.appendChild(productoNombre);
        productoDetalles.appendChild(productoPrecio);
        productoDetalles.appendChild(contadorContainer);

        carritoItem.appendChild(productoImagen);
        carritoItem.appendChild(productoDetalles);
        carritoItem.appendChild(removerBtn);

        return carritoItem;
    }

    function removerDelCarrito(removerItem) {
        const actualizarCarritoItems = JSON.parse(localStorage.getItem("carritoItems")).filter(item => item.nombre !== removerItem.nombre);
        localStorage.setItem("carritoItems", JSON.stringify(actualizarCarritoItems));
        renderCarritoItems(actualizarCarritoItems);
        actualizarCarritoTotal();

        showToast("Producto eliminado");
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

function restaContador(item) {
    if (item.cantidad > 1) {
        item.cantidad--;
        const carritoItems = JSON.parse(localStorage.getItem("carritoItems"));
        const actualizarCarritoItems = carritoItems.map(carritoItem => {
            if (carritoItem.nombre === item.nombre) {
                return item;
            }
            return carritoItem;
        });
        localStorage.setItem("carritoItems", JSON.stringify(actualizarCarritoItems));
        renderCarritoItems(actualizarCarritoItems);
        actualizarCarritoTotal();
    }
}

function sumaContador(item) {
    item.cantidad++;
    const carritoItems = JSON.parse(localStorage.getItem("carritoItems"));
    const actualizarCarritoItems = carritoItems.map(carritoItem => {
        if (carritoItem.nombre === item.nombre) {
            return item;
        }
        return carritoItem;
    });
    localStorage.setItem("carritoItems", JSON.stringify(actualizarCarritoItems));
    renderCarritoItems(actualizarCarritoItems);
    actualizarCarritoTotal();
}

    function actualizarCarritoTotal() {
        const carritoItems = JSON.parse(localStorage.getItem("carritoItems")) || [];
        let total = 0;

        carritoItems.forEach(item => {
            total += item.precio * item.cantidad;
        });

        const precioTotal = document.querySelector(".precio-total");
        precioTotal.textContent = "$" + total.toFixed(2);
    }

    const btnVaciarCarrito = document.querySelector(".vaciar-carrito");
    btnVaciarCarrito.addEventListener("click", () => {

        if (localStorage.getItem("carritoItems") !== null) {
            Swal.fire({
                title: "CUIDADO!!",
                text: "Estas por borrar todos los productos del carrito!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Vaciar carrito!"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "",
                    text: "Vaciaste el carrito correctamente",
                    icon: "success"
                  });
                  localStorage.removeItem("carritoItems");
                  renderCarritoItems([]);
                  actualizarCarritoTotal();
                }else {
                    
                }
              });
        }else {
            Swal.fire({
                title: "Carrito vacio",
                text: "No hay productos en el carrito",
                icon: "info"
            });
        }
    });

    const btnFinalizarCompra = document.querySelector(".btn-finalizar-compra");
    btnFinalizarCompra.addEventListener("click", () => {

        if (localStorage.getItem("carritoItems") !== null ) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Muchas gracias por tu compra!",
                showConfirmButton: false,
                timer: 1500
              });
        }else {
            Swal.fire({
                title: "Carrito vacio",
                text: "No hay productos para comprar",
                icon: "info"
            })
        }
        localStorage.removeItem("carritoItems");
        renderCarritoItems([]);
        actualizarCarritoTotal();
    });

    const carritoItems = JSON.parse(localStorage.getItem("carritoItems")) || [];
    renderCarritoItems(carritoItems);
    actualizarCarritoTotal();
});
