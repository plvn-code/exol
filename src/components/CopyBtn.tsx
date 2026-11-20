"use client";
import { useState } from "react";

export default function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className={"copy" + (ok ? " ok" : "")}
      onClick={(e) => {
        e.preventDefault();
        navigator.clipboard?.writeText(text).then(() => {
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        });
      }}
    >
      {ok ? "Скопировано" : "Копировать"}
    </button>
  );
}
