const header = document.querySelector("#header");
const columnTypeSelect = document.querySelector("#column-type-select");
const columnEditor = document.querySelector("#column-editor");
const addColumnBtn = document.querySelector("#add-column-button");
const removeColumnBtn = document.querySelector("#remove-column-button");
let selectedColumn = null;

function updateContentEditor() {
  const selectedType = columnTypeSelect.value;
  let editorContent = "";

  if (selectedType === "html") {
    editorContent = '<textarea id="html-editor"></textarea>';
  } else if (selectedType === "image") {
    editorContent =
      '<input type="text" id="image-editor" placeholder="Paste Image URL">';
  } else if (selectedType === "clock") {
    editorContent =
      '<select id="clock-editor"><option value="Analogue" selected>Analogue</option><option value="Digital">Digital</option></select>';
  }

  columnEditor.innerHTML = editorContent;
}

function selectColumn(column) {
  selectedColumn = column;
  const type = column.getAttribute("data-type");
  columnTypeSelect.value = type;

  updateContentEditor();

  if (type === "html") {
    document.querySelector("#html-editor").value = column.innerHTML;
  } else if (type === "image") {
    document.querySelector("#image-editor").value =
      column.firstElementChild.src;
  } else if (type === "clock") {
    document.querySelector("#clock-editor").value = column.innerHTML;
  }
}

header.addEventListener("click", function (e) {
  selectColumn(e.target);
});

function saveChanges() {
  if (selectedColumn) {
    const selectedType = columnTypeSelect.value;

    if (selectedType === "html") {
      selectedColumn.innerHTML = document.querySelector("#html-editor").value;
    } else if (selectedType === "image") {
      selectedColumn.innerHTML = `<img src="${
        document.querySelector("#image-editor").value
      }" alt="column image">`;
    } else if (selectedType === "clock") {
      selectedColumn.innerHTML = document.querySelector("#clock-editor").value;
    }
  }
}

function addColumn() {
  const newColumn = document.createElement("div");
  newColumn.classList.add("column");
  newColumn.setAttribute("data-type", "html");
  newColumn.setAttribute("draggable", "true");

  header.appendChild(newColumn);
}

function removeColumn() {
  if (selectedColumn && document.querySelectorAll(".column").length > 1) {
    header.removeChild(selectedColumn);
    selectedColumn = null;
  }
}

addColumnBtn.addEventListener("click", addColumn);
removeColumnBtn.addEventListener("click", removeColumn);

function updateColumnType() {
  if (selectedColumn) {
    updateContentEditor();
  }
}

columnTypeSelect.addEventListener("change", updateColumnType);

let draggedColumn = null;

function dragStart(event) {
  draggedColumn = event.target;
  event.dataTransfer.setData("text/plain", null);
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const targetColumn = event.target.closest(".column");

  if (targetColumn && draggedColumn !== targetColumn) {
    const columns = Array.from(header.getElementsByClassName("column"));
    const draggedIndex = columns.indexOf(draggedColumn);
    const targetIndex = columns.indexOf(targetColumn);
    if (draggedIndex !== -1 && targetIndex !== -1) {
      if (draggedIndex < targetIndex) {
        header.insertBefore(draggedColumn, targetColumn.nextSibling);
      } else {
        header.insertBefore(draggedColumn, targetColumn);
      }
    }
  }
}

header.addEventListener("dragstart", dragStart);
header.addEventListener("dragover", dragOver);
header.addEventListener("drop", drop);
