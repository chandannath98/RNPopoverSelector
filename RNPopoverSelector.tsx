import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  ListRenderItem,
  ViewStyle,
  TextStyle,
  StyleProp,
  Dimensions,
} from 'react-native';

import Entypo from "react-native-vector-icons/Entypo"

// --- Interfaces ---
export interface SelectorItem {
  id: string | number;
  title: string | number;
  [key: string]: any;
}

export interface RNPopoverSelectorProps {
  data: SelectorItem[];
  value: string | number | (string | number)[] | null;
  onChange: (item: SelectorItem | SelectorItem[] | null) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  selectAllLabel?: string;
  
  // --- Clear Button Props ---
  showClearButton?: boolean;
  clearButtonLabel?: string;
  onClear?: () => void; // <--- Added onClear prop

  renderButton?: (selectedItem: SelectorItem | SelectorItem[] | null, isOpen: boolean) => React.ReactNode;
  renderItem?: (item: SelectorItem, isSelected: boolean, onSelect: () => void) => React.ReactNode;
  color?: string;
  width?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean
  disableStyle?: StyleProp<ViewStyle>;
  icon?: (isOpen: boolean) => React.ReactNode,

  themeEnabled?: boolean;
  TextComponent?: React.ComponentType<any>;
  TextInputComponent?: React.ComponentType<any>;
   colors?:Record<string, string>;
  scale?: (v:number) => number;
  vScale?: (v:number) => number;
  mScale?: (v:number) => number;
    selectorItemTextStyle?: StyleProp<TextStyle>
  selectorItemStyle?: StyleProp<ViewStyle>
}



