import clsx from "clsx";
import type { Task } from "../types";
import { labelPenanda, porsiSisa24Jam } from "../lib/waktu";
import { AlertIcon, ClockIcon } from "./Icons";

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const formatDeadline = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });

export default function TaskCard({ task, onToggle, onDelete }: Props) {
  const label = labelPenanda(task.kategori, task.sisa_detik);
  const soon = task.kategori === "mendekati_deadline";
  const late = task.kategori === "overdue";

  return (
    <li className={clsx("card task reveal-item", { soon, late })} data-kategori={task.kategori}>
      <div>
        {label && (
          <p className="reminder">
            {late ? <AlertIcon /> : <ClockIcon />}
            {label}
          </p>
        )}
        <h3 className="task-title">{task.judul}</h3>
        <div className="task-meta">
          <span>
            {task.mata_kuliah} ({task.kode})
          </span>
          <span>
            Deadline <time dateTime={task.deadline}>{formatDeadline(task.deadline)}</time>
          </span>
          {task.deskripsi && <span>{task.deskripsi}</span>}
        </div>
        {soon && (
          <div className="rail" aria-hidden="true">
            <span style={{ transform: `scaleX(${porsiSisa24Jam(task.sisa_detik)})` }} />
          </div>
        )}
      </div>

      <div className="task-foot">
        <span className={clsx("badge", task.status)}>{task.status === "selesai" ? "Selesai" : "Belum"}</span>
        <span className="spacer" />
        <button
          className="btn btn-text"
          onClick={() => onToggle(task)}
          aria-label={`${task.status === "selesai" ? "Tandai belum selesai" : "Tandai selesai"}: ${task.judul}`}
        >
          {task.status === "selesai" ? "Tandai belum" : "Tandai selesai"}
        </button>
        <button className="btn btn-text danger" onClick={() => onDelete(task)} aria-label={`Hapus: ${task.judul}`}>
          Hapus
        </button>
      </div>
    </li>
  );
}