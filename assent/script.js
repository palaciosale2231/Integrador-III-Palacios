//Estas son las APIS de donde se van a sacar los personajes y sus datos
const API_URL = "https://thesimpsonsapi.com/api/characters";
const CDN_URL = "https://cdn.thesimpsonsapi.com/500";
//Estas son las referencias al DOM(html)
const contenedor = document.getElementById("cartaPj");
const mensaje = document.getElementById("mensajeEstado");
const inputBuscar = document.getElementById("buscarPj");
const formBuscar = document.getElementById("formBuscar");
const btnLimpiar = document.getElementById("btnLimpiar");
//Variable donde se van almacenar los personajes para no volver a consultar a la API
let personajes = [];

//En esta función se traen los personajes de la API y se almacenan en "personajes".

async function obtenerPersonajes() {
  try {
    //Acá con el fetch hacemos la peticion a la API para obtener sus datos en bruto y los almacenamos en la constante
    const respuesta = await fetch(API_URL);
    //En esta parte al hacer el "respuesta.json()" lo que hacemos es pasar los datos en bruto de la anterior linea a un objeto manipulable, (estaría haciendo de esos datos un arreglo con informacion limpia)
    const datos = await respuesta.json();

    //Acá se le asigna los datos limpios a la variable personajes
    personajes = datos.results;
    //En esta parte se cargan los personajes y se captura con catch un error si es que la anterior consulta a la API falla
    mostrarPersonajes(personajes);
  } catch (error) {
    console.log(error);
    mensaje.innerHTML = `<div class="alert alert-danger">No se pudieron cargar los personajes</div>`;
  }
}
// Se utiliza el try/catch para poder controlar que pasa en caso de que ocurra un error

//Esta función recibe el parametro de lista porque la voy a usar en dos situaciones una es esta, y la otra es para mostrar solo los que coincidan con la busqueda
function mostrarPersonajes(lista) {
  //Esto limpia el contenido del contenedor para que al cargar nuevos personajes o buscar no se repitan
  contenedor.innerHTML = "";
  // Esto dice que si la lista de personajes está vacía, detiene la ejecución del código y muestra un mensaje de alerta
  if (lista.length === 0) {
    mensaje.innerHTML = `<div class="alert alert-warning">No se encontraron personajes</div>`;
    //Con esto termina y sale de la función
    return;
  }

  mensaje.innerHTML = "";
  //En esta parte al forEach le decimos"por cada personaje hace esto"
  lista.forEach((personaje) => {
    //Esto es para las imagenes donde accedemos a la propiedad portrait_path de cada objeto que nos da una ruta relativa para saber la imagen del personaje
    const imagen = CDN_URL + personaje.portrait_path;
    //Acá se usa el "+=" porque usar solo el "=" replazaría todo el contenido por cada vuelta del forEach dejando solo la ultima card, usando el "+=" significa "tomá lo que ya hay, y agregá esto al final" asi por vuelta va a ir agregando cada una de las tarjetas
    contenedor.innerHTML += `
      <div class="col-md-3">
        <div class="card h-100">
          <img src="${imagen}" class="card-img-top" alt="${personaje.name}">
          <div class="card-body">
            <h5 class="card-title">${personaje.name}</h5>
            <p class="card-text">Ocupación: ${personaje.occupation}</p>
            <p class="card-text">Estado: ${personaje.status}</p>
            <button class="btn btn-warning btn-detalle" data-id="${personaje.id}">
              Ver detalle
            </button>
          </div>
        </div>
      </div>
        `;
  });
}
//Acá hacemos el buscador de los personajes con la función filtrarPersonajes
function filtrarPersonajes() {
  //Declaramos esta constante de texto que es el nombre que ingresa el usuario en el buscador donde tomamos el valor del inputBuscar y con el .trim decimos que borre todos los espacios vacios y con el toLowerCase forzamos que el texto sea en minuscula así no existen diferencias entre mayúsculas y minusculas.
  const texto = inputBuscar.value.trim().toLowerCase();
  //Esto dice que "Si texto es estrictamente igual a vacio entonces se devuelve el valor de la función mostrarPersonajes" (osea que se no se va a mostrar ningun cambio, solo se van a ver los personajes tal como están)
  if (texto === "") {
    mostrarPersonajes(personajes);
    return;
  }
  //Acá declaramos una constante con valor personajes.filter que es literalmente "dame un nuevo arreglo con los elementos que cumplen esta condición"
  const filtrados = personajes.filter((personaje) =>
    //Esta sería la condición para que el personaje pase el filtro, el ".includes(texto)" revisa que el texto que se escribió esta dentro de personaje.name en caso de que esté va a dar verdadero y va a llamar a la función que va a mostrar el personaje que se está buscando, caso contrario mostrará una alerta que dice "no se encontraron personajes"
    personaje.name.toLowerCase().includes(texto),
  );
  mostrarPersonajes(filtrados);
}

