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
      setNameErrorMessage("Имя должно состоять минимум из 3х символов!");
      return false;
    } else if (!pattern.test(name)) {
      setNameErrorMessage("В имени должны быть только буквы!");
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
        throw new Error("Ошибка запроса к API!");
      }
      if (response.status === 429) {
        throw Error("Слишком много запросов, необходимо подождать!");
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
      <h2>Предсказание пола по имени</h2>
      <input
        className={styles.inp}
        type="text"
        placeholder="Введите имя"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button type="button" onClick={() => checkGender(name)}>
        Проверить пол
      </button>
      <p style={{ color: "red" }}>{nameErrorMessage}</p>
      <p style={{ color: "red" }}>{errorMessage}</p>
      <section>
        {genderInfo && (
          <div>
            <p>Имя: {genderInfo.name}</p>
            <p>
              Пол:
              {genderInfo.gender === "male"
                ? "мужской"
                : genderInfo.gender === "female"
                ? "женский"
                : "неизвестно"}
            </p>
            <p>Страна: {genderInfo?.country}</p>
            <p>Вероятность: {genderInfo?.probability}</p>
            <p>Остаток запросов: {genderInfo?.remainingCredits}</p>
          </div>
        )}
      </section>
    </div>
  );
};
