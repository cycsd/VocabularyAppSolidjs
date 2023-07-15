import { useMousePosition } from "@solid-primitives/mouse";
import { Position } from '@solid-primitives/utils';
import { createSignal, createResource, Match, Switch } from "solid-js";
import { SimpleWordInfoDto, WordCard } from "./WordCard";
import { KeyValuePair } from "./KeyValuePair";
import { fetchGet } from "../util/utilExtension";

export function WordSearch(props: any) {

    const [showSearchIcon, setShowIcon] = createSignal(false);
    const [showDetail, setShowDetail] = createSignal(false);
    const [word, setWord] = createSignal("");
    const [position_onSelect, set_position_onSelect] = createSignal<Position>({ x: 0, y: 0 });

    const OpenDetail = (event: Event) => {
        setShowIcon(false);
        setShowDetail(true);
    }

    const getSelectWord = (event: Event) => {
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
                const pos = useMousePosition();
                set_position_onSelect({ x: pos.x, y: pos.y + 20 });
                setWord(word => text.trim().length > 0 ? text : word);
            }
            setShowIcon(icon => !showDetail());
        }

    };

    const fetchDefinition = async (text: string) => {
        let url = new URL('https://localhost:7186/api/Vocabulary/WordDetail');
        if (word().length > 0) {
            url.searchParams.set('word', word());
            console.log(url.toString());
            const res = await fetch(url.toString()).then((res) => {
                if (res.ok) { return res; } else { throw new Error(res.statusText) }
            });
            return res.json();
        }
        else { throw new Error("bad request"); }
    }
    const [vocabulary,{mutate:setVocabulary}] = createResource<SimpleWordInfoDto, string>(word, fetchDefinition);

    const fetchCategories = async () => {
        const res = await fetchGet('https://localhost:7186/api/Vocabulary/Categories')
        return res.json()
    }
    const [categories] = createResource<KeyValuePair[]>(fetchCategories);

    const saveCategories = (seleted:KeyValuePair[])=>{
        console.log({seleted});
        setVocabulary({...vocabulary()!,categories:seleted});
        console.log(vocabulary());

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
                                word={()=>vocabulary()!}
                                categories={categories() ?? []}
                                onCategoryChange={saveCategories} ></WordCard>
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