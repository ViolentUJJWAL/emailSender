import React, { useState } from "react";
import ManualSend from "./ManualSend";
import JsonSend from "./JsonSend";
import Excelsend from "./ExcelSend";

function EmailSender({ selectedTab }) {

  return (
    <div>
      {selectedTab === "manual" && (
        <ManualSend/>
      )}

      {selectedTab === "json" && (
        <JsonSend/>
      )}

      {selectedTab === "excel" && (
        <Excelsend/>
      )}
    </div>
  );
}

export default EmailSender;
