import { KeyValuePair } from "../components/KeyValuePair";
import { ResponseOk } from "../util/utilExtension";
import { ChangeCategories, SaveNewWord, SaveRespone, SimpleWordInfoDto } from "./Resource";

interface Word {
    data: SimpleWordInfoDto,
    status: 'new' | 'inFavorite',
}
function GetWord(wordInfo: SimpleWordInfoDto): Word {
    return wordInfo.wordId === 0
        ? { data: wordInfo, status: 'new' }
        : { data: wordInfo, status: 'inFavorite' }
}
function SaveWord(word: Word) {
    switch (word.status) {
        case 'new':
            return SaveNewWord({ ...word.data })
                .then(ResponseOk)
                .then(data => data as SaveRespone)
        case 'inFavorite':
            return ChangeCategories(word.data)
                .then(ResponseOk)
                .then(data => data as SaveRespone);
    }
}
const DeleteWord = async (word: Word) => {
    return ChangeCategory(word, []);
}
const ChangeCategory = async (word: Word, categories: KeyValuePair[]) => {
    switch (word.status) {
        case 'inFavorite':
            return ChangeCategories({ ...word.data, categories })
                .then(ResponseOk)
                .then(data => data as SaveRespone);
    }
}
export { SaveWord, DeleteWord, GetWord, ChangeCategory }
export type { Word }