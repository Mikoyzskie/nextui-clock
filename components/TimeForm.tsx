/* eslint-disable prettier/prettier */
'use client'

import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { Input } from "@nextui-org/input";
import { CircleCheck, CircleX, Eye, EyeOff } from "lucide-react";
import { Image } from "@nextui-org/image";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, useCallback } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { DateTime } from "luxon";

import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";
import { IEmployees, IInitial } from "@/app/types"
import { Attendance } from "@/app/actions";
import clsx from "clsx";

const Time = dynamic(() => import('../components/time'), {
    ssr: false,
})

const initialState: IInitial = {
    fieldValues: {
        username: "",
        pin: "",
        ipaddress: "",
        localTime: "",
        timezoneClient: "",
        timezoneOffset: ""
    },
    error: "",
    reset: false,
};

function SubmitButton({ status }: { status: boolean | undefined }) {
    const { pending } = useFormStatus();

    return (
        <Button
            className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
                size: "md",
                fullWidth: true,
            })}
            href={siteConfig.links.docs}
            isDisabled={pending}
            type="submit"
        >
            {pending ? "Submiting..." : (status === undefined ? "Time In / Time Out" : (status ? "Timeout" : "Timein"))}
        </Button>
    );
}

export default function TimeForm({ data }: { data: IEmployees[] }) {
    const [state, formAction] = useFormState(Attendance, initialState)
    const [message, setMessage] = useState("")
    const [isAvailable, setIsAvailable] = useState(false);
    const [isLogged, setIsLogged] = useState<boolean | undefined>();
    const [isVisible, setIsVisible] = useState(false);
    const [ipAddress, setIpAddress] = useState('');
    const formRef = useRef<HTMLFormElement>(null)

    const dateTime = new Date()
    const luxonDateTime = DateTime.now()

    useEffect(() => {
        setMessage(state.error)
    }, [state.error])


    // Fetch IP address once when component mounts
    useEffect(() => {
        const fetchIpAddress = async () => {
            try {
                const response = await fetch('https://api.ipify.org/?format=json');

                if (response.ok) {
                    const data = await response.json();

                    setIpAddress(data.ip);
                } else {
                    throw new Error('Failed to fetch IP address');
                }
            } catch (error) {
                console.error(`Error fetching IP address: ${error}`);
            }
        };

        fetchIpAddress();
    }, []);

    // Reset form state if needed
    useEffect(() => {
        if (state.reset) {
            formRef.current?.reset();
            // state.error = "";
            setIsAvailable(false);
            setIsLogged(false);
        }
    }, [state.reset]);

    const toggleVisibility = useCallback(() => setIsVisible(prev => !prev), []);

    const handleUsernameChange = useCallback((event: any) => {
        const userInput = event.target.value;
        const userAvailable = data.find((x) => x.Employee_Username === userInput);

        setIsLogged(userInput === '' ? undefined : userAvailable?.Clock_Status);
        setIsAvailable(!!userAvailable);
    }, [data]);

    const timezoneOffset = dateTime.toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'short' }).substring(4);

    const errors = ["User not found", "Already Logged", "Invalid pin", "Ip Address Invalid", "Internal Server Error"]

    return (
        <Card className="flex flex-col items-center justify-center gap-4 p-10">
            <CardHeader className="flex flex-col gap-3 w-full max-w-sm text-center items-center justify-center p-0 relative">
                <Image
                    alt="Zanda Logo"
                    className="p-0"
                    src="/logo-dark.png"
                    width={150}
                />
                <div className="absolute top-0 right-0">
                    <ThemeSwitch />
                </div>
                <Time time={dateTime.getTime()} />
            </CardHeader>
            <p className={clsx("text-xs font-bold",
                errors.find(x => x === message) ? "text-red-500" : "text-green-500"
            )}>{message}</p>
            <form
                ref={formRef} action={formAction}
                className="flex flex-col items-center justify-center gap-3"
            >
                <CardBody className="max-w-sm flex flex-col items-center justify-center gap-4 p-0">
                    <Input
                        isRequired
                        aria-label="Username Input"
                        autoComplete="off"
                        classNames={{
                            inputWrapper: "bg-default-100",
                            input: "text-sm",
                        }}
                        endContent={
                            isAvailable ? (isLogged ? <CircleCheck className="text-base text-default-400 pointer-events-none flex-shrink-0" /> : <CircleX className="text-base text-default-400 pointer-events-none flex-shrink-0" />) : ""
                        }
                        id="username"
                        label="Username"
                        name="username"
                        size="sm"
                        type="text"
                        onChange={handleUsernameChange}
                    />
                    <Input
                        isRequired
                        aria-label="Password Input"
                        classNames={{
                            inputWrapper: "bg-default-100",
                            input: "text-sm",
                        }}
                        endContent={
                            <button type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <EyeOff className="text-default-400 pointer-events-none" />
                                ) : (
                                    <Eye className="text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        id="pin"
                        label="Password"
                        name="pin"
                        size="sm"
                        type={isVisible ? "text" : "password"}
                    />
                    <input defaultValue={ipAddress} id="ipaddress" name="ipaddress" type="hidden" />
                    <input defaultValue={dateTime.toISOString()} id="localTime" name="localTime" type="hidden" />
                    <input defaultValue={timezoneOffset} id="timezoneOffset" name="timezoneOffset" type="hidden" />
                    <input defaultValue={luxonDateTime.zoneName} id="timezoneClient" name="timezoneClient" type="hidden" />

                    <div className="w-full flex justify-around">
                        <Link className="text-xs" color="primary" href="/">
                            Reset Password
                        </Link>
                        <button className="text-xs" type="button" onClick={() => { formRef.current?.reset(); }}>
                            Reset Form
                        </button>
                    </div>
                </CardBody>
                <SubmitButton status={isLogged} />
            </form>
        </Card>
    );
}
