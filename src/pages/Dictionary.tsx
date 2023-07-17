import { For, Show, createResource, createSignal } from "solid-js";
import { fetchGet, fetchPost } from "../util/utilExtension";
import { SaveStatus, WordCard } from "../components/WordCard";
import { KeyValuePair } from "../components/KeyValuePair";
import { SimpleWordInfoDto, fetchCategories } from "../context/Resource";

interface A extends Pick<SimpleWordInfoDto,'text'>{
another:string,
}

export function Dictionary() {
    const getWords = async () => {
        const res = await fetchPost(
            'https://localhost:7186/api/Vocabulary/Words',
            {
                searchText: "",
            }
        );
        return res.json();
    }
    const [words, { mutate: setWords }] = createResource<SimpleWordInfoDto[]>(getWords);
    const onSaveChange = (index: number, word: SimpleWordInfoDto) => {
        setWords(
            old => old?.map((w, i) => i === index ? word : w)
        )
        
    }

    const [categories] = createResource<KeyValuePair[]>(fetchCategories);

    return (<>
        <Show when={words()}>
            <For each={words()}>{
                (word, index) => <>
                    <WordCard
                        word={() => word}
                        categories={categories()!}
                        onCategoryChange={e => e}
                        onSaveChange={async (w, s) => SaveStatus.Saved}
                    ></WordCard>
                </>
            }
            </For>
        </Show>
    </>)
}