'use client'

import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import Image from "next/image";
import {formatCurrencyNumber} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";

export default function AccountSection(props: {accounts: object[]; loadingAccounts: boolean}) {
    const { accounts, loadingAccounts } = props;

    return (
        <section className="w-[80%] mx-auto">
            {loadingAccounts ? (
                <Skeleton className="w-full h-26 rounded-xl bg-gray-200"/>
            ) : (
                <>
                    <Carousel>
                        <CarouselContent>
                            {accounts?.map((e: any, i: number) => (
                                <CarouselItem key={i}>
                                    <div className="relative h-52">
                                        <div className="absolute w-full -z-[1]">
                                            <div className="relative w-full h-52">
                                                <Image src="/images/backgrounds/card-1.svg" alt="card-1" fill className="object-cover rounded-xl"/>
                                            </div>
                                        </div>
                                        <div className="h-full p-6 flex flex-col justify-between z-10">
                                            <div>
                                                <h1 className="text-3xl text-white font-bold">{e.name}</h1>
                                                <p className="text-gray-300 font-medium">{e.type}</p>
                                            </div>
                                            <div className="w-full flex flex-col items-end">
                                                <p className="text-gray-100 font-medium">Balance</p>
                                                <h1 className="text-3xl text-white font-bold">
                                                    Rp {formatCurrencyNumber((e.balance ?? 0).toString())}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                    <div className="mt-4 flex justify-center">
                        <Button variant="outline">
                            <Plus/>
                            Add New Account
                        </Button>
                    </div>
                </>
            )}
        </section>
    )
}
