import { useState } from "react";
import styles from "./GenderPredictor.module.css";

interface GenderInfo {
  name: string;
  gender: string;
  country: string;
  probability: number;
  remainingCredits: number;
}

export const GenderPredictor = () => {
  const pattern = /^[A-Za-zА-Яа-я]{3,}$/;
  const [name, setName] = useState<string>("");
  const [genderInfo, setGenderInfo] = useState<GenderInfo | undefined>(
    undefined
  );
  const [nameErrorMessage, setNameErrorMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  function validate(name: string): boolean {
    if (name.length < 3) {
      setNameErrorMessage("Name should be at least 3 symbols long!");
      return false;
    } else if (!pattern.test(name)) {
      setNameErrorMessage("Name should consist of letters only!");
      return false;
    }
    setNameErrorMessage("");
    return true;
  }

  const checkGender = async (name: string) => {
    if (validate(name)) {
      fetchGender(name);
    }
  };

  const fetchGender = async (name: string) => {
    try {
      const response = await fetch(
        `https://api.genderapi.io/api/?name=${name}`
      );
      if (!response.ok) {
        throw new Error("API request error!");
      }
      if (response.status === 429) {
        throw Error("Too many requests, please wait!");
      }

      const data = await response.json();
      setGenderInfo(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Gender Predictor</h2>
      <input
        className={styles.inp}
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button type="button" onClick={() => checkGender(name)}>
        Check gender
      </button>
      <p style={{ color: "red" }}>{nameErrorMessage}</p>
      <p style={{ color: "red" }}>{errorMessage}</p>
      <section>
        {genderInfo && (
          <div>
            <p>Your name: {genderInfo?.name}</p>
            <p>Gender: {genderInfo?.gender}</p>
            <p>Country: {genderInfo?.country}</p>
            <p>Probability: {genderInfo?.probability}</p>
            <p>Remaining credits: {genderInfo?.remainingCredits}</p>
          </div>
        )}
      </section>
    </div>
  );
};
