import { useContext } from 'react';
import { AuthContext } from './AuthContextType';

export const useAuth = () => useContext(AuthContext);