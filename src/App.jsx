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
  const [originalItemRects, setOriginalItemRects] = useState({});

  const onDragItem = (e) => {
    const element = document.getElementById(e.target.id);
    element.style.display = "none";
  };

  const onDragItemStart = (e) => {
    const rects = {};
    items.forEach((item) => {
      const el = document.getElementById(`drag-item-${item.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        rects[`drag-item-${item.id}`] = { left: rect.left, top: rect.top };
      }
    });
    setOriginalItemRects(rects);
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

    items.forEach((item) => {
      const el = document.getElementById(`drag-item-${item.id}`);
      if (el) {
        el.style.position = "";
        el.style.left = "";
        el.style.top = "";
        el.style.transition = "";
      }
    });

    if (targetElement.id && draggingItem.id && targetElement.id !== draggingItem.id) {
      const dragId = parseInt(draggingItem.id.split("-")[2]);
      const targetId = parseInt(targetElement.id.split("-")[2]);

      setItems((prev) => {
        const result = [...prev];
        const fromIndex = result.findIndex((item) => item.id === dragId);
        const toIndex = result.findIndex((item) => item.id === targetId);
        const [moved] = result.splice(fromIndex, 1);
        result.splice(toIndex, 0, moved);
        return result;
      });
    }

    setTargetElement({ id: null, x: 0, y: 0 });
    setOriginalItemRects({});
  };

  const onDragItemOver = (e) => {
    e.preventDefault();
    const element = document.getElementById(e.target.id);
    if (!element) return;
    if (e.target.id === draggingItem.id) return;

    const rect = element.getBoundingClientRect();
    setTargetElement({
      id: e.target.id,
      x: rect.left,
      y: rect.top,
    });

    transitionElements(draggingItem.id, e.target.id);
  };

  const transitionElements = (dragId, targetId) => {
    const dragIndex = items.findIndex((item) => `drag-item-${item.id}` === dragId);
    const targetIndex = items.findIndex((item) => `drag-item-${item.id}` === targetId);
    if (dragIndex === -1 || targetIndex === -1) return;

    items.forEach((item, index) => {
      const el = document.getElementById(`drag-item-${item.id}`);
      if (!el) return;
      if (`drag-item-${item.id}` === dragId) return;

      const originRect = originalItemRects[`drag-item-${item.id}`];
      if (!originRect) return;

      el.style.transition = "left 0.2s ease-in-out, top 0.2s ease-in-out";
      el.style.position = "fixed";

      if (dragIndex < targetIndex && index > dragIndex && index <= targetIndex) {
        const prevItemId = `drag-item-${items[index - 1].id}`;
        const prevRect = originalItemRects[prevItemId];
        el.style.left = prevRect ? `${prevRect.left}px` : `${originRect.left}px`;
        el.style.top = prevRect ? `${prevRect.top}px` : `${originRect.top}px`;
      } else if (dragIndex > targetIndex && index >= targetIndex && index < dragIndex) {
        const nextItemId = `drag-item-${items[index + 1].id}`;
        const nextRect = originalItemRects[nextItemId];
        el.style.left = nextRect ? `${nextRect.left}px` : `${originRect.left}px`;
        el.style.top = nextRect ? `${nextRect.top}px` : `${originRect.top}px`;
      } else {
        el.style.left = `${originRect.left}px`;
        el.style.top = `${originRect.top}px`;
      }
    });
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
