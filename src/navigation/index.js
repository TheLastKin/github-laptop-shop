import React from 'react';
import { AuthProvider } from './AuthProvider';
import Route from './Route';

const Provider = () => {
    return(
        <AuthProvider>
            <Route/>
        </AuthProvider>
    );
};

export default Provider;