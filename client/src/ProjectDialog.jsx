import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function ProjectDialog({ project, onClose, onSave, busy, error }) {
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    if (project) setForm({ name: project.name || '', description: project.description || '' });
  }, [project]);

  const submit = (event) => {
    event.preventDefault();
    onSave({ name: form.name.trim(), description: form.description.trim() });
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
        <div className="dialog-header">
          <div><p className="eyebrow">WORKSPACE</p><h2 id="project-dialog-title">{project ? 'Editar proyecto' : 'Nuevo proyecto'}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={19} /></button>
        </div>
        <form className="dialog-form" onSubmit={submit}>
          <label className="field"><span>Nombre del proyecto</span><input maxLength={255} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ej. Rediseño web" required autoFocus /></label>
          <label className="field"><span>Descripción</span><textarea maxLength={255} rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="¿Qué quieres conseguir?" required /></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="dialog-actions"><button className="button button-quiet" type="button" onClick={onClose}>Cancelar</button><button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Guardando…' : project ? 'Guardar cambios' : 'Crear proyecto'}</button></div>
        </form>
      </section>
    </div>
  );
}