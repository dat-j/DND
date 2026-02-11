// import { useState } from "react";
import { useEffect, useState } from "react";
import "./App.css";
import { mockItem } from "./utils/dataMock";

function App() {
  // const [position, setPosition] = useState({ x: 0, y: 0 });
  const [draggingItem, setDraggingItem] = useState({
    id: null,
    clientX: 0,
    clientY: 0,
  });
  const [targetElement, setTargetElement] = useState({ id: null, x: 0, y: 0 });

  const onDragItem = (e) => {
    const element = document.getElementById(e.target.id);
    element.style.display = "none";
    for (let i = 1; i <= targetElement.id?.split("-")[2]; i++) {
      transitionElements(55, `drag-item-${i}`);
    }
  };

  const onDragItemStart = (e) => {
    setDraggingItem({ clientX: e.clientX, clientY: e.clientY });
  };

  const onDragItemEnd = (e) => {
    const element = document.getElementById(e.target.id);
    element.style.display = "flex";

    if (draggingItem.clientX === 0 && draggingItem.clientY === 0) return;
    const pos1 = draggingItem.clientX - e.clientX;
    const pos2 = draggingItem.clientY - e.clientY;
    setDraggingItem({
      ...draggingItem,
      clientX: e.clientX,
      clientY: e.clientY,
    });
    // element.style.position = "fixed";
    element.style.left = `${element.offsetLeft - pos1}px`;
    element.style.top = `${element.offsetTop - pos2}px`;
    console.log(
      "element offsetLeft:",
      element.offsetLeft,
      "element offsetTop:",
      element.offsetTop,
    );

    if (targetElement.x && targetElement.y) {
      element.style.left = `${targetElement.x}px`;
      element.style.top = `${targetElement.y}px`;
    }
  };
  const onDragItemOver = (e) => {
    e.preventDefault();
    const element = document.getElementById(e.target.id);
    const rect = element.getBoundingClientRect();
    setTargetElement({
      ...targetElement,
      id: e.target.id,
      x: rect.left,
      y: rect.top,
    });
  };

  const transitionElements = (pixel, id) => {
    const element = document.getElementById(id);
    const rect = element.getBoundingClientRect();
    element.style.position = "fixed";
    element.style.left = `${rect.left - pixel}px`;
    element.style.top = `${rect.top}px`;
    element.style.transition = "all 0.5s ease-in-out";
  };

  return (
    <div className="drag-context">
      {mockItem.map((item) => (
        <div
          className="drop-area"
          key={item.id}
          id={item.id}
          onDragOver={(e) => onDragItemOver(e)}
        >
          <div
            key={item.id}
            id={`drag-item-${item.id}`}
            className="drag-item"
            style={{
              background: `${item.background}`,
            }}
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
