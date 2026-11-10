import { useState } from "react";

type ItemId = string | number;

interface FromToListProps<T> {
  availableItems: T[];
  selectedItems?: T[];
  getId: (item: T) => ItemId;
  getLabel: (item: T) => string;
  onChange?: (from: T[], to: T[]) => void;
  height?: string;
}

export default function FromToList<T>({
  availableItems,
  selectedItems = [],
  getId,
  getLabel,
  onChange,
  height = "h-64",
}: FromToListProps<T>) {
  const [from, setFrom] = useState<T[]>(() =>
    availableItems.filter(
      (item) =>
        !selectedItems.some((selected) => getId(selected) === getId(item)),
    ),
  );

  const [to, setTo] = useState<T[]>(selectedItems);

  const [selectedFrom, setSelectedFrom] = useState<ItemId[]>([]);
  const [selectedTo, setSelectedTo] = useState<ItemId[]>([]);

  // Update both lists
  const updateLists = (newFrom: T[], newTo: T[]) => {
    setFrom(newFrom);
    setTo(newTo);
    onChange?.(newFrom, newTo);
  };

  // Toggle item selection
  const toggleSelection = (
    id: ItemId,
    selected: ItemId[],
    setSelected: (ids: ItemId[]) => void,
  ) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );
  };

  // Move selected items from From to To
  const moveTo = () => {
    const moving = from.filter((item) => selectedFrom.includes(getId(item)));

    updateLists(
      from.filter((item) => !selectedFrom.includes(getId(item))),
      [...to, ...moving],
    );

    setSelectedFrom([]);
  };

  // Move all items from From to To
  const moveAllTo = () => {
    updateLists([], [...to, ...from]);
    setSelectedFrom([]);
  };

  // Move selected items from To to From
  const moveFrom = () => {
    const moving = to.filter((item) => selectedTo.includes(getId(item)));

    updateLists(
      [...from, ...moving],
      to.filter((item) => !selectedTo.includes(getId(item))),
    );

    setSelectedTo([]);
  };

  // Move all items from To to From
  const moveAllFrom = () => {
    updateLists([...from, ...to], []);
    setSelectedTo([]);
  };

  // Render a list
  const renderList = (
    title: string,
    items: T[],
    selected: ItemId[],
    setSelected: (ids: ItemId[]) => void,
    onDoubleClick: (item: T) => void,
  ) => {
    const [search, setSearch] = useState("");

    const filteredItems = items.filter((item) =>
      getLabel(item).toLowerCase().includes(search.toLowerCase()),
    );

    return (
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-2">
          <span className="font-semibold text-gray-700">{title}</span>
          <span className="text-sm text-gray-500">{items.length} items</span>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${title}...`}
          className="w-full mb-2 rounded border border-gray-300
                     px-3 py-2 text-sm outline-none
                     focus:border-blue-500"
        />

        <div
          className={`${height} overflow-y-auto rounded-lg
                         border border-gray-300 bg-white`}
        >
          {filteredItems.map((item) => {
            const id = getId(item);
            const isSelected = selected.includes(id);

            return (
              <div
                key={id}
                onClick={() => toggleSelection(id, selected, setSelected)}
                onDoubleClick={() => onDoubleClick(item)}
                className={`cursor-pointer border-b border-gray-100
                            px-3 py-2 text-sm hover:bg-blue-50
                  ${
                    isSelected ? "bg-blue-100 text-blue-800" : "text-gray-700"
                  }`}
              >
                {getLabel(item)}
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-400">
              No items found
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full items-center gap-4">
      {renderList("From", from, selectedFrom, setSelectedFrom, (item) => {
        updateLists(
          from.filter((x) => getId(x) !== getId(item)),
          [...to, item],
        );
        setSelectedFrom([]);
      })}

      {/* Move buttons */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={moveTo}
          disabled={!selectedFrom.length}
          className="rounded border px-3 py-2 hover:bg-gray-100
                     disabled:opacity-40"
        >
          &gt;
        </button>

        <button
          type="button"
          onClick={moveAllTo}
          disabled={!from.length}
          className="rounded border px-3 py-2 hover:bg-gray-100
                     disabled:opacity-40"
        >
          &gt;&gt;
        </button>

        <button
          type="button"
          onClick={moveFrom}
          disabled={!selectedTo.length}
          className="rounded border px-3 py-2 hover:bg-gray-100
                     disabled:opacity-40"
        >
          &lt;
        </button>

        <button
          type="button"
          onClick={moveAllFrom}
          disabled={!to.length}
          className="rounded border px-3 py-2 hover:bg-gray-100
                     disabled:opacity-40"
        >
          &lt;&lt;
        </button>
      </div>

      {renderList("To", to, selectedTo, setSelectedTo, (item) => {
        updateLists(
          [...from, item],
          to.filter((x) => getId(x) !== getId(item)),
        );
        setSelectedTo([]);
      })}
    </div>
  );
}
