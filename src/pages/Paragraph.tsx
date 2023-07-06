import { useParams } from "@solidjs/router"
import { Show, createResource, createSignal } from "solid-js";
import { WordProvider, useWordContext } from "../context/WordContext";
import { WordCard } from "../components/Word";
import { createPositionToElement, useMousePosition } from "@solid-primitives/mouse";

interface Paragraph {
    uri: string,
    audioUri: string,
    content: string,
}

export function Paragraph() {
    const path = decodeURIComponent(useParams().path);

    const fetchParagraph = async () => {
        let url = new URL('https://localhost:7186/api/Article/paragraph');
        url.searchParams.set('path', path);
        const res = await fetch(url.toString());
        return res.json();
    }
    const [paragraph] = createResource<Paragraph>(fetchParagraph);

    const lerp = (current: number, goal: number, p: number): number =>
        (1 - p) * current + p * goal;
    const [pos, setPos] = createSignal({ x: 0, y: 0, elX: 0, elY: 0 });

    const [wordCardRef, setWordCardRef] = createSignal<HTMLDivElement>();
    const mouse = useWordContext().mouse_poition_on_click;
    const relative = createPositionToElement(wordCardRef, mouse);

    return (< Show when={paragraph()} fallback={<p> loading...</p>}>

        <audio controls>
            <source src={paragraph()?.audioUri}></source>
        </audio>
        <div innerHTML={paragraph()?.content}></div>
        <div ref={setWordCardRef} >
            <div style={{
                transform: `translate(${relative.x}px,${relative.y+20}px)`,
            }}
            class="bg-white border-amber-500 border-2 rounded-md">
                <WordCard></WordCard>
            </div>
        </div>
    </Show>)

}