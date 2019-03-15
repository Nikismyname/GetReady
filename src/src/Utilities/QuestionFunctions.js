import React from "react";
import {
    blockMappings,
    transperantBlockMappings,
    inlineMappings,
    replaceTags,
    trimEnds,
    makePre,
} from "./FormattingHelpers";

export function formatText(text) {
    return ParseTransperantBlockElements(text, transperantBlockMappings);
}

function ParseTransperantBlockElements(text, mappings) {
    let tags = Object.keys(mappings);
    let result = [
        [text, false /*is in final state!*/]
    ];

    for (let j = 0; j < tags.length; j++) {
        let tag = tags[j];
        let newResult = [];
        for (let k = 0; k < result.length; k++) {
            if (result[k][1] === true) {
                newResult.push(result[k]);
                continue;
            };
            if (result[k][0].length === 0 || result[k][0]==="\n") {
                continue;
            };

            let currText = result[k][0];
            let chunks = currText.split(tag);
            let toEqual = 1;
            for (let i = 0; i < chunks.length; i++) {
                let chunk = chunks[i];
                if (i % 2 === toEqual) {
                    chunk = trimEnds(chunk);
                    let formattedChunk = mappings[tag](ParseBlockElements(chunk, blockMappings));
                    chunk = [formattedChunk, true];
                    newResult.push(chunk);
                } else {
                    chunk = [chunk, false];
                    newResult.push(chunk);
                }
            };
        };
        result = newResult;
    };

    //console.log("NUMBER OF TRANS BLOCK ELEMENTS: " + result.length);

    for (let i = 0; i < result.length; i++) {
        if (result[i][1] === false) {
            result[i][0] = ParseBlockElements(result[i][0], blockMappings);
        }
    };

    return result.map(x=>x[0]);
}

function ParseBlockElements(text, mappings) {
    let tags = Object.keys(mappings);
    let result = [
        [text, false /*is in final state!*/]
    ];

    for (let j = 0; j < tags.length; j++) {
        let tag = tags[j];
        let newResult = [];
        for (let k = 0; k < result.length; k++) {
            if (result[k][1] === true) {
                newResult.push(result[k]);
                continue;
            };
            if (result[k][0].length === 0 || result[k][0]==="\n") {
                continue;
            };
            let currText = result[k][0];
            let chunks = currText.split(tag);

            let toEqual = 1;
            for (let i = 0; i < chunks.length; i++) {
                let chunk = chunks[i];
                if (i % 2 === toEqual) {
                    chunk = trimEnds(chunk);
                    let formattedChunk = mappings[tag](chunk);
                    chunk = [formattedChunk, true];
                    newResult.push(chunk);
                } else {
                    chunk = [chunk, false];
                    newResult.push(chunk);
                }
            };
        };
        result = newResult;
    };

    //console.log("NUMBER OF BLOCK ELEMENTS: " + result.length);

    for (let i = 0; i < result.length; i++) {
        if (result[i][1] === false) {
            result[i][0] = makePre(parseInlineElements(result[i][0], inlineMappings));
            result[i][1] = true;
        }
    };

    return result.map(x => x[0]);
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
        if (preText.length !== 0 && preText !== "\n") {
            preText = trimEnds(preText);
            preParts.push(<text>{preText}</text>);
        }

        let specialText = text.slice(startIndex + tagLength, endIndex);
        specialText = replaceTags(specialText);
        specialText = trimEnds(specialText);
        preParts.push(mappings[currTag](specialText));
        let specialTextSymbolAfterTag = text.slice(endIndex + tagLength, endIndex + tagLength+1)
        if (specialTextSymbolAfterTag === "\n") {
            preParts.push(<br/>)
        }

        prevIndex = endIndex + tagLength;
    };

    let trailingText = text.slice(prevIndex);
    if (trailingText.length !== 0 && trailingText!=="\n") {
        trailingText = trimEnds(trailingText);
        preParts.push(<text>{trailingText}</text>);
    }

    return preParts;
}
