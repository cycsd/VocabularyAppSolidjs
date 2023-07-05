import { For, Index, Match, Show, Switch, createResource, createSignal } from "solid-js";
import { useWordContext } from "../context/WordContext"
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


export function WordCard() {

    const wordContext = useWordContext();
    const fetchDefinition = async (text: string) => {
        let url = new URL('https://localhost:7186/api/Vocabulary');
        if (wordContext?.word() != undefined && wordContext.word() != "") {
            url.searchParams.set('word', wordContext?.word());
            //console.log(url.toString());
            const res = await fetch(url.toString()).then((res) => {
                if (res.ok) { return res; } else { throw new Error(res.statusText) }
            });
            return res.json();
        }
        else { throw new Error("bad request"); }

    }
    const [vocabulary] = createResource<SimpleWordInfoDto, string>(wordContext?.word, fetchDefinition);
    const getPronounceAudio = () => {
        return new Audio(vocabulary()?.pronounceAudioUrl);
    }
    let play_pronounce = (e: Event) => {
        let audio = getPronounceAudio();
        audio.play();
    };

    return (<div>
        <Switch>
            <Match when={vocabulary.state === 'ready'}>
                <h2 class="mx-3">{vocabulary()?.text}</h2>
                <span onclick={play_pronounce} class="material-symbols-outlined btn mx-3">
                    play_arrow
                </span>
                <Tab.Container defaultActiveKey={0}>
                    <Nav variant="pills" class="grid grid-cols-6 gap-1">
                        <For each={vocabulary()?.partOfSpeech}>{
                            (poc, index) => (
                                <Nav.Item>
                                    <Nav.Link eventKey={index()}>{poc.partOfSpeech}</Nav.Link>
                                </Nav.Item>
                            )}
                        </For>
                    </Nav>
                    <Tab.Content>
                        <For each={vocabulary()?.partOfSpeech}>{
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
            </Match>
        </Switch>
    </div>)


}