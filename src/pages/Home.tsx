import { For, createResource } from "solid-js"
import { Show } from "solid-js/web"


const fetchArticle = async () => {
    const res = await fetch('https://localhost:7186/api/Article')

    return res.json()
}


export function Home() {
    const [articles] = createResource(fetchArticle)

    return (
        <>
            < Show when={articles()} fallback={<p> loading...</p>}>
                <For each={articles()}>
                    {(article) => (
                        article.titile
                    )

                    }

                </For>
            </Show >
        </>)
}