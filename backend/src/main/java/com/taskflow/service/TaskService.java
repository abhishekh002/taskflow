package com.taskflow.service;

import com.taskflow.model.Priority;
import com.taskflow.model.Status;
import com.taskflow.model.Task;
import com.taskflow.model.User;
import com.taskflow.repository.TaskRepository;
import com.taskflow.request.TaskRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> getTasks(User user, Status status, Priority priority, String search) {
        return taskRepository.searchTasks(user, status, priority, search);
    }

    public Task getTaskById(Long id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this task");
        }

        return task;
    }

    public Task createTask(TaskRequest request, User user) {
        Status status = Status.TODO;
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            try {
                status = Status.valueOf(request.getStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + request.getStatus());
            }
        }

        Priority priority = Priority.MEDIUM;
        if (request.getPriority() != null && !request.getPriority().trim().isEmpty()) {
            try {
                priority = Priority.valueOf(request.getPriority().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid priority: " + request.getPriority());
            }
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(status)
                .priority(priority)
                .dueDate(request.getDueDate())
                .user(user)
                .build();

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, TaskRequest request, User user) {
        Task task = getTaskById(id, user);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());

        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            try {
                task.setStatus(Status.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + request.getStatus());
            }
        }

        if (request.getPriority() != null && !request.getPriority().trim().isEmpty()) {
            try {
                task.setPriority(Priority.valueOf(request.getPriority().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid priority: " + request.getPriority());
            }
        }

        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long id, Status status, User user) {
        Task task = getTaskById(id, user);
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public void deleteTask(Long id, User user) {
        Task task = getTaskById(id, user);
        taskRepository.delete(task);
    }
}
