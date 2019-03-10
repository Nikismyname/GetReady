export function orderInitialColumns(questions) { 
    let unassigned = [];
    let col1 = [];
    let col2 = [];
    let col3 = [];

    for (let i = 0; i < questions.length; i++){
        let question = questions[i];
        switch (question.column) {
            case 1:
                col1.push(question);
                break;
            case 2:
                col2.push(question);
                break;
            case 3:
                col3.push(question);
                break;
            default:
                unassigned.push(question);
                break;
        }
    };

    col1 = col1.sort((a, b) => a.order - b.order);
    col2 = col2.sort((a, b) => a.order - b.order);
    col3 = col3.sort((a, b) => a.order - b.order);

    if (unassigned.length === 0) {
        return [col1, col2, col3]
    } else {
        return orderColumns(col1, col2, col3, unassigned) ;
    }
}

export function orderColumns(col1, col2, col3, unassigned = [], saveOrderCallBack) {
    let all = [...col1, ...col2, ...col3, ...unassigned];
    col1 = col2 = col3 = [];
    let allLenght = all.length;
    let remainder = allLenght % 3;
    let solidColumnLenght = (allLenght - remainder) / 3;
    let columnOneHasOneExtra = remainder >= 1;
    let columnTwoHasOneExtra = remainder >= 2;
    let columnOneLenght = solidColumnLenght + (columnOneHasOneExtra ? 1 : 0);
    col1 = all.slice(0, columnOneLenght);
    let columnThoLenght = solidColumnLenght + (columnTwoHasOneExtra ? 1 : 0);
    col2 = all.slice(columnOneLenght, columnOneLenght + columnThoLenght);
    col3 = all.slice(columnOneLenght + columnThoLenght);

    let columns = [col1, col2, col3];

    return columns;
}

export function createOrderings(columns) {
    let orderings = [];

    for (let i = 0; i < columns.length; i++) {
        let column = columns[i];

        for (let j = 0; j < column.length; j++) {
            let q = column[j];
            orderings.push([q.id, j, i+1]);
        };
    };
    return orderings
}
