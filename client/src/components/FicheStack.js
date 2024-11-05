import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const FicheStack = ({ fiches }) => {
  return (
    <Droppable droppableId="droppableFiches">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
            width: '120px',
          }}
        >
          {fiches.map((id, index) => (
            <Draggable key={id} draggableId={String(id)} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    ...provided.draggableProps.style,
                    height: '50px',
                    width: '100px',
                    backgroundColor: 'lightblue',
                    margin: '5px',
                    cursor: 'move',
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  Fiche {id}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default FicheStack;
