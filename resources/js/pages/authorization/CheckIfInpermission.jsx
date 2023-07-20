import { useSelector } from 'react-redux';
import { getAuth } from '../../store/authSlice';

export default function CheckIfInPermission(abilities) {
  const auth = useSelector(getAuth);

  let status = false;

  if (abilities?.length === 0) {
    status = true;
  }

  if (auth.loadingState === 'success' && auth?.auth) {
    const { permissions, roles } = auth?.auth;

    if (roles.includes('Super Admin')) {
      status = true;
    }

    if (!roles.includes('Super Admin')) {
      for (const ability of abilities) {
        if (permissions.some((c_permission, i) => c_permission === ability)) {
          status = true;
        }
      }
    }
  }

  return status;
}

