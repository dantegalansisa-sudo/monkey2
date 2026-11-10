import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type QuoteItem =
  | { kind: 'artist'; id: string; date?: string; format?: string }
  | { kind: 'service'; id: string }
  | { kind: 'pack'; id: string };

type Ctx = {
  items: QuoteItem[];
  has: (kind: QuoteItem['kind'], id: string) => boolean;
  toggle: (item: QuoteItem) => void;
  add: (item: QuoteItem) => void;
  remove: (kind: QuoteItem['kind'], id: string) => void;
  clear: () => void;
  pulse: number;
  lastAdded: string | null;
};

const QuoteCtx = createContext<Ctx>(null as never);

function load(): QuoteItem[] {
  try {
    const raw = localStorage.getItem('bq-quote');
    return raw ? (JSON.parse(raw) as QuoteItem[]) : [];
  } catch {
    return [];
  }
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>(load);
  const [pulse, setPulse] = useState(0);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('bq-quote', JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items]);

  const has = (kind: QuoteItem['kind'], id: string) => items.some((i) => i.kind === kind && i.id === id);
  const remove = (kind: QuoteItem['kind'], id: string) => setItems((xs) => xs.filter((i) => !(i.kind === kind && i.id === id)));
  const add = (item: QuoteItem) => {
    setItems((xs) => [...xs.filter((i) => !(i.kind === item.kind && i.id === item.id)), item]);
    setPulse((p) => p + 1);
    setLastAdded(item.id);
  };
  const toggle = (item: QuoteItem) => (has(item.kind, item.id) ? remove(item.kind, item.id) : add(item));

  return (
    <QuoteCtx.Provider value={{ items, has, toggle, add, remove, clear: () => setItems([]), pulse, lastAdded }}>{children}</QuoteCtx.Provider>
  );
}

export const useQuote = () => useContext(QuoteCtx);

export const CONTACT = {
  whatsapp: '17879550554',
  phone: '787-955-0554',
  phoneHref: 'tel:+17879550554',
  email: 'Monkeydopr@gmail.com',
  instagram: 'https://www.instagram.com/monkeydostudios/',
};

export const waLink = (text: string) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
