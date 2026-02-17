import React, { useState } from 'react';
import { ChevronDown, Github, BookOpen, Zap, Copy, Check } from 'lucide-react';

const RNPopoverSelectorDocs = () => {
  const [copiedId, setCopiedId] = useState(null);
  const [activeExample, setActiveExample] = useState(0);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const CodeBlock = ({ code, language = 'jsx', id }) => (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg my-4">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-mono text-gray-400">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition"
        >
          {copiedId === id ? (
            <>
              <Check size={14} /> Copied
            </>
          ) : (
            <>
              <Copy size={14} /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-sm leading-relaxed">
          {highlightCode(code)}
        </code>
      </pre>
    </div>
  );

  const highlightCode = (code) => {
    return code.split('\n').map((line, idx) => {
      const tokens = tokenizeLine(line);
      return (
        <div key={idx} className="flex">
          <span className="text-gray-600 select-none pr-4 text-right" style={{ minWidth: '2rem' }}>
            {idx + 1}
          </span>
          <span className="flex-1">
            {tokens.map((token, i) => (
              <span key={i} style={{ color: token.color }}>
                {token.value}
              </span>
            ))}
          </span>
        </div>
      );
    });
  };

  const tokenizeLine = (line) => {
    if (!line) return [{ value: ' ', color: '#d1d5db' }];
    
    const tokens = [];
    let remaining = line;
    
    while (remaining.length > 0) {
      let matched = false;

      // Keywords (red)
      const keywordMatch = remaining.match(/^(import|from|const|function|return|useState|export|default|true|false|null|if|else|try|catch|new|class|extends|data|value|onChange|placeholder|color|item|id|title|selected|onPress|renderItem|placeholderLabel|confirmButtonLabel|displayKey|searchableText|showsVerticalScrollIndicator|keyExtractor|doneButtonLabel|searchIcon|listIconColor|searchInputPlaceholderText|searchInputPlaceholderTextColor)\b/);
      if (keywordMatch) {
        tokens.push({ value: keywordMatch[0], color: '#ff7b72' });
        remaining = remaining.slice(keywordMatch[0].length);
        matched = true;
      }

      // Strings (blue)
      if (!matched) {
        const stringMatch = remaining.match(/^(['"`])([^'">`]*?)\1/);
        if (stringMatch) {
          tokens.push({ value: stringMatch[0], color: '#a5d6ff' });
          remaining = remaining.slice(stringMatch[0].length);
          matched = true;
        }
      }

      // Numbers (cyan)
      if (!matched) {
        const numberMatch = remaining.match(/^\d+/);
        if (numberMatch) {
          tokens.push({ value: numberMatch[0], color: '#79c0ff' });
          remaining = remaining.slice(numberMatch[0].length);
          matched = true;
        }
      }

      // Comments (gray)
      if (!matched) {
        const commentMatch = remaining.match(/^(\/\/.*)/);
        if (commentMatch) {
          tokens.push({ value: commentMatch[0], color: '#7d8590' });
          remaining = '';
          matched = true;
        }
      }

      // Function names (purple)
      if (!matched) {
        const functionMatch = remaining.match(/^([a-zA-Z_]\w*)\s*(?=\()/);
        if (functionMatch) {
          tokens.push({ value: functionMatch[1], color: '#d2a8ff' });
          remaining = remaining.slice(functionMatch[1].length);
          matched = true;
        }
      }

      // JSX/HTML tags (green)
      if (!matched) {
        const tagMatch = remaining.match(/^<\/?[^>]*>/);
        if (tagMatch) {
          tokens.push({ value: tagMatch[0], color: '#7ee787' });
          remaining = remaining.slice(tagMatch[0].length);
          matched = true;
        }
      }

      // Properties/methods (cyan)
      if (!matched) {
        const propMatch = remaining.match(/^\.([a-zA-Z_]\w*)/);
        if (propMatch) {
          tokens.push({ value: '.' + propMatch[1], color: '#79c0ff' });
          remaining = remaining.slice('.' .length + propMatch[1].length);
          matched = true;
        }
      }

      // Default text (light gray)
      if (!matched) {
        tokens.push({ value: remaining[0], color: '#d1d5db' });
        remaining = remaining.slice(1);
      }
    }

    return tokens;
  };

  const examples = [
    {
      title: 'Basic Single Selection',
      description: 'Simple country selector with single selection',
      snackUrl: 'https://snack.expo.dev/@chandannath98/rn-popover-selector-basic',
      code: `import { useState } from 'react';
import { View, Text } from 'react-native';
import RNPopoverSelector from 'rn-popover-selector';

const COUNTRIES = [
  { id: 'us', title: '🇺🇸 United States' },
  { id: 'uk', title: '🇬🇧 United Kingdom' },
  { id: 'ca', title: '🇨🇦 Canada' },
  { id: 'au', title: '🇦🇺 Australia' },
];

export default function CountrySelector() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <View>
      <Text>Select a Country</Text>
      <RNPopoverSelector
        data={COUNTRIES}
        value={selectedCountry}
        onChange={(item) => setSelectedCountry(item.id)}
        placeholder="Choose country"
        color="#667eea"
      />
      {selectedCountry && (
        <Text>Selected: {selectedCountry}</Text>
      )}
    </View>
  );
}`
    },
    {
      title: 'Multi-Select with Search',
      description: 'Select multiple skills with live search functionality',
      snackUrl: 'https://snack.expo.dev/@chandannath98/rn-popover-selector-multiselect',
      code: `import { useState } from 'react';
import { View, Text } from 'react-native';
import RNPopoverSelector from 'rn-popover-selector';

const SKILLS = [
  { id: 1, title: 'JavaScript' },
  { id: 2, title: 'TypeScript' },
  { id: 3, title: 'React' },
  { id: 4, title: 'React Native' },
  { id: 5, title: 'Node.js' },
  { id: 6, title: 'Python' },
];

export default function SkillSelector() {
  const [skills, setSkills] = useState([]);

  return (
    <View>
      <Text>Select Skills</Text>
      <RNPopoverSelector
        data={SKILLS}
        value={skills}
        onChange={(items) => setSkills(items.map(i => i.id))}
        multiple
        searchable
        placeholder="Choose skills"
        selectAllLabel="Select All Skills"
        color="#27ae60"
      />
      <Text>Selected {skills.length} skills</Text>
    </View>
  );
}`
    },
    {
      title: 'Custom Item Rendering',
      description: 'Render custom item components with icons and prices',
      snackUrl: 'https://snack.expo.dev/@chandannath98/rn-popover-selector-custom',
      code: `import { useState } from 'react';
import { View, Text } from 'react-native';
import RNPopoverSelector from 'rn-popover-selector';

const PRODUCTS = [
  { id: 1, title: 'Laptop', icon: '💻', price: 999 },
  { id: 2, title: 'Phone', icon: '📱', price: 799 },
  { id: 3, title: 'Tablet', icon: '📱', price: 599 },
];

export default function ProductSelector() {
  const [product, setProduct] = useState(null);

  return (
    <View>
      <RNPopoverSelector
        data={PRODUCTS}
        value={product}
        onChange={(item) => setProduct(item.id)}
        renderButton={(selected) => (
          <View style={{ padding: 12 }}>
            <Text>
              {selected 
                ? \`\${selected.icon} \${selected.title}\` 
                : '🛍️ Select Product'}
            </Text>
          </View>
        )}
        renderItem={(item, isSelected) => (
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            paddingHorizontal: 16 
          }}>
            <Text>\${item.icon} \${item.title}</Text>
            <Text>\$\${item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}`
    },
    {
      title: 'Form Integration',
      description: 'Complete form with validation and submission',
      snackUrl: 'https://snack.expo.dev/@chandannath98/rn-popover-selector-form',
      code: `import { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import RNPopoverSelector from 'rn-popover-selector';

const DEPARTMENTS = [
  { id: 1, title: 'Engineering' },
  { id: 2, title: 'Sales' },
  { id: 3, title: 'Marketing' },
];

export default function EmployeeForm() {
  const [form, setForm] = useState({ 
    name: '', 
    department: null 
  });

  const handleSubmit = () => {
    if (!form.department) {
      Alert.alert('Error', 'Please select a department');
      return;
    }
    Alert.alert(
      'Success', 
      \`Employee added to department\`
    );
  };

  return (
    <View>
      <Text>Department Selection</Text>
      <RNPopoverSelector
        data={DEPARTMENTS}
        value={form.department}
        onChange={(item) => 
          setForm({ ...form, department: item.id })
        }
        placeholder="Select department"
      />
      <Button 
        title="Submit" 
        onPress={handleSubmit} 
      />
    </View>
  );
}`
    },
    {
      title: 'Advanced Customization',
      description: 'Theme selector with custom styling and colors',
      snackUrl: 'https://snack.expo.dev/@chandannath98/rn-popover-selector-advanced',
      code: `import { useState } from 'react';
import { View, Text } from 'react-native';
import RNPopoverSelector from 'rn-popover-selector';

const THEMES = [
  { id: 'light', title: 'Light Theme', color: '#ffffff' },
  { id: 'dark', title: 'Dark Theme', color: '#1a1a1a' },
  { id: 'blue', title: 'Blue Theme', color: '#667eea' },
];

export default function ThemeSelector() {
  const [theme, setTheme] = useState(null);

  return (
    <View>
      <RNPopoverSelector
        data={THEMES}
        value={theme}
        onChange={(item) => setTheme(item.id)}
        color="#667eea"
        width={280}
        placeholder="Choose theme"
        renderItem={(item, isSelected) => (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: 12 
          }}>
            <View 
              style={{
                width: 24,
                height: 24,
                backgroundColor: item.color,
                borderRadius: 4,
                borderWidth: isSelected ? 2 : 0,
                borderColor: '#667eea'
              }}
            />
            <Text style={{ flex: 1 }}>{item.title}</Text>
            {isSelected && <Text>✓</Text>}
          </View>
        )}
      />
    </View>
  );
}`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">📦</span>
              </div>
              <h1 className="text-xl font-bold text-white">RNPopoverSelector</h1>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#examples" className="text-gray-300 hover:text-white transition">Examples</a>
              <a href="#props" className="text-gray-300 hover:text-white transition">Props</a>
              <a href="https://github.com/chandannath98/RNPopoverSelector" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            RNPopoverSelector - React Native Selector Component
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Powerful, fully customizable popover dropdown selector for React Native with search, multi-select, and more. Install via npm and enhance your React Native applications today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#installation" className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
              Get Started
            </a>
            <a href="https://snack.expo.dev/@chandannath1/react-native-selector-rn-popover-selector" target="_blank" rel="noopener noreferrer" className="px-8 py-3 border border-gray-400 text-white rounded-lg font-semibold hover:bg-gray-800 transition">
              Try on Expo Snack
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-white mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: '✅', title: 'Single & Multiple Selection', desc: 'Support both selection modes' },
            { icon: '🔍', title: 'Searchable', desc: 'Built-in search functionality' },
            { icon: '🎨', title: 'Fully Customizable', desc: 'Custom colors and rendering' },
            { icon: '⚡', title: 'High Performance', desc: 'Optimized with memoization' },
            { icon: '📱', title: 'iOS & Android', desc: 'Works on both platforms' },
            { icon: '🧹', title: 'Clear Button', desc: 'Easy selection clearing' }
          ].map((feature, idx) => (
            <div key={idx} className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Installation */}
      <section id="installation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-800/30 rounded-xl my-20">
        <h2 className="text-4xl font-bold text-white mb-8">Installation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4">NPM</h3>
            <CodeBlock code="npm install rn-popover-selector" id="npm-install" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Yarn</h3>
            <CodeBlock code="yarn add rn-popover-selector" id="yarn-install" />
          </div>
        </div>
        <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <p className="text-yellow-200">
            <span className="font-semibold">Note:</span> Make sure you have <code className="bg-slate-900 px-2 py-1 rounded">react-native-vector-icons</code> installed
          </p>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-white mb-12">Code Examples</h2>
        
        {/* Example Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => setActiveExample(idx)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeExample === idx
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>

        {/* Example Content */}
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{examples[activeExample].title}</h3>
            <p className="text-gray-400 mb-6">{examples[activeExample].description}</p>
          </div>
          
          {/* Two Column Layout - Code and Snack */}
          <div className="grid ">
            {/* Code Block */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                Source Code
              </h4>
              <CodeBlock code={examples[activeExample].code} id={`example-${activeExample}`} />
            </div>
            
            {/* Expo Snack iframe */}
           
          </div>
          <iframe
                    src={"https://snack.expo.dev/embedded/@chandannath1/react-native-selector-rn-popover-selector?preview=true&platform=web&theme=light&hideCode=true"}
                    style={{
                      width: '100%',
                      height: '100%',
                      minHeight: '600px',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                    title={`Live Preview: ${examples[activeExample].title}`}
                  />
          {/* Try on Snack Button */}
          {examples[activeExample].snackUrl && (
            <div className="mt-6 flex justify-center">
              <a
                href={examples[activeExample].snackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition inline-flex items-center gap-2"
              >
                <Zap size={18} />
                Try This Example on Expo Snack
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Props Reference */}
      <section id="props" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-800/30 rounded-xl my-20">
        <h2 className="text-4xl font-bold text-white mb-8">Props Reference</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700">
                <th className="px-6 py-3 text-left text-purple-400 font-semibold">Prop</th>
                <th className="px-6 py-3 text-left text-purple-400 font-semibold">Type</th>
                <th className="px-6 py-3 text-left text-purple-400 font-semibold">Default</th>
                <th className="px-6 py-3 text-left text-purple-400 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {[
                { prop: 'data', type: 'SelectorItem[]', default: '—', desc: 'Array of selectable items (required)' },
                { prop: 'value', type: 'string | number | array | null', default: '—', desc: 'Currently selected value(s) (required)' },
                { prop: 'onChange', type: 'function', default: '—', desc: 'Callback when selection changes (required)' },
                { prop: 'placeholder', type: 'string', default: '"Select"', desc: 'Text shown when nothing is selected' },
                { prop: 'multiple', type: 'boolean', default: 'false', desc: 'Enable multiple selection mode' },
                { prop: 'searchable', type: 'boolean', default: 'false', desc: 'Show search input in dropdown' },
                { prop: 'selectAllLabel', type: 'string', default: '"Select All"', desc: 'Label for select all button' },
                { prop: 'showClearButton', type: 'boolean', default: 'true', desc: 'Show clear selection button' },
                { prop: 'color', type: 'string', default: '"#007AFF"', desc: 'Primary color for selected items' },
                { prop: 'width', type: 'number', default: 'auto', desc: 'Width of dropdown in pixels' },
                { prop: 'disabled', type: 'boolean', default: 'false', desc: 'Disable the selector' },
                { prop: 'renderButton', type: 'function', default: '—', desc: 'Custom button render function' },
                { prop: 'renderItem', type: 'function', default: '—', desc: 'Custom item render function' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 text-pink-400 font-mono text-sm">{row.prop}</td>
                  <td className="px-6 py-4 text-purple-400 font-mono text-sm">{row.type}</td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-sm">{row.default}</td>
                  <td className="px-6 py-4 text-gray-300">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">SelectorItem Interface</h3>
          <CodeBlock code={`interface SelectorItem {
  id: string | number;
  title: string | number;
  [key: string]: any;  // Additional custom properties
}`} id="selector-interface" language="typescript" />
        </div>
      </section>

      {/* Basic Usage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-white mb-12">Basic Usage</h2>
        
        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-semibold text-white mb-4">Single Select</h3>
            <CodeBlock code={`import { useState } from 'react';
import { View } from 'react-native';
import RNPopoverSelector from 'rn-popover-selector';

const data = [
  { id: 1, title: 'Option 1' },
  { id: 2, title: 'Option 2' },
  { id: 3, title: 'Option 3' },
];

export default function App() {
  const [value, setValue] = useState(null);

  return (
    <View>
      <RNPopoverSelector
        data={data}
        value={value}
        onChange={(item) => setValue(item.id)}
        placeholder="Select option"
      />
    </View>
  );
}`} id="basic-single" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-white mb-4">Multiple Select</h3>
            <CodeBlock code={`const [values, setValues] = useState([]);

<RNPopoverSelector
  data={data}
  multiple
  searchable
  value={values}
  onChange={(items) => setValues(items.map(i => i.id))}
  selectAllLabel="Select All Items"
  placeholder="Choose items"
/>`} id="basic-multi" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-white mb-4">Custom Styling</h3>
            <CodeBlock code={`<RNPopoverSelector
  data={data}
  value={value}
  onChange={setValue}
  color="#667eea"
  width={300}
  placeholder="Select with style"
  style={{ 
    borderColor: '#667eea',
    borderWidth: 2,
    borderRadius: 8
  }}
/>`} id="basic-style" />
          </div>
        </div>
      </section>

      {/* Tips & Best Practices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-800/30 rounded-xl my-20">
        <h2 className="text-4xl font-bold text-white mb-12">Tips & Best Practices</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">💡 Performance</h3>
            <p className="text-gray-300 mb-4">Use React.memo and useMemo for custom renders to prevent unnecessary re-renders:</p>
            <CodeBlock code={`const renderItem = useMemo(() => (item, isSelected) => (
  <View>...</View>
), []);`} id="perf-tip" />
          </div>

          <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">🎨 Styling Tips</h3>
            <p className="text-gray-300 mb-4">Maintain consistency with the color prop across your app:</p>
            <CodeBlock code={`<RNPopoverSelector
  color="#667eea"
  textStyle={{ fontSize: 14 }}
  style={{ width: '100%' }}
/>`} id="style-tip" />
          </div>

          <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">📊 Data Structure</h3>
            <p className="text-gray-300 mb-4">Always ensure unique IDs in your data:</p>
            <CodeBlock code={`// ✅ Good - Unique IDs
const data = [
  { id: 'unique-1', title: 'Item 1' },
  { id: 'unique-2', title: 'Item 2' },
];`} id="data-tip" />
          </div>

          <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">🔍 Search Implementation</h3>
            <p className="text-gray-300 mb-4">Search is case-insensitive and filters by title property:</p>
            <CodeBlock code={`<RNPopoverSelector
  searchable
  data={data}
  placeholder="Search items..."
/>`} id="search-tip" />
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-white mb-12">Troubleshooting</h2>
        
        <div className="space-y-6">
          <div className="p-6 bg-red-900/20 border border-red-700/50 rounded-lg">
            <h3 className="text-lg font-semibold text-red-300 mb-2">❌ Dropdown not appearing</h3>
            <p className="text-gray-300">Ensure the component is within a proper parent container and check that the button ref is correctly assigned.</p>
          </div>

          <div className="p-6 bg-red-900/20 border border-red-700/50 rounded-lg">
            <h3 className="text-lg font-semibold text-red-300 mb-2">❌ Search not working</h3>
            <p className="text-gray-300 mb-4">Make sure searchable prop is enabled:</p>
            <CodeBlock code={`<RNPopoverSelector
  data={data}
  searchable={true}
  ...
/>`} id="search-fix" />
          </div>

          <div className="p-6 bg-red-900/20 border border-red-700/50 rounded-lg">
            <h3 className="text-lg font-semibold text-red-300 mb-2">❌ Multiple selection not working</h3>
            <p className="text-gray-300 mb-4">Ensure value is an array, not null:</p>
            <CodeBlock code={`// ✅ Correct
const [values, setValues] = useState([]);

// ❌ Wrong
const [values, setValues] = useState(null);`} id="multi-fix" />
          </div>

          <div className="p-6 bg-red-900/20 border border-red-700/50 rounded-lg">
            <h3 className="text-lg font-semibold text-red-300 mb-2">❌ Custom render not showing</h3>
            <p className="text-gray-300">Ensure your render function returns a valid React element and handles all props.</p>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-800/30 rounded-xl my-20">
        <h2 className="text-4xl font-bold text-white mb-12">Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <a href="https://github.com/chandannath98/RNPopoverSelector" target="_blank" rel="noopener noreferrer" className="p-8 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-purple-500/50 transition group">
            <Github className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold text-white mb-2">GitHub Repository</h3>
            <p className="text-gray-400">View source code, report issues, and contribute</p>
          </a>

          <a href="https://www.npmjs.com/package/rn-popover-selector" target="_blank" rel="noopener noreferrer" className="p-8 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-purple-500/50 transition group">
            <BookOpen className="w-12 h-12 text-pink-400 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold text-white mb-2">NPM Package</h3>
            <p className="text-gray-400">Install via npm or yarn package manager</p>
          </a>

          <a href="https://snack.expo.dev/@chandannath1/react-native-selector-rn-popover-selector" target="_blank" rel="noopener noreferrer" className="p-8 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-purple-500/50 transition group">
            <Zap className="w-12 h-12 text-yellow-400 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold text-white mb-2">Expo Snack</h3>
            <p className="text-gray-400">Try the component live in your browser</p>
          </a>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-white mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          {[
            {
              q: "What is RNPopoverSelector?",
              a: "RNPopoverSelector is a powerful React Native component that provides a customizable dropdown/popover selector with support for single selection, multi-select, search functionality, and custom rendering options."
            },
            {
              q: "How do I install RNPopoverSelector?",
              a: "Install RNPopoverSelector via npm with 'npm install rn-popover-selector' or yarn with 'yarn add rn-popover-selector'. Make sure you have React Native and react-native-vector-icons installed."
            },
            {
              q: "Does RNPopoverSelector support multi-select?",
              a: "Yes! RNPopoverSelector fully supports multi-select mode. Simply set the 'multiple' prop to true and pass an array to the 'value' prop to enable multiple selections."
            },
            {
              q: "Is search functionality built-in?",
              a: "Yes, RNPopoverSelector includes a built-in searchable option. Enable it by setting the 'searchable' prop to true. The search is case-insensitive and filters by the title property."
            },
            {
              q: "Can I customize the appearance?",
              a: "Absolutely! RNPopoverSelector is fully customizable. You can customize colors, width, rendering functions for buttons and items, and more using props and style options."
            },
            {
              q: "What platforms does RNPopoverSelector support?",
              a: "RNPopoverSelector works on both iOS and Android platforms. It requires React Native 0.60 or higher."
            },
            {
              q: "Is RNPopoverSelector free to use?",
              a: "Yes, RNPopoverSelector is completely free and open-source under the MIT license. You can use it in both personal and commercial projects."
            },
            {
              q: "How do I try RNPopoverSelector before installing?",
              a: "You can try RNPopoverSelector live using Expo Snack without installing anything. Visit the Expo Snack link to experiment with the component in real-time."
            },
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-purple-500/50 transition">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">{item.q}</h3>
              <p className="text-gray-300">{item.a}</p>
            </div>
          ))}
        </div>

        {/* FAQ Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is RNPopoverSelector?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "RNPopoverSelector is a powerful React Native component that provides a customizable dropdown/popover selector with support for single selection, multi-select, search functionality, and custom rendering options."
                }
              },
              {
                "@type": "Question",
                "name": "How do I install RNPopoverSelector?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Install RNPopoverSelector via npm with 'npm install rn-popover-selector' or yarn with 'yarn add rn-popover-selector'. Make sure you have React Native and react-native-vector-icons installed."
                }
              },
              {
                "@type": "Question",
                "name": "Does RNPopoverSelector support multi-select?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! RNPopoverSelector fully supports multi-select mode. Simply set the 'multiple' prop to true and pass an array to the 'value' prop to enable multiple selections."
                }
              },
              {
                "@type": "Question",
                "name": "Is search functionality built-in?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, RNPopoverSelector includes a built-in searchable option. Enable it by setting the 'searchable' prop to true. The search is case-insensitive and filters by the title property."
                }
              },
              {
                "@type": "Question",
                "name": "Can I customize the appearance?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely! RNPopoverSelector is fully customizable. You can customize colors, width, rendering functions for buttons and items, and more using props and style options."
                }
              },
              {
                "@type": "Question",
                "name": "What platforms does RNPopoverSelector support?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "RNPopoverSelector works on both iOS and Android platforms. It requires React Native 0.60 or higher."
                }
              },
              {
                "@type": "Question",
                "name": "Is RNPopoverSelector free to use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, RNPopoverSelector is completely free and open-source under the MIT license. You can use it in both personal and commercial projects."
                }
              },
              {
                "@type": "Question",
                "name": "How do I try RNPopoverSelector before installing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can try RNPopoverSelector live using Expo Snack without installing anything. Visit the Expo Snack link to experiment with the component in real-time."
                }
              }
            ]
          })}
        </script>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 mb-2">
            <span className="font-semibold text-white">RNPopoverSelector</span> - React Native Selector Component
          </p>
          <p className="text-gray-500 text-sm">
            Made with <span className="text-red-500">❤️</span> by{' '}
            <a href="https://github.com/chandannath98" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
              Chandan Nath
            </a>
          </p>
          <p className="text-gray-600 text-xs mt-4">
            © 2026 | MIT License
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default RNPopoverSelectorDocs;
