import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { Header } from "../../components/layout/Header";

export default function Profile() {
  return (
    <ProtectedRoute>
      <>
        <Header />

        <main>
          <h1>Mon profil</h1>
        </main>
      </>
    </ProtectedRoute>
  );
}