package com.taskflow.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String status; // String representing Status enum

    private String priority; // String representing Priority enum

    private LocalDate dueDate;
}
