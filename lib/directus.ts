/* eslint-disable prettier/prettier */
import { createDirectus, staticToken, rest, readItems } from "@directus/sdk";

//should be in env
const apiClient = "YQRwVAFUn-LlC_IOPoOkpVLeH75QBlyI"
  ? createDirectus("https://data.zanda.info")
      .with(staticToken("YQRwVAFUn-LlC_IOPoOkpVLeH75QBlyI"))
      .with(rest({ credentials: "include" }))
  : undefined;
const employees: any = "Employees";

export async function getEmployees() {
  try {
    const data = await apiClient?.request(
      readItems(employees, {
        fields: ["id", "Employee_Username", "employee_pin", "Clock_Status"],
      })
    );

    return data;
  } catch (error) {
    return error;
  }
}
