import React from 'react';
import { Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import ImageHelper from './ImageHelper';
import SearchContainer from './SearchContainer';

const LicenseNavbar = (props) => {
  const getfile = () => {
    var url = '/server/sheet/getfile?name=' + props.currentSheet;
    fetch(url, {
      method: 'get',
    })
      .then((res) => res.json())
      .then((result) => {
        {
          console.log(result);
          url = '/server' + result;
          const link = document.createElement('a');
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand className="brand">{props.currentSheet}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {props.auth && (
            <Nav.Link onClick={() => props.newRow()}>
              <ImageHelper mode="add" />
            </Nav.Link>
          )}

          {props.auth && !props.editing && (
            <>
              <Nav.Link onClick={() => props.toggleEditing(!props.editing)}>
                <ImageHelper mode="edit" />
              </Nav.Link>
              <Nav.Link onClick={getfile}>
                <ImageHelper mode="download" />
              </Nav.Link>
              <Nav.Link onClick={() => props.setUpload(true)}>
                <ImageHelper mode="upload" />
              </Nav.Link>
            </>
          )}
          {props.auth && props.editing && (
            <>
              <Nav.Link onClick={props.save}>
                <ImageHelper mode="save" />
              </Nav.Link>
              <Nav.Link onClick={() => props.toggleEditing(!props.editing)}>
                <ImageHelper mode="delete" />
              </Nav.Link>
            </>
          )}
        </Nav>

        <SearchContainer setSearch={props.setSearch} search={props.search} />
        {!props.login && !props.auth && (
          <Button onClick={() => props.setLogin(true)} variant="link">
            Login
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default LicenseNavbar;
