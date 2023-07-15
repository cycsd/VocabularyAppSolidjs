import { As, Select } from "@kobalte/core";
import { Accessor, Component, For, createResource, createSignal } from "solid-js";
import { KeyValuePair } from "./KeyValuePair";

interface CategoryProps {
    selectedValue: Accessor<KeyValuePair[]>,
    optionValues: Accessor<KeyValuePair[]>,
    onChange: (selectedValue: KeyValuePair[]) => void,
}

const CategoryOptions: Component<CategoryProps> = (props: {
    selectedValue: Accessor<KeyValuePair[]>,
    optionValues: Accessor<KeyValuePair[]>,
    onChange: (selectedValue: KeyValuePair[]) => void,
}) => {
    const { selectedValue, optionValues, onChange } = props;
    return (
        <>
            <Select.Root<KeyValuePair>
                multiple={true}
                value={selectedValue()}
                onChange={onChange}
                options={optionValues()}
                 optionValue="key"
                 optionTextValue="value"
                //placeholder="select category"
                itemComponent={props => (
                    <Select.Item item={props.item}>
                        <Select.ItemLabel>{props.item.rawValue.value}</Select.ItemLabel>
                        <Select.ItemIndicator>
                        </Select.ItemIndicator>
                    </Select.Item>
                )}
            >
                <Select.Trigger aria-label="KeyValuePair" asChild>
                    <As component="div">
                        <Select.Value<KeyValuePair>>
                            {state => (
                                <>
                                    <div>
                                        <For each={state.selectedOptions()}>
                                            {option => (<>
                                                <span onPointerDown={e => e.stopPropagation()}>
                                                    {option.value}
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
        </>
    );
}

export { CategoryOptions }