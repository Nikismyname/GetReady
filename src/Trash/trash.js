// const SortableQuestion = SortableElement(({ value, _this, ind }) => {
//     return (
//         <div key={ind} className="col-sm-4" onClick={() => _this.onClickGlobalQuestion(value.id)}>
//             <div data-tip="" className="card mb-2" style={{ border: c.videoNotesBorder }}>
//                 <div className="card-body">
//                     <h6 className="card-title">{value.name}</h6>
//                     <p className="card-text">{value.description}</p>
//                     <a className="ml-1" href="#" onClick={(e) => _this.onClickDeleteQuestion(e, value.id)} >Delete</a>
//                     <NavLink className="ml-1" to={c.editQuestionPath + "/" + value.id + "/personal/" + _this.state.currentSheet.id} onClick={_this.onCLickStopPropagation}>Edit</NavLink>
//                 </div>
//             </div>
//         </div>
//     )
// });

// const SortableQuestions = SortableContainer(({ items, _this }) => {
//     let globalQ = items;
//     let rows = globalQ.length / 3;
//     rows = Math.ceil(rows);
//     let result = [];

//     for (let i = 0; i < rows; i++) {
//         let thisRowQuestions = [];
//         for (let j = 0; j < 3; j++) {
//             let currentIndex = i * 3 + j;
//             if (currentIndex < globalQ.length) {
//                 thisRowQuestions.push(globalQ[currentIndex]);
//             }
//         };

//         result.push((
//             <div className="row" key={result.length}>
//                 {thisRowQuestions.map((x, i) => (
//                     <SortableQuestion value={x} index={i} ind={i} _this={_this} />
//                 ))}
//             </div>
//         ));
//     };

//     return result;
// });