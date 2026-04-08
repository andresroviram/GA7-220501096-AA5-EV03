import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import RolesDesktop from './desktop/RolesDesktop';
import RolesMobile from './mobile/RolesMobile';

function Roles() {
  const isMobile = useIsMobile();
  return isMobile ? <RolesMobile /> : <RolesDesktop />;
}

export default Roles;
