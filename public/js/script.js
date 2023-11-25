function DescompletarTarefa(id) {
    fetch("http://localhost:3000/descompletar", {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ id })
    })

    window.location.reload()
}
function completarTarefa(id) {
    fetch("http://localhost:3000/completar", {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ id })
    })

    window.location.reload()
}

function alterarTema() {
    const tema = localStorage.getItem("tema")
    const body = document.querySelector("body")
    const button = document.querySelector(".tema-button")

    if (tema) {
        let novoTema

        if (tema === "light") {
            novoTema = "dark"
            button.innerHTML = `<img src="/imagens/sun-icon.png" alt="icone do sol">`
            body.classList.remove("light")
            body.classList.add("dark")
        }
        else {
            novoTema = "light"
            button.innerHTML = `<img src="/imagens/moon-icon.png" alt="icone da lua">`
            body.classList.remove("dark")
            body.classList.add("light")
        }

        localStorage.setItem("tema", novoTema)
        return
    }

    localStorage.setItem("tema", "dark")
    body.classList.add("dark")
}

function verificarTema() {
    const tema = localStorage.getItem("tema")
    const body = document.querySelector("body")
    const button = document.querySelector(".tema-button")

    if (tema) {
        if (tema === "dark") {
            body.classList.add("dark")
            button.innerHTML = `<img src="/imagens/sun-icon.png" alt="icone do sol">`
        }
        else {
            body.classList.add("light")
            button.innerHTML = `<img src="/imagens/moon-icon.png" alt="icone da lua">`
        }
    }
}

verificarTema()