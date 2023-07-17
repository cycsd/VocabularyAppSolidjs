import { For, Show, createResource, createSignal } from "solid-js";
import { fetchGet, fetchPost } from "../util/utilExtension";
import { SaveStatus, SimpleWordInfoDto, WordCard } from "../components/WordCard";
import { KeyValuePair } from "../components/KeyValuePair";


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
    const [words] = createResource<SimpleWordInfoDto[]>(getWords);
    const fetchCategories = async () => {
        const res = await fetchGet('https://localhost:7186/api/Vocabulary/Categories')
        return res.json()
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
                        onSaveChange={async(w,s)=>SaveStatus.Saved}
                    ></WordCard>
                </>
            }
            </For>
        </Show>
    </>)
}