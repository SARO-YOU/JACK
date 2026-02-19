// This file replaces the old debug /working page that exposed admin credentials.
// It now safely redirects all visitors to the proper /login page.

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Working() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login', { replace: true });
  }, [navigate]);

  return null;
}