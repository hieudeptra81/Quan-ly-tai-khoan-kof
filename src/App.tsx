import { Loader2 } from 'lucide-react';
import AuthScreen from '@/components/AuthScreen';
import VaultDashboard from '@/components/VaultDashboard';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function AppContent() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    );
  }

  return session ? <VaultDashboard /> : <AuthScreen />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
