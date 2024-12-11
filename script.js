document.addEventListener("DOMContentLoaded", function () {
    // Obtener elementos
    const formContainer = document.getElementById("form");
    const noteForm = formContainer.querySelector("form");
    const dropdownBtn = document.querySelector('.dropdown button');
    const dropdownContent = document.querySelector('.dropdown-content');
    const notesSection = document.querySelector('.seccion-notas');
  
  // Mostrar y ocultar el menú desplegable
dropdownBtn.addEventListener('click', function(event) {
    event.preventDefault();  // Previene el comportamiento predeterminado
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});

    // Manejar el envío del formulario
    noteForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Evita que la página se recargue
  
      // Obtener datos del formulario
      const fecha = noteForm.elements['fecha'].value;
      const titulo = noteForm.elements['titulo'].value;
      const contenido = noteForm.elements['contenido'].value;
      const monto = parseFloat(noteForm.elements['monto'].value) || 0;
      const categorias = Array.from(
        document.querySelectorAll('.dropdown-content input:checked')
      ).map(input => input.parentElement.textContent.trim());
  
      // Validar campos
      if (!fecha || !titulo || !contenido) {
        alert('Por favor, completa los campos obligatorios.');
        return;
      }
  
      const noteData = { fecha, titulo, contenido, monto, categorias };
  
      // Guardar la nota
      const notes = loadNotesFromLocalStorage();
      notes.push(noteData);
      saveNotesToLocalStorage(notes);
  
      // Renderizar la nueva nota
      renderNote(noteData);
  
      // Limpiar formulario
      noteForm.reset();
      dropdownContent.style.display = 'none'; // Cerrar dropdown
    });
  
    // Mostrar u ocultar el menú de categorías
    dropdownBtn.addEventListener('click', function (event) {
      event.preventDefault();
      dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
    });
  
    // Cargar notas desde LocalStorage
    function loadNotesFromLocalStorage() {
      const savedNotes = localStorage.getItem('notes');
      return savedNotes ? JSON.parse(savedNotes) : [];
    }
  
    // Guardar notas en LocalStorage
    function saveNotesToLocalStorage(notes) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  
    // Renderizar la nota en el DOM
    function renderNote({ fecha, titulo, contenido, monto, categorias }) {
      const noteElement = document.createElement('div');
      noteElement.classList.add('note');
      noteElement.innerHTML = `
        <h2>${titulo}</h2>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Contenido:</strong> ${contenido}</p>
        <p><strong>Categorías:</strong> ${categorias.join(', ')}</p>
        ${monto ? `<p><strong>Monto:</strong> ₡${monto.toFixed(2)}</p>` : ''}
      `;
  
      // Botón para eliminar la nota
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Eliminar';
      deleteButton.addEventListener('click', () => deleteNote(titulo, noteElement, monto));
      noteElement.appendChild(deleteButton);
  
      notesSection.appendChild(noteElement);
    }
  
    // Eliminar una nota
    function deleteNote(titulo, noteElement, monto) {
      const notes = loadNotesFromLocalStorage();
      const updatedNotes = notes.filter(note => note.titulo !== titulo);
      saveNotesToLocalStorage(updatedNotes);
      notesSection.removeChild(noteElement);
      updateTotalMonto(-monto);
    }
  
    // Actualizar monto total
    let totalMonto = 0;
    function updateTotalMonto(amount) {
      totalMonto += amount;
      document.querySelector('.total-monto').textContent = `Monto Total: ₡${totalMonto.toFixed(2)}`;
    }
  
    // Cargar notas al iniciar la página
    loadNotesFromLocalStorage().forEach(renderNote);
  });
  