package ru.nngasu.socialka.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.nngasu.socialka.model.Format;

public interface FormatRepository extends JpaRepository<Format, Integer> {
}