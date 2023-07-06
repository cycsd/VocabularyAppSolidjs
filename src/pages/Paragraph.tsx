import { useParams } from "@solidjs/router"
import { Show, createResource, createSignal } from "solid-js";
import { WordSearch } from "../components/WordSearch";


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

    return (< Show when={paragraph()} fallback={<p> loading...</p>}>
        <WordSearch>
            <audio controls>
                <source src={paragraph()?.audioUri}></source>
            </audio>
            <div innerHTML={paragraph()?.content}></div>
        </WordSearch>
    </Show>)

}