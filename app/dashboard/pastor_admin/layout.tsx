import type { Metadata } from 'next';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
export const metadata: Metadata = { title: 'Espace pastoral | CLG Connect', description: 'Tableau de bord de gestion de chapelle CLG' };
export default function PastorAdminLayout({children}:{children:React.ReactNode}) { return <div className="min-h-screen bg-[#f7f9fc] text-slate-900"><Sidebar/><div className="min-h-screen lg:pl-[270px]"><Topbar/><main className="mx-auto w-full max-w-[1600px] p-5 pt-7 sm:p-8 lg:p-9">{children}</main></div></div> }
