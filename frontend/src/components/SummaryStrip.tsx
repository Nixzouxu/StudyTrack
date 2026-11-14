import type { Task } from "../types";
import { hitungRingkasan } from "../lib/ringkasan";

const dua = (n: number) => String(n).padStart(2, "0");

// tiga angka di atas daftar, angkanya naik pelan pas halaman pertama muncul
export default function SummaryStrip({ tasks }: { tasks: Task[] }) {
  const { total, mendekati, overdue } = hitungRingkasan(tasks);
  return (
    <div className="summary" role="group" aria-label="Ringkasan tugas">
      <div className="stat reveal-item">
        <b data-val={total}>{dua(total)}</b>
        <span>Total tugas</span>
      </div>
      <div className={mendekati > 0 ? "stat soon reveal-item" : "stat reveal-item"}>
        <b data-val={mendekati}>{dua(mendekati)}</b>
        <span>Segera</span>
      </div>
      <div className={overdue > 0 ? "stat late reveal-item" : "stat reveal-item"}>
        <b data-val={overdue}>{dua(overdue)}</b>
        <span>Terlambat</span>
      </div>
    </div>
  );
}