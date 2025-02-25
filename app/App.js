import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './HomePage';
import LoginForm from './login/LoginForm';
import Layout from './components/Layout/layout';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = ({ email, password }) => {
        // Implement your authentication logic here
        if (email === 'user@example.com' && password === 'password') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <Router>
            <Layout>
                <Switch>
                    <Route path="/login">
                        {isAuthenticated ? <Redirect to="/" /> : <LoginForm onLogin={handleLogin} />}
                    </Route>
                    <Route path="/">
                        {isAuthenticated ? <HomePage /> : <Redirect to="/login" />}
                    </Route>
                </Switch>
            </Layout>
        </Router>
    );
};

export default App;