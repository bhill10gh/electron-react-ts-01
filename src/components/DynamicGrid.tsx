import React from "react";

export interface GridColumn<T> {
  key: keyof T;
  header: string;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DynamicGridProps<T> {
  columns: GridColumn<T>[];
  data: T[];
}

export default function DynamicGrid<T>({ columns, data }: DynamicGridProps<T>) {
  const gridColumns = columns
    .map((col) => col.width ?? "minmax(0, 1fr)")
    .join(" ");

  return (
    <div className="w-full overflow-x-auto border border-gray-300 rounded-lg">
      {/* Header */}
      <div
        className="grid bg-slate-700 text-white font-semibold"
        style={{ gridTemplateColumns: gridColumns }}
      >
        {columns.map((col) => (
          <div key={String(col.key)} className="p-3">
            {col.header}
          </div>
        ))}
      </div>

      {/* Data Rows */}
      {data.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid border-t border-gray-200 ${
            rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
          } hover:bg-blue-50`}
          style={{ gridTemplateColumns: gridColumns }}
        >
          {columns.map((col) => (
            <div key={String(col.key)} className="p-3 min-w-0 truncate">
              {col.render
                ? col.render(row[col.key], row)
                : String(row[col.key] ?? "")}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
