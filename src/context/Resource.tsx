import { KeyValuePair } from "../components/KeyValuePair";
import { ResponseOk, fetchGet, fetchPost } from "../util/utilExtension"

interface SimpleWordInfoDto {
    wordId: number;
    text: string;
    partOfSpeech: DefinitionInfoDto[];
    note: string;
    pronounceAudioUrl: string;
    categories: KeyValuePair[],
}

interface DefinitionInfoDto {
    partOfSpeech: string;
    definitions: string[];
}
interface SaveRespone {
    id: number,
    text: string,
}

type SaveNewWordPara = Pick<SimpleWordInfoDto, 'text' | 'categories'>
type ChangeCategoryPara = Pick<SimpleWordInfoDto, 'wordId' | 'text' | 'categories'>

const fetchCategories = async () => {
    const res = await fetchGet('https://localhost:7186/api/Vocabulary/Categories')
    return res.json()
}
const SaveNewWord = async (para: SaveNewWordPara,) => {
    return fetchPost(
        'https://localhost:7186/api/Vocabulary/SaveNew',
        para
    )
}
const ChangeCategories = (para: ChangeCategoryPara) => {
    return fetchPost(
        'https://localhost:7186/api/Vocabulary/ChangeCategories',
        para
    );
}


export { fetchCategories, SaveNewWord, ChangeCategories }
export type { SimpleWordInfoDto, SaveRespone }