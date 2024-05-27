/* eslint-disable prettier/prettier */
import { getEmployees } from "@/lib/directus";
import TimeForm from "@/components/TimeForm";
import { IEmployees } from "@/app/types"

export default async function Home() {

  const employees = await getEmployees();
  // console.log(employees);


  return (
    <main>

      {/* <TimeForm data={employees} /> */}

    </main>
  );
}
