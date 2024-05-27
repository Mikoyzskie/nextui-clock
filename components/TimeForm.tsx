/* eslint-disable prettier/prettier */
'use client'

import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { Input } from "@nextui-org/input";
import { CircleUser, Lock, CircleCheck, CircleX } from "lucide-react";
import { Image } from "@nextui-org/image";
// import { Divider } from "@nextui-org/divider";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import dynamic from 'next/dynamic';
const Time = dynamic(() => import('../components/time'), {
    ssr: false,
})
import { siteConfig } from "@/config/site";

import { IEmployees } from "@/app/types"
import { useState } from "react";


export default function TimeForm({ data }: { data: IEmployees[] }) {
    const [isAvailable, setIsAvailable] = useState(false)
    const [isLogged, setIsLogged] = useState(false)

    // console.log(data);

    const now = new Date();

    function handleUsernameChange(event: any) {
        const userInput = event.target
        const userAvailable = data.find((x) => x.Employee_Username === userInput.value)

        if (userAvailable) {
            setIsAvailable(true)
            setIsLogged(userAvailable.Clock_Status)
        } else {
            setIsAvailable(false)
        }

    }

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
                action=""
                className="flex flex-col items-center justify-center gap-3"
            >
                <CardBody className="max-w-sm flex flex-col items-center justify-center gap-4 p-0">
                    <Input
                        aria-label="Username Input"
                        classNames={{
                            inputWrapper: "bg-default-100",
                            input: "text-sm",
                        }}
                        labelPlacement="outside"
                        placeholder="Username"
                        startContent={
                            <CircleUser className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        type="text"
                        endContent={
                            isAvailable ? (isLogged ? <CircleCheck className="text-base text-default-400 pointer-events-none flex-shrink-0" /> : <CircleX className="text-base text-default-400 pointer-events-none flex-shrink-0" />) : ""
                        }
                        onChange={handleUsernameChange}
                    />
                    <Input
                        aria-label="Password Input"
                        classNames={{
                            inputWrapper: "bg-default-100",
                            input: "text-sm",
                        }}
                        labelPlacement="outside"
                        placeholder="Password"
                        startContent={
                            <Lock className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        type="password"

                    />
                    <Link className="text-xs" color="primary" href="/">
                        Reset Password
                    </Link>
                    {/* <Divider className="w-1/2" /> */}
                </CardBody>
                <Button
                    className={buttonStyles({
                        color: "primary",
                        radius: "full",
                        variant: "shadow",
                        size: "md",
                        fullWidth: true,
                    })}
                    href={siteConfig.links.docs}
                >
                    Time In
                </Button>
            </form>
        </Card>
    );
}
