import React from "react";

const TaskList = ({ userdata, onEdit, onDelete, startIndex }) => {
  return (
    <>
      {userdata.length === 0 ? (
        <p className="no_data">No Tasks Available!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userdata.map((task, i) => (
              <tr key={task.id}>
                <td>{startIndex + i + 1}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>
                  <button className="edit_button" onClick={() => onEdit(task)}>Edit</button>
                  <button className="delete_button" onClick={() => onDelete(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default TaskList;