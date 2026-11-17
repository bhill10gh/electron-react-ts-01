import { useState } from "react";
import FromToList from "../components/FromToList";
import CollapsiblePanel from "../components/CollapsiblePanel";
import DynamicGrid from "../components/DynamicGrid";

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

  const columns = ["Employee Id", "First Name", "Last Name", "Department"];

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Employee Assignment</h2>

      <div className="space-y-3 p-6">
        <CollapsiblePanel title="Empoyee Selection" defaultOpen={true}>
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
        </CollapsiblePanel>
        <CollapsiblePanel title="Assigned Employees">
          {assigned !== null && assigned.length > 0 && (
            <DynamicGrid columns={columns} data={assigned} />
          )}
          {assigned.length === 0 && (
            <p className="text-gray-500">No employees assigned</p>
          )}
        </CollapsiblePanel>
      </div>
    </div>
  );
}

export default EmployeeAssignment;