const RNPopoverSelector: React.FC<RNPopoverSelectorProps> = ({
  data,
  value,
  onChange,
  placeholder = 'Select',
  multiple = false,
  searchable = false,
  selectAllLabel = 'Select All',
  showClearButton = true, 
  clearButtonLabel = 'Clear Selection', 
  onClear, // <--- Destructure onClear
  renderButton,
  renderItem,
  color,
  width,
  style,
  textStyle,
  disabled,
  disableStyle,
  icon,
  TextComponent=Text,
  TextInputComponent=TextInput,
  colors={},
  scale=(v)=>v,
  vScale=(v)=>v,
  mScale=(v)=>v,
  themeEnabled=false,
    selectorItemTextStyle,
  selectorItemStyle
}) => {






const styles = StyleSheet.create({
  defaultButton: {
    padding: mScale(12),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: mScale(8),
    backgroundColor: colors?.backgroundColor || 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: { fontSize: scale(14),  flex: 1 },
  overlay: { flex: 1,backgroundColor:'rgba(0, 0, 0, 0.07)' },
  dropdown: {
    position: 'absolute',
    backgroundColor: colors?.backgroundColor || 'white',
    borderRadius: mScale(12),
    paddingVertical: vScale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchContainer: {
    paddingHorizontal: scale(10),
    paddingBottom: vScale(8),
    marginBottom: vScale(5),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInput: {
    fontSize: scale(14),
    padding: mScale(8),
    backgroundColor: '#f9f9f9',
    borderRadius: mScale(8),
  },
  item: {
    paddingVertical: vScale(12),
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: vScale(44),
  },
  selectAllItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: vScale(5),
  },
  activeItem: { backgroundColor: '#F0F9FF' },
  itemTitle: { fontSize: scale(14), },
  activeTitle: { color: '#007AFF', 
    
    // fontWeight: '600' 
  },
  checkbox: {
    width: mScale(20),
    height: mScale(20),
    borderRadius: mScale(4),
    borderWidth: mScale(2),
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: scale(12),
    fontWeight: 'bold',
  },
  clearBtnContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: vScale(5),
  },
  clearButton: {
    paddingVertical: vScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: scale(14),
    // fontWeight: '600',
  },
});


// --- 1. MEMOIZED ROW COMPONENT ---
const SelectorRow = React.memo(
  ({
    item,
    isSelected,
    onSelect,
    customRender,
    color,
   TextComponent=Text,
  TextInputComponent=TextInput,
  colors={},
  scale=(v)=>v,
  vScale=(v)=>v,
  mScale=(v)=>v,
  themeEnabled=false,
  selectorItemTextStyle,
  selectorItemStyle
  }: {
    item: SelectorItem;
    isSelected: boolean;
    onSelect: (item: SelectorItem) => void;
    customRender?: (item: SelectorItem, isSelected: boolean, onSelect: () => void) => React.ReactNode;
    color?: string;
      TextComponent?: React.ComponentType<any>;
  TextInputComponent?: React.ComponentType<any>;
   colors?:Record<string, string>;
  scale?: (v:number) => number;
  vScale?: (v:number) => number;
  mScale?: (v:number) => number;
  themeEnabled?: boolean;
  selectorItemTextStyle?: StyleProp<TextStyle>
  selectorItemStyle?: StyleProp<ViewStyle>
  }) => {
    const handlePress = () => onSelect(item);

    if (customRender) {
      return <>{customRender(item, isSelected, handlePress)}</>;
    }

    return (
      <TouchableOpacity
        style={[styles.item,selectorItemStyle]} onPress={handlePress}>
        <TextComponent
        mode="medium"
          style={[
            styles.itemTitle,
            isSelected && styles.activeTitle,
            isSelected && color ? { color: color } : {},
            themeEnabled?{}:{},
            selectorItemTextStyle
          ]}
        >
          {item.title}
        </TextComponent>
        {isSelected && <TextComponent style={{ color: color || '#007AFF' }}>✓</TextComponent>}
      </TouchableOpacity>
    );
  },
  (prev, next) => {
    return (
      prev.isSelected === next.isSelected &&
      prev.item.id === next.item.id &&
      prev.color === next.color &&
      prev.onSelect === next.onSelect
    );
  }
);




  const [visible, setVisible] = useState(false);
  
  const [dropdownPosition, setDropdownPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });
  
  const [searchText, setSearchText] = useState('');
  const buttonRef = useRef<View>(null);

  const valueRef = useRef(value);
  const dataRef = useRef(data);

  useEffect(() => { valueRef.current = value; }, [value]);
  useEffect(() => { dataRef.current = data; }, [data]);

  // --- Derived State ---
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    const lowerText = searchText.toLowerCase();
    return data.filter((item) => item.title.toString().toLowerCase().includes(lowerText));
  }, [data, searchText]);

  const selectedItem = useMemo(() => {
    if (multiple && Array.isArray(value)) {
      return data.filter((item) => value.includes(item.id));
    }
    return data.find((item) => item.id === value) || null;
  }, [data, value, multiple]);

  const isAllSelected = useMemo(() => {
    if (!multiple || !Array.isArray(value)) return false;
    if (filteredData.length === 0) return false;
    return filteredData.every((item) => value.includes(item.id));
  }, [filteredData, value, multiple]);

  // --- Handlers ---
  const openDropdown = () => {
    const givenWidth = width;
    
    buttonRef.current?.measureInWindow((x, y, btnWidth, btnHeight) => {
      const windowHeight = Dimensions.get('window').height;
      const DROPDOWN_HEIGHT_BUFFER = 300; 
      const spaceBelow = windowHeight - (y + btnHeight);
      
      let positionConfig = {};

      if (spaceBelow < DROPDOWN_HEIGHT_BUFFER && y > DROPDOWN_HEIGHT_BUFFER) {
        positionConfig = {
          bottom: windowHeight - y + 5,
          top: undefined, 
          left: x,
          width: givenWidth || btnWidth
        };
      } else {
        positionConfig = {
          top: y + btnHeight + 5,
          bottom: undefined,
          left: x,
          width: givenWidth || btnWidth
        };
      }

      setDropdownPosition(positionConfig as any);
      setVisible(true);
      setSearchText('');
    });
  };

  const handleSelect = useCallback((item: SelectorItem) => {
    const currentIds = valueRef.current;
    const currentData = dataRef.current;

    if (multiple) {
      const ids = Array.isArray(currentIds) ? [...currentIds] : [];
      const idx = ids.indexOf(item.id);

      if (idx > -1) {
        ids.splice(idx, 1);
      } else {
        ids.push(item.id);
      }

      const newSelectedObjects = currentData.filter(d => ids.includes(d.id));
      onChange(newSelectedObjects);
    } else {
      onChange(item);
      setVisible(false);
    }
  }, [multiple, onChange]);

  const handleToggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(filteredData);
    }
  }, [isAllSelected, onChange, filteredData]);

  // --- CLEAR HANDLER ---
  const handleClear = useCallback(() => {
    setVisible(false); // Close dropdown first

    if (onClear) {
      // If onClear prop is passed, use it (Parent handles state reset)
      onClear();
    } else {
      // Default behavior: reset internal value
      if (multiple) {
        onChange([]);
      } else {
        onChange(null);
      }
    }
  }, [multiple, onChange, onClear]);

  const renderFlatListItem: ListRenderItem<SelectorItem> = useCallback(
    ({ item }) => {
      const isSelected = Array.isArray(value) ? value.includes(item.id) : value === item.id;

      return (
        <SelectorRow
          item={item}
          isSelected={isSelected}
          onSelect={handleSelect}
          customRender={renderItem}
          color={color}
          TextComponent={TextComponent}
  TextInputComponent={TextInputComponent}
  colors={colors}
  scale={scale}
  vScale={vScale}
  mScale={mScale}
  selectorItemTextStyle={selectorItemTextStyle}
  selectorItemStyle={selectorItemStyle}
        />
      );
    },
    [value, renderItem, color, handleSelect]
  );

  return (
    <View>
      <TouchableOpacity
        disabled={disabled}
        ref={buttonRef} activeOpacity={0.8} onPress={openDropdown}>
        {renderButton ? (
          renderButton(selectedItem, visible)
        ) : (
          <View style={[styles.defaultButton, style ? style : {}, (disabled && disableStyle) ? disableStyle : {}]}>
            <TextComponent style={[styles.buttonText,textStyle]} numberOfLines={1}>
              {!multiple && selectedItem && !Array.isArray(selectedItem)
                ? (selectedItem as SelectorItem).title
                : multiple && Array.isArray(selectedItem) && selectedItem.length > 0
                  ? `${selectedItem.length} Selected`
                  : placeholder}
            </TextComponent>
            {icon ? icon(visible) :
              <Entypo
                name={visible ? "chevron-up" : "chevron-down"}
                size={15}
                color="gray"
              />}
          </View>
        )}
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.dropdown,
                  { 
                    left: dropdownPosition.left, 
                    width: dropdownPosition.width,
                    ...(dropdownPosition.top !== undefined ? { top: dropdownPosition.top } : {}),
                    ...(dropdownPosition.bottom !== undefined ? { bottom: dropdownPosition.bottom } : {}),
                  },
                ]}
              >
                {searchable && (
                  <View style={styles.searchContainer}>
                    <TextInputComponent
                      style={styles.searchInput}
                      placeholder="Search..."
                      value={searchText}
                      onChangeText={setSearchText}
                    />
                  </View>
                )}

                <FlatList
                  data={filteredData}
                  keyExtractor={(item) => String(item.id)}
                  style={{ maxHeight: 250 }}
                  contentContainerStyle={{ paddingBottom: 10 }}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={5}
                  removeClippedSubviews={true}
                  getItemLayout={(data, index) => (
                    { length: 44, offset: 44 * index, index }
                  )}

                  ListHeaderComponent={
                    multiple && filteredData.length > 0 ? (
                      <TouchableOpacity style={[styles.item, styles.selectAllItem]} onPress={handleToggleSelectAll}>
                        <TextComponent
                        mode="bold"
                          style={[
                            styles.itemTitle,
                            { color: isAllSelected ? (color || '#007AFF') : colors.textColor|| '#333' },
                            themeEnabled?{}:{fontWeight:'bold'}
                          ]}
                        >
                          {selectAllLabel}
                        </TextComponent>
                        <View
                          style={[
                            styles.checkbox,
                            isAllSelected && { borderColor: color || '#007AFF', backgroundColor: color || '#007AFF' },
                          ]}
                        >
                          {isAllSelected && <TextComponent style={styles.checkmark}>✓</TextComponent>}
                        </View>
                      </TouchableOpacity>
                    ) : null
                  }

                  renderItem={renderFlatListItem}
                />

                {/* --- CLEAR BUTTON (Visible for both Single and Multiple) --- */}
                {showClearButton && (
                  <View style={styles.clearBtnContainer}>
                     <TouchableOpacity 
                       onPress={handleClear} 
                       style={styles.clearButton}
                     >
                       <TextComponent mode="medium" style={[styles.clearButtonText, { color: "#be1919ff" }, themeEnabled?{}:{fontWeight:'600'}]}>
                         {clearButtonLabel}
                       </TextComponent>
                     </TouchableOpacity>
                  </View>
                )}

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};



export default RNPopoverSelector;