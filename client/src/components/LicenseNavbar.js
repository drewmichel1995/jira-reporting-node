import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

const LicenseNavbar = (props) => {

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand className="brand">Jira Report Tool</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          
            <Nav.Link onClick={() => {props.showDirect(!props.Direct); props.showBP(false)}}>
              Direct Report
            </Nav.Link>
            <Nav.Link onClick={() => { props.showBP(!props.BP); props.showDirect(false)}}>
              {`Pre-B&P and B&P Report`}
            </Nav.Link>
            <Nav.Link onClick={() => { props.getCapacityReport() }}>
              {`Capacity Allocation Report`}
            </Nav.Link>
            <Nav.Link onClick={() => { props.getWeeklyReport() }}>
              {`Weekly Report`}
            </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default LicenseNavbar;
