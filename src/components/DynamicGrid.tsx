import React, { useCallback, useEffect, useRef, useState } from "react";

function GridCell({
  children,
  tooltip,
}: {
  children: React.ReactNode;
  tooltip: string;
}) {
  const cellRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState<string | undefined>();

  const updateTooltip = useCallback(() => {
    const el = cellRef.current;
    if (!el) return;
    const truncated = el.scrollWidth > el.clientWidth;
    setTitle(truncated && tooltip ? tooltip : undefined);
  }, [tooltip]);

  useEffect(() => {
    updateTooltip();
    const el = cellRef.current;
    if (!el) return;

    const observer = new ResizeObserver(updateTooltip);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateTooltip, children]);

  return (
    <div ref={cellRef} className="p-3 min-w-0 truncate" title={title}>
      {children}
    </div>
  );
}

export interface GridColumn<T> {
  key: keyof T;
  header: string;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

type ResolvedColumn = {
  key: string;
  header: string;
  width?: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
};

type DynamicGridPropsWithColumns<T extends object> = {
  columns: GridColumn<T>[];
  data: T[];
};

type DynamicGridPropsWithStrings = {
  columns: string[];
  data: object[];
};

type DynamicGridProps<T extends object> =
  | DynamicGridPropsWithColumns<T>
  | DynamicGridPropsWithStrings;

function isStringColumnList(columns: readonly unknown[]): columns is string[] {
  return columns.length > 0 && typeof columns[0] === "string";
}

function resolveStringColumns(
  headers: string[],
  data: object[]
): ResolvedColumn[] {
  const fieldKeys =
    data.length > 0
      ? Object.keys(rowAsRecord(data[0]))
      : [];

  return headers.map((header, index) => {
    const fieldKey = fieldKeys[index];
    return {
      key: fieldKey ?? header,
      header,
    };
  });
}

function resolveTypedColumns<T extends object>(
  columns: GridColumn<T>[]
): ResolvedColumn[] {
  return columns.map((col) => ({
    key: String(col.key),
    header: col.header,
    width: col.width,
    render: col.render
      ? (value, row) => col.render!(value, row as T)
      : undefined,
  }));
}

function rowAsRecord(row: object): Record<string, unknown> {
  return row as Record<string, unknown>;
}

export default function DynamicGrid<T extends object>(
  props: DynamicGridProps<T>
) {
  const { columns, data } = props;

  const resolvedColumns: ResolvedColumn[] = isStringColumnList(columns)
    ? resolveStringColumns(columns, data)
    : resolveTypedColumns(columns as GridColumn<T>[]);

  const gridTemplate = resolvedColumns
    .map((col) => col.width ?? "minmax(0, 1fr)")
    .join(" ");

  return (
    <div className="w-full overflow-x-auto border border-gray-300 rounded-lg">
      {/* Header */}
      <div
        className="grid bg-slate-700 text-white font-semibold"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {resolvedColumns.map((col) => (
          <div key={col.key} className="p-3">
            {col.header}
          </div>
        ))}
      </div>

      {/* Data Rows */}
      {data.map((row, rowIndex) => {
        const record = rowAsRecord(row);
        return (
          <div
            key={rowIndex}
            className={`grid border-t border-gray-200 ${
              rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
            } hover:bg-blue-50`}
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {resolvedColumns.map((col) => {
              const value = record[col.key];
              const text = String(value ?? "");
              return (
                <GridCell key={col.key} tooltip={text}>
                  {col.render ? col.render(value, record) : text}
                </GridCell>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
