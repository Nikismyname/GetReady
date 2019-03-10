import React from "react";
import { Droppable, Draggable } from 'react-beautiful-dnd';
import * as c from "../Constants";

const grid = 0;

export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

export const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: "0 0 ${grid}px 0",

    // change background colour if dragging
    background: isDragging ? "lightgreen" : c.secondaryColor,

    // styles we need to apply on draggables
    ...draggableStyle
});

export const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? c.secondaryColor : c.primaryColor,
    padding: grid,
});

export const getEmptyListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    background: c.secondaryColor,
    padding: "0 0 200px 0",
});


export function renderDroppable(items, colId) {
    return <Droppable droppableId={colId.toString()} direction="horizontal">
        {(provided, snapshot) => (
            <div className="row"
                ref={provided.innerRef}
                style={
                    items.length > 0 ?
                        getListStyle(snapshot.isDraggingOver) :
                        getEmptyListStyle(snapshot.isDraggingOver)
                }
            >
                {items.map((item, index) => (
                    <div className="col-sm-4">
                        <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                    )}
                                >
                                    {item.item}
                                </div>
                            )}
                        </Draggable>
                        </div>
                ))}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
}

export async function extOnDragEnd (result, _this, collections, saveReorderings, orderColumns){
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
        return;
    }

    if (source.droppableId === destination.droppableId) {
        const items = reorder(
            _this.state[source.droppableId],
            source.index,
            destination.index
        );

        await _this.setState({ [source.droppableId]: items });
    } else {
        const result = move(
            _this.state[source.droppableId],
            _this.state[destination.droppableId],
            source,
            destination
        );

        let state = {
            [source.droppableId]: result[source.droppableId],
            [destination.droppableId]: result[destination.droppableId],
        };

        await _this.setState(state);
    }

    let [col1, col2, col3] = orderColumns(_this.state.col1, _this.state.col2, _this.state.col3);

    await _this.setState({col1, col2, col3});

    let orderings = [];

    for (let i = 0; i < collections.length; i++) {
        let collection = collections[i];

        for (let j = 0; j < _this.state[collection].length; j++) {
            let q = _this.state[collection][j];
            orderings.push([q.id, j, i+1]);
        };
    };

    saveReorderings(orderings);
};