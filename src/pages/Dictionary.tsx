import { Accessor, For, Show, createResource, createSignal } from "solid-js";
import { fetchGet, fetchPost } from "../util/utilExtension";
import { SaveStatus, WordCard } from "../components/WordCard";
import { KeyValuePair } from "../components/KeyValuePair";
import { SimpleWordInfoDto, fetchCategories } from "../context/Resource";
import { ChangeCategory, DeleteWord, GetWord, SaveWord, Word } from "../context/Domain";
import { FaSolidTags } from 'solid-icons/fa'

interface A extends Pick<SimpleWordInfoDto, 'text'> {
    another: string,
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
    const [categories] = createResource<KeyValuePair[]>(fetchCategories);

    const onSaveChange = async (w: SimpleWordInfoDto, pre_status: SaveStatus) => {
        const word: Word = GetWord(w);
        if (pre_status === SaveStatus.Unsaved) {
            return await SaveWord(word)
                .then((res) => {
                    setWords(
                        old => old?.map((o) => o.text === res.text ? { ...o, wordId: res.id } : o)
                    );
                    return SaveStatus.Saved;
                });
        }
        if (pre_status === SaveStatus.Saved) {
            return await DeleteWord(word)
                .then((sr) => {
                    if (sr !== undefined) {
                        setWords(
                            old => old?.filter(o => o.text != sr.text)
                        )
                    }
                    return SaveStatus.Unsaved;
                })
        }
    }

    const saveCategories = (index: Accessor<number>) => (seleted: KeyValuePair[]) => {
        const word = words()?.find((_, i) => i == index());
        ChangeCategory(GetWord(word!), seleted);
        setWords(old => old?.map((o, i) => i == index()
            ? { ...word!, categories: seleted }
            : o))
    }

    return (<>
        <div class="flex items-center">
            <For each={categories()}>{
                (cate) =>
                    <div>
                        <FaSolidTags class="inline"/>
                        {cate.value}
                    </div>
            }
            </For>

        </div>
        <div class="grid grid-cols-1 gap-2">
        <Show when={words()}>
            <For each={words()}>{
                (word, index) => <>
                    <WordCard
                        word={() => word}
                        categories={categories()!}
                        onCategoryChange={saveCategories(index)}
                        onSaveChange={onSaveChange}
                    ></WordCard>
                </>
            }
            </For>
        </Show>
        </div>
    </>)
}