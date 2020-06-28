import React, { useState, useEffect } from "react";
import Card from "../Card/Card";
import getCompositeInterest, {
  calculatePercentage,
} from "../../helpers/compositeInterest";

export default function Main() {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const [initial, setInitial] = useState(1000);
  const [interest, setInterest] = useState(0.5);
  const [period, setPeriod] = useState(0);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    createCards();
  }, [period, initial, interest]);

  const handleChange = ({ target }) => {
    const { id, value } = target;
    switch (id) {
      case "initial":
        setInitial(value);
        break;
      case "interest":
        setInterest(value);
        break;
      case "period":
        setPeriod(value);
        break;
      default:
        break;
    }
  };

  const createCards = () => {
    let arrCards = [];
    for (let idx = 1; idx <= period; idx++) {
      const total = getCompositeInterest(initial, interest, idx);
      const percentage = calculatePercentage(initial, total - initial);
      arrCards.push({
        period: idx,
        total,
        dif: total - initial,
        percentage,
      });
    }
    setCards(arrCards);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Calcular Juros Compostos</h1>
      <form className="col">
        <div className="row">
          <div className="input-field col s4">
            <input
              id="initial"
              type="number"
              defaultValue={initial}
              min={0}
              onChange={handleChange}
            />
            <label>Montante inicial</label>
          </div>
          <div className="input-field col s4">
            <input
              id="interest"
              type="number"
              defaultValue={interest}
              step={0.1}
              onChange={handleChange}
            />
            <label>Taxa de juros mensal</label>
          </div>
          <div className="input-field col s4">
            <input
              id="period"
              type="number"
              defaultValue={period}
              min={0}
              onChange={handleChange}
            />
            <label>Período (meses)</label>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "left",
            flexWrap: "wrap",
            maxWidth: "920px",
          }}
        >
          {cards.map((card) => (
            <Card
              key={card.period}
              period={card.period}
              total={formatter.format(card.total)}
              dif={formatter.format(card.dif)}
              percentage={card.percentage}
            />
          ))}
        </div>
      </form>
    </div>
  );
}
