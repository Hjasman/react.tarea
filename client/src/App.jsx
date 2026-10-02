import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardList,
  Clock3,
  FolderKanban,
  Layers3,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { api } from './api.js';
import { useAuth } from './AuthContext.jsx';
import AuthScreen from './AuthScreen.jsx';
import ProjectDialog from './ProjectDialog.jsx';
import TaskDialog from './TaskDialog.jsx';

const PAGE_SIZE = 10;
const PROJECT_COLORS = ['#c2e66e', '#f2a78b', '#81bbb1', '#e6c86f', '#9fa6e8'];

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function App() {
  const { session } = useAuth();
  return session?.token ? <Workspace /> : <AuthScreen />;
}

function Workspace() {
  const { session, signOut } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectLoading, setProjectLoading] = useState(true);
  const [taskLoading, setTaskLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, totalItems: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [projectReload, setProjectReload] = useState(0);
  const [taskReload, setTaskReload] = useState(0);
  const [projectDialog, setProjectDialog] = useState(null);
  const [taskDialog, setTaskDialog] = useState(null);
  const [saving, setSaving] = useState(false);
  const [projectError, setProjectError] = useState('');
  const [taskError, setTaskError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setProjectLoading(true);
    setProjectError('');
    api.projects(session.token)
      .then((data) => {
        if (!active) return;
        const available = (Array.isArray(data) ? data : []).filter((project) => project.status !== 'deleted');
        setProjects(available);
        setSelectedProjectId((current) =>
          available.some((project) => project.id === current) ? current : available[0]?.id || '',
        );
      })
      .catch((error) => active && setProjectError(error.message))
      .finally(() => active && setProjectLoading(false));
    return () => { active = false; };
  }, [session.token, projectReload]);

  const activeProject = projects.find((project) => project.id === selectedProjectId);

  useEffect(() => {
    if (!activeProject) {
      setTasks([]);
      setPagination({ page: 1, limit: PAGE_SIZE, totalItems: 0, totalPages: 0 });
      setTaskLoading(false);
      return undefined;
    }

    let active = true;
    setTaskLoading(true);
    setTaskError('');
    api.tasks(session.token, activeProject.id, page, PAGE_SIZE)
      .then((data) => {
        if (!active) return;
        setTasks(data?.items || []);
        setPagination(data?.pagination || { page, limit: PAGE_SIZE, totalItems: 0, totalPages: 0 });
      })
      .catch((error) => active && setTaskError(error.message))
      .finally(() => active && setTaskLoading(false));
    return () => { active = false; };
  }, [session.token, activeProject?.id, page, taskReload]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('es');
    return tasks.filter((task) => {
      const matchesFilter = filter === 'all' || (filter === 'done' ? task.completed : !task.completed);
      const matchesSearch = !normalizedSearch || `${task.title} ${task.description || ''}`.toLocaleLowerCase('es').includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  const refreshProjects = () => setProjectReload((value) => value + 1);
  const refreshTasks = () => setTaskReload((value) => value + 1);

  const saveProject = async (data) => {
    setSaving(true);
    setProjectError('');
    try {
      if (projectDialog?.id) {
        await api.updateProject(session.token, projectDialog.id, data);
      } else {
        const created = await api.createProject(session.token, data);
        if (created?.id) setSelectedProjectId(created.id);
      }
      setProjectDialog(null);
      setPage(1);
      refreshProjects();
    } catch (error) {
      setProjectError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const removeProject = async () => {
    if (!activeProject || !window.confirm(`¿Eliminar el proyecto “${activeProject.name}”?`)) return;
    setProjectError('');
    try {
      await api.deleteProject(session.token, activeProject.id);
      setSelectedProjectId('');
      setPage(1);
      refreshProjects();
    } catch (error) {
      setProjectError(error.message);
    }
  };

  const saveTask = async (data) => {
    if (!activeProject) return;
    setSaving(true);
    setTaskError('');
    try {
      if (taskDialog?.id) {
        await api.updateTask(session.token, activeProject.id, { id: taskDialog.id, ...data });
      } else {
        await api.createTask(session.token, activeProject.id, data);
        setPage(1);
      }
      setTaskDialog(null);
      refreshTasks();
    } catch (error) {
      setTaskError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const removeTask = async (task) => {
    if (!window.confirm(`¿Eliminar la tarea “${task.title}”?`)) return;
    setTaskError('');
    try {
      await api.deleteTask(session.token, activeProject.id, task.id);
      if (tasks.length === 1 && page > 1) setPage((value) => value - 1);
      else refreshTasks();
    } catch (error) {
      setTaskError(error.message);
    }
  };

  const toggleTask = async (task) => {
    setTaskError('');
    try {
      await api.setTaskStatus(session.token, activeProject.id, task.id, !task.completed);
      refreshTasks();
    } catch (error) {
      setTaskError(error.message);
    }
  };

  const dateLabel = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const doneOnPage = tasks.filter((task) => task.completed).length;
  const pageCount = Math.max(1, pagination.totalPages || 1);

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileProjectsOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#workspace" onClick={() => setMobileProjectsOpen(false)}>
          <span className="brand-mark"><Layers3 size={19} strokeWidth={2.2} /></span><span>taskflow</span>
        </a>

        <div className="sidebar-label">ESPACIO DE TRABAJO</div>
        <button className="sidebar-link sidebar-link-active" onClick={() => setMobileProjectsOpen(false)}>
          <LayoutDashboard size={17} /><span>Vista general</span><span className="sidebar-current" />
        </button>

        <div className="project-nav-heading">
          <span>PROYECTOS</span>
          <button className="sidebar-add" onClick={() => setProjectDialog({})} aria-label="Crear proyecto" title="Crear proyecto"><Plus size={16} /></button>
        </div>
        <div className="project-nav-list">
          {projectLoading ? <div className="sidebar-loading"><span /> Cargando…</div> : projects.map((project, index) => (
            <button
              className={`project-nav-item ${selectedProjectId === project.id ? 'project-nav-selected' : ''}`}
              key={project.id}
              onClick={() => { setSelectedProjectId(project.id); setPage(1); setMobileProjectsOpen(false); }}
              title={project.name}
            >
              <span className="project-dot" style={{ '--project-color': PROJECT_COLORS[index % PROJECT_COLORS.length] }} />
              <span className="project-nav-name">{project.name}</span>
              {selectedProjectId === project.id && <ArrowRight className="project-nav-arrow" size={14} />}
            </button>
          ))}
          {!projectLoading && projects.length === 0 && <p className="sidebar-empty">Aún no hay proyectos</p>}
        </div>

        <div className="sidebar-spacer" />
        <div className="sidebar-note"><span className="note-icon"><Sparkles size={15} /></span><span>Un paso a la vez.<br /><strong>El progreso se acumula.</strong></span></div>
        <div className="account-row">
          <div className="avatar">{initials(session.user?.name)}</div>
          <div className="account-copy"><strong>{session.user?.name}</strong><span>{session.user?.email}</span></div>
          <button className="icon-button account-logout" onClick={signOut} aria-label="Cerrar sesión" title="Cerrar sesión"><LogOut size={17} /></button>
        </div>
      </aside>

      {mobileProjectsOpen && <button className="mobile-scrim" aria-label="Cerrar menú" onClick={() => setMobileProjectsOpen(false)} />}

      <section className="workspace-main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-button" onClick={() => setMobileProjectsOpen(true)} aria-label="Abrir proyectos"><FolderKanban size={19} /></button>
            <span className="breadcrumb-muted">Workspace</span><span className="breadcrumb-divider">/</span><span className="breadcrumb-current">Vista general</span>
          </div>
          <div className="topbar-right"><span className="today-label">{dateLabel}</span><span className="topbar-avatar">{initials(session.user?.name)}</span></div>
        </header>

        <div className="content-wrap">
          <div className="page-intro">
            <div><p className="eyebrow">PANEL DE CONTROL <span className="intro-dot" /></p><h1>Hola, {session.user?.name?.split(' ')[0] || 'de nuevo'}.</h1><p className="intro-subtitle">Aquí empieza un buen día de trabajo.</p></div>
            <button className="button button-primary new-project-button" onClick={() => setProjectDialog({})}><Plus size={17} /> Nuevo proyecto</button>
          </div>

          {projectError && <div className="inline-alert" role="alert">{projectError}<button onClick={() => setProjectError('')} aria-label="Cerrar aviso">×</button></div>}

          {projectLoading ? (
            <div className="loading-panel"><span className="spinner" /><span>Cargando tu espacio de trabajo…</span></div>
          ) : projects.length === 0 ? (
            <section className="first-project-panel">
              <div className="first-project-art"><div className="art-sheet art-sheet-back" /><div className="art-sheet art-sheet-front"><span /><span /><span /></div><span className="art-spark"><Sparkles size={18} /></span></div>
              <p className="eyebrow">TODO EMPIEZA AQUÍ</p><h2>Crea tu primer proyecto</h2><p>Define un objetivo y convierte el trabajo pendiente en próximos pasos.</p>
              <button className="button button-primary" onClick={() => setProjectDialog({})}><Plus size={17} /> Crear proyecto</button>
            </section>
          ) : activeProject ? (
            <>
              <section className="metrics-grid" aria-label="Resumen">
                <article className="metric metric-projects"><div className="metric-top"><span>PROYECTOS ACTIVOS</span><FolderKanban size={18} /></div><div className="metric-value">{projects.length.toString().padStart(2, '0')}</div><div className="metric-foot"><span className="metric-mark">↗</span>En tu espacio de trabajo</div></article>
                <article className="metric metric-tasks"><div className="metric-top"><span>TAREAS DEL PROYECTO</span><ListTodo size={18} /></div><div className="metric-value">{String(pagination.totalItems).padStart(2, '0')}</div><div className="metric-foot"><span className="metric-project-name">{activeProject.name}</span><span className="metric-arrow"><ArrowDownRight size={15} /></span></div></article>
                <article className="metric metric-done"><div className="metric-top"><span>COMPLETADAS EN PÁGINA</span><CheckCircle2 size={18} /></div><div className="metric-value">{String(doneOnPage).padStart(2, '0')}<small> / {String(tasks.length).padStart(2, '0')}</small></div><div className="metric-foot"><span className="completion-track"><i style={{ width: `${tasks.length ? (doneOnPage / tasks.length) * 100 : 0}%` }} /></span><span>{tasks.length ? Math.round((doneOnPage / tasks.length) * 100) : 0}%</span></div></article>
              </section>

              <section className="project-heading">
                <div className="project-heading-title"><span className="project-heading-mark" style={{ '--project-color': PROJECT_COLORS[Math.max(0, projects.findIndex((project) => project.id === activeProject.id)) % PROJECT_COLORS.length] }}><FolderKanban size={18} /></span><div><p className="eyebrow">PROYECTO SELECCIONADO</p><h2>{activeProject.name}</h2></div></div>
                <div className="project-heading-actions"><button className="button button-quiet button-edit-project" onClick={() => setProjectDialog(activeProject)}><Pencil size={15} /> Editar</button><button className="icon-button danger-icon" onClick={removeProject} aria-label="Eliminar proyecto" title="Eliminar proyecto"><Trash2 size={17} /></button></div>
              </section>
              {activeProject.description && <p className="project-description">{activeProject.description}</p>}

              <section className="task-panel">
                <div className="task-panel-heading">
                  <div><p className="eyebrow">ENFOQUE DEL PROYECTO</p><h2>Lista de tareas <span>{pagination.totalItems}</span></h2></div>
                  <button className="button button-primary button-add-task" onClick={() => setTaskDialog('new')}><Plus size={17} /> Añadir tarea</button>
                </div>
                <div className="task-toolbar">
                  <div className="task-filters" role="tablist" aria-label="Filtrar tareas">
                    {[['all', 'Todas'], ['open', 'Pendientes'], ['done', 'Completadas']].map(([value, label]) => <button role="tab" aria-selected={filter === value} className={filter === value ? 'filter-active' : ''} key={value} onClick={() => setFilter(value)}>{label}</button>)}
                  </div>
                  <label className="task-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar tarea" aria-label="Buscar tareas" /></label>
                </div>

                {taskError && <div className="inline-alert task-alert" role="alert">{taskError}<button onClick={() => setTaskError('')} aria-label="Cerrar aviso">×</button></div>}

                {taskLoading ? (
                  <div className="task-loading"><span className="spinner" /> Cargando tareas…</div>
                ) : filteredTasks.length === 0 ? (
                  <div className="empty-tasks"><span className="empty-icon"><ClipboardList size={23} /></span><strong>{tasks.length === 0 ? 'Aún no hay tareas' : 'No encontramos tareas'}</strong><p>{tasks.length === 0 ? 'Añade el primer paso para empezar a avanzar.' : 'Prueba con otro filtro o búsqueda.'}</p>{tasks.length === 0 && <button className="text-action" onClick={() => setTaskDialog('new')}>Añadir primera tarea <ArrowRight size={15} /></button>}</div>
                ) : (
                  <div className="task-list">
                    {filteredTasks.map((task) => <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task)} onEdit={() => setTaskDialog(task)} onDelete={() => removeTask(task)} />)}
                  </div>
                )}

                <div className="task-panel-footer"><span>{pagination.totalItems ? `Mostrando ${Math.min((page - 1) * PAGE_SIZE + 1, pagination.totalItems)}–${Math.min(page * PAGE_SIZE, pagination.totalItems)} de ${pagination.totalItems} tareas` : 'Sin tareas para mostrar'}</span><div className="pagination"><button className="icon-button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1 || taskLoading} aria-label="Página anterior"><ChevronLeft size={18} /></button><span><strong>{page}</strong><i>/</i>{pageCount}</span><button className="icon-button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page >= pageCount || taskLoading} aria-label="Página siguiente"><ChevronRight size={18} /></button></div></div>
              </section>
            </>
          ) : null}

          <footer className="content-footer"><span>PROJECT TASK FLOW</span><span>Los buenos resultados empiezan con buenos pasos.</span></footer>
        </div>
      </section>

      {projectDialog && <ProjectDialog project={projectDialog.id ? projectDialog : null} onClose={() => setProjectDialog(null)} onSave={saveProject} busy={saving} error={projectError} />}
      {taskDialog && <TaskDialog task={taskDialog === 'new' ? null : taskDialog} onClose={() => setTaskDialog(null)} onSave={saveTask} busy={saving} error={taskError} />}
    </main>
  );
}

function TaskRow({ task, onToggle, onEdit, onDelete }) {
  const createdLabel = task.createdAt
    ? new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }).format(new Date(task.createdAt))
    : '';

  return (
    <article className={`task-row ${task.completed ? 'task-completed' : ''}`}>
      <button className="task-check" onClick={onToggle} aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'} title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}>
        {task.completed ? <span className="check-completed"><Check size={13} /></span> : <Circle size={20} strokeWidth={1.7} />}
      </button>
      <div className="task-copy"><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}</div>
      <span className={`task-status ${task.completed ? 'status-done' : 'status-open'}`}><i />{task.completed ? 'Completada' : 'Pendiente'}</span>
      <span className="task-date"><Clock3 size={14} />{createdLabel || 'Sin fecha'}</span>
      <div className="task-actions"><button className="icon-button" onClick={onEdit} aria-label={`Editar ${task.title}`} title="Editar tarea"><Pencil size={15} /></button><button className="icon-button danger-icon" onClick={onDelete} aria-label={`Eliminar ${task.title}`} title="Eliminar tarea"><Trash2 size={15} /></button></div>
    </article>
  );
}

export default App;