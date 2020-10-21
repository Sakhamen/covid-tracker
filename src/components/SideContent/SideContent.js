import React from 'react';
import './SideContent.css';
import { Card, CardContent } from "@material-ui/core";

import Table from '../Table/Table';
import LineGraph from '../LineGraph/LineGraph';

function SideContent({ type, data }) {
  return (
    <Card className="sideContent">
      <CardContent>
        <div className="sideContent__information">
          <h3>Live Cases by Country</h3>
          <Table countries={data} />
          <h3>Worldwide new {type}</h3>
          <LineGraph casesType={type} />
        </div>
      </CardContent>
    </Card>
  );
}

export default SideContent;
