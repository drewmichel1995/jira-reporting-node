import React, { useState, useEffect, useRef } from 'react';
import LicenseNavbar from './LicenseNavbar';
import SelectModal from './SelectModal';
import TableView from './TableView';
import  FadeIn from 'react-fade-in';
import { Col, Alert } from 'react-bootstrap';

const SheetView = (props) => {
  const [showBP, setShowBP] = useState(false);
  const [showDirect, setShowDirect] = useState(false);
  const [status, setStatus] = useState("To Do");
  const [fields, setFields] = useState([]);
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  useEffect(() => {
    
  });

  const getReport = (type) => {
    var url = '/server/jira/' + type + '/' + status;
    console.log(status);
    fetch(url, {
      method: 'get',
    })
      .then((res) => res.json())
      .then((result) => {
        {
          console.log(result);
          setFields(result.message.fields);
          setData(result.message.issues);
          setTitle(result.message.title);
          setShowDirect(false);
          setShowBP(false);
          setStatus("To Do");
          url = '/server' + result.message.url;
          const link = document.createElement('a');
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
  };

  const getCapacityReport = () => {
    var url = '/server/jira/DEDELCapacity';
    console.log(status);
    fetch(url, {
      method: 'get',
    })
      .then((res) => res.json())
      .then((result) => {
        {
          console.log(result);
          setFields(result.message.fields);
          setData(result.message.issues);
          setTitle(result.message.title);
          setShowDirect(false);
          setShowBP(false);
          setStatus("To Do");
          url = '/server' + result.message.url;
          const link = document.createElement('a');
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
  };

  const setCancel = () => {
    setShowBP(false);
    setShowDirect(false);
    setStatus("To Do");
  }

  return (
    <div>
      <LicenseNavbar showBP={setShowBP} BP={showBP} showDirect={setShowDirect} Direct={showDirect} getCapacityReport={getCapacityReport}></LicenseNavbar>
        <FadeIn><SelectModal show={showBP} title={`Pre-B&P/B&P Report`} body="Select status for report." mode="confirm" firstText="Get Report" firstButton={() => getReport("DEDELBP")} secondText="Cancel" secondButton={setCancel} setStatus={(value) => setStatus(value)}></SelectModal></FadeIn>
      
        <FadeIn><SelectModal show={showDirect} title={`Direct Report`} body="Select status for report." mode="confirm" firstText="Get Report" firstButton={() => getReport("DEDELDirect")} secondText="Cancel" secondButton={setCancel} setStatus={(value) => setStatus(value)}></SelectModal></FadeIn>
      <Col>
        
        <TableView data={data} fields={fields} title={title}></TableView>
      </Col>
    </div>
  );
};

export default SheetView;
