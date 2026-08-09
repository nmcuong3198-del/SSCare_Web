import { Outlet } from "react-router-dom";

import Header from "@/shared/components/layout/Header/Header";
import Footer from "@/shared/components/layout/Footer/Footer";

export default function MainLayout() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}