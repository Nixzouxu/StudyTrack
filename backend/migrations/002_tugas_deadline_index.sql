-- fitur reminder deadline: nggak ada kolom baru, kategori dihitung pas query karena tergantung waktu
-- index ini buat mempercepat ambil tugas per mata kuliah yang difilter status dan deadline
CREATE INDEX idx_tugas_mk_status_deadline ON tugas (mata_kuliah_id, status, deadline);