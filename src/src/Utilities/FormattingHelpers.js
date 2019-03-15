import React from "react";
import { secondaryColor } from "./Constants"

const codeBlockTag = "<<c>>";
const emphasisBlockTag = "<<e>>"

const paragraphTBlockTag = "<<p>>";
const yellowTBlockTag = "<<y>>";

const inlineCodeTag = "<<s>>";
const inlineEmpTag = "<<em>>";

const fontSize = 25;
const empBackgroundColor = secondaryColor;

let preStyle = {fontSize, whiteSpace: "pre-wrap", margin: 0,};

export const blockMappings = {
    [codeBlockTag]: parseCodeBlock,
    [emphasisBlockTag]: parseEmpBlock,
};

function parseCodeBlock(text) {
    return (
        <pre
            className="mt-3 mb-3"
            style={{fontSize: 20, whiteSpace: "pre-wrap", margin: 0,}}
            dangerouslySetInnerHTML={{ __html: window.PR.prettyPrintOne(text) }}
        />
    )
}

function parseEmpBlock(text) {
    //console.log("EMP PARSED: "+ text);
    return (
        <div
            style={{
                backgroundColor: empBackgroundColor,
                display: "inline-block"
            }}
            className="p-3"
        >
            <pre style={preStyle}>
                {text}
            </pre>
        </div>
    )
}

export const transperantBlockMappings = {
    [yellowTBlockTag]: yellowFormatting,
    [paragraphTBlockTag]: paragraphFormatting,
};

export function makePre(items){
    return (
        <pre style={preStyle}>
            {items}
        </pre>
    );
}

function yellowFormatting(items) {
    return (
            <div style={{ backgroundColor: "yellow" }}>{items}</div>
    );
};

function paragraphFormatting(items) {
    return (
        <p>{items}</p>
    );
}

export const inlineMappings = {
    [inlineCodeTag]: parseInlineCode,
    [inlineEmpTag]: parseInlineEmp,
};

function parseInlineCode(text) {
    text = replaceTags(text);
    return <span
        className="pr-2 pl-2"
        dangerouslySetInnerHTML={{ __html: window.PR.prettyPrintOne(text) }}
    >
    </span>
}

function parseInlineEmp(text) {
    return <span
        className="pr-2 pl-2"
        style={{ backgroundColor: empBackgroundColor }}
    >{text}
    </span>
}



export function replaceTags(str) {
    return str.replace(/[<>]/g, replaceTag);
}
function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}
var tagsToReplace = {
    '<': '&lt;',
    '>': '&gt;'
};

export function trimEnds(chunk) {
    if (chunk.startsWith("\n")) {
        chunk = chunk.slice(1);
    }
    // if (chunk.endsWith("\n")) {
    //     chunk = chunk.slice(0,chunk.length-1);
    // }
    return chunk
}












// function parseEmpAndCode(text) {
//     let chunks = text.split(codeBlockTag);
//     let result = [];
//     for (let i = 0; i < chunks.length; i++) {
//         let chunk = chunks[i];
//         ///Code Here
//         if (i % 2 === 1) {
//             chunk = replaceTags(chunk);
//             result.push(
//                 <pre
//                     key={i}
//                     style={{ fontSize, }}
//                     dangerouslySetInnerHTML={{ __html: window.PR.prettyPrintOne(chunk) }} />);
//         }
//         ///Rest Here
//         else {
//             result.push(...parseEmp(chunk));
//         }
//     };

//     return result.map(x=>x[0]);
// }

// function parseEmp(text) {
//     let chunks = text.split(emphasisBlockTag);
//     let result = [];
//     for (let i = 0; i < chunks.length; i++) {
//         let chunk = chunks[i];
//         if (i % 2 === 1) {
//             chunk = trimEnds(chunk);
//             result.push(
//                 <div
//                     style={{
//                         backgroundColor: empBackgroundColor,
//                         display: "inline-block"
//                     }}
//                     className="p-3"
//                 >
//                     <pre style={{
//                         whiteSpace: "pre-wrap",
//                         margin: 0,
//                         fontSize,
//                     }}>
//                         {chunk}
//                     </pre>
//                 </div>
//             );
//         } else {
//             result.push(parseParagraphs(chunk));
//         }
//     };
//     return result;
// }

// function parseParagraphs(text) {
//     let chunks = text.split(paragraphTBlockTag);
//     let result = [];
//     let toEqual = 1;
//     for (let i = 0; i < chunks.length; i++) {
//         let chunk = chunks[i];
//         if (chunk === "\n\r" || chunk.length === 0) {
//             if (toEqual === 1) {
//                 toEqual = 0;
//             } else {
//                 toEqual = 1;
//             }
//             continue;
//         }
//         if (i % 2 === toEqual) {
//             chunk = trimEnds(chunk)
//             result.push(<p>{parseInlineElements(chunk, inlineMappings)}</p>);
//         } else {
//             result.push(...parseInlineElements(chunk, inlineMappings));
//         }
//     };

//     return <pre style={{ whiteSpace: "pre-wrap", fontSize }}>{result}</pre>;
// }