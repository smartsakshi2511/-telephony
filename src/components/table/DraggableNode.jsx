// src/components/table/DraggableNode.js
import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableNode = ({ type }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'node',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        padding: '10px',
        border: '1px solid black',
        backgroundColor: isDragging ? '#ccc' : 'white',
        cursor: 'move',
      }}
    >
      {type} Node
    </div>
  );
};

export default DraggableNode;
