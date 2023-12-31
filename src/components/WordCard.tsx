import { Accessor, For, Match, Switch, createMemo, createResource, createSignal, } from "solid-js";
import { Card, Col, Nav, Row, Tab } from "solid-bootstrap";
import { KeyValuePair } from "./KeyValuePair";
import { KeyValueOptionsMutilpleSelect } from "./KeyValueOptionMutilpleSelect";
import { SimpleWordInfoDto } from "../context/Resource";

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


export enum SaveStatus {
    Saved,
    Unsaved,
}

export function WordCard(props: {
    word: Accessor<SimpleWordInfoDto>,
    categories: KeyValuePair[],
    onCategoryChange: (selected: KeyValuePair[]) => void,
    onSaveChange: (word: SimpleWordInfoDto, pre_status: SaveStatus) => Promise<SaveStatus | undefined>,
}) {
    const { word, categories, onCategoryChange, onSaveChange } = props;

    const [savedStatus, setSaveStatus] = createSignal(
        word().categories.length === 0
            ? SaveStatus.Unsaved
            : SaveStatus.Saved);


    const saveWord = async () => {
        const pre_status = savedStatus();
        const new_status = await onSaveChange(word(), pre_status);
        setSaveStatus(new_status!);
    }
    let play_pronounce = (e: Event) => {
        let audio = new Audio(word().pronounceAudioUrl);
        audio.play();
    };

    return (<div>
        <div class="flex justify-between">
            <div>
                <h2 class="mx-3">{word().text}</h2>
                <span onclick={play_pronounce} class="material-symbols-outlined btn mx-3">
                    play_arrow
                </span>
            </div>
            <div class="flex justify-end items-center basis-2/3">
                <KeyValueOptionsMutilpleSelect
                    selectedValue={() => word().categories}
                    optionValues={() => props.categories}
                    onChange={onCategoryChange}
                    labelName="category" />
                <button onclick={saveWord}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke="red"
                        fill={savedStatus() == SaveStatus.Saved ? "red" : "none"}
                        class="w-6 h-6">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                </button>
            </div>
        </div>
        <Tab.Container defaultActiveKey={0}>
            <Nav variant="pills" class="flex gap-2">
                <For each={word().partOfSpeech}>{
                    (poc, index) => (
                        <Nav.Item>
                            <Nav.Link eventKey={index()}>{poc.partOfSpeech}</Nav.Link>
                        </Nav.Item>
                    )}
                </For>
            </Nav>
            <Tab.Content>
                <For each={word().partOfSpeech}>{
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