import { useState } from "react";
import "./App.css";
import { mockItem } from "./utils/dataMock";

function App() {
  const [items, setItems] = useState(mockItem);
  const [draggingItem, setDraggingItem] = useState({
    id: null,
    clientX: 0,
    clientY: 0,
  });
  const [targetElement, setTargetElement] = useState({ id: null, x: 0, y: 0 });

  const onDragItem = (e) => {
    const element = document.getElementById(e.target.id);
    element.style.display = "none";
  };

  const onDragItemStart = (e) => {
    setDraggingItem({
      id: e.target.id,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  const onDragItemEnd = (e) => {
    const element = document.getElementById(e.target.id);
    element.style.opacity = "1";
    element.style.display = "flex";

    if (targetElement.id && draggingItem.id && targetElement.id !== draggingItem.id) {
      const dragId = parseInt(draggingItem.id.split("-")[2]);
      const targetId = parseInt(targetElement.id.split("-")[2]);

      setItems((prev) => {
        const result = [...prev];
        const fromIndex = result.findIndex((item) => item.id === dragId);
        const toIndex = result.findIndex((item) => item.id === targetId);
        const temp = result[fromIndex];
        result[fromIndex] = result[toIndex];
        result[toIndex] = temp;
        return result;
      });
    }

    setTargetElement({ id: null, x: 0, y: 0 });
  };

  const onDragItemOver = (e) => {
    e.preventDefault();
    const element = document.getElementById(e.target.id);
    if (!element) return;
    if (e.target.id === draggingItem.id) return;

    const rect = element.getBoundingClientRect();
    setTargetElement({
      ...targetElement,
      id: e.target.id,
      x: rect.left,
      y: rect.top,
    });

    transitionElements(e.target.id);
  };

  const transitionElements = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.style.transform = "scale(1.05)";
    element.style.transition = "transform 0.2s ease-in-out";
    setTimeout(() => {
      element.style.transform = "scale(1)";
    }, 200);
  };

  return (
    <div className="drag-context">
      {items.map((item) => (
        <div
          className="drop-area"
          key={item.id}
          id={item.id}
          onDragOver={(e) => onDragItemOver(e)}
        >
          <div
            id={`drag-item-${item.id}`}
            className="drag-item"
            style={{ background: item.background }}
            onDrag={(e) => onDragItem(e)}
            onDragStart={(e) => onDragItemStart(e)}
            onDragEnd={(e) => onDragItemEnd(e)}
            draggable
          >
            {item.name}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
