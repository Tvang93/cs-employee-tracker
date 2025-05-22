import EmployeePageComponent from '@/components/EmployeePageComponent';
import React from 'react'

const page = async ({
  params,
}: {
  params: Promise<{ employeeId: number }>;
}) => {
    const { employeeId } = await params;

    return (
        <EmployeePageComponent employeeId={employeeId}/>
    )
}

export default page