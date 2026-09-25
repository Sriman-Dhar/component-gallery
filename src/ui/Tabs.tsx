import { useState, type ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export default function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const current = items.find((item) => item.id === active) ?? items[0];

  return (
    <div>
      <div role="tablist" className="mb-4 flex gap-2 border-b border-gray-200">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === current?.id}
            onClick={() => setActive(item.id)}
            className={`px-3 py-2 text-sm ${
              item.id === current?.id ? 'border-b-2 border-gray-900' : 'text-gray-500'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{current?.content}</div>
    </div>
  );
}
