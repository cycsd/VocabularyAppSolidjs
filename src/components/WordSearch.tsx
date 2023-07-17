import { useMousePosition } from "@solid-primitives/mouse";
import { Position } from '@solid-primitives/utils';
import { createSignal, createResource, Match, Switch } from "solid-js";
import { SaveStatus, WordCard } from "./WordCard";
import { KeyValuePair } from "./KeyValuePair";
import { ResponseOk, fetchGet, fetchPost } from "../util/utilExtension";
import { SimpleWordInfoDto, fetchCategories } from "../context/Resource";
import { ChangeCategory, DeleteWord, GetWord, SaveWord, Word } from "../context/Domain";




export function WordSearch(props: any) {

    const [showSearchIcon, setShowIcon] = createSignal(false);
    const [showDetail, setShowDetail] = createSignal(false);
    const [word, setWord] = createSignal("");
    const [position_onSelect, set_position_onSelect] = createSignal<Position>({ x: 0, y: 0 });

    const OpenDetail = (event: Event) => {
        setShowIcon(false);
        setShowDetail(true);
    }

    const getSelectWord = (event: MouseEvent) => {
        let text = "";
        setShowIcon(false);
        setShowDetail(false);
        const activeEl = document.activeElement;
        const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
        if (window.getSelection && (activeElTagName != "input") && (activeElTagName != "textarea")) {
            text = window.getSelection()?.toString() ?? "";
        }
        if (text.trim().length > 0) {
            if (text != word()) {
                //const pos = useMousePosition();
                var scrollTop = (document.documentElement
                    || document.body.parentNode
                    || document.body).scrollTop;
                set_position_onSelect({ x: event.clientX, y: event.clientY + scrollTop + 20 });
                setWord(word => text.trim().length > 0 ? text : word);
            }
            setShowIcon(icon => !showDetail());
        }

    };

    const fetchDefinition = async (text: string) => {
        if (word().length > 0) {
            const res = await fetchGet(
                'https://localhost:7186/api/Vocabulary/WordDetail'
                , url => { url.searchParams.set('word', word()); return url; })
                .then((res) => {
                    if (res.ok) { return res; } else { throw new Error(res.statusText) }
                });
            return res.json();
        }
        else { throw new Error("bad request"); }
    }
    const [vocabulary, { mutate: setVocabulary }] = createResource<SimpleWordInfoDto, string>(word, fetchDefinition);


    const [categories] = createResource<KeyValuePair[]>(fetchCategories);

    const saveCategories = (seleted: KeyValuePair[]) => {
        setVocabulary({ ...vocabulary()!, categories: seleted });
        ChangeCategory(GetWord(vocabulary()!), seleted);
    }

    const onSaveChange = async (w: SimpleWordInfoDto, pre_status: SaveStatus) => {
        const word: Word = GetWord(w);
        if (pre_status === SaveStatus.Unsaved) {
            return await SaveWord(word)
                .then((res) => {
                    setVocabulary({ ...vocabulary()!, wordId: res.id });
                    return SaveStatus.Saved;
                });
        }
        if (pre_status === SaveStatus.Saved) {
            return await DeleteWord(word)
                .then((_) => SaveStatus.Unsaved)
        }
    }


    return (
        <>
            <div style={
                {
                    position: 'absolute',
                    top: `${position_onSelect().y}px`,
                    left: `${position_onSelect().x}px`
                }
            } class="bg-white">
                <Switch>
                    <Match when={showSearchIcon()}>
                        <button onclick={OpenDetail}>
                            <span class="material-symbols-outlined">translate</span>
                        </button>
                    </Match>
                    <Match when={showDetail() && vocabulary.state === 'ready'}>
                        <div class="border-amber-500 border-2 rounded-md">
                            <WordCard
                                word={() => vocabulary()!}
                                categories={categories() ?? []}
                                onCategoryChange={saveCategories}
                                onSaveChange={onSaveChange}></WordCard>
                        </div>
                    </Match>
                </Switch>
            </div>
            <div onmouseup={getSelectWord} onkeyup={getSelectWord}>
                {props.children}
            </div>
        </>
    )
}