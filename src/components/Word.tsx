import { createResource } from "solid-js";
import { useWordContext } from "../context/WordContext"

export interface VocabularyDto {
    wordId: number | null;
    note: string;
    word: string;
    phonetic: string;
    phonetics: Phonetic[];
    meanings: Meaning[];
    license: License;
    sourceUrls: string[];
}

export interface Definition {
    definition: string;
    synonyms: any[];
    antonyms: any[];
    example: string;
}

export interface License {
    name: string;
    url: string;
}

export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
    synonyms: any[];
    antonyms: string[];
}

export interface Phonetic {
    text: string;
    audio: string;
    sourceUrl: string;
    license: License;
}


export function WordCard() {

    const wordContext = useWordContext();
    const fetchDefinition = async (text:string) => {
        let url = new URL('https://localhost:7186/api/Vocabulary');
        if (wordContext?.word() != undefined && wordContext.word() != "")
            url.searchParams.set('word', wordContext?.word());
        const res = await fetch(url.toString());
        return res.json()

    }
    const [vocabulary]=createResource<VocabularyDto,string>(wordContext?.word,fetchDefinition);
    return <>
        <h1 >{wordContext?.word()}</h1>

        <h1 >{vocabulary()?.word}</h1>
    </>
}