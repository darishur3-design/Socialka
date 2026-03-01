package ru.nngasu.socialka.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nngasu.socialka.model.Format;
import ru.nngasu.socialka.repository.FormatRepository;

import java.util.List;

@RestController
@RequestMapping("/api/formats")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class FormatController {

    private final FormatRepository formatRepository;

    public FormatController(FormatRepository formatRepository) {
        this.formatRepository = formatRepository;
    }

    @GetMapping
    public ResponseEntity<List<Format>> getAllFormats() {
        return ResponseEntity.ok(formatRepository.findAll());
    }
}