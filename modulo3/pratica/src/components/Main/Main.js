import React, { useState } from "react";
import SalaryBar from "../SalaryBar/SalaryBar";
import { calculateSalaryFrom, calculatePercentage } from "../../helpers/salary";

export default function Main() {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const [bruteSalary, setBruteSalary] = useState(1000);
  const [baseINSS, setBaseINSS] = useState(calculateSalaryFrom(1000).baseINSS);
  const [baseIRPF, setBaseIRPF] = useState(calculateSalaryFrom(1000).baseIRPF);
  const [discountINSS, setDiscountINSS] = useState(
    calculateSalaryFrom(1000).discountINSS
  );
  const [discountIRPF, setDiscountIRPF] = useState(
    calculateSalaryFrom(1000).discountIRPF
  );
  const [salary, setSalary] = useState(calculateSalaryFrom(1000).netSalary);

  function handleChangeFullSalary(event) {
    const value = event.target.value;
    const {
      baseINSS,
      baseIRPF,
      discountINSS,
      discountIRPF,
      netSalary,
    } = calculateSalaryFrom(event.target.value);

    setBruteSalary(value);
    setBaseINSS(baseINSS);
    setBaseIRPF(baseIRPF);
    setDiscountINSS(discountINSS);
    setDiscountIRPF(discountIRPF);
    setSalary(netSalary);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Calcular Salário</h1>
      <form className="col">
        <div className="row">
          <div className="input-field col s12">
            <input
              id="salary_brute"
              type="number"
              defaultValue={bruteSalary}
              min={0}
              onChange={handleChangeFullSalary}
            />
            <label>Salário Bruto:</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s3">
            <input
              id="base_inss"
              type="text"
              value={formatter.format(baseINSS)}
              min={0}
              readOnly
              style={{ fontWeight: "bold" }}
            />
            <label>Base INSS:</label>
          </div>
          <div className="input-field col s3">
            <input
              id="discount_inss"
              type="text"
              value={`${formatter.format(discountINSS)} (${calculatePercentage(
                bruteSalary,
                discountINSS
              )}%)`}
              min={0}
              readOnly
              style={{ color: "#e67e22", fontWeight: "bold" }}
            />
            <label>Desconto INSS:</label>
          </div>
          <div className="input-field col s3">
            <input
              id="base_irpf"
              type="text"
              value={formatter.format(baseIRPF)}
              min={0}
              readOnly
              style={{ fontWeight: "bold" }}
            />
            <label>Base IRPF:</label>
          </div>
          <div className="input-field col s3">
            <input
              id="discount_irpf"
              type="text"
              value={`${formatter.format(discountIRPF)} (${calculatePercentage(
                bruteSalary,
                discountIRPF
              )}%)`}
              min={0}
              readOnly
              style={{ color: "#c0392b", fontWeight: "bold" }}
            />
            <label>Desconto IRPF:</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s3">
            <input
              id="salary"
              type="text"
              value={`${formatter.format(salary)} (${calculatePercentage(
                bruteSalary,
                salary
              )}%)`}
              min={0}
              readOnly
              style={{ color: "#16a085", fontWeight: "bold" }}
            />
            <label>Salário Líquido:</label>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SalaryBar
            value={calculatePercentage(bruteSalary, discountINSS)}
            color="#e67e22"
          />
          <SalaryBar
            value={calculatePercentage(bruteSalary, discountIRPF)}
            color="#c0392b"
          />
          <SalaryBar
            value={calculatePercentage(bruteSalary, salary)}
            color="#16a085"
          />
        </div>
      </form>
    </div>
  );
}
