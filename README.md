
# RNPopoverSelector

A **high-performance, customizable popover selector** for **React Native** with support for:

- ✅ Single & Multiple selection
- 🔍 Searchable list
- ☑️ Select All (for multi-select)
- 🎨 Custom colors
- 🧩 Fully customizable button & item rendering
- ⚡ Optimized with memoization for large lists

---


![Screenshot](https://i.postimg.cc/tJLksv1z/Screenshot-from-2026-01-22-14-35-26.png)
![Screenshot2](https://i.postimg.cc/MHX3Mj9Q/Screenshot-from-2026-01-22-14-34-30.png)


## Installation

```bash
npm install rn-popover-selector
```

or

```bash
yarn add rn-popover-selector
```

---

## Basic Usage

```tsx
import RNPopoverSelector from 'rn-popover-selector';

const data = [
  { id: 1, title: 'Option 1' },
  { id: 2, title: 'Option 2' },
  { id: 3, title: 'Option 3' },
];

export default function App() {
  const [value, setValue] = useState<number | null>(null);

  return (
    <RNPopoverSelector
      data={data}
      value={value}
      onChange={(item) => setValue(item.id)}
      placeholder="Select option"
    />
  );
}
```

---

## Multi Select Example

```tsx
const [values, setValues] = useState<number[]>([]);

<RNPopoverSelector
  data={data}
  multiple
  searchable
  value={values}
  onChange={(items) => setValues(items.map(i => i.id))}
  selectAllLabel="Select All Items"
/>
```

---

## Props

| Prop | Type | Default | Description |
|-----|------|--------|-------------|
| `data` | `SelectorItem[]` | — | List of items |
| `value` | `string \| number \| array \| null` | — | Selected value(s) |
| `onChange` | `(item \| items) => void` | — | Selection callback |
| `placeholder` | `string` | `"Select"` | Button placeholder |
| `multiple` | `boolean` | `false` | Enable multi-select |
| `searchable` | `boolean` | `false` | Enable search |
| `selectAllLabel` | `string` | `"Select All"` | Select-all label |
| `color` | `string` | `#007AFF` | Active color |
| `renderButton` | `function` | — | Custom button renderer |
| `renderItem` | `function` | — | Custom item renderer |
| `width` | `number` | — | Selector Modal width |
| `style` | `ViewStyle` | — | Selector Style |
| `textStyle` | `TextStyle` | — | Selector Text Style |
| `disabled` | `boolean` | — |  |
| `disableStyle` | `ViewStyle` | — | Selector Style  when its disabled|
| `showClearButton` | `boolean` | — | Show/Hide Clear Selection Button|
| `clearButtonLabel` | `string` | — | clear Button Label|

---

## SelectorItem Interface

```ts
export interface SelectorItem {
  id: string | number;
  title: string | number;
  [key: string]: any;
}
```

---

## Custom Button Example

```tsx
<RNPopoverSelector
  data={data}
  value={value}
  onChange={(item) => setValue(item.id)}
  renderButton={(selected, open) => (
    <View style={{ padding: 12 }}>
      <Text>{selected ? selected.title : 'Choose item'}</Text>
    </View>
  )}
/>
```

---

## Custom Item Example

```tsx
renderItem={(item, isSelected, onSelect) => (
  <TouchableOpacity onPress={onSelect}>
    <Text style={{ color: isSelected ? 'blue' : 'black' }}>
      {item.title}
    </Text>
  </TouchableOpacity>
)}
```

---

## Performance Notes

- Uses `React.memo` for rows
- Stable handlers via `useRef` + `useCallback`
- Optimized `FlatList` (`getItemLayout`, `removeClippedSubviews`)
- Handles large datasets smoothly

---

## License



This project is licensed under the MIT License - see the [LICENSE](/LICENSE.txt) file for details.
![License](https://img.shields.io/npm/l/rn-popover-selector)
 