"use client";

import { Employee } from "@/lib/interfaces/interfaces";
import { deleteEmployee, getEmployees } from "@/lib/services/employee-service";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Button } from "./ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "./ui/table";
import EmployeeModal from "./EmployeeModal";
import { useAppContext } from "@/lib/context/context";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const EmployeeTable = () => {
  const { push } = useRouter();

  const { setEmployeeId } = useAppContext();

  // useStates
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sortedEmployees, setSortedEmployees] = useState<Employee[]>([]);
  const [sortedEmployeesArr, setSortedEmployeesArr] = useState<Employee[][]>([]);
  const [pageNum, setPageNum] = useState<number>(1)

  const [token, setToken] = useState("");

  const [sortBy, setSortBy] = useState("");
  const [sortByJob, setSortByJob] = useState("");

  const numOfEntriesPerPage = 10

  // Function to get employees
  const handleGetEmployees = async () => {
    try {
      const result: Employee[] | "Not Authorized" = await getEmployees(token);
      // const result: Employee[] | "Not Authorized" = [];
      if (result.toString() === "Not Authorized") {
        localStorage.setItem("Not Authorized", "true");
        push("/login");
      }

      setEmployees(result as Employee[]);
    } catch (error) {
      console.log("error", error);
    }
  };

function chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
        array.slice(i * size, i * size + size)
    );
}

  useEffect(()=>{
    setSortedEmployeesArr(chunkArray(employees, numOfEntriesPerPage))
  }, [employees])

