import React from "react";
import { secondaryColor } from "./Constants"

const codeSeparationTag = "<<c>>";
const emphasisSeparationTag = "<<e>>"
const inlineCodeTag = "<<s>>";
const inlineEmpTag = "<<em>>";
const paragraphTag = "<<p>>";

const fontSize = 25;
const empBackgroundColor = secondaryColor;

export function parseEmpAndCode(text) {
    let chunks = text.split(codeSeparationTag);
    let result = [];
    for (let i = 0; i < chunks.length; i++) {
        let chunk = chunks[i];
        ///Code Here
        if (i % 2 === 1) {
            chunk = replaceTags(chunk);
            result.push(
                <pre
                    key={i}
                    style={{ fontSize, }}
                    dangerouslySetInnerHTML={{ __html: window.PR.prettyPrintOne(chunk) }} />);
        }
        ///Rest Here
        else {
            result.push(...parseEmp(chunk));
        }
    };

    return result;
}

function parseEmp(text) {
    let chunks = text.split(emphasisSeparationTag);
    let result = [];
    for (let i = 0; i < chunks.length; i++) {
        let chunk = chunks[i];
        if (i % 2 === 1) {
            chunk = trimEnds(chunk);
            result.push(
                <div
                    style={{
                        backgroundColor: empBackgroundColor,
                        display: "inline-block"
                    }}
                    className="p-3"
                >
                    <pre style={{
                        whiteSpace: "pre-wrap",
                        margin: 0,
                        fontSize,
                    }}>
                        {chunk}
                    </pre>
                </div>
            );
        } else {
            result.push(parseParagraphs(chunk));
        }
    };
    return result;
}

function parseParagraphs(text) {
    let chunks = text.split(paragraphTag);
    let result = [];
    let toEqual = 1;
    for (let i = 0; i < chunks.length; i++) {
        let chunk = chunks[i];
        if (chunk === "\n\r" || chunk.length === 0) {
            if (toEqual === 1) {
                toEqual = 0;
            } else {
                toEqual = 1;
            }
            continue;
        }
        if (i % 2 === toEqual) {
            chunk = trimEnds(chunk)
            result.push(<p>{parseInlineElements(chunk, inlineMappings)}</p>);
        } else {
            result.push(...parseInlineElements(chunk, inlineMappings));
        }
    };

    return <pre style={{ whiteSpace: "pre-wrap", fontSize }}>{result}</pre>;
}

function parseInlineElements(text, mappings) {

    let tags = Object.keys(mappings);
    let lines = [];
    let currentIndexForLine = [];
    for (let i = 0; i < tags.length; i++) {
        lines[i] = [];
        currentIndexForLine[i] = 0;
    };

    for (let i = 0; i < tags.length; i++) {
        let tag = tags[i];
        let tagLength = tag.length;

        let index = text.indexOf(tag);
        while (index !== -1) {
            lines[i].push(index);
            index = text.indexOf(tag, index + 1);
        }
    };

    let preParts = [];
    let prevIndex = 0;

    while (true) {
        let minTextIndex = Number.MAX_SAFE_INTEGER;
        let secondTextIndex;
        let index;
        let currTag;
        let foundOne = false;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].length < 2 || lines[i].length <= currentIndexForLine[i]) {
                continue;
            }

            if (lines[i][currentIndexForLine[i]] < minTextIndex) {
                minTextIndex = lines[i][currentIndexForLine[i]];
                secondTextIndex = lines[i][currentIndexForLine[i] + 1]
                index = i;
                currTag = tags[i];
                foundOne = true;
            }
        };

        if (foundOne === false) {
            break;
        } else {
            currentIndexForLine[index] += 2;
        }

        let tagLength = currTag.length;

        let startIndex = minTextIndex;
        let endIndex = secondTextIndex;

        let preText = text.slice(prevIndex, startIndex);
        let specialText = text.slice(startIndex + tagLength, endIndex);

        preText = trimEnds(preText);
        preParts.push(<text>{preText}</text>);
        // if (!emptyContent.includes(preText)) {
        //     preText = trimEnds(preText);
        //     preParts.push(<text>{preText}</text>);
        // }
        specialText = replaceTags(specialText);
        specialText = trimEnds(specialText);

        preParts.push(mappings[currTag](specialText));
        // if (!emptyContent.includes(specialText)) {
        //     specialText = replaceTags(specialText);
        //     specialText = trimEnds(specialText);
        //     preParts.push(mappings[currTag](specialText));
        // }

        prevIndex = endIndex + tagLength;
    };

    let trailingText = text.slice(prevIndex);
    trailingText = trimEnds(trailingText);
    preParts.push(<text>{trailingText}</text>);

    // if (!emptyContent.includes(trailingText)) {
    //     trailingText = trimEnds(trailingText);
    //     preParts.push(<text>{trailingText}</text>);
    // }

    return preParts;
}

let inlineMappings = {
    [inlineCodeTag]: parseInlineCode,
    [inlineEmpTag]: parseInlineEmp,
};

function parseInlineCode(text) {
    text = replaceTags(text);
    return <span
        className="pr-2 pl-2"
        style={{ backgroundColor: empBackgroundColor }}
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

function replaceTags(str) {
    return str.replace(/[<>]/g, replaceTag);
}

var tagsToReplace = {
    '<': '&lt;',
    '>': '&gt;'
};

function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function trimEnds(chunk) {
    if (chunk.startsWith("\n")) {
        chunk = chunk.slice(1);
    }
    // if (chunk.endsWith("\n")) {
    //     chunk = chunk.slice(0,chunk.length-1);
    // }
    return chunk
}
