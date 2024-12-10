// Mostrar y ocultar el menú desplegable
document.querySelector('.dropdown button').addEventListener('click', function() {
    const dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});

// Capturar el formulario
const form = document.querySelector('form');
const notesSection = document.querySelector('.seccion-notas div:last-child');

// Guardar notas en LocalStorage
function saveNotesToLocalStorage(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Cargar notas desde LocalStorage
function loadNotesFromLocalStorage() {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
}

// Renderizar todas las notas guardadas al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const savedNotes = loadNotesFromLocalStorage();
    savedNotes.forEach(renderNote);

    // Calcular el total de montos al cargar
    savedNotes.forEach(note => {
        if (note.monto) {
            updateTotalMonto(parseFloat(note.monto));
        }
    });
});

// Manejar el envío del formulario
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que la página se recargue

    // Obtener los valores del formulario
    const fecha = form.elements['fecha'].value;
    const titulo = form.elements['titulo'].value;
    const contenido = form.elements['contenido'].value;
    const monto = parseFloat(form.elements['monto'].value) || 0;
    const categorias = Array.from(
        document.querySelectorAll('.dropdown-content input:checked')
    ).map((input) => input.parentElement.textContent.trim());

    // Validar datos requeridos
    if (!fecha || !titulo || !contenido) {
        alert('Por favor, completa los campos obligatorios.');
        return;
    }

    // Crear el objeto de la nota
    const noteData = { fecha, titulo, contenido, monto, categorias };

    // Renderizar la nota en el DOM
    renderNote(noteData);

    // Guardar la nota en LocalStorage
    const notes = loadNotesFromLocalStorage();
    notes.push(noteData);
    saveNotesToLocalStorage(notes);

    // Actualizar el total de montos
    updateTotalMonto(monto);

    // Limpiar el formulario
    form.reset();
});

// Renderizar una nota en el DOM
function renderNote({ fecha, titulo, contenido, monto, categorias }) {
    const note = document.createElement('div');
    note.classList.add('note');
    note.style.border = '1px solid var(--color-textos)';
    note.style.margin = '1rem 0';
    note.style.padding = '1rem';

    note.innerHTML = `
        <h2>${titulo}</h2>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Contenido:</strong> ${contenido}</p>
        <p><strong>Categorías:</strong> ${categorias.join(', ')}</p>
        ${
            monto
                ? `<p style="font-size: 24px; color: var(--color-textos);"><strong>Monto:</strong> $${monto}</p>`
                : ''
        }
    `;

    // Crear botón de eliminación
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.style.marginTop = '1rem';
    deleteButton.style.backgroundColor = 'red';
    deleteButton.style.color = 'white';
    deleteButton.style.border = 'none';
    deleteButton.style.padding = '0.5rem 1rem';
    deleteButton.style.cursor = 'pointer';

    // Manejar el clic en el botón de eliminación
    deleteButton.addEventListener('click', function () {
        deleteNote(note, monto);
    });

    // Agregar el botón al final de la nota
    note.appendChild(deleteButton);

    notesSection.appendChild(note);
}

// Función para eliminar una nota
function deleteNote(noteElement, monto) {
    const notes = loadNotesFromLocalStorage();
    const titleToDelete = noteElement.querySelector('h2').textContent;

    // Eliminar la nota del localStorage
    const updatedNotes = notes.filter(note => note.titulo !== titleToDelete);
    saveNotesToLocalStorage(updatedNotes);

    // Eliminar la nota del DOM
    notesSection.removeChild(noteElement);

    // Actualizar el total de montos
    updateTotalMonto(-monto);
}

// Crear y configurar el elemento para mostrar el total de montos
const totalMontoElement = document.createElement('p');
totalMontoElement.classList.add('total-monto');
totalMontoElement.style.fontSize = '1.5rem';
totalMontoElement.style.fontWeight = 'bold';
totalMontoElement.style.color = 'var(--color-medio-oscuro)';
totalMontoElement.textContent = 'Monto Total: $0';
notesSection.appendChild(totalMontoElement);

let totalMonto = 0;

// Función para actualizar el total de montos
function updateTotalMonto(amount) {
    totalMonto += amount;
    totalMontoElement.textContent = `Monto Total: $${totalMonto.toFixed(2)}`;
}

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
        console.log('Service Worker registrado:', registration);
    }).catch((error) => {
        console.error('Error al registrar el Service Worker:', error);
    });
}
