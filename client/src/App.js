import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FicheStack from './components/FicheStack';
import DropZone from './components/DropZone';

const App = () => {
  const [fiches, setFiches] = React.useState(Array.from({ length: 10 }, (_, i) => i + 1));

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newFiches = Array.from(fiches);
    const [removed] = newFiches.splice(result.source.index, 1);
    newFiches.splice(result.destination.index, 0, removed);
    setFiches(newFiches);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
        <Droppable droppableId="droppableFiches">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
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
        <DropZone id="dropzone1" />
        <DropZone id="dropzone2" />
      </div>
    </DragDropContext>
  );
};

export default App;
