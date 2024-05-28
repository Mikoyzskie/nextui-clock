/* eslint-disable prettier/prettier */
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DateTime } from "luxon";

import { checkIpAddress, getRecentClock, verifyPin } from "@/lib/directus";

const emptyField = {
  userid: 0,
  username: "",
  pin: "",
  hash: "",
  ipaddress: "",
  //   localTime: "",
  //   timezoneClient: "",
  //   timezoneOffset: "",
};

export async function Attendance(
  prevState: {
    error: string;
  },
  formData: FormData
) {
  const schema = z.object({
    userid: z.string().min(1),
    username: z.string().min(1),
    pin: z.string().min(1),
    hash: z.string().min(1),
    ipaddress: z.string().min(1),
  });
  const parse = schema.safeParse({
    userid: formData.get("userid"),
    username: formData.get("username"),
    pin: formData.get("pin"),
    hash: formData.get("hash"),
    ipaddress: formData.get("ipaddress"),
  });

  if (!parse.success) {
    return { error: "Failed to parse form data" };
  }

  const data = parse.data;

  const {
    userid,
    username,
    pin,
    hash,
    ipaddress,
    // localTime,
    // timezoneClient,
    // timezoneOffset,
  } = data;

  const formValues = {
    userid,
    username,
    pin,
    hash,
    ipaddress,
    // localTime,
    // timezoneClient,
    // timezoneOffset,
  };

  try {
    const isValidIpAddres = await checkIpAddress(ipaddress);

    if (isValidIpAddres?.length === 0)
      return {
        error: "Ip Address Invalid",
        formValues,
      };

    const checkPin = await verifyPin(pin, hash);

    if (!checkPin)
      return {
        error: "Invalid pin",
        formValues,
      };

    const checkAttendance: any = await getRecentClock(Number(userid));

    if (checkAttendance && checkAttendance.length > 0) {
      if (checkAttendance[0].clock_out_utc === null) {
        const test = new Date();
        const luxonTest = DateTime.fromJSDate(test, {
          zone: checkAttendance.local_device_timezone,
        });
        console.log(luxonTest.day);
      }
    }
    revalidatePath("/");

    return {
      error: "No error",
      emptyField,
    };
  } catch (error) {
    return {
      error: "Internal Server Error",
      formValues,
    };
  }
}
