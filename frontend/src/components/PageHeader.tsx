import type { ReactNode } from "react";

interface Props {
  label: string;
  title: string;
  children?: ReactNode;
}

// judul halaman: label kecil, judul besar, dan tombol aksi di kanan
export default function PageHeader({ label, title, children }: Props) {
  return (
    <header className="page-head">
      <div className="head-text">
        <p className="label">{label}</p>
        <h1>
          <span className="mask">
            <span>{title}</span>
          </span>
        </h1>
      </div>
      {children && <div className="head-actions">{children}</div>}
    </header>
  );
}