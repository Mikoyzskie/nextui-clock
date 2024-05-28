/* eslint-disable prettier/prettier */
import {
  createDirectus,
  staticToken,
  rest,
  readItems,
  verifyHash,
} from "@directus/sdk";

//should be in env
const apiClient = "YQRwVAFUn-LlC_IOPoOkpVLeH75QBlyI"
  ? createDirectus("https://data.zanda.info")
      .with(staticToken("YQRwVAFUn-LlC_IOPoOkpVLeH75QBlyI"))
      .with(rest({ credentials: "include" }))
  : undefined;

//Ip address list
const iplist: any = "time_clock_allowed_ips";

export async function checkIpAddress(ip: string) {
  return await apiClient?.request(
    readItems(iplist, {
      fields: ["IP_Address"],
      filter: {
        IP_Address: {
          _eq: ip,
        },
      },
    })
  );
}

//Employees
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

// Clocks
const attendance: any = "Attendance_Clocks";

export async function getRecentClock(user: number) {
  try {
    const data = await apiClient?.request(
      readItems(attendance, {
        fields: ["*"],
        filter: {
          clock_user: {
            _eq: user,
          },
        },
        sort: ["-date_created"],
        limit: 1,
      })
    );

    return data;
  } catch (error) {
    return error;
  }
}

export async function TimeIn() {
  try {
  } catch (error) {
    return error;
  }
}

//Hashing

export async function verifyPin(pin: string, hash: string) {
  return apiClient?.request(verifyHash(pin, hash));
}
