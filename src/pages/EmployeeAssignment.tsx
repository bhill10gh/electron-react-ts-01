import { useState } from "react";
import FromToList from "../components/FromToListProps";

interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  department: string;
}

const employees: Employee[] = [
  {
    employeeId: 1,
    firstName: "John",
    lastName: "Smith",
    department: "IT",
  },
  {
    employeeId: 2,
    firstName: "Mary",
    lastName: "Jones",
    department: "Accounting",
  },
  {
    employeeId: 3,
    firstName: "David",
    lastName: "Brown",
    department: "Sales",
  },
  {
    employeeId: 4,
    firstName: "Sarah",
    lastName: "Wilson",
    department: "IT",
  },
];

function EmployeeAssignment() {
  const [assigned, setAssigned] = useState<Employee[]>([]);

  const handleChange = (from: Employee[], to: Employee[]) => {
    setAssigned(to);

    console.log("Available:", from);
    console.log("Assigned:", to);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="mb-4 text-xl font-semibold">Employee Assignment</h2>

      <FromToList<Employee>
        availableItems={employees}
        selectedItems={[]}
        getId={(item: Employee) => item.employeeId}
        getLabel={(item: Employee) =>
          `${item.firstName} ${item.lastName} (${item.department})`
        }
        onChange={handleChange}
        height="h-80"
      />
    </div>
  );
}

export default EmployeeAssignment;
