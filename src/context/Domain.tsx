import { ResponseOk } from "../util/utilExtension";
import { ChangeCategories, SaveNewWord, SaveRespone, SimpleWordInfoDto } from "./Resource";

interface Word {
    data: SimpleWordInfoDto,
    status: 'new' | 'inFavorite',
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
    switch (word.status) {
        case 'inFavorite':
            word.data.categories = [];
            return ChangeCategories(word.data)
                .then(ResponseOk)
                .then(data => data as SaveRespone);
    }
}
export { SaveWord, DeleteWord }
export type { Word }