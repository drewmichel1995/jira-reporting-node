import React from 'react';
import { Table, Alert } from 'react-bootstrap';

const TableView = (props) => {

    const generateKey = (pre) => {
      return `${ pre }_${ new Date().getTime() }`;
    }

    return (
      <div className="data-table"> 
        {(props.fields.length > 0) && <Alert variant="dark">{props.title}</Alert>}
        <Table striped bordered hover variant="dark" size="sm">
        <thead>
          <tr>
            {props.fields.map((field,index) => (
              <th key={generateKey(index)}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.data.map((d,index2) => (
            <tr key={generateKey(index2)}>
              {props.fields.map((field,index3) => (
                <td key={generateKey(index3)}>{d[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    )
}

export default TableView;