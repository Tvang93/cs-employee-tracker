'use client'

import { Employee } from '@/lib/interfaces/interfaces'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'

const EmployeeEditView = ({ employee, setEdit }: { employee: Employee, setEdit: (value: boolean) => void }) => {
    const [details, setDetails] = useState<string>("")
    const [status, setStatus] = useState<string>("")
      const [employeeToChange, setEmployeeToChange] = useState<Employee>({
        id: 0,
        name: "",
        jobTitle: "",
        hireDate: "",
      });

    useEffect(()=>{
        setEmployeeToChange(employee)
    }, [])

    useEffect(()=>{

    }, [details])

      const handleEmployeeToChangeHireDate = (date: string) => {
    setEmployeeToChange({
      ...employeeToChange,
      hireDate: date,
    });
  };

  // Date functions
  const formatDateForInput = (date: string) => {
    if (!date) return undefined;

    const [year, month, day] = date.toString().split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDateFromInput = (date: Date | undefined) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

    return (
        <>
            <div>
                <p className="text-sm font-semibold">Job Title</p>
                <Input readOnly value={employee.jobTitle} />
            </div>

            <div>
                <p className="text-sm font-semibold">Details</p>
                <Input onChange={(e)=>(setDetails(e.target.value))} />
            </div>

            <div>
                <p className="text-sm font-semibold">Status</p>
                <Select>
                    <SelectTrigger className='hover:cursor-pointer'>
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem className='hover:cursor-pointer' value="Active">Active</SelectItem>
                            <SelectItem className='hover:cursor-pointer' value="Sick">Sick</SelectItem>
                            <SelectItem className='hover:cursor-pointer' value="Out of Office">Out of Office</SelectItem>
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
                                    className={cn("w-full justify-start text-left font-normal text-muted-foreground hover:cursor-pointer")}
                                >
                                    <CalendarIcon />
                                    <span>{new Date(employee.hireDate).toLocaleDateString()}</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formatDateForInput(employee.hireDate)}
                                    // onSelect={(e) => {
                                    //     console.log("test");
                                    //     handleEmployeeToChangeHireDate(formatDateFromInput(e))
                                    //     }
                                    // }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
            </div>


            <div className="flex justify-between pt-4">
                <Button className='hover:cursor-pointer' onClick={() => setEdit(false)}>Cancel</Button>
                {employee && <Button className='hover:cursor-pointer' variant="outline">Save Edits</Button>}
            </div>
        </>
    )
}

export default EmployeeEditView