async function obtenerDetalle(id) {
  try {
    //Acá realizamos la petición a la API para pedir los datos del personaje con ese "id" con el "fetch(`${API_URL}/${id}`)" basicamente le estoy pidiendo que vaya a esa URL y me busque información del personaje que tiene ese id
    const respuesta = await fetch(`${API_URL}/${id}`);
    //Y acá solo se esta pasando esos datos planos a un objeto manipulable con el .json()
    const personaje = await respuesta.json();

    mostrarModal(personaje);
    //Acá se utiliza alert en el catch no como en la otra función de obtenerPersonajes que se una "mensaje.innerHTML" porque en esta parte si no funciona la pagína debería funcionar igual, en cambio en la otra si no funcionaba no mostraría nada entonces si tiene sentido que en esa función haya un mensaje "permanente" dentro de la página
  } catch (error) {
    console.log(error);
    alert("No se pudo cargar el detalle del personaje");
  }
}
function mostrarModal(personaje) {
  //En esta parte utilizamos el .textContent y no el .innerHTML porque el textContent va a insertar el valor como texto plano, sin interpretarlo como HTML, en cambio el otro sí.
  document.getElementById("modalNombre").textContent = personaje.name;
  document.getElementById("modalImagen").src =
    CDN_URL + personaje.portrait_path;
  //En este modal el ?? significa que si personaje.age es null va a mostrar el mensaje "Desconocida" es conveniente usar este y no un || (OR) porque el ?? interpreta el null solo cuando es VACÍO "", en cambio el || tambien lo va a interpretar como null pero tambien lo toma al 0 y el 0 tambien es una edad valida porque podria ser la edad de un recíen nacido.
  document.getElementById("modalEdad").textContent =
    personaje.age ?? "Desconocida";
  document.getElementById("modalNacimiento").textContent =
    personaje.birthdate ?? "Desconocida";
  document.getElementById("modalGenero").textContent =
    personaje.gender ?? "Desconocido";
  document.getElementById("modalOcupacion").textContent = personaje.occupation;
  document.getElementById("modalEstado").textContent = personaje.status;
  //En esta utilizo el personaje.phrases[0] porque la consigna solo pide mostrar una sola frase.
  document.getElementById("modalFrase").textContent =
    personaje.phrases[0] ?? "Sin frases";

  //Acá basicamente le estamos diciendo que "Busque en el diseño de la página la ventana modalDetalle y que la prepare usando Boostrap y que se muestre en pantalla con el modal.show"
  const modal = new bootstrap.Modal(document.getElementById("modalDetalle"));
  modal.show();
}
//Acá le decimos al navegador que cuando se termine de cargar todo el hmtl se ejecute el obtenerPersonajes
document.addEventListener("DOMContentLoaded", obtenerPersonajes);
//Esta línea dice que cada vez que se escriba algo dentro del inputBuscar se ejecute la función filtrarPersonajes
inputBuscar.addEventListener("input", filtrarPersonajes);
//En esta parte puede ser medio confusa porque me pregunte por qué no le pongo el evento al botón pero lo que pasa es que cuando la página carga el botón todavia no existe, porque ese botón se crea recíen cuando llega la respuesta de la API y mostrarPersonajes() genera las cards con sus botones por eso se le agrega desde el principio, aunque esté vacío le decimos que cada que se haga click en el boton(btn-detalle) que abra el detalle de ese personaje.
contenedor.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-detalle")) {
    const id = event.target.dataset.id;
    obtenerDetalle(id);
  }
});
//En este evento escuchamos el submit del formulario, y lo que ocurre es que si el usuario presiona ENTER o toca el botón se vacia el contenido del input de busqueda
formBuscar.addEventListener("submit", (event) => {
  event.preventDefault();
  inputBuscar.value = "";
  mostrarPersonajes(personajes);
});
