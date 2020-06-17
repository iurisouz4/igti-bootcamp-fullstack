import React, { useState } from "react";
import SalaryBar from "../SalaryBar/SalaryBar";
import { calculateSalaryFrom } from "../../helpers/salary";

export default function Main() {
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
    setBruteSalary(value);
    setBaseINSS(calculateSalaryFrom(value).baseINSS);
    setBaseIRPF(calculateSalaryFrom(value).baseIRPF);
    setDiscountINSS(calculateSalaryFrom(value).discountINSS);
    setDiscountIRPF(calculateSalaryFrom(value).discountIRPF);
    setSalary(calculateSalaryFrom(value).netSalary);
  }

  return (
    <>
      <h1>React Salário</h1>
      <form class="col s12">
        <div class="row">
          <div class="input-field col s8">
            <input
              id="salary_brute"
              type="number"
              defaultValue={bruteSalary}
              min={0}
              onChange={handleChangeFullSalary}
            />
            <label for="salary_brute">Salário Bruto:</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s2">
            <input id="base_inss" type="text" value={baseINSS} min={0} />
            <label for="base_inss">Base INSS:</label>
          </div>
          <div class="input-field col s2">
            <input
              id="discount_inss"
              type="text"
              value={discountINSS}
              min={0}
            />
            <label for="discount_inss">Desconto INSS:</label>
          </div>
          <div class="input-field col s2">
            <input id="base_irpf" type="text" value={baseIRPF} min={0} />
            <label for="base_irpf">Base IRPF:</label>
          </div>
          <div class="input-field col s2">
            <input
              id="discount_irpf"
              type="text"
              value={discountIRPF}
              min={0}
            />
            <label for="discount_irpf">Desconto IRPF:</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s2">
            <input id="salary" type="text" value={salary} min={0} />
            <label for="salary">Salário Líquido:</label>
          </div>
        </div>
      </form>
      <SalaryBar discountIRPF={""} discountINSS={""} salary={""} />
    </>
  );
}
