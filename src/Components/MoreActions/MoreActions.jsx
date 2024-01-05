import React from "react";
//import './MoreActions.css'
import { Dropdown } from "react-bootstrap";

function MoreActions() {
  
    function handleSelect(eventKey) {
      alert(`selected ${eventKey}`);
    }

  return (
    <Dropdown onSelect={handleSelect}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Select Action
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey="1">Report user</Dropdown.Item>
        <Dropdown.Item eventKey="2">Follow user</Dropdown.Item>
        <Dropdown.Item eventKey="3">Bookmark</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default MoreActions;
