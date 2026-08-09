import AppRoutes from "@/app/routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import SessionTimeout from "@/features/auth/components/SessionTimeout/SessionTimeout";

function App() {
  return (
    <>
      <AppRoutes />
      <SessionTimeout />

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 3000,

          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#30374F",
            fontSize: "16px",
            padding: "18px 22px",
            width: "min(380px, calc(100vw - 32px))",
            maxWidth: "calc(100vw - 32px)",
            fontWeight: 500,
          },

          success: {
            iconTheme: {
              primary: "#22C55E",
              secondary: "#fff",
            },
          },

          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}

export default App;
