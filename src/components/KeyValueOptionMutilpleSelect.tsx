import { As, Select } from "@kobalte/core";
import { Accessor, Component, For, createResource, createSignal } from "solid-js";
import { KeyValuePair } from "./KeyValuePair";
import { VsCheck, VsClose, VsError, VsErrorSmall, VsFilter } from 'solid-icons/vs'

interface OptionProps {
    selectedValue: Accessor<KeyValuePair[]>,
    optionValues: Accessor<KeyValuePair[]>,
    onChange: (selectedValue: KeyValuePair[]) => void,
    placeHolder?: string,
    labelName?: string
}

const KeyValueOptionsMutilpleSelect: Component<OptionProps> = (props: {
    selectedValue: Accessor<KeyValuePair[]>,
    optionValues: Accessor<KeyValuePair[]>,
    onChange: (selectedValue: KeyValuePair[]) => void,
    placeHolder?: string,
    labelName?: string
}) => {

    const { selectedValue, optionValues, onChange, placeHolder = "", labelName = "" } = props;
    return (
        <>
            <Select.Root<KeyValuePair>
                multiple={true}
                value={selectedValue()}
                onChange={onChange}
                options={optionValues()}
                optionValue="key"
                optionTextValue="value"
                placeholder={placeHolder}
                itemComponent={props => (
                    <Select.Item item={props.item} class="flex justify-between">
                        <Select.ItemLabel>{props.item.rawValue.value}</Select.ItemLabel>
                        <Select.ItemIndicator>
                            <VsCheck />
                        </Select.ItemIndicator>
                    </Select.Item>
                )}
            >
                <Select.Trigger aria-label={labelName} asChild>
                    <As component="div" class="flex  justify-evenly items-center">
                        <Select.Value<KeyValuePair>>
                            {state => (
                                <div class="flex justify-between items-center">
                                    <div>
                                        <For each={state.selectedOptions()}>
                                            {option => (<>
                                                <span onPointerDown={e => e.stopPropagation()}>
                                                    {option.value}
                                                    <button onClick={() => state.remove(option)}>
                                                        <VsErrorSmall />
                                                    </button>
                                                </span>
                                            </>
                                            )}
                                        </For>
                                    </div>
                                    <button onPointerDown={e => e.stopPropagation()} onClick={state.clear}>
                                    <VsClose />
                                    </button>
                                </div>
                            )}
                        </Select.Value>
                        <Select.Icon>
                        <VsFilter />
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

export { KeyValueOptionsMutilpleSelect}