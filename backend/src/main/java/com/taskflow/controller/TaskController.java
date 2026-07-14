package com.taskflow.controller;

import com.taskflow.model.Priority;
import com.taskflow.model.Status;
import com.taskflow.model.Task;
import com.taskflow.model.User;
import com.taskflow.request.TaskRequest;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> getTasks(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String search
    ) {
        Status statusEnum = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                statusEnum = Status.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Ignore invalid status filter or return BAD_REQUEST. Let's keep it robust.
            }
        }

        Priority priorityEnum = null;
        if (priority != null && !priority.trim().isEmpty()) {
            try {
                priorityEnum = Priority.valueOf(priority.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Ignore invalid priority filter
            }
        }

        List<Task> tasks = taskService.getTasks(user, statusEnum, priorityEnum, search);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@AuthenticationPrincipal User user, @PathVariable Long id) {
        Task task = taskService.getTaskById(id, user);
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@AuthenticationPrincipal User user, @Valid @RequestBody TaskRequest request) {
        Task task = taskService.createTask(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request
    ) {
        Task task = taskService.updateTask(id, request, user);
        return ResponseEntity.ok(task);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateTaskStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String statusStr = body.get("status");
        if (statusStr == null || statusStr.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Status status = Status.valueOf(statusStr.toUpperCase());
            Task task = taskService.updateTaskStatus(id, status, user);
            return ResponseEntity.ok(task);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@AuthenticationPrincipal User user, @PathVariable Long id) {
        taskService.deleteTask(id, user);
        return ResponseEntity.noContent().build();
    }
}