//   useEffect(()=>{
//     console.log(num)
//   }, [num])

  // Updating sort functions
  const changeSortBy = (value: string) => {
    if (sortByJob) {
      setSortByJob("");
    }

    setSortBy(value);
  };

  const changeSortByJob = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy("job-title");

    setSortByJob(e.target.value);
  };

  // Delete employee
  const handleDeleteEmployee = async (id: number) => {
    try {
      if (await deleteEmployee(token, id)) {
        await handleGetEmployees();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleViewEmployee = async (id: number) => {
    await setEmployeeId(id);

    push(`/employee-page/${id}`);
  };

  // Getting the user token from storage
  useEffect(() => {
    const handleToken = async () => {
      if (localStorage.getItem("user")) {
        setToken(await JSON.parse(localStorage.getItem("user")!).token);
      }
      if (sessionStorage.getItem("user")) {
        setToken(await JSON.parse(sessionStorage.getItem("user")!).token);
      }
    };

    handleToken();
  }, []);

  // Fetching employees after token is set
  useEffect(() => {
    if (token !== "") {
      handleGetEmployees();
    }
  }, [token]);

  // Sorting the employees
  useEffect(() => {
    const sortingEmployees = employees;

    const handleSorting = (arrToSort: Employee[], number: number) => {
      switch (sortBy) {
        case "name":
          arrToSort.sort((a: Employee, b: Employee) =>
            a.name.localeCompare(b.name)
          )
          .slice(1, 4);
          break;
        case "name-reverse":
          arrToSort.sort((a: Employee, b: Employee) =>
            b.name.localeCompare(a.name)
          );
          break;
        case "hire-date":
          arrToSort.sort(
            (a: Employee, b: Employee) =>
              Number(new Date(b.hireDate)) - Number(new Date(a.hireDate))
          );
          break;
        case "hire-date-reverse":
          arrToSort.sort(
            (a: Employee, b: Employee) =>
              Number(new Date(a.hireDate)) - Number(new Date(b.hireDate))
          );
          break;
        default:
          arrToSort.sort((a: Employee, b: Employee) => a.id - b.id);
          break;
      }
      const slicedArr = arrToSort.slice(number*numOfEntriesPerPage-numOfEntriesPerPage, number*numOfEntriesPerPage)
      setSortedEmployees([...slicedArr]);
    };
    if (sortBy === "job-title") {
      handleSorting(
        sortingEmployees.filter(
          (employee: Employee) => employee.jobTitle == sortByJob
        ), pageNum);
    } else {
      handleSorting(sortingEmployees, pageNum);
    }
  }, [sortedEmployeesArr, sortBy, sortByJob, pageNum]);

  const handlePageChangeUp = () => {
    if(pageNum < Math.ceil(employees.length/numOfEntriesPerPage)){
        setPageNum(pageNum + 1)
    }
  }

  const handlePageChangeDown = () => {
    if(pageNum > 1){
        setPageNum(pageNum - 1)
    }
  }

  return (
    <>
      {/* Sort by - Start */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4">
        <div className="flex items-center gap-3 mb-2 md:mb-0">
          <h2 className="text-2xl font-medium text-gray-700 dark:text-white">
            Add new hire
          </h2>
          <EmployeeModal
            type="Add"
            employee={null}
            refreshEmployees={handleGetEmployees}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center">
            <p className="mr-2 text-sm text-gray-600">Sort by:</p>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-sm text-gray-600 hover:cursor-pointer"
                >
                  Name
                  {sortBy === "name" ? (
                    <FaCaretDown className="ml-2" />
                  ) : sortBy === "name-reverse" ? (
                    <FaCaretUp className="ml-2" />
                  ) : (
                    ""
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="hover:cursor-pointer hover:bg-gray-100"
                  onClick={() => changeSortBy("name")}
                >
                  A-Z
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:cursor-pointer hover:bg-gray-100"
                  onClick={() => changeSortBy("name-reverse")}
                >
                  Z-A
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-sm text-gray-600 hover:cursor-pointer"
                >
                  Hire date
                  {sortBy === "hire-date" ? (
                    <FaCaretUp className="ml-2" />
                  ) : sortBy === "hire-date-reverse" ? (
                    <FaCaretDown className="ml-2" />
                  ) : (
                    ""
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="hover:cursor-pointer hover:bg-gray-100"
                  onClick={() => changeSortBy("hire-date")}
                >
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:cursor-pointer hover:bg-gray-100"
                  onClick={() => changeSortBy("hire-date-reverse")}
                >
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <select
              className="ml-3 text-sm border rounded p-1 hover:cursor-pointer"
              value={sortBy === "job-title" ? sortByJob : ""}
              onChange={changeSortByJob}
            >
              <option value="" disabled>
                Job title
              </option>
              <option value="Customer Support">Customer Support</option>
              <option value="IT Support Specialist">
                IT Support Specialist
              </option>
              <option value="Software Engineer">Software Engineer</option>
            </select>
          </div>
        </div>
      </div>
      {/* Sort by - End */}

      {/* Display table - Start */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg">Employee name</TableHead>
            <TableHead className="text-lg">Job Title</TableHead>
            <TableHead className="text-lg">Date Hired</TableHead>
            <TableHead className="text-lg text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEmployees.length === 0 ? (
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="text-center">No Employees</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ) : (
            sortedEmployees.map((employee, idx) => (
                <TableRow key={idx}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.jobTitle}</TableCell>
                    <TableCell>{employee.hireDate}</TableCell>
                    <TableCell className="flex gap-3 justify-end">
                        <Button className='hover:cursor-pointer' onClick={() => handleViewEmployee(employee.id)}>
                            View
                        </Button>
                        <EmployeeModal type="Edit" employee={employee} refreshEmployees={handleGetEmployees} />
                        <Button variant="destructive" className='hover:cursor-pointer' onClick={() => handleDeleteEmployee(employee.id)}>
                            Delete
                        </Button>
                    </TableCell>
                </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Display table - End */}

    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious className={`${pageNum > 1 ? `hover:cursor-pointer` : `hover:cursor-auto`}`} onClick={handlePageChangeDown} />
        </PaginationItem>
        {sortedEmployeesArr.length === 0 ? (
            <PaginationItem>
                <PaginationEllipsis />
            </PaginationItem>
        ) : (
            sortedEmployeesArr.map((arr, idx)=>
            <PaginationItem key={idx}>
                <PaginationLink className='hover: cursor-pointer' onClick={()=>setPageNum(idx+1)} isActive={pageNum == idx+1}>{idx+1}</PaginationLink>
            </PaginationItem>
            )
        )}
        <PaginationItem>
          <PaginationNext className={`${pageNum < Math.ceil(employees.length/numOfEntriesPerPage) ? `hover:cursor-pointer` : `hover:cursor-auto`}`} onClick={handlePageChangeUp} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>

    </>
  );
};

export default EmployeeTable;
