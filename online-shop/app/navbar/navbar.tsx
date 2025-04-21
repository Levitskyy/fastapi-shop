import Link from 'next/link';
import Image from 'next/image';
import AuthButtons from './authButtons';
import Notifications from './notifications';
import { getCurrentUser } from "@/context/tokenUtils";
import { cookies } from "next/headers";

export default async function Navbar() {
    const cookieStore = await cookies();
    const user = getCurrentUser(cookieStore.get('refresh_token')?.value);
    const userName = user?.userName;
    const role = user?.role;

    return (
        <nav className="bg-neutral-800 shadow-md">
            <div className="mx-auto flex justify-between px-4 py-2 items-center">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-white text-2xl font-bold md:block">ONLINE SHOP</Link>
                </div>
                <div className="flex space-x-6 items-center">
                    <Link href="/animes">Список товаров</Link>
                    <Link href="/room">Создать комнату</Link>
                </div>
                <div className='flex'>
                    <AuthButtons/>
                </div>
            </div>
            { role === "manager" && <Notifications /> }
        </nav>
    );
};