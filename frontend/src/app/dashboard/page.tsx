'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import styles from './dashboard.module.css';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TaskForm {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

const emptyForm: TaskForm = { title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' };

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterPriority) params.append('priority', filterPriority);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      const qs = params.toString() ? `?${params.toString()}` : '';
      const data = await api.get<Task[]>(`/api/tasks${qs}`);
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  }, [filterStatus, filterPriority, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]);

  const openCreateModal = () => {
    setEditingTask(null);
    setForm(emptyForm);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || '',
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || null,
      };
      if (editingTask) {
        await api.put(`/api/tasks/${editingTask.id}`, payload);
      } else {
        await api.post('/api/tasks', payload);
      }
      setShowModal(false);
      fetchTasks();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading your workspace...</p>
          </div>
        </main>
      </div>
    );
  }

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  const priorityColor = (p: string) => {
    if (p === 'HIGH') return styles.priorityHigh;
    if (p === 'LOW') return styles.priorityLow;
    return styles.priorityMedium;
  };

  const renderTaskCard = (task: Task) => (
    <div key={task.id} className={`${styles.taskCard} glass-panel`}>
      <div className={styles.taskCardTop}>
        <span className={`${styles.priorityBadge} ${priorityColor(task.priority)}`}>{task.priority}</span>
        {task.dueDate && <span className={styles.dueDate}>📅 {task.dueDate}</span>}
      </div>
      <h4 className={styles.taskTitle}>{task.title}</h4>
      {task.description && <p className={styles.taskDesc}>{task.description}</p>}
      <div className={styles.taskActions}>
        <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)} className={styles.statusSelect}>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <button onClick={() => openEditModal(task)} className={styles.editBtn} title="Edit">✏️</button>
        <button onClick={() => handleDelete(task.id)} className={styles.deleteBtn} title="Delete">🗑️</button>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        {/* Dashboard Header */}
        <section className={styles.dashHeader}>
          <div>
            <h1>Your Dashboard</h1>
            <p>Welcome back, <strong>{user?.username}</strong>. You have <strong>{tasks.length}</strong> task{tasks.length !== 1 ? 's' : ''}.</p>
          </div>
          <button onClick={openCreateModal} className={styles.createBtn}>+ New Task</button>
        </section>

        {/* Stats Bar */}
        <section className={styles.statsBar}>
          <div className={`${styles.statCard} glass-panel`}>
            <span className={styles.statNumber}>{todoTasks.length}</span>
            <span className={styles.statLabel}>To Do</span>
          </div>
          <div className={`${styles.statCard} glass-panel`}>
            <span className={`${styles.statNumber} ${styles.inProgressStat}`}>{inProgressTasks.length}</span>
            <span className={styles.statLabel}>In Progress</span>
          </div>
          <div className={`${styles.statCard} glass-panel`}>
            <span className={`${styles.statNumber} ${styles.doneStat}`}>{doneTasks.length}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
        </section>

        {/* Filter Bar */}
        <section className={styles.filterBar}>
          <input type="text" placeholder="🔍 Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={styles.filterSelect}>
            <option value="">All Statuses</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className={styles.filterSelect}>
            <option value="">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </section>

        {/* Kanban Columns */}
        {loadingTasks ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Fetching tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className={styles.emptyState}>
            <p>🎉 No tasks yet. Click <strong>"+ New Task"</strong> to create one!</p>
          </div>
        ) : (
          <section className={styles.kanban}>
            <div className={styles.column}>
              <div className={`${styles.columnHeader} ${styles.todoHeader}`}>
                <span className={styles.columnDot} style={{ background: '#f59e0b' }}></span>
                <h3>Todo <span className={styles.count}>{todoTasks.length}</span></h3>
              </div>
              <div className={styles.columnBody}>
                {todoTasks.map(renderTaskCard)}
              </div>
            </div>
            <div className={styles.column}>
              <div className={`${styles.columnHeader} ${styles.progressHeader}`}>
                <span className={styles.columnDot} style={{ background: '#3b82f6' }}></span>
                <h3>In Progress <span className={styles.count}>{inProgressTasks.length}</span></h3>
              </div>
              <div className={styles.columnBody}>
                {inProgressTasks.map(renderTaskCard)}
              </div>
            </div>
            <div className={styles.column}>
              <div className={`${styles.columnHeader} ${styles.doneHeader}`}>
                <span className={styles.columnDot} style={{ background: '#10b981' }}></span>
                <h3>Done <span className={styles.count}>{doneTasks.length}</span></h3>
              </div>
              <div className={styles.columnBody}>
                {doneTasks.map(renderTaskCard)}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={`${styles.modal} glass-panel`} onClick={(e) => e.stopPropagation()}>
            <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
            {formError && <div className={styles.modalError}>{formError}</div>}
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.modalGroup}>
                <label>Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="What needs to be done?" required />
              </div>
              <div className={styles.modalGroup}>
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Optional details..." rows={3}></textarea>
              </div>
              <div className={styles.modalRow}>
                <div className={styles.modalGroup}>
                  <label>Status</label>
                  <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}>
                    <option value="TODO">Todo</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <div className={styles.modalGroup}>
                  <label>Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div className={styles.modalGroup}>
                <label>Due Date</label>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})} />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.saveBtn} disabled={submitting}>{submitting ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
