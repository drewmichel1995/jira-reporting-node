import React, { useState, useEffect, useRef } from 'react';
import { Table, Alert } from 'react-bootstrap';

const TableView = (props) => {


    return (
      <div className="data-table"> 
        {(props.fields.length > 0) && <Alert variant="dark">{props.title}</Alert>}
        <Table striped bordered hover variant="dark" size="sm">
        <thead>
          <tr>
            {props.fields.map(field => (
              <th>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.data.map(d => (
            <tr>
              {props.fields.map(field => (
                <td>{d[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    )
}

export default TableView;