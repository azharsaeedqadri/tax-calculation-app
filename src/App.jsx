import { useState } from "react";
import "./App.css";

// constants
const ENTER_KEY = 13;
const FIRST_SLAB = "0%";
const SECOND_SLAB = "2.5% of amount exceeding 600,000";
const THIRD_SLAB = "15,000 + 12.5% of amount exceeding 1,200,000";
const FOURTH_SLAB = "165,000 + 22.5% of amount exceeding 2,400,000";
const FIFTH_SLAB = "435,000 + 27.5% of amount exceeding 3,600,000";
const SIXTH_SLAB = "1,095,000 + 35% of amount exceeding 6,000,000";
const FORMAT_NUMBERS_REGEX = /\B(?=(\d{3})+(?!\d))/g;

function App() {
  const [salary, setSalary] = useState("");
  const [taxAmount, setTaxAmount] = useState(null);
  const [annualSalary, setAnnualSalary] = useState(0);
  const [annualTax, setAnnualTax] = useState(0);
  const [effectiveRate, setEffectiveRate] = useState(0);
  const [slabDetails, setSlabDetails] = useState("");

  const handleKeyUp = (event) => {
    if (event.keyCode === ENTER_KEY) {
      handleClick();
    }
  };

  const handleChange = (event) => {
    setSalary(event.target.value);
  };

  const handleClear = () => {
    setSalary("");
    setTaxAmount(null);
    setAnnualSalary(0);
    setAnnualTax(0);
    setEffectiveRate(0);
    setSlabDetails("");
  };

  const handleClick = () => {
    const yearlySalary = parseFloat(salary) * 12;

    setAnnualSalary(
      yearlySalary.toFixed(2).toString().replace(FORMAT_NUMBERS_REGEX, ",")
    );

    let yearlyTaxDeduction = 0;

    switch (true) {
      // In javascript, we can write 600000 as 6_00_000 for better code readability
      case yearlySalary <= 6_00_000:
        yearlyTaxDeduction = 0;
        setSlabDetails(FIRST_SLAB);
        break;
      case yearlySalary <= 1_200_000:
        // 0.025 is for 2.5%
        yearlyTaxDeduction = (yearlySalary - 6_00_000) * 0.025;
        setSlabDetails(SECOND_SLAB);
        break;
      case yearlySalary <= 2_400_000:
        // 0.125 is for 12.5%
        yearlyTaxDeduction = 15_000 + (yearlySalary - 1_200_000) * 0.125;
        setSlabDetails(THIRD_SLAB);
        break;
      case yearlySalary <= 3_600_000:
        // 0.225 is for 22.5%
        yearlyTaxDeduction = 165_000 + (yearlySalary - 2_400_000) * 0.225;
        setSlabDetails(FOURTH_SLAB);
        break;
      case yearlySalary <= 6_000_000:
        // 0.275 is for 27.5%
        yearlyTaxDeduction = 435_000 + (yearlySalary - 3_600_000) * 0.275;
        setSlabDetails(FIFTH_SLAB);
        break;
      default:
        // 0.35 is for 35%
        yearlyTaxDeduction = 1_095_000 + (yearlySalary - 6_000_000) * 0.35;
        setSlabDetails(SIXTH_SLAB);
    }

    const monthlyTaxDeduction = yearlyTaxDeduction / 12;

    const calculateEffectiveRate = (
      (yearlyTaxDeduction / yearlySalary) *
      100
    ).toFixed(2);

    setEffectiveRate(calculateEffectiveRate);
    setAnnualTax(
      yearlyTaxDeduction
        .toFixed(2)
        .toString()
        .replace(FORMAT_NUMBERS_REGEX, ",")
    );
    setTaxAmount(
      monthlyTaxDeduction
        .toFixed(2)
        .toString()
        .replace(FORMAT_NUMBERS_REGEX, ",")
    );
  };

  const isTaxAmountNan = isNaN(parseInt(taxAmount));
  const shouldShowResult = taxAmount !== null && !isTaxAmountNan;

  return (
    <div className="page-container">
      <h1 className="heading">Zeki Tax Calculator</h1>
      <p className="description">
        Put your monthly salary in the input field. You will get the information
        of your taxable amount and tax slab.
      </p>
      <div className="container">
        <div className="calculator">
          <h1>Type Your Salary</h1>
          <input
            type="number"
            placeholder="Enter Your Salary"
            value={salary}
            name="salary"
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            className="input-field"
          />
          <button onClick={handleClick} className="calculate-button">
            Calculate
          </button>
          {shouldShowResult && (
            <>
              <div className="result">
                <p>Per Month Tax Amount:</p>
                <p>{taxAmount}</p>
              </div>
              <div className="result">
                <p>Annual Salary:</p>
                <p>{annualSalary}</p>
              </div>
              <div className="result">
                <p>Annual Payable Tax:</p>
                <p>{annualTax}</p>
              </div>
              <div className="result">
                <p>Effective Rate:</p>
                <p>{effectiveRate}</p>
              </div>
              <div className="result">
                <p>Details of Tax Slab:</p>
                <p>{slabDetails}</p>
              </div>
            </>
          )}
          <button
            style={{ marginLeft: "10px", marginTop: "10px" }}
            onClick={handleClear}
            className="clear-button"
          >
            Clear Fields
          </button>
        </div>
      </div>
      <footer className="footer">
        <p>
          Developed with <span style={{ color: "red" }}>❤</span> by M. Azhar
          Saeed.
        </p>
      </footer>
    </div>
  );
}

export default App;
