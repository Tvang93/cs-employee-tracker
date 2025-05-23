"use client";

import { Employee } from "@/lib/interfaces/interfaces";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { updateEmployeeDetails } from "@/lib/services/employee-service";

const EmployeeEditView = ({
  employee,
  setEdit,
}: {
  employee: Employee;
  setEdit: (value: boolean) => void;
}) => {
  const [status, setStatus] = useState<string>("");
  const [employeeToChange, setEmployeeToChange] = useState<Employee>(employee);

  const [token, setToken] = useState("");

  // get token
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

  // Change employee functions
  const handleEmployeeToChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEmployeeToChange({
      ...employeeToChange,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    setEmployeeToChange({
      ...employeeToChange,
      status: status,
    });
  }, [status]);

  //make edits
  const handleSaveEdits = async () => {
    const didItUpdate: boolean = await updateEmployeeDetails(
      token,
      employeeToChange
    );
    if (didItUpdate) {
      setEdit(false);
    }
  };

  // Date functions
  const formatDateForInput = (date: string) => {
    if (!date) return undefined;

    const [year, month, day] = date.toString().split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <>
      <div>
        <p className="text-sm font-semibold">Job Title</p>
        <Input disabled value={employee.jobTitle} />
      </div>

      <div>
        <p className="text-sm font-semibold">Details</p>
        <Input
          id="details"
          placeholder={employee.details ? employee.details : ""}
          onChange={handleEmployeeToChange}
        />
      </div>

      <div>
        <p className="text-sm font-semibold">Status</p>
        <Select onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="hover:cursor-pointer">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem className="hover:cursor-pointer" value="Active">
                Active
              </SelectItem>
              <SelectItem className="hover:cursor-pointer" value="Sick">
                Sick
              </SelectItem>
              <SelectItem
                className="hover:cursor-pointer"
                value="Out of Office"
              >
                Out of Office
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="text-sm font-semibold">Hire Date</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal text-muted-foreground hover:cursor-pointer"
              )}
              disabled
            >
              <CalendarIcon />
              <span>{employee.hireDate}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formatDateForInput(employee.hireDate)}
              disabled
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-between pt-4">
        <Button className="hover:cursor-pointer" onClick={() => setEdit(false)}>
          Cancel
        </Button>
        {employee && (
          <Button
            className="hover:cursor-pointer"
            variant="outline"
            onClick={handleSaveEdits}
          >
            Save Edits
          </Button>
        )}
      </div>
    </>
  );
};

export default EmployeeEditView;
