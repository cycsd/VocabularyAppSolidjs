import { As, Select } from "@kobalte/core";
import { Component, For, createResource, createSignal } from "solid-js";
import { KeyValuePair } from "./KeyValuePair";



const CategoryOptions: Component = (props:{}) => {
    const [value,setValues]=createSignal<KeyValuePair>();
    const getCategories =async () => {
        const res = await fetchGet('https://localhost:7186/api/Vocabulary/WordDetail');
        return res.json();      
    }
    const [categoriesSource] = createResource<KeyValuePair[]>(getCategories);
    

    return (
        <>
            <Select.Root<KeyValuePair>
                multiple
                value={categoriesSource()}
                onChange={setCategories}
                options={categoriesSource()!}
                placeholder="Select some fruits…"
                itemComponent={props => (
                    <Select.Item item={props.item}>
                        <Select.ItemLabel>{props.item.rawValue.value}</Select.ItemLabel>
                        <Select.ItemIndicator>
                        </Select.ItemIndicator>
                    </Select.Item>
                )}
            >
                <Select.Trigger aria-label="Tags" asChild>
                    <As component="div">
                        <Select.Value<string>>
                            {state => (
                                <>
                                    <div>
                                        <For each={state.selectedOptions()}>
                                            {option => (
                                                <span onPointerDown={e => e.stopPropagation()}>
                                                    {option}
                                                    <button onClick={() => state.remove(option)}>
                                                    </button>
                                                </span>
                                            )}
                                        </For>
                                    </div>
                                    <button onPointerDown={e => e.stopPropagation()} onClick={state.clear}>
                                    </button>
                                </>
                            )}
                        </Select.Value>
                        <Select.Icon>
                        </Select.Icon>
                    </As>
                </Select.Trigger>
                <Select.Portal>
                    <Select.Content>
                        <Select.Listbox />
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        </>
    );
}

export { CategoryOptions }