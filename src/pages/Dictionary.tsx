import { As, Select } from "@kobalte/core";
import { For, createSignal } from "solid-js";

export function Dictionary(){

    const [values,setValues] = createSignal([
        "我的最愛",
       "工作"
     ])

    return (<>
        <Select.Root<string>
            multiple ={true}
            value={values()}
            onChange={setValues}
            options={[
                "我的最愛",
               "工作",
               "生活"
             ]}
            // optionValue="key"
            // optionTextValue="value"
            placeholder="select category"
            itemComponent={props => (
                <Select.Item item={props.item}>
                    <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
                    <Select.ItemIndicator>
                    </Select.ItemIndicator>
                </Select.Item>
            )}
        >
            <Select.Trigger aria-label="KeyValuePair" asChild>
                <As component="div">
                    <Select.Value<string>>
                        {state => (
                            <>
                                <div>
                                    <For each={state.selectedOptions()}>
                                        {option => (<>
                                            <span onPointerDown={e => e.stopPropagation()}>
                                                {option}
                                                <button onClick={() => state.remove(option)}>
                                                    <span>remove</span>
                                                </button>
                                            </span>
                                        </>
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
    </>)
}