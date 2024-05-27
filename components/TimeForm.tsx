/* eslint-disable prettier/prettier */
'use client'

import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { Input } from "@nextui-org/input";
import { CircleUser, Lock } from "lucide-react";
import { Image } from "@nextui-org/image";
// import { Divider } from "@nextui-org/divider";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

import { siteConfig } from "@/config/site";
import Time from "@/components/time";
import { IEmployees } from "@/app/types"


export default function TimeForm({ data }: { data: IEmployees[] }) {

    console.log(data);


    const usernameInput = (
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
        />
    );
    const passwordInput = (
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
    );

    const now = new Date();



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
                    {usernameInput}
                    {passwordInput}
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
