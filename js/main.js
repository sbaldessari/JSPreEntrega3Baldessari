const abecedario = 'abcdefghijklmnopqrstuvwxyz'.split('')
const colores = ["Naranja", "Amarillo", "Verde", "Azul", "Rojo", "Gris", "Negro", "Blanco", "Celeste", "Violeta"]
const palabraElegida = []
const coincidencias = []
const letrasIngresadas = []

let validacion = true
let chances = 5
let opciones = 0
let intentos = 0
let usuario = ""

let botonNuevoJuego = document.getElementById("btnNuevoJuego")
botonNuevoJuego.addEventListener("click", () => nuevoJuego())     
let botonIngresarUsuario = document.getElementById("btnIngresarUsuario")
botonIngresarUsuario.addEventListener("click", () => iniciarJuego())     
let botonIngresarPalabra = document.getElementById("btnIngresarPalabra")
botonIngresarPalabra.addEventListener("click", () => intentarPalabra())  

ocultarElemento("divNuevoJuego")

renderizarRanking()

function nuevoJuego(){

    mostrarElemento("divNuevoJuego")
    
    mostrarElemento("divUsuario")
    ocultarElemento("divAhorcado")

    document.getElementById("txtUsuario").value = ""
    document.getElementById("txtPalabra").value = ""   

}

function iniciarJuego(){

    palabraElegida.splice(0,palabraElegida.length)
    coincidencias.splice(0,coincidencias.length)
    letrasIngresadas.splice(0,letrasIngresadas.length)
    intentos = 0

    usuario = document.getElementById("txtUsuario").value

    if(usuario == ""){
        Toastify({
            text: `Debes ingresar un nombre de usuario`,
            className: "info",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast()       
    }else{
        ocultarElemento("divUsuario")

        let numeroAleatorio = Math.floor(Math.random() * 10)
    
        for (let i = 0; i < colores[numeroAleatorio].length; i++) {
            palabraElegida.push(colores[numeroAleatorio][i].toLowerCase())
            coincidencias.push("*")
        }  
    
        Toastify({
            text: `La palabra a adivinar tiene ${palabraElegida.length} letras`,
            className: "info",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast()
    
        mostrarElemento("divAhorcado")
    
        revisarIntentos()
        renderizarLetrasDisponibles()
    }

}

function ocultarElemento(elemento) {
    document.getElementById(elemento).style.display = 'none'
}

function mostrarElemento(elemento) {
    document.getElementById(elemento).style.display = 'flex'
}

function buscarLetra(letra){
    let letraEncontrada = false
    for (let i = 0; i < palabraElegida.length; i++) {
        if (palabraElegida[i] === letra) {
            coincidencias[i] = letra
            letraEncontrada = true
        }
    }
    return letraEncontrada
}

function buscarPalabra(palabra){
    let palabraEncontrada = true
    if(palabra.length == palabraElegida.length){
        for (let i = 0; i < palabra.length; i++) {
            if (palabraElegida[i] !== palabra[i]) {
                palabraEncontrada = false
            }
        }
    }else{
        palabraEncontrada = false
    }
    return palabraEncontrada
}

function intentarPalabra(){    
    palabra = document.getElementById("txtPalabra").value
    let existePalabra = buscarPalabra(palabra)
    ocultarElemento("divNuevoJuego") 
    if(existePalabra){
        Swal.fire(
            `Ganaste!!!! La palabra es ${palabra}!!!`,
            'Revisa si entraste en el ranking!',
            'success'
            )  
        let juego = new Ranking(palabraElegida.join(""), intentos, usuario)
        actualizarRanking(juego) 
        renderizarRanking() 
    }else{   
        Swal.fire(
            `Perdiste!!!!`,
            'No adivinaste la palabra!',
            'error'
            )
    }     
}

function revisarSiGano(){
    for (let i = 0; i < palabraElegida.length; i++) {
        if (palabraElegida[i] !== coincidencias[i]) {
            return false
        }
    }
    return true
}

function renderizarLetrasDisponibles(){
    let divBotonera = document.getElementById("divBotonera")
    divBotonera.innerHTML = ""   
    for (let i = 0; i < abecedario.length; i++) {
        let letra = document.createElement("button")
        letra.className = "btn btn-warning m-3 btn-lg"
        letra.innerHTML = `${abecedario[i]}`
        letra.setAttribute("onclick", `intentarLetra('${abecedario[i]}')`)
        const usada = letrasIngresadas.find((element) => element === abecedario[i])
        if (usada) {
            letra.disabled = true
        }
        divBotonera.appendChild(letra)
    }
}

function revisarIntentos(){
    document.getElementById("divCoincidencias").innerHTML = coincidencias.join("")
    document.getElementById("divCantidadIntentosRestantes").innerHTML = chances - intentos
    if(intentos == chances){    
        ocultarElemento("divNuevoJuego")
        renderizarRanking()    
        Swal.fire(
            `Perdiste!!!!`,
            'No adivinaste la palabra!',
            'error'
            )
    }
}

function intentarLetra(letra){    
    letrasIngresadas.push(letra)
    let existeLetra = buscarLetra(letra)
    document.getElementById("divCoincidencias").innerHTML = coincidencias.join("")
    if(existeLetra){
        let gano = revisarSiGano()
        if(gano){
            ocultarElemento("divNuevoJuego")
            Swal.fire(
                `Ganaste!!!! La palabra es ${coincidencias.join("")}!!!`,
                'Revisa si entraste en el ranking!',
                'success'
                )      
            let juego = new Ranking(palabraElegida.join(""), intentos, usuario)
            actualizarRanking(juego) 
            renderizarRanking()       
        }else{
            revisarIntentos()
            renderizarLetrasDisponibles()
        }
    }else{ 
        intentos++           
        revisarIntentos()
        renderizarLetrasDisponibles()
    } 
}

function actualizarRanking(juego){
    let storageRanking = localStorage.getItem("storageRanking") ? JSON.parse(localStorage.getItem("storageRanking")) : []
    storageRanking.push(juego)
    localStorage.setItem("storageRanking", JSON.stringify(storageRanking))
}

function renderizarRanking(){
    let storageRanking = localStorage.getItem("storageRanking") ? JSON.parse(localStorage.getItem("storageRanking")) : []
    let contenedorRanking = document.getElementById("tBodyRanking")
    let contador = 1

    contenedorRanking.innerHTML = ""        
    storageRanking.sort(function (a, b) {
        if (a.intentos > b.intentos) {
        return 1;
        }
        if (a.intentos < b.intentos) {
        return -1;
        }
        return 0;
    })
    
    storageRanking.forEach(({ usuario, intentos, palabra }) => {
        let jugador = document.createElement("tr")
        jugador.className = ""
        jugador.innerHTML = `
        <th scope='row'>${contador}</th>
        <td>${usuario}</td>
        <td>${intentos}</td>
        <td>${palabra}</td>            
        `
        contenedorRanking.appendChild(jugador)
        contador++
    })

}









