/* eslint-disable prettier/prettier */
export interface IEmployees {
  id: number;
  employee_pin: string;
  Employee_Username: string;
  Clock_Status: boolean;
}

// export interface IInitial {
//   message: string;
//   fieldValues: {
//     username: string;
//     pin: string;
//     ipaddress: string;
//     localTime: string;
//     timezoneClient: string;
//     timezoneOffset: string;
//   };
//   error: string;
//   stats: boolean;
// }

export interface IInitial {
  fieldValues: {
    userid: string;
    username: string;
    pin: string;
    hash: string;
    ipaddress: string;
  };
  error: string;
}
