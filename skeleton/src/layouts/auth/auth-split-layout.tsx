import { type PropsWithChildren } from 'react';
import Link from "next/link";
import {usePathname} from "next/navigation";
import AppLogoIcon from "@/components/icons/logo-icon";

interface QuoteProps {
    message: string;
    author: string;
}

const quotes = [
    {"message":"Life isn’t about getting and having, it’s about giving and being.","author":"Kevin Kruse"},
    {"message":"Whatever the mind of man can conceive and believe, it can achieve.","author":"Napoleon Hill"},
    {"message":"Strive not to be a success, but rather to be of value.","author":"Albert Einstein"},
    {"message":"Two roads diverged in a wood, and I—I took the one less traveled by, And that has made all the difference.","author":"Robert Frost"},
    {"message":"I attribute my success to this: I never gave or took any excuse.","author":"Florence Nightingale"},
    {"message":"Your time is limited, so don’t waste it living someone else’s life.","author":"Steve Jobs"},
    {"message":"Winning isn’t everything, but wanting to win is.","author":"Vince Lombardi"},
    {"message":"I am not a product of my circumstances. I am a product of my decisions.","author":"Stephen Covey"},
    {"message":"Every child is an artist.  The problem is how to remain an artist once he grows up.","author":"Pablo Picasso"},
    {"message":"You can never cross the ocean until you have the courage to lose sight of the shore.","author":"Christopher Columbus"},
];

export default function AuthSplitLayout({ children }: PropsWithChildren) {
    const pathname = usePathname();
    const today = new Date().getDate().toString();
    const quote: QuoteProps = quotes[parseInt(today.charAt(today.length - 1)) - 1];

    const title = pathname.includes('login') ? 'Log in to your account' : 'Create an account';
    const description = pathname.includes('login')
        ? 'Enter your email and password below to log in'
        : 'Enter your details below to create your account'

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <Link href={'/'} className="relative z-20 flex items-center text-3xl font-medium">
                    <AppLogoIcon className="mr-2 size-10" />
                    STORYROW
                </Link>
                {quote && (
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">&ldquo;{quote.message}&rdquo;</p>
                            <footer className="text-sm text-neutral-300">{quote.author}</footer>
                        </blockquote>
                    </div>
                )}
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={'/'} className="relative z-20 flex items-center justify-center lg:hidden">
                        <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
