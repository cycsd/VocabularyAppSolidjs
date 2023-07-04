import { For, createResource } from "solid-js";
import { useWordContext } from "../context/WordContext"
import { Col, Nav, Row, Tab } from "solid-bootstrap";

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
    pronuanceAudioUrl: string;
}

export interface DefinitionInfoDto {
    partOfSpeech: string;
    definitions: string[];
}


export function WordCard() {

    const wordContext = useWordContext();
    const fetchDefinition = async (text: string) => {
        let url = new URL('https://localhost:7186/api/Vocabulary');
        if (wordContext?.word() != undefined && wordContext.word() != "")
            url.searchParams.set('word', wordContext?.word());
        console.log(url.toString());
        const res = await fetch(url.toString());
        return res.json()

    }
    const [vocabulary] = createResource<SimpleWordInfoDto, string>(wordContext?.word, fetchDefinition);
    return <div>
        <Tab.Container>
            <Row>
                <Nav variant="pills" class="flex-column grid">
                    <For each={vocabulary()?.partOfSpeech}>{
                        (poc) => (
                            <Nav.Item>
                                <Nav.Link eventKey={poc.partOfSpeech}>{poc.partOfSpeech}</Nav.Link>
                            </Nav.Item>
                        )}
                    </For>
                </Nav>
            </Row>
            <Row>
                <Tab.Content>
                    <For each={vocabulary()?.partOfSpeech}>{
                        (poc) => (
                            <Tab.Pane eventKey={poc.partOfSpeech}>
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
            </Row>

        </Tab.Container >
    </div>
}