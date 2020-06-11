import React, { useState, useEffect, useRef } from 'react';
import { Table, Form, Container, Col, Row } from 'react-bootstrap';
import { StickyTable } from 'react-sticky-table';
import LicenseNavbar from './LicenseNavbar';
import ToastViewer from './ToastViewer';
import ConfirmModal from './ConfirmModal';
import UploadModal from './UploadModal';
import ContentEditable from 'react-contenteditable';
import Loading from './Loading/Loading.js';
import DropZone from './DropZone';
import LoginPage from './LoginPage';

const SheetView = (props) => {
  const [fields, setFields] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [sheet, setSheet] = useState('Loading');
  const [sheets, setSheets] = useState([]);
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [deleteRows, setDeleteRows] = useState([]);
  const [pendingRow, setPendingRow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [upload, setUpload] = useState(false);
  const [done, setDone] = useState(true);
  const [update, setUpdate] = useState(false);
  const [auth, setAuth] = useState(false);
  const [login, setLogin] = useState(false);
  const contentEditable = useRef();
  useEffect(() => {
    setDeleteRows(deleteRows);
    if (!editing) {
      var url = '';
      if (!sheets.length) {
        getSheets();
      }

      if (!(sheet === 'Loading')) {
        setLoading(true);
        setDone(false);
        url = '/server/sheet/fields?name=' + sheet;

        fetch(url, { method: 'get' })
          .then((res) => res.json())
          .then((result) => {
            url = '/server/sheet/data?name=' + sheet;

            fetch(url, { method: 'get' })
              .then((res2) => res2.json())
              .then((result2) => {
                console.log('pulled data');
                setFields(result.sheetFields);
                setData(result2.sheetData);
                setLoading(false);
                setTimeout(() => {
                  setDone(true);
                }, 1500);
              });
          });
      }
    }
  }, [sheet, sheets, editing, update, deleteRows]);

  const getSheets = () => {
    var url = '/server/sheet/sheets';

    fetch(url, { method: 'get' })
      .then((res) => res.json())
      .then((result) => {
        setSheets(result);
        setSheet(result[0].sheetName);
      });
  };

  const updateCurrentSheet = (sheetName) => {
    setSheet(sheetName);
  };

  const handleEdit = (index, id, event) => {
    var tempData = data;
    tempData[index][id].field = event.currentTarget.textContent;
    setData(tempData);
  };

  const updateData = (e, confirmed = false) => {
    if (deleteRows.length > 0 && !confirmed) {
      setConfirm(true);
    } else {
      setLoading(true);
      setDone(false);
      setConfirm(false);
      handleDelete().then((newData) => {
        postData(newData).then((success) => {
          console.log(success);
          if (success) {
            console.log('It worked!');
            setEditing(false);
            setSuccess(true);
            setDeleteRows([]);
            setLoading(false);
            setTimeout(() => {
              setDone(true);
            }, 1500);
            setPendingRow(false);
          } else {
            setLoading(false);
            setDone(true);
            setError(true);
          }
        });
      });
    }
  };

  const postData = async (newData = data) => {
    var url = '/server/sheet/update';
    var postBody = {
      name: sheet,
      data: newData,
    };
    console.log('In post: ' + data.length);
    return fetch(url, {
      method: 'post',
      body: JSON.stringify(postBody),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (!(result.sheetName == undefined)) {
          setData(result.sheetData);
          return true;
        } else {
          return false;
        }
      });
  };

  const addDelete = (key) => {
    console.log(key);
    var temp = deleteRows;
    deleteRows.includes(key)
      ? temp.splice(temp.indexOf(key))
      : (temp = [...deleteRows, key]);

    setDeleteRows(temp);
    console.log(deleteRows.length);
  };

  const handleDelete = async () => {
    console.log('Before: ' + data.length);
    var temp = data.filter((item) => {
      return !deleteRows.includes(item[0]._id);
    });

    return temp;
  };

  const addRow = () => {
    if (pendingRow) {
      postData().then((success) => {
        setEditing(true);
        const row = [];
        fields.map((field) => {
          row.push({ field: '' });
        });
        setData((prev) => [row, ...prev]);
      });
      setPendingRow(true);
    } else {
      setPendingRow(true);
      setEditing(true);
      const row = [];
      fields.map((field) => {
        row.push({ field: '' });
      });
      setData((prev) => [row, ...prev]);
    }
  };

  const sendFile = (newData, name) => {
    var url = '/server/sheet/updatefile';
    console.log('Current Sheet: ' + name);
    var postBody = {
      name: name,
      data: newData,
    };
    return fetch(url, {
      method: 'post',
      body: JSON.stringify(postBody),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((result) => {
        if (!(result.sheetName == undefined)) {
          getSheets();
          postData(result.sheetData);
          setUpload(false);
        } else {
          setError(true);
          setUpload(false);
        }
      });
  };

  return (
    <Col>
      {confirm && (
        <ConfirmModal
          title="Confirm Data Delete"
          body={
            'Do you want to delete the ' +
            deleteRows.length +
            ' rows selected?'
          }
          firstButton={(e) => updateData(e, true)}
          firstText="Delete"
          secondButton={() => setConfirm(false)}
          secondText="Cancel"
          mode="error"
        />
      )}
      {upload && (
        <UploadModal
          sendFile={sendFile}
          sheet={sheet}
          setUpload={setUpload}
          mode="confirm"
        />
      )}
      <LicenseNavbar
        updateSheet={updateCurrentSheet}
        save={updateData}
        toggleEditing={setEditing}
        newRow={addRow}
        editing={editing}
        currentSheet={sheet}
        sheets={sheets}
        search={searchTerm}
        setSearch={setSearchTerm}
        setUpload={setUpload}
        auth={auth}
        login={login}
        setLogin={setLogin}
      />
      {login ? (
        <LoginPage setAuth={setAuth} setLogin={setLogin} />
      ) : !done ? (
        <Loading loading={loading} />
      ) : (
        <div className="content">
          <ToastViewer
            header="Data Saved"
            body={sheet + ' was successfully saved.'}
            show={success}
            setShow={() => setSuccess(false)}
            mode="success"
          />
          <ToastViewer
            header="Error Saving Data"
            body={sheet + ' could not be saved.'}
            show={error}
            setShow={() => setError(false)}
            mode="error"
          />

          <Table striped bordered hover variant="dark" size="sm">
            <thead className="sticky-nav">
              <tr key="sheet-fields">
                {auth && editing ? (
                  <th
                    className="bg-danger text-light first-col"
                    onClick={updateData}
                  >
                    {'Delete ' + deleteRows.length}
                  </th>
                ) : (
                  <th className="first-col text-light">No.</th>
                )}
                {fields.map((field, index) => (
                  <th
                    key={field.field + index}
                    className="nowrap d-none d-lg-table-cell"
                  >
                    {field.field}
                  </th>
                ))}
                {fields.slice(0, 2).map((field, index) => (
                  <th
                    key={field.field + index}
                    className="nowrap d-lg-none d-md-table-cell"
                  >
                    {field.field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data
                .filter((item) =>
                  JSON.stringify(item)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((fieldData, index) => (
                  <tr key={index}>
                    <td className="first-col">
                      {auth && editing ? (
                        <Form.Check
                          className="text-center"
                          onChange={() => addDelete(fieldData[0]._id)}
                        />
                      ) : (
                        index + 1
                      )}
                    </td>
                    {fieldData.map((cell, index2) => (
                      <td
                        key={
                          index +
                          index2 +
                          (cell._id == undefined ? cell.field : cell._id)
                        }
                        id={
                          index +
                          index2 +
                          (cell._id == undefined ? cell.field : cell._id)
                        }
                        onClick={() =>
                          auth ? setEditing(true) : setEditing(false)
                        }
                        className="d-none d-lg-table-cell"
                      >
                        <ContentEditable
                          innerRef={contentEditable}
                          html={cell.field}
                          disabled={!editing}
                          onKeyUp={(e) => handleEdit(index, index2, e)}
                        />
                      </td>
                    ))}
                    {fieldData.slice(0, 2).map((cell, index2) => (
                      <td
                        key={
                          index +
                          index2 +
                          (cell._id == undefined ? cell.field : cell._id)
                        }
                        id={
                          index +
                          index2 +
                          (cell._id == undefined ? cell.field : cell._id)
                        }
                        onClick={() =>
                          auth ? setEditing(true) : setEditing(false)
                        }
                        className="d-lg-none d-md-table-cell"
                      >
                        <ContentEditable
                          innerRef={contentEditable}
                          html={cell.field}
                          disabled={!editing}
                          onKeyUp={(e) => handleEdit(index, index2, e)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      )}
    </Col>
  );
};

export default SheetView;
