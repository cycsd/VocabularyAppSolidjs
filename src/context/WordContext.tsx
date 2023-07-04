import { Accessor, Setter, createContext,useContext, createSignal, onMount, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

export interface WordContextValue{
    word:Accessor<string>,
    setWord:Setter<string>,
}
export const WordContext = createContext<WordContextValue>();

export function useWordContext(){
    return useContext(WordContext)
}

export function WordProvider(props:any){
    const getSelectWord = (event:Event)=>{
        let text = "";
        const activeEl = document.activeElement;
        const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
        if (window.getSelection && (activeElTagName != "input") && (activeElTagName != "textarea")) {
            text = window.getSelection()?.toString()??"";
        }
        return setWord(word=>text.trim()===""?word:text);
    }
    onMount(()=>{
        document.body.addEventListener("dblclick", getSelectWord);
        document.body.addEventListener("mouseup", getSelectWord);
    })
    onCleanup(()=>{
        document.body.removeEventListener("dblclick", getSelectWord);
        document.body.removeEventListener("mouseup", getSelectWord);
    })

    const [word,setWord] = createSignal("");
    const wordContextValue:WordContextValue={
        word,
        setWord,
    }

    return (
        <WordContext.Provider value={wordContextValue}>
            <div onDblClick={getSelectWord}>
            {props.children}
            </div>
        </WordContext.Provider>
    )
}