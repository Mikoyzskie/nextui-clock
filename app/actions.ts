/* eslint-disable prettier/prettier */
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DateTime } from "luxon";

import {
  checkIpAddress,
  getRecentClock,
  verifyPin,
  getUser,
  AttendanceIn,
  ExtendTimeIn,
  AttendanceOut,
  ExtendTimeOut,
} from "@/lib/directus";

const emptyField = {
  username: "",
  pin: "",
  ipaddress: "",
  localTime: "",
  timezoneClient: "",
  timezoneOffset: "",
};

export async function Attendance(
  prevState: {
    error: string;
    reset: boolean;
  },
  formData: FormData
) {
  const schema = z.object({
    username: z.string().min(1),
    pin: z.string().min(1),
    ipaddress: z.string().min(1),
    localTime: z.string().min(1),
    timezoneClient: z.string().min(1),
    timezoneOffset: z.string().min(1),
  });
  const parse = schema.safeParse({
    username: formData.get("username"),
    pin: formData.get("pin"),
    ipaddress: formData.get("ipaddress"),
    localTime: formData.get("localTime"),
    timezoneClient: formData.get("timezoneClient"),
    timezoneOffset: formData.get("timezoneOffset"),
  });

  if (!parse.success) {
    return { error: "Failed to parse form data", reset: false };
  }

  const data = parse.data;

  const {
    username,
    pin,
    ipaddress,
    localTime,
    timezoneClient,
    timezoneOffset,
  } = data;

  const formValues = {
    username,
    pin,
    ipaddress,
    localTime,
    timezoneClient,
    timezoneOffset,
  };

  try {
    const isValidUser: any = await getUser(username);

    if (isValidUser?.length === 0)
      return {
        error: "User not found",
        formValues,
        reset: false,
      };

    const checkPin = await verifyPin(pin, isValidUser[0].employee_pin);

    if (!checkPin)
      return {
        error: "Invalid pin",
        formValues,
        reset: false,
      };

    const isValidIpAddres = await checkIpAddress(ipaddress);

    if (isValidIpAddres?.length === 0)
      return {
        error: "Ip Address Invalid",
        formValues,
        reset: false,
      };

    const checkAttendance: any = await getRecentClock(isValidUser[0].id);

    if (checkAttendance && checkAttendance.length > 0) {
      const jsDate = new Date(localTime);

      const currentTimeIn = new Date(checkAttendance[0].date_created);

      if (checkAttendance[0].clock_out_utc === null) {
        if (jsDate.getDate() - currentTimeIn.getDate() >= 2) {
          await AttendanceIn(
            isValidUser[0].id,
            localTime,
            timezoneClient,
            timezoneOffset
          );
          await ExtendTimeIn(isValidUser[0].id);
          await AttendanceOut(checkAttendance[0].id, "No Log");

          revalidatePath("/");

          return {
            error: "Logged in",
            emptyField,
            reset: true,
          };
        } else {
          //Log out

          await AttendanceOut(checkAttendance[0].id, localTime);
          await ExtendTimeOut(isValidUser[0].id);

          revalidatePath("/");

          return {
            error: "Logged out",
            emptyField,
            reset: true,
          };
        }
      } else {
        if (jsDate.getDate() === currentTimeIn.getDate()) {
          revalidatePath("/");

          return {
            error: "Already logged today",
            emptyField,
            reset: true,
          };
        } else {
          await AttendanceIn(
            isValidUser[0].id,
            localTime,
            timezoneClient,
            timezoneOffset
          );
          await ExtendTimeIn(isValidUser[0].id);

          revalidatePath("/");

          return {
            error: "Logged in",
            emptyField,
            reset: true,
          };
        }
      }
    } else {
      //Log in

      await AttendanceIn(
        isValidUser[0].id,
        localTime,
        timezoneClient,
        timezoneOffset
      );
      await ExtendTimeIn(isValidUser[0].id);

      revalidatePath("/");

      return {
        error: "Logged in",
        emptyField,
        reset: true,
      };
    }
  } catch (error) {
    return {
      error: "Internal Server Error",
      formValues,
      reset: false,
    };
  }
}
