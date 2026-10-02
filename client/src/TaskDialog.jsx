import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function TaskDialog({ task, onClose, onSave, busy, error }) {
  const [form, setForm] = useState({ title: '', description: '' });

  useEffect(() => {
    if (task) setForm({ title: task.title || '', description: task.description || '' });
  }, [task]);

  const submit = (event) => {
    event.preventDefault();
    onSave({ title: form.title.trim(), description: form.description.trim() });
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="task-dialog-title">
        <div className="dialog-header">
          <div><p className="eyebrow">TAREA</p><h2 id="task-dialog-title">{task ? 'Editar tarea' : 'Añadir tarea'}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={19} /></button>
        </div>
        <form className="dialog-form" onSubmit={submit}>
          <label className="field"><span>Título</span><input maxLength={255} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="¿Qué hay que hacer?" required autoFocus /></label>
          <label className="field"><span>Descripción <em>OPCIONAL</em></span><textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Añade contexto o detalles" /></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="dialog-actions"><button className="button button-quiet" type="button" onClick={onClose}>Cancelar</button><button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Guardando…' : task ? 'Guardar cambios' : 'Crear tarea'}</button></div>
        </form>
      </section>
    </div>
  );
}