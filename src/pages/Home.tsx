import { For, createResource } from "solid-js"
import { Show } from "solid-js/web"
import { Card } from "solid-bootstrap"
import { A } from "@solidjs/router"

interface Article {
    title: string,
    uri: string,
    imageUri: string,
    publishDate: string,
}
const fetchArticle = async () => {
    const res = await fetch('https://localhost:7186/api/Article/articles')
    const data = res.json()
    return data
}


export function Home() {
    const [articles] = createResource<Article[]>(fetchArticle)

    return (
        <>
            < Show when={articles()} fallback={<p> loading...</p>}>
                <div class="grid grid-cols-4 gap-10 my-4">
                    <For each={articles()}>
                        {(article) => (
                        <A href={`paragraph/${encodeURIComponent(article.uri)}`} >
                            <Card>
                                <Card.Img variant="top" src={article.imageUri}></Card.Img>
                                <Card.Body>
                                    <Card.Text>
                                        <h2>{article.title}</h2>
                                        <span>{article.publishDate}</span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </A>
                        )
                        }
                    </For>
                </div>
            </Show >
        </>)
}