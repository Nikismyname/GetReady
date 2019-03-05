import React from "react";
import * as c from "../../Utilities/Constants";
import { NavLink } from "react-router-dom";

export default function QuestionView(props) {
    return (
        <div key={props.q.id} onClick={() => props.onClickBody(props.q.id)}>
            <div data-tip="" className="card mb-2" style={{ border: c.videoNotesBorder }}>
                <div className="card-body">
                    <h6 className="card-title">{props.q.name}</h6>
                    <p className="card-text">{props.q.description}</p>
                    <a
                        className="ml-1"
                        href="#"
                        onClick={(e) => props.onClickDelete(e, props.q.id)}
                    >
                        Delete
                    </a>
                    <NavLink
                        className="ml-1"
                        to={c.editQuestionPath + "/" + props.q.id + "/personal/" + props.sheetId}
                        onClick={(e) => { e.stopPropagation() }}>
                        Edit
                    </NavLink>
                </div>
            </div>
        </div>
    )
}