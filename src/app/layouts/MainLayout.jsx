import { Outlet, useLocation } from "react-router-dom";

import Header from "@/shared/components/layout/Header/Header";
import Footer from "@/shared/components/layout/Footer/Footer";

export default function MainLayout() {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <>
            <Header />

            <main>
                <Outlet />
            </main>

            {!isHome && <Footer />}
        </>
    );
}
