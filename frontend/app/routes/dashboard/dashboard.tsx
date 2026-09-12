import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { Header } from "../../components/layout/Header";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <>
        <Header />

        <main>
          <h1>Dashboard</h1>
        </main>
      </>
    </ProtectedRoute>
  );
}