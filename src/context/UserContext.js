import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export default function UserProvider({ children }) {
  const [catapultToken, setCatapultToken] = useState(
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0NjFiMTExMS02ZjdhLTRkYmItOWQyOS0yMzAzOWZlMjI4OGUiLCJqdGkiOiJjYmI4YjJkOThlYzU3YTFjNzFhMmFjMTJmYjEwMWRmMWU0MjY1Y2IyYjM3MmNlMTBkNmI4Y2QzZDhhOGVhNmFhOGI0ZTlkMzBjOTBlZWY2MyIsImlhdCI6MTY3MzQ3NzI2MywibmJmIjoxNjczNDc3MjYzLCJleHAiOjQ4MjcwNzcyNjMsInN1YiI6ImYyZTZmZTM2LWYzNGEtNGI5Mi04MWQzLWQ2N2VkMDBmYTA1YiIsInNjb3BlcyI6WyJhY3Rpdml0aWVzLXVwZGF0ZSIsImFubm90YXRpb25zLXVwZGF0ZSIsImF0aGxldGVzLXVwZGF0ZSIsImNhdGFwdWx0ciIsImNvbm5lY3QiLCJwYXJhbWV0ZXJzLXVwZGF0ZSIsInNlbnNvci1yZWFkLW9ubHkiLCJ0YWdzLXVwZGF0ZSJdfQ.OAGclWZ7gqua9vuJ_Ia98pRsUuZECbB0FER5KotIFb-wcKk-ynaHZZ5r2ggybVFJxS9-xvICrCp4eKNeF0BZISs-hzyx7vDAtQiNAjD8Dc6BmhvkbNwr1zzTXPasxhA_qEdviezUtJKtecRvBjYYchw6AIeiNc7q5z-0n10SzZ0MY9BSnBNVmcY1K4uHAnXZ-hDox66-zDGgqI29cE7oemUlzHQ_oVHR4qXqII4UP9ys7mwAOiYeP9pF5yhgHXD4w7XyHstvuPz5tL-LcRaUTK5peJIqh0a_MFLbNFSwZw1Wg_dtUy9g7Qc6R5uDI3oMfWJi1PLlYwSyp74yxjjYH8XB1r4s8Qpr0Uj6AcH-GnngMhJ-ecHiBwFeFOO7oz476V75kIHVT7q6hGYpdVyT1CuB9jf7SPN9-upG0ZNL1Gt1_IKWiszYdgniQR3WYwoqkimGFqto85U0pF_4tHAF0kz5YxRJSvEfJARiPqlhba-6EOvV5mATX7B7Chhgi9y5jAX-oxXXSlG9VKyY4P4w_CpMQUG23-T4S9j9nCEdgqJDq5fW-p9RTa95jSj5ihOHKolXESNY6P7ZD2GYeX8IR1hWMikcjATpMaeZc1kPAl5EusAN7VSzxACQBPKgXMoPvuuHbovp1QZE0l34f4Xwed91j_I3Kdq4mCSfLXiK7bU"
  );

  return (
    <UserContext.Provider
      value={{
        catapultToken, //variables to export
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUser must be used within a CountProvider");

  const { catapultToken } = context;

  return { catapultToken };
}
