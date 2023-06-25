import { For, createResource } from "solid-js"
import { Show } from "solid-js/web"

interface Article{
    title:string,
    uri:string,
    imageUri:string,
    publishDate:string,
}
const fetchArticle = async () => {
    const res = await fetch('https://localhost:7186/api/Article')
    const data = res.json() 
    return data
}


export function Home() {
    const [articles] = createResource<Article[]>(fetchArticle)

    return (
        <>
            < Show when={articles()} fallback={<p> loading...</p>}>
                <For each={articles()}>
                    {(article) => (<>
                        <p>{article.title}</p>
                        </>
                    )

                    }

                </For>
            </Show >
        </>)
}