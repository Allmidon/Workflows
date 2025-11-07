document.addEventListener('DOMContentLoaded', () => {

    // URL DE NODO WEBHOOK EN N8N
    const N8N_WEBHOOK_URL = "https://asc.app.n8n.cloud/webhook-test/4ead4bdb-631f-4b89-b880-b6502034287b";

    // Referencias a los elementos del DOM
    const btnCalcular = document.getElementById('btnCalcular');
    const textoOperacion = document.getElementById('textoOperacion');

    // Referencias del botón (para el spinner)
    const btnText = document.getElementById('button-text');
    const btnSpinner = document.getElementById('spinner');

    // Alertas de resultado y error
    const divResultado = document.getElementById('divResultado');
    const resultadoTexto = document.getElementById('resultadoTexto');
    const divError = document.getElementById('divError');
    const errorTexto = document.getElementById('errorTexto');


    // --- Funciones de Ayuda ---

    // Función para manejar el estado de carga
    function setLoading(isLoading) {
        if (isLoading) {
            btnCalcular.disabled = true;
            // Usamos las referencias del HTML que te di en el ejemplo anterior
            if(btnText && btnSpinner) {
                btnText.classList.add('d-none');
                btnSpinner.classList.remove('d-none');
            } else {
                // Fallback si usas el HTML original
                btnCalcular.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Calculando...`;
            }
        } else {
            btnCalcular.disabled = false;
            if(btnText && btnSpinner) {
                btnText.classList.remove('d-none');
                btnSpinner.classList.add('d-none');
            } else {
                 // Fallback si usas el HTML original
                btnCalcular.innerHTML = `Calcular <i class="bi bi-send ms-1"></i>`;
            }
        }
    }

    // Función para mostrar el resultado
    function showResult(message) {
        divResultado.style.display = 'block';
        divError.style.display = 'none';
        resultadoTexto.textContent = message;
    }

    // Función para mostrar un error
    function showError(message) {
        divResultado.style.display = 'none';
        divError.style.display = 'block';
        errorTexto.textContent = message;
    }

    // --- Lógica Principal ---

    btnCalcular.addEventListener('click', () => {
        const query = textoOperacion.value.trim();

        // 1. Ocultar mensajes anteriores
        divResultado.style.display = 'none';
        divError.style.display = 'none';

        if (query === "") {
            // !! ESTE ES EL ARREGLO !!
            // En lugar de alert(...), usamos el div de error.
            showError("Por favor, escribe una operación.");
            return;
        }

        // 2. Iniciar estado de carga
        setLoading(true);

        // 3. Enviar la solicitud a n8n
        fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                textoUsuario: query
            })
        })
        .then(response => {
            if (!response.ok) {
                // Error de servidor (ej: 500)
                throw new Error(`Error del servidor: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // 4. Éxito
            setLoading(false);
            // Asumimos que n8n devuelve { "respuestaCalculada": "..." }
            // Si la clave es diferente (ej: "resultado"), cámbiala aquí.
            showResult(data.respuestaCalculada); 
        })
        .catch(error => {
            // 5. Error (de red, CORS, o JSON inválido)
            setLoading(false);
            console.error('Error en fetch:', error);
            // El error de CORS se mostrará en la consola, y aquí daremos un mensaje genérico.
            showError('Hubo un error al procesar la solicitud. Revisa la consola (F12).');
        });
    });

});
