// State
let selectedElement = null;
let selectedElementIndex = null;

// Drag and Drop for templates
document.querySelectorAll('.template-item').forEach(item => {
  item.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', item.getAttribute('data-template'));
  });
});

const canvas = document.getElementById('canvas');

canvas.addEventListener('dragover', e => {
  e.preventDefault();
  canvas.classList.add('dragover');
});

canvas.addEventListener('dragleave', e => {
  e.preventDefault();
  canvas.classList.remove('dragover');
});

canvas.addEventListener('drop', e => {
  e.preventDefault();
  canvas.classList.remove('dragover');
  const html = e.dataTransfer.getData('text/plain');
  addElementToCanvas(html);
});

// Click to select and edit
canvas.addEventListener('click', e => {
  let el = e.target.closest('.canvas-element');
  if (!el) {
    selectElement(null, null);
    return;
  }
  selectElement(el, Array.from(canvas.children).indexOf(el));
});

// Add element to canvas
function addElementToCanvas(html) {
  const wrapper = document.createElement('div');
  wrapper.className = 'canvas-element';
  wrapper.innerHTML = html;
  canvas.appendChild(wrapper);
  selectElement(wrapper, canvas.childElementCount - 1);
}

// Select element
function selectElement(el, idx) {
  if (selectedElement) selectedElement.classList.remove('selected');
  selectedElement = el;
  selectedElementIndex = idx;
  if (el) {
    el.classList.add('selected');
    document.getElementById('code-editor').value = el.innerHTML;
  } else {
    document.getElementById('code-editor').value = '';
  }
}

// Apply code changes
document.getElementById('apply-code').addEventListener('click', () => {
  if (selectedElement) {
    selectedElement.innerHTML = document.getElementById('code-editor').value;
  }
});

// Keyboard navigation (optional)
canvas.addEventListener('keydown', e => {
  if (!canvas.children.length) return;
  if (e.key === 'ArrowDown') {
    let idx = selectedElementIndex === null ? 0 : (selectedElementIndex + 1) % canvas.children.length;
    selectElement(canvas.children[idx], idx);
  } else if (e.key === 'ArrowUp') {
    let idx = selectedElementIndex === null ? 0 : (selectedElementIndex - 1 + canvas.children.length) % canvas.children.length;
    selectElement(canvas.children[idx], idx);
  } else if (e.key === 'Delete' && selectedElement) {
    selectedElement.remove();
    selectElement(null, null);
  }
});

// Accessibility: focus canvas on load
window.addEventListener('DOMContentLoaded', () => {
  canvas.focus();
});