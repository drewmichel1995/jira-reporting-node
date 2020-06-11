import React from 'react';
import { Form } from 'react-bootstrap';

const SearchContainer = props => {
  return (
    <Form inline className="mr-sm-2">
      <Form.Control
        type="text"
        onChange={event => props.setSearch(event.target.value)}
        placeholder="Search"
      />
    </Form>
  );
};

export default SearchContainer;
