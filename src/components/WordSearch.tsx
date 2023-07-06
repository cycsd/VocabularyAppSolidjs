import { useMousePosition } from "@solid-primitives/mouse";
import { Position } from '@solid-primitives/utils';
import { createSignal, createResource, Match, Switch, onMount, onCleanup } from "solid-js";
import { SimpleWordInfoDto, WordCard } from "./WordCard";

export function WordSearch(props: any) {

    const [showSearchIcon, setShowIcon] = createSignal(false);
    const [showDetail, setShowDetail] = createSignal(false);
    const [word, setWord] = createSignal("");
    const [position_onSelect, set_position_onSelect] = createSignal<Position>({ x: 0, y: 0 });

    let ref: HTMLDivElement;
    const OpenDetail = (event: Event) => {
        event.stopPropagation();
        setShowIcon(false);
        setShowDetail(true);
        console.log("OpenDetail");
    }

    const getSelectWord = (event: MouseEvent) => {
        console.log("getselectword");
        let text = "";
        const activeEl = document.activeElement;
        const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
        if (window.getSelection && (activeElTagName != "input") && (activeElTagName != "textarea")) {
            text = window.getSelection()?.toString() ?? "";
        }
        if (!ref.contains(event.target as Element)) {
            setShowIcon(false);
            setShowDetail(false);
            console.log("not in div");
        }
        if (text.trim().length > 0) {
            if (text != word()) {
                const pos = useMousePosition();
                set_position_onSelect({ x: pos.x, y: pos.y + 20 });
                setWord(word => text.trim().length > 0 ? text : word);
            }
            console.log(showDetail());
            setShowIcon(true);
            console.log(text);
        }


    };

    const fetchDefinition = async (text: string) => {
        let url = new URL('https://localhost:7186/api/Vocabulary');
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
    const [vocabulary] = createResource<SimpleWordInfoDto, string>(word, fetchDefinition);

    onMount(() => {
        window.addEventListener("dblclick", getSelectWord);
        window.addEventListener("mouseup", getSelectWord);
    })
    onCleanup(() => {
        window.removeEventListener("dblclick", getSelectWord);
        window.removeEventListener("mouseup", getSelectWord);
    })

    return (
        <>
            <div ref={ref!} style={
                {
                    position: 'absolute',
                    top: `${position_onSelect().y}px`,
                    left: `${position_onSelect().x}px`
                }
            } class="bg-white">
                <Switch>
                    <Match when={showDetail() && vocabulary.state === 'ready'}>
                        <div class="border-amber-500 border-2 rounded-md">
                            <WordCard word={vocabulary()!}></WordCard>
                        </div>
                    </Match>
                    <Match when={showSearchIcon()}>
                        <button onclick={OpenDetail}>
                            <span class="material-symbols-outlined">translate</span>
                        </button>
                    </Match>

                </Switch>
            </div>
            <div >
                {props.children}
            </div>
        </>
    )
}