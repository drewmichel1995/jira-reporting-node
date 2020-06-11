import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';

export default function LoginPage(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [failed, setFailed] = useState(false);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    var users = ["michell", "fischerand", "orellanadw"];

    if(users.includes(email) && users.includes(password)){
      props.setAuth(true);
      props.setLogin(false);
      setFailed(false);
    }else{
      props.setAuth(false);
      setFailed(true);
    }
    
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <Form.Group controlId="email" bsSize="large">
          <Form.Label className="text-light">Email</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password" bsSize="large">
          <Form.Label className="text-light">Password</Form.Label>
          <Form.Control
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </Form.Group>
        {failed && (
          <Alert variant="danger">
          Invalid Login Credentials!
        </Alert>
        )}
        <Button block bsSize="large" disabled={!validateForm()} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}
