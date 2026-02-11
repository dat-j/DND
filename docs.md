- draggable makes a div draggable (instead of highlighting when you click and drag)
- onDragStart fires ONCE when you begin to drag
- onDragEnter fires ONCE when the dragged div enters another.
- onDragOver fires CONTINUOUSLY when dragging over a div
- onDrop fires when the mouse click is released
- captrue vi tri
- ![alt text](image.png)
- // By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
  document.addEventListener("dragover", function(event) {
  event.preventDefault();
  });
