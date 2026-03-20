import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, editTask, deleteTask } from "../slice/taskSlice";
import TaskList from "./TaskList";


const TaskManager = () => {
  //usestate
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    priority: "Low",
    status: "Pending",
  });
  const [errors, setErrors] = useState({});
  const [filters, setFilters] = useState({
    title: "",
    priority: "",
    status: "",
    selectedFilter: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  //page count
  const itemsPerPage = 5;
//Form validation  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title required!";
    if (!formData.description.trim()) newErrors.description = "Description required!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
// Add click 
  const handleAddClick = () => {
    setFormData({ id: null, title: "", description: "", priority: "Low", status: "Pending" });
    setErrors({});
    setEditId(null);
    setShowModal(true);
  };
// Form submit 
  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editId !== null) {
      dispatch(editTask({ id: editId, data: formData }));
      alert("Task Updated!");
    } else {
      dispatch(addTask({ ...formData, id: Date.now() }));
      alert("Task Added!");
    }

    setShowModal(false);
    setEditId(null);
  };
//Edit button
  const handleEdit = task => {
    setFormData(task);
    setEditId(task.id);
    setShowModal(true);
  };
//Delete button
  const handleDelete = id => {
    if (window.confirm("Are you sure?")) dispatch(deleteTask(id));
  };

  // Filter + Pagination
  const selectedFilter = filters.selectedFilter || "";
  const filteredData = tasks.filter(task => {
    if (!selectedFilter) return true;
    const value = (filters[selectedFilter] || "").toLowerCase();
    return task[selectedFilter]?.toString().toLowerCase().includes(value);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="task_container">
      <h1>Task Manager</h1>

      {/* Filter + Add */}
      <div className="top_bar">
        <div className="filter_container">
          <select
            value={filters.selectedFilter}
            onChange={e =>
              setFilters({ title: "", priority: "", status: "", selectedFilter: e.target.value })
            }
          >
            <option value="">Select Filter</option>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>

          <input
            type="text"
            placeholder="Enter value..."
            disabled={!filters.selectedFilter}
            value={filters[filters.selectedFilter] || ""}
            onChange={e => setFilters({ ...filters, [filters.selectedFilter]: e.target.value })}
          />
        </div>

        <button className="add_button" onClick={handleAddClick}>Add Task</button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal_content">
            <h4>Task Details</h4>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && <p className="error">{errors.title}</p>}

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
              {errors.description && <p className="error">{errors.description}</p>}

              <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>

              <div className="modal_buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task List */}
      <TaskList userdata={currentData} onEdit={handleEdit} onDelete={handleDelete} startIndex={indexOfFirstItem} />

      {/* Pagination */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? "active" : ""}>{i + 1}</button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
};

export default TaskManager;