import { useState } from "react";

export type DynamicTableProps = {
  data: any[];
  columns: string[];
};

export default function DynamicTable({
  data: initialData,
  columns: initialColumns,
}: DynamicTableProps) {
  const [data, setData] = useState(initialData);
  const [columns, setColumns] = useState(initialColumns);

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column}
              className="border border-neutral-300 px-3 py-2 text-left font-semibold"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.entries(row).map(([key, value]) => (
              <td key={key} className="border border-neutral-300 px-3 py-2">
                {String(value ?? "")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
