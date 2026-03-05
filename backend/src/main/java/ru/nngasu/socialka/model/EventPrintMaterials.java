package ru.nngasu.socialka.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "event_print_materials")
public class EventPrintMaterials {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "event_id")
    private Integer eventId;

    private String name;
    private String format;

    @Column(name = "paper_type")
    private String paperType;

    private BigDecimal price;
    private Integer quantity;

    // Геттеры и сеттеры
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getEventId() { return eventId; }
    public void setEventId(Integer eventId) { this.eventId = eventId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public String getPaperType() { return paperType; }
    public void setPaperType(String paperType) { this.paperType = paperType; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}