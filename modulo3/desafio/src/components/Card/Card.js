import React from "react";

export default function Card({ period, total, dif, percentage }) {
  return (
    <div className="card">
      <div className="card-content">
        <div className="row">
          <div className="col s3">
            <h5>{period}</h5>
          </div>

          <div className="col s1">
            <h6>{total}</h6>
            <h6>{dif}</h6>
            <h6>{percentage}%</h6>
          </div>
        </div>
      </div>
    </div>
  );
}
