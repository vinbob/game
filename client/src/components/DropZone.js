import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

const DropZone = ({ id }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            width: '120px',
            height: '200px',
            border: '2px dashed gray',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '10px',
          }}
        >
          {id}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DropZone;
