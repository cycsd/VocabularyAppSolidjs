import { Accessor, For, Show, createResource, createSignal } from "solid-js";
import { fetchGet, fetchPost } from "../util/utilExtension";
import { SaveStatus, WordCard } from "../components/WordCard";
import { KeyValuePair } from "../components/KeyValuePair";
import { SimpleWordInfoDto, fetchCategories } from "../context/Resource";
import { ChangeCategory, DeleteWord, GetWord, SaveWord, Word } from "../context/Domain";
import { FaSolidTags } from 'solid-icons/fa'
import { AiOutlineSearch } from 'solid-icons/ai'

interface SearchParas extends Partial<Pick<SimpleWordInfoDto, 'text' | 'categories'>> {
}

export function Dictionary() {
    const getWords = async (para:SearchParas) => {
        const res = await fetchPost(
            'https://localhost:7186/api/Vocabulary/Words',
            para
        );
        return res.json();
    }
    const [categories] = createResource<KeyValuePair[]>(fetchCategories);
    const [searchOption, setSearchOption] = createSignal<SearchParas>(
        { text: "" }
    );    
    const [words, { mutate: setWords }] = createResource<SimpleWordInfoDto[],SearchParas>(
        searchOption,
        getWords);

    const keySearch = (e: KeyboardEvent) => {
        setSearchOption({ ...searchOption(), 
            text: (e.target as HTMLInputElement).value })
    }
    const clickCategoryFilter = (category:KeyValuePair)=>{
        setSearchOption({...searchOption(),
        categories:[category]})
    }

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
        <div class="flex gap-2 justify-around border-2 border-black rounded-xl w-2/3 mx-auto text-2xl">
            <input onkeyup={keySearch} class="w-full rounded-lg p-2" placeholder="Search..."></input>
            <button>
                <AiOutlineSearch />
            </button>
        </div>
        <div class="flex items-center gap-4 p-5">
            <For each={categories()}>{
                (cate) =>
                    <div>
                        <button onclick={()=>clickCategoryFilter(cate)}>
                        <FaSolidTags class="inline" />
                        {cate.value}
                        </button>
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