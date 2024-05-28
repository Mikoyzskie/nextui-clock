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
import { useState, useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { siteConfig } from "@/config/site";
import { IEmployees, IInitial } from "@/app/types"
import { Attendance } from "@/app/actions";

const Time = dynamic(() => import('../components/time'), {
    ssr: false,
})

const initialState: IInitial = {
    fieldValues: {
        userid: "",
        username: "",
        pin: "",
        hash: "",
        ipaddress: "",
        localTime: ""
    },
    error: "",
};

function SubmitButton({ status }: { status: string }) {
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
            {pending ? "Submiting..." : status}
        </Button>
    );
}



export default function TimeForm({ data }: { data: IEmployees[] }) {
    const [isAvailable, setIsAvailable] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [timeIn, setTimeIn] = useState("Time in / Time out");
    const [isVisible, setIsVisible] = useState(false);

    const [state, formAction] = useFormState(Attendance, initialState)
    const [ipAddress, setIpAddress] = useState('');
    const [hash, setHash] = useState('');
    const [userid, setUserid] = useState(0);
    const formRef = useRef<HTMLFormElement>(null)


    // console.log(data);
    console.log(state?.error);


    //Password visibility
    const toggleVisibility = () => setIsVisible(!isVisible);

    //Check if user exists
    function handleUsernameChange(event: any) {
        const userInput = event.target
        const userAvailable = data.find((x) => x.Employee_Username === userInput.value)

        if (userAvailable) {
            setIsAvailable(true)
            setIsLogged(userAvailable.Clock_Status)
            setHash(userAvailable.employee_pin)
            setUserid(userAvailable.id)
            if (userAvailable.Clock_Status) {
                setTimeIn("Time out")
            } else {
                setTimeIn("Time in")
            }

        } else {
            setIsAvailable(false)
        }
    }

    //Get user ip address
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
                throw new Error(`Error fetching IP address: ${error}`)
            }
        };

        fetchIpAddress();
    }, []);

    //Get local time to convert
    const now = new Date();

    console.log(now.toISOString());


    return (
        <Card className="flex flex-col items-center justify-center gap-4 p-10">
            <CardHeader className="flex flex-col gap-3 w-full max-w-sm text-center items-center justify-center p-0">
                <Image
                    alt="Zanda Logo"
                    className="p-0"
                    src="/logo-dark.png"
                    width={150}
                />
                <Time time={now.getTime()} />
            </CardHeader>
            <form
                ref={formRef} action={formAction}
                className="flex flex-col items-center justify-center gap-3"
            >
                <CardBody className="max-w-sm flex flex-col items-center justify-center gap-4 p-0">
                    <Input
                        isRequired
                        aria-label="Username Input"
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
                    <input defaultValue={hash} id="hash" name="hash" type="hidden" />
                    <input defaultValue={userid} id="userid" name="userid" type="hidden" />
                    <input defaultValue={now.toISOString()} id="localTime" name="localTime" type="hidden" />
                    <Link className="text-xs" color="primary" href="/">
                        Reset Password
                    </Link>
                    {/* <Divider className="w-1/2" /> */}
                </CardBody>
                <SubmitButton status={timeIn} />
            </form>
        </Card>
    );
}
