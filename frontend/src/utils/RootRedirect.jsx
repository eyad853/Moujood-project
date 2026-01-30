import { Navigate } from 'react-router-dom';
import Loadiing from '../components/Loadiing/Loadiing'
import { useUser } from '../context/userContext';

const RootRedirect = () => {
  const { user, loading } = useUser();

  if (loading) return (
    <div className="fixed inset-0">
      <Loadiing />
    </div>
  );

  // ❌ Not logged in → signup choice page
  if (!user) {
    return <Navigate to="/signup_as" replace />;
  }

  // ✅ Logged in → redirect by account type
  if (user.accountType === 'user') {
    return <Navigate to="/client/feed" replace />;
  }

  if (user.accountType === 'business') {
    return <Navigate to="/business/dashboard" replace />;
  }

  if (user.accountType === 'super_admin') {
    return <Navigate to="/super_admin/dashboard" replace />;
  }

  // fallback
  return <Navigate to="/signup_as" replace />;
};

export default RootRedirect;
