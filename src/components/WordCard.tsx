import { For, Match, Switch, createResource, } from "solid-js";
import { Card, Col, Nav, Row, Tab } from "solid-bootstrap";

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

export interface SimpleWordInfoDto {
    wordId: number;
    text: string;
    partOfSpeech: DefinitionInfoDto[];
    note: string;
    pronounceAudioUrl: string;
}

export interface DefinitionInfoDto {
    partOfSpeech: string;
    definitions: string[];
}


export function WordCard(props: { word: SimpleWordInfoDto }) {

    // const getPronounceAudio = () => {
    //     return new Audio(props.word.pronounceAudioUrl);
    // }
    let play_pronounce = (e: Event) => {
        let audio = new Audio(props.word.pronounceAudioUrl);
        console.log("in play audio");
        audio.play();
    };

    return (<div>
        <h2 class="mx-3">{props.word.text}</h2>
        <span onclick={play_pronounce} class="material-symbols-outlined btn mx-3">
            play_arrow
        </span>
        <Tab.Container defaultActiveKey={0}>
            <Nav variant="pills" class="grid grid-cols-6 gap-1">
                <For each={props.word.partOfSpeech}>{
                    (poc, index) => (
                        <Nav.Item>
                            <Nav.Link eventKey={index()}>{poc.partOfSpeech}</Nav.Link>
                        </Nav.Item>
                    )}
                </For>
            </Nav>
            <Tab.Content>
                <For each={props.word.partOfSpeech}>{
                    (poc, index) => (
                        <Tab.Pane eventKey={index()}>
                            <For each={poc.definitions}>{
                                (def) => (
                                    <p>-{def}</p>
                                )
                            }
                            </For>
                        </Tab.Pane>
                    )}
                </For>
            </Tab.Content>
        </Tab.Container >
    </div>)


